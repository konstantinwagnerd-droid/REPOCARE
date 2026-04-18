import Link from "next/link";
import { db } from "@/db/client";
import { auth } from "@/lib/auth";
import { residents, careReports, incidents, vitalSigns, carePlans } from "@/db/schema";
import { eq, desc, gte } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity, AlertTriangle, CheckCircle2, Clock, Users, ArrowRight,
  HeartPulse, Mic, Bell, CalendarDays, FileText, ClipboardList, Sunrise,
} from "lucide-react";
import { calcAge, timeAgo } from "@/lib/utils";
import {
  PageContainer, PageHeader, PageSection, PageGrid, StatCard, QuickAction,
} from "@/components/app/page-shell";

/**
 * Pflegekraft-Heute-Dashboard.
 *
 * Inhaltsordnung (siehe docs/IA-AUDIT.md §5):
 *  1. Begruessung + Schicht-Info + primaere Aktionen (Voice / Uebergabe)
 *  2. Heute-KPIs: offene Aufgaben, kritische Werte, Schicht-Info
 *  3. Meine Bewohner-Liste mit letzten Einträgen
 *  4. Benachrichtigungen
 *  5. Dein Dienstplan diese Woche
 *  6. Schnell-Links (Schichtuebergabe, Zeiterfassung, Voice-Command)
 */
