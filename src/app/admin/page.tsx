import { db } from "@/db/client";
import { auth } from "@/lib/auth";
import { users, residents, auditLog, careReports, incidents } from "@/db/schema";
import { eq, desc, gte } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, UserCog, FileCheck, ShieldAlert, TrendingUp } from "lucide-react";
import { timeAgo } from "@/lib/utils";

export default async function AdminDashboard() {
  const session = await auth();
  const tenantId = session!.user.tenantId;
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [staff, residentList, recentAudit, reports7d, incidents7d] = await Promise.all([
    db.select().from(users).where(eq(users.tenantId, tenantId)),
    db.select().from(residents).where(eq(residents.tenantId, tenantId)),
    db.select().from(auditLog).where(eq(auditLog.tenantId, tenantId)).orderBy(desc(auditLog.createdAt)).limit(10),
    db.select().from(careReports).where(gte(careReports.createdAt, since)),
    db.select().from(incidents).where(gte(incidents.occurredAt, since)),
  ]);

  const pflegekraftCount = staff.filter((s) => s.role === "pflegekraft").length;

  return (
    <div className="space-y-8 p-6 lg:p-10">
      <div>
        <h1 className="font-serif text-4xl font-semibold tracking-tight">Administration</h1>
        <p className="mt-1 text-muted-foreground">Überblick über Ihre Einrichtung.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Bewohner:innen", value: residentList.length, icon: Users, tone: "text-primary bg-primary/10" },
          { label: "Pflegekräfte", value: pflegekraftCount, icon: UserCog, tone: "text-accent bg-accent/10" },
          { label: "Berichte (7 Tage)", value: reports7d.length, icon: FileCheck, tone: "text-emerald-700 bg-emerald-100" },
          { label: "Vorfälle (7 Tage)", value: incidents7d.length, icon: ShieldAlert, tone: "text-amber-700 bg-amber-100" },
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

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5 text-primary" /> KPI Woche</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: "Dokumentationszeit pro Schicht (Ø)", value: "42 Min", change: "-67%", good: true },
              { label: "SIS-Vollständigkeit", value: "98%", change: "+4%", good: true },
              { label: "Mitarbeiterzufriedenheit (NPS)", value: "+62", change: "+12", good: true },
              { label: "MDK-konforme Einträge", value: "100%", change: "±0", good: true },
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
          <CardHeader><CardTitle>Audit-Log (letzte Einträge)</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {recentAudit.map((a) => (
              <div key={a.id} className="flex items-start justify-between gap-3 rounded-lg border border-border p-3 text-sm">
                <div>
                  <div className="font-semibold">{a.action}<span className="ml-2 font-normal text-muted-foreground">{a.entityType}</span></div>
                  <div className="text-xs text-muted-foreground">IP {a.ip} · {timeAgo(a.createdAt)}</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
