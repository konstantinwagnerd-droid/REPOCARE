import { db } from "@/db/client";
import { auth } from "@/lib/auth";
import { users, residents, auditLog, careReports, incidents } from "@/db/schema";
import { eq, desc, gte } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users, UserCog, FileCheck, ShieldAlert, TrendingUp,
  Activity, ClipboardList, CalendarClock, Building2, Stethoscope,
  UserPlus, AlertTriangle,
} from "lucide-react";
import { timeAgo } from "@/lib/utils";
import {
  PageContainer, PageHeader, PageSection, PageGrid, StatCard, QuickAction,
} from "@/components/admin/page-shell";

/**
 * PDL / Admin-Dashboard — Einrichtung heute + Qualitaetsindikatoren +
 * Dokumentations-Score + Personal-Status + MDK-Termine.
 *
 * Rationale siehe docs/IA-AUDIT.md §5 (PDL-Dashboard-Enrichment).
 */
export default async function AdminDashboard() {
  const session = await auth();
  const tenantId = session!.user.tenantId;
  const since7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const since14d = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  const startOfToday = new Date(); startOfToday.setHours(0, 0, 0, 0);

  const [staff, residentList, recentAudit, reports7d, reports14d, incidents7d, incidents14d, todayReports] = await Promise.all([
    db.select().from(users).where(eq(users.tenantId, tenantId)),
    db.select().from(residents).where(eq(residents.tenantId, tenantId)),
    db.select().from(auditLog).where(eq(auditLog.tenantId, tenantId)).orderBy(desc(auditLog.createdAt)).limit(10),
    db.select().from(careReports).where(gte(careReports.createdAt, since7d)),
    db.select().from(careReports).where(gte(careReports.createdAt, since14d)),
    db.select().from(incidents).where(gte(incidents.occurredAt, since7d)),
    db.select().from(incidents).where(gte(incidents.occurredAt, since14d)),
    db.select().from(careReports).where(gte(careReports.createdAt, startOfToday)),
  ]);

  const pflegekraftCount = staff.filter((s) => s.role === "pflegekraft").length;
  const pdlCount = staff.filter((s) => s.role === "pdl" || s.role === "admin").length;
  const reportsPrev = Math.max(0, reports14d.length - reports7d.length);
  const reportTrend = reportsPrev > 0 ? ((reports7d.length - reportsPrev) / reportsPrev) * 100 : 0;
  const incidentsPrev = Math.max(0, incidents14d.length - incidents7d.length);
  const incidentTrend = incidentsPrev > 0 ? ((incidents7d.length - incidentsPrev) / incidentsPrev) * 100 : 0;

  // Vereinfachte Sparklines: reportsPerDay der letzten 7 Tage.
  const reportsByDay: number[] = Array.from({ length: 7 }).map((_, i) => {
    const day = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000);
    day.setHours(0, 0, 0, 0);
    const next = new Date(day); next.setDate(next.getDate() + 1);
    return reports7d.filter((r) => r.createdAt >= day && r.createdAt < next).length;
  });
  const incidentsByDay: number[] = Array.from({ length: 7 }).map((_, i) => {
    const day = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000);
    day.setHours(0, 0, 0, 0);
    const next = new Date(day); next.setDate(next.getDate() + 1);
    return incidents7d.filter((r) => r.occurredAt >= day && r.occurredAt < next).length;
  });

  // Occupancy approximiert — tatsaechliche Bett-Daten in echtem System:
  const totalBeds = Math.max(residentList.length, 1);
  const occupancy = Math.round((residentList.length / totalBeds) * 100);

  // Qualitaetsindikatoren (Demo-Zahlen basierend auf Bewohner-Grundmenge):
  const dekubitusRate = Math.max(0, Math.min(8, Math.round(incidents7d.length / Math.max(residentList.length, 1) * 50) / 10));
  const sturzRate = Math.round(incidents7d.length * 0.6) / 10;
  const femQuote = residentList.length > 0 ? Math.round((residentList.filter((r) => r.pflegegrad >= 4).length / residentList.length) * 100) : 0;
  const docCompleteness = reports7d.length > 0 ? Math.min(100, Math.round((reports7d.length / (residentList.length * 7)) * 100)) : 0;

  // Anstehende MDK/QM-Termine (Mock — in echt aus Kalender):
  const upcoming = [
    { label: "MDK-Qualitätspruefung", date: "in 12 Tagen", tone: "warning" as const },
    { label: "Heimaufsicht Begehung", date: "in 23 Tagen", tone: "default" as const },
    { label: "QM-Audit intern", date: "in 6 Tagen", tone: "danger" as const },
  ];

  return (
    <PageContainer>
      <PageHeader
        title="Administration"
        subtitle="Einrichtung heute — Auslastung, Personal, Qualitaet, Compliance."
        icon={Building2}
        actions={
          <Badge variant="success" className="px-3 py-1.5">Live · aktualisiert gerade</Badge>
        }
      />

      {/* Einrichtung heute */}
      <PageSection heading="Einrichtung heute" description="Kernkennzahlen fuer den laufenden Tag.">
        <PageGrid columns={4}>
          <StatCard
            label="Belegung"
            value={`${occupancy}%`}
            sublabel={`${residentList.length} von ${totalBeds} Betten`}
            icon={Users}
            tone="primary"
            trend={{ value: "+2%", direction: "up" }}
            sparkline={[92, 94, 93, 95, 96, 97, occupancy]}
            href="/admin/residents"
          />
          <StatCard
            label="Personal aktiv"
            value={pflegekraftCount}
            sublabel={`${pdlCount} PDL/Admin · Früh/Spät/Nacht`}
            icon={UserCog}
            tone="accent"
            href="/admin/staff"
          />
          <StatCard
            label="Berichte heute"
            value={todayReports.length}
            sublabel={`${reports7d.length} in 7 Tagen`}
            icon={FileCheck}
            tone="success"
            trend={{ value: `${reportTrend >= 0 ? "+" : ""}${reportTrend.toFixed(0)}%`, direction: reportTrend >= 0 ? "up" : "down", positive: true }}
            sparkline={reportsByDay}
          />
          <StatCard
            label="Vorfälle 7 Tage"
            value={incidents7d.length}
            sublabel="Stürze, Medifehler, Dekubitus"
            icon={ShieldAlert}
            tone={incidents7d.length > 3 ? "danger" : "warning"}
            trend={{ value: `${incidentTrend >= 0 ? "+" : ""}${incidentTrend.toFixed(0)}%`, direction: incidentTrend >= 0 ? "up" : "down", positive: false }}
            sparkline={incidentsByDay}
            href="/admin/anomaly"
          />
        </PageGrid>
      </PageSection>

      {/* Qualitaetsindikatoren + Dokumentations-Score */}
      <PageSection heading="Qualität &amp; Dokumentation" description="MDK-relevante Kennzahlen.">
        <PageGrid columns={4}>
          <StatCard label="Dekubitus-Rate" value={`${dekubitusRate}%`} sublabel="Ziel < 3%" icon={Stethoscope} tone={dekubitusRate > 3 ? "warning" : "success"} trend={{ value: "-0.3%", direction: "down", positive: true }} />
          <StatCard label="Sturzrate" value={sturzRate.toFixed(1)} sublabel="je 1000 Belegtage" icon={AlertTriangle} tone="warning" trend={{ value: "-12%", direction: "down", positive: true }} />
          <StatCard label="FEM-Quote" value={`${femQuote}%`} sublabel="Freiheitsentzug · Ziel < 10%" icon={ClipboardList} tone={femQuote > 10 ? "warning" : "success"} />
          <StatCard label="Dok-Vollständigkeit" value={`${docCompleteness}%`} sublabel="Pflichteinträge pro Bewohner/Tag" icon={FileCheck} tone={docCompleteness >= 95 ? "success" : "warning"} sparkline={[82, 86, 88, 91, 93, 94, docCompleteness]} href="/admin/dokumentation/check" />
        </PageGrid>
      </PageSection>

      {/* KPI-Woche + Audit */}
      <PageSection heading="Wochenbericht" description="Kontinuierliche Verbesserung — letzte 7 Tage.">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <TrendingUp className="h-5 w-5 text-primary" /> KPI-Woche
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Dokumentationszeit pro Schicht (Ø)", value: "42 Min", change: "-67%", good: true },
                { label: "SIS-Vollständigkeit", value: "98%", change: "+4%", good: true },
                { label: "Mitarbeiterzufriedenheit (NPS)", value: "+62", change: "+12", good: true },
                { label: "MDK-konforme Einträge", value: "100%", change: "±0", good: true },
                { label: "Kundenzufriedenheit (Angehoerige)", value: "94%", change: "+2%", good: true },
              ].map((k) => (
                <div key={k.label} className="flex items-center justify-between rounded-xl border border-border p-3">
                  <span className="text-sm">{k.label}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-serif text-xl font-semibold">{k.value}</span>
                    <Badge variant={k.good ? "success" : "warning"}>{k.change}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Activity className="h-5 w-5 text-primary" /> Audit-Log (letzte Einträge)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {recentAudit.length === 0 && (
                <p className="text-sm text-muted-foreground">Noch keine Ereignisse.</p>
              )}
              {recentAudit.map((a) => (
                <div key={a.id} className="flex items-start justify-between gap-3 rounded-lg border border-border p-3 text-sm">
                  <div>
                    <div className="font-semibold">
                      {a.action}
                      <span className="ml-2 font-normal text-muted-foreground">{a.entityType}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">IP {a.ip} · {timeAgo(a.createdAt)}</div>
                  </div>
                  <Badge variant={a.action === "delete" ? "danger" : a.action === "create" ? "success" : "secondary"} className="shrink-0">{a.action}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </PageSection>

      {/* Anstehende Termine + Quick-Actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        <PageSection heading="Anstehende MDK- und QM-Termine">
          <Card>
            <CardContent className="divide-y divide-border p-0">
              {upcoming.map((u) => (
                <div key={u.label} className="flex items-center justify-between gap-4 p-4">
                  <div className="flex items-center gap-3">
                    <CalendarClock className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{u.label}</div>
                      <div className="text-xs text-muted-foreground">{u.date}</div>
                    </div>
                  </div>
                  <Badge variant={u.tone === "danger" ? "danger" : u.tone === "warning" ? "warning" : "secondary"}>
                    {u.tone === "danger" ? "kritisch" : u.tone === "warning" ? "bald" : "geplant"}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </PageSection>

        <PageSection heading="Quick-Actions">
          <div className="grid gap-2 md:grid-cols-2">
            <QuickAction title="Neue Bewohnende aufnehmen" description="Aufnahme-Wizard mit SIS" href="/admin/residents" icon={UserPlus} tone="primary" />
            <QuickAction title="Mitarbeitende anlegen" description="Rolle, Schicht, Qualifikation" href="/admin/staff" icon={UserCog} />
            <QuickAction title="Audit-Log exportieren" description="PDF fuer MDK / Heimaufsicht" href="/admin/audit" icon={FileCheck} />
            <QuickAction title="DSGVO-Anfrage bearbeiten" description="Auskunft, Loeschung, Uebertragung" href="/admin/dsgvo" icon={ShieldAlert} />
          </div>
        </PageSection>
      </div>
    </PageContainer>
  );
}
