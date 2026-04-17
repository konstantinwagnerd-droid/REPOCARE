import Link from "next/link";
import { db } from "@/db/client";
import { auth } from "@/lib/auth";
import { residents, careReports, incidents, vitalSigns, carePlans } from "@/db/schema";
import { eq, desc, gte } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Activity, AlertTriangle, CheckCircle2, Clock, Users, ArrowRight, HeartPulse, Mic } from "lucide-react";
import { calcAge, timeAgo } from "@/lib/utils";

export default async function AppDashboard() {
  const session = await auth();
  const tenantId = session!.user.tenantId;
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const [residentList, recentReports, openIncidents, todayVitals, openPlans] = await Promise.all([
    db.select().from(residents).where(eq(residents.tenantId, tenantId)).limit(6),
    db.select().from(careReports).orderBy(desc(careReports.createdAt)).limit(5),
    db.select().from(incidents).where(gte(incidents.occurredAt, since)).limit(5),
    db.select().from(vitalSigns).where(gte(vitalSigns.recordedAt, since)).limit(20),
    db.select().from(carePlans).where(eq(carePlans.status, "offen")).limit(6),
  ]);

  return (
    <div className="space-y-8 p-6 lg:p-10">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h1 className="font-serif text-4xl font-semibold tracking-tight">Guten Tag, {session!.user.name?.split(" ")[0]}.</h1>
          <p className="mt-1 text-muted-foreground">Hier ist Ihre Schicht im Überblick.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="accent" size="lg"><Link href="/app/voice"><Mic className="h-4 w-4" /> Spracheingabe starten</Link></Button>
          <Button asChild variant="outline" size="lg"><Link href="/app/handover">Schichtbericht erstellen <ArrowRight className="h-4 w-4" /></Link></Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Meine Bewohner:innen", value: residentList.length.toString(), icon: Users, tone: "text-primary bg-primary/10" },
          { label: "Offene Aufgaben", value: openPlans.length.toString(), icon: Clock, tone: "text-accent bg-accent/10" },
          { label: "Vitalwerte heute", value: todayVitals.length.toString(), icon: HeartPulse, tone: "text-emerald-700 bg-emerald-100" },
          { label: "Vorfälle 24h", value: openIncidents.length.toString(), icon: AlertTriangle, tone: "text-amber-700 bg-amber-100" },
        ].map((k) => (
          <Card key={k.label}>
            <CardContent className="flex items-center gap-4 p-6">
              <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${k.tone}`}>
                <k.icon className="h-5 w-5" />
              </span>
              <div>
                <div className="font-serif text-3xl font-semibold">{k.value}</div>
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{k.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Meine Bewohner:innen</CardTitle>
            <Button asChild variant="ghost" size="sm"><Link href="/app/residents">Alle anzeigen</Link></Button>
          </CardHeader>
          <CardContent className="divide-y divide-border">
            {residentList.length === 0 && <p className="py-6 text-sm text-muted-foreground">Keine Bewohner:innen zugewiesen.</p>}
            {residentList.map((r) => (
              <Link
                key={r.id}
                href={`/app/residents/${r.id}`}
                className="flex items-center justify-between gap-4 py-3 transition-colors hover:bg-secondary/50"
              >
                <div>
                  <div className="font-semibold">{r.fullName}</div>
                  <div className="text-xs text-muted-foreground">
                    Zimmer {r.room} · {calcAge(r.birthdate)} Jahre · Pflegegrad {r.pflegegrad}
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
          <CardHeader><CardTitle>Letzte Einträge</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {recentReports.length === 0 && <p className="text-sm text-muted-foreground">Noch keine Berichte.</p>}
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
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Offene Maßnahmen</CardTitle></CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2">
          {openPlans.length === 0 && <p className="text-sm text-muted-foreground">Alle Maßnahmen erledigt — bravo!</p>}
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
    </div>
  );
}