export default async function AppDashboard() {
  const session = await auth();
  const tenantId = session!.user.tenantId;
  const since24h = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const startOfToday = new Date(); startOfToday.setHours(0, 0, 0, 0);

  const [residentList, recentReports, openIncidents, todayVitals, openPlans, todayReports] = await Promise.all([
    db.select().from(residents).where(eq(residents.tenantId, tenantId)).limit(6),
    db.select().from(careReports).orderBy(desc(careReports.createdAt)).limit(5),
    db.select().from(incidents).where(gte(incidents.occurredAt, since24h)).limit(5),
    db.select().from(vitalSigns).where(gte(vitalSigns.recordedAt, since24h)).limit(20),
    db.select().from(carePlans).where(eq(carePlans.status, "offen")).limit(6),
    db.select().from(careReports).where(gte(careReports.createdAt, startOfToday)),
  ]);

  const firstName = session!.user.name?.split(" ")[0] ?? "Team";
  const hour = new Date().getHours();
  const greeting = hour < 11 ? "Guten Morgen" : hour < 17 ? "Guten Tag" : "Guten Abend";
  const shift: "Früh" | "Spät" | "Nacht" = hour < 14 ? "Früh" : hour < 22 ? "Spät" : "Nacht";
  const shiftWindow = shift === "Früh" ? "06:00 – 14:00" : shift === "Spät" ? "14:00 – 22:00" : "22:00 – 06:00";

  // Kritische Vitalwerte — Schema speichert type + valueNumeric als generische Paare.
  const criticalVitals = todayVitals.filter((v) => {
    const n = v.valueNumeric ?? 0;
    if (v.type === "heartRate") return n > 0 && (n < 50 || n > 110);
    if (v.type === "bloodPressureSystolic") return n > 160;
    if (v.type === "temperature") return n > 38.5;
    return false;
  });

  // Dienstplan-Wochenansicht (Demo — in echtem System aus shifts-Tabelle):
  const weekDays = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"];
  const today = new Date().getDay();
  const todayIdx = today === 0 ? 6 : today - 1;
  const plan = [shift, shift, "Frei", shift, shift === "Früh" ? "Spät" : "Früh", "Frei", shift];

  // Benachrichtigungen (Demo — in echtem System aus notifications):
  const notifications = [
    { icon: AlertTriangle, title: "Bewohner:in Maier — erhoehte Temperatur", time: "vor 18 Min", tone: "danger" as const, href: "/app/residents" },
    { icon: FileText, title: "Arztbrief Dr. Huber eingetroffen", time: "vor 1 Std", tone: "default" as const, href: "/app/notifications" },
    { icon: ClipboardList, title: "Schichtübergabe wartet auf Gegenzeichnung", time: "vor 2 Std", tone: "warning" as const, href: "/app/handover" },
  ];

  return (
    <PageContainer>
      <PageHeader
        title={`${greeting}, ${firstName}.`}
        subtitle={`${shift}-Schicht · ${shiftWindow} · Deine Bewohnenden im Überblick.`}
        icon={Sunrise}
        actions={
          <>
            <Button asChild variant="accent" size="lg">
              <Link href="/app/voice"><Mic className="h-4 w-4" /> Spracheingabe</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/app/handover">Schichtbericht <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </>
        }
      />

      {/* KPIs heute */}
      <PageSection heading="Heute auf einen Blick">
        <PageGrid columns={4}>
          <StatCard
            label="Meine Bewohner:innen"
            value={residentList.length}
            sublabel={`${residentList.filter((r) => r.pflegegrad >= 4).length} mit PG ≥ 4`}
            icon={Users}
            tone="primary"
            href="/app/residents"
          />
          <StatCard
            label="Offene Aufgaben"
            value={openPlans.length}
            sublabel="Medikation, Lagerung, Grundpflege"
            icon={Clock}
            tone={openPlans.length > 5 ? "warning" : "accent"}
          />
          <StatCard
            label="Vitalwerte heute"
            value={todayVitals.length}
            sublabel={`${criticalVitals.length} auffällige Werte`}
            icon={HeartPulse}
            tone={criticalVitals.length > 0 ? "danger" : "success"}
          />
          <StatCard
            label="Vorfälle 24h"
            value={openIncidents.length}
            sublabel="Stürze, Aggressionen, Medifehler"
            icon={AlertTriangle}
            tone={openIncidents.length > 0 ? "warning" : "success"}
          />
        </PageGrid>
      </PageSection>

      {/* Meine Bewohner + Letzte Eintraege */}
      <PageSection heading="Bewohnende &amp; letzte Einträge">
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Meine Bewohner:innen</CardTitle>
              <Button asChild variant="ghost" size="sm"><Link href="/app/residents">Alle anzeigen <ArrowRight className="h-4 w-4" /></Link></Button>
            </CardHeader>
            <CardContent className="divide-y divide-border p-0">
              {residentList.length === 0 && (
                <p className="p-6 text-sm text-muted-foreground">Keine Bewohner:innen zugewiesen.</p>
              )}
              {residentList.map((r) => (
                <Link
                  key={r.id}
                  href={`/app/residents/${r.id}`}
                  className="flex items-center justify-between gap-4 p-4 transition-colors hover:bg-secondary/50"
                >
                  <div className="min-w-0">
                    <div className="font-semibold">{r.fullName}</div>
                    <div className="text-xs text-muted-foreground">
                      Zimmer {r.room} · {calcAge(r.birthdate)} Jahre · {r.station ?? "—"}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={r.pflegegrad >= 4 ? "warning" : "secondary"}>PG {r.pflegegrad}</Badge>
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Letzte Einträge</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentReports.length === 0 && <p className="text-sm text-muted-foreground">Noch keine Berichte heute.</p>}
              {recentReports.map((r) => (
                <div key={r.id} className="flex items-start gap-3">
                  <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Activity className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm">{r.content}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{timeAgo(r.createdAt)} · {r.shift}-Schicht</p>
                  </div>
                </div>
              ))}
              <div className="pt-2 text-xs text-muted-foreground">
                {todayReports.length} Einträge heute — vor Schichtende noch {Math.max(0, residentList.length - todayReports.length)} offen.
              </div>
            </CardContent>
          </Card>
        </div>
      </PageSection>

      {/* Offene Massnahmen + Benachrichtigungen */}
      <div className="grid gap-6 lg:grid-cols-2">
        <PageSection heading="Offene Maßnahmen">
          <Card>
            <CardContent className="grid gap-3 p-6 md:grid-cols-1">
              {openPlans.length === 0 && (
                <p className="text-sm text-muted-foreground">Alle Maßnahmen erledigt — bravo!</p>
              )}
              {openPlans.map((p) => (
                <div key={p.id} className="flex items-start gap-3 rounded-xl border border-border p-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold">{p.title}</div>
                    <div className="text-xs text-muted-foreground">{p.frequency} · {p.description}</div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </PageSection>

        <PageSection heading="Benachrichtigungen" actions={<Button asChild variant="ghost" size="sm"><Link href="/app/notifications">Alle <ArrowRight className="h-4 w-4" /></Link></Button>}>
          <Card>
            <CardContent className="divide-y divide-border p-0">
              {notifications.map((n, i) => (
                <Link key={i} href={n.href} className="flex items-center gap-3 p-4 transition-colors hover:bg-secondary/50">
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                    n.tone === "danger" ? "bg-rose-100 text-rose-700" :
                    n.tone === "warning" ? "bg-amber-100 text-amber-700" :
                    "bg-primary/10 text-primary"
                  }`}>
                    <n.icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{n.title}</div>
                    <div className="text-xs text-muted-foreground">{n.time}</div>
                  </div>
                  <Bell className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </CardContent>
          </Card>
        </PageSection>
      </div>

      {/* Dienstplan diese Woche */}
      <PageSection heading="Dein Dienstplan diese Woche">
        <Card>
          <CardContent className="p-4">
            <div className="grid grid-cols-7 gap-2">
              {weekDays.map((d, i) => {
                const p = plan[i];
                const isToday = i === todayIdx;
                const free = p === "Frei";
                return (
                  <div
                    key={d}
                    className={`rounded-xl border p-3 text-center ${
                      isToday
                        ? "border-primary bg-primary/5"
                        : free
                        ? "border-dashed border-border bg-muted/30"
                        : "border-border"
                    }`}
                  >
                    <div className="text-xs font-medium uppercase text-muted-foreground">{d}</div>
                    <div className={`mt-1 font-serif text-lg font-semibold ${free ? "text-muted-foreground" : "text-foreground"}`}>{p}</div>
                    {isToday && <div className="mt-1 text-[10px] uppercase tracking-wider text-primary">heute</div>}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </PageSection>

      {/* Quick-Actions */}
      <PageSection heading="Schnell-Zugriff">
        <PageGrid columns={4} gap="sm">
          <QuickAction title="Schichtübergabe" description="Übergabe an Kolleg:in" href="/app/handover" icon={ClipboardList} tone="primary" />
          <QuickAction title="Zeiterfassung" description="Stempeln / Pause" href="/app/zeiterfassung" icon={Clock} />
          <QuickAction title="Kalender / Termine" description="Visite, Therapie, Familie" href="/app/notifications" icon={CalendarDays} />
          <QuickAction title="Voice-Commands" description="Sprache-zu-Text Shortcuts" href="/app/voice-commands" icon={Mic} />
        </PageGrid>
      </PageSection>
    </PageContainer>
  );
}
