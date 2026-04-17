import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { COURSES } from "@/lib/lms/courses";
import { db } from "@/lib/lms/store";
import { computeTenantCompliance } from "@/lib/lms/compliance";
import { ComplianceAmpel } from "@/components/lms/ComplianceAmpel";
import { Users, AlertTriangle, ShieldCheck, Clock, ArrowRight, Award } from "lucide-react";
import Link from "next/link";

export default function AdminLmsDashboard() {
  const d = db();
  const mandatory = COURSES.filter((c) => c.category === "pflicht");
  const t = computeTenantCompliance(d.staff, mandatory, d.assignments, d.certificates);
  const rate = Math.round(t.totals.complianceRate * 100);
  const critical = t.rows
    .flatMap((r) =>
      r.breakdown
        .filter((b) => b.state === "rot")
        .map((b) => ({ user: r.status.userName, course: b.course, due: b.dueDate })),
    )
    .slice(0, 8);

  return (
    <div className="space-y-8 p-6 lg:p-10">
      <div>
        <h1 className="font-serif text-4xl font-semibold tracking-tight">Training-Admin</h1>
        <p className="mt-1 text-muted-foreground">
          Compliance-Überblick der Einrichtung — {t.totals.staffCount} Mitarbeitende · {mandatory.length} Pflichtkurse.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Stat icon={ShieldCheck} label="Compliance-Quote" value={`${rate} %`} tone="text-emerald-700 bg-emerald-100" />
        <Stat icon={AlertTriangle} label="Überfällige Schulungen" value={`${t.totals.overdue}`} tone="text-red-700 bg-red-100" />
        <Stat icon={Clock} label="Bald fällig" value={`${t.totals.dueSoon}`} tone="text-amber-700 bg-amber-100" />
        <Stat icon={Users} label="Mitarbeitende" value={`${t.totals.staffCount}`} tone="text-primary bg-primary/10" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Kritische Fristen</CardTitle>
            <Link href="/admin/lms/compliance" className="inline-flex items-center gap-1 text-xs text-primary">
              Alles ansehen <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="space-y-2">
            {critical.length === 0 && (
              <p className="text-sm text-muted-foreground">Keine überfälligen Schulungen — top!</p>
            )}
            {critical.map((c, i) => (
              <div key={i} className="flex items-center justify-between rounded-xl border border-red-200 bg-red-50 p-3 text-sm">
                <div>
                  <div className="font-semibold">{c.user}</div>
                  <div className="text-xs text-muted-foreground">{c.course.title}</div>
                </div>
                <span className="text-xs font-semibold text-red-700">
                  {c.due ? `seit ${Math.abs(Math.floor((Date.now() - new Date(c.due).getTime()) / 86400000))} Tagen` : "überfällig"}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ampel-Status Team</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {t.rows.map((r) => (
              <div key={r.status.userId} className="flex items-center justify-between rounded-xl border border-border p-3 text-sm">
                <div className="flex items-center gap-3">
                  <ComplianceAmpel state={r.status.state} />
                  <div>
                    <div className="font-semibold">{r.status.userName}</div>
                    <div className="text-xs text-muted-foreground capitalize">{r.status.role}</div>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <div>
                    {r.status.mandatoryCoursesCompleted}/{r.status.mandatoryCoursesTotal} Pflicht
                  </div>
                  {r.status.nextDueDate && (
                    <div className="text-muted-foreground">
                      nächste Frist {new Date(r.status.nextDueDate).toLocaleDateString("de-AT")}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" /> Kurse im Überblick
          </CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="py-2">Kurs</th>
                <th>Kategorie</th>
                <th>Dauer</th>
                <th>Gültigkeit</th>
                <th>Abschlüsse</th>
              </tr>
            </thead>
            <tbody>
              {COURSES.map((c) => {
                const completions = d.certificates.filter((cert) => cert.courseId === c.id).length;
                return (
                  <tr key={c.id} className="border-t border-border">
                    <td className="py-2.5">
                      <Link href={`/lms/kurs/${c.id}`} className="font-semibold hover:text-primary">
                        {c.thumbnailEmoji} {c.title}
                      </Link>
                    </td>
                    <td className="capitalize">{c.category}</td>
                    <td>{c.durationMinutes} Min</td>
                    <td>{c.validity.type}</td>
                    <td>{completions}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ icon: Icon, label, value, tone }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; tone: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${tone}`}>
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <div className="font-serif text-2xl font-semibold">{value}</div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}
