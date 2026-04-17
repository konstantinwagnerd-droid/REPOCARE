import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { COURSES } from "@/lib/lms/courses";
import { db } from "@/lib/lms/store";
import { computeTenantCompliance } from "@/lib/lms/compliance";
import { ComplianceAmpel } from "@/components/lms/ComplianceAmpel";
import { Download, Shield } from "lucide-react";

export default function CompliancePage() {
  const d = db();
  const mandatory = COURSES.filter((c) => c.category === "pflicht");
  const t = computeTenantCompliance(d.staff, mandatory, d.assignments, d.certificates);

  return (
    <div className="space-y-6 p-6 lg:p-10">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-4xl font-semibold tracking-tight">Compliance</h1>
          <p className="mt-1 text-muted-foreground">
            Detailansicht pro Mitarbeiter:in und Pflicht. Export für MDK / MD-Prüfung.
          </p>
        </div>
        <a
          href="/api/lms/compliance/tenant?format=csv"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          <Download className="h-4 w-4" /> MD-Export (CSV)
        </a>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-5">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Gesamt-Quote</div>
            <div className="mt-1 font-serif text-3xl font-semibold">{Math.round(t.totals.complianceRate * 100)} %</div>
            <div className="mt-2 h-2 rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary" style={{ width: `${Math.round(t.totals.complianceRate * 100)}%` }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Ampel</div>
              <div className="mt-2 flex flex-col gap-1 text-sm">
                <ComplianceAmpel state="gruen" label={`${t.totals.green} Personen aktuell`} />
                <ComplianceAmpel state="gelb" label={`${t.totals.yellow} bald fällig`} />
                <ComplianceAmpel state="rot" label={`${t.totals.red} überfällig`} />
              </div>
            </div>
            <Shield className="h-10 w-10 text-muted-foreground" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5 text-sm">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Geprüfte Pflichten</div>
            <ul className="mt-2 space-y-1">
              {mandatory.map((m) => (
                <li key={m.id}>
                  {m.thumbnailEmoji} {m.title}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Matrix-Ansicht</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="py-2">Mitarbeiter:in</th>
                {mandatory.map((c) => (
                  <th key={c.id} className="py-2 text-center" title={c.title}>
                    <div className="text-lg">{c.thumbnailEmoji}</div>
                    <div className="text-[10px] font-normal">{c.title.split(" ")[0]}</div>
                  </th>
                ))}
                <th className="py-2 text-right">Quote</th>
              </tr>
            </thead>
            <tbody>
              {t.rows.map((r) => (
                <tr key={r.status.userId} className="border-t border-border">
                  <td className="py-3">
                    <div className="font-semibold">{r.status.userName}</div>
                    <div className="text-xs text-muted-foreground capitalize">{r.status.role} · {r.status.userId}</div>
                  </td>
                  {r.breakdown.map((b) => (
                    <td key={b.course.id} className="text-center">
                      <ComplianceAmpel state={b.state} size="sm" label="" />
                    </td>
                  ))}
                  <td className="text-right font-semibold">
                    {r.status.mandatoryCoursesCompleted}/{r.status.mandatoryCoursesTotal}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
