import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/lms/store";
import { COURSES } from "@/lib/lms/courses";
import { Download, BarChart3, PieChart, TrendingDown } from "lucide-react";

export default function ReportsPage() {
  const d = db();

  const courseStats = COURSES.map((c) => {
    const certs = d.certificates.filter((cert) => cert.courseId === c.id);
    const enrolls = d.enrollments.filter((e) => e.courseId === c.id);
    const avgScore =
      certs.length > 0
        ? Math.round((certs.reduce((s, cert) => s + cert.score / cert.total, 0) / certs.length) * 100)
        : 0;
    const completionRate =
      enrolls.length > 0 ? Math.round((certs.length / enrolls.length) * 100) : 0;
    const avgTimeMin = c.durationMinutes; // Stub — echte Messung bräuchte Events
    return { course: c, completions: certs.length, avgScore, completionRate, avgTimeMin };
  });

  return (
    <div className="space-y-6 p-6 lg:p-10">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-4xl font-semibold tracking-tight">Reports</h1>
          <p className="mt-1 text-muted-foreground">Kursmetriken, Abbruchquote, Zeitaufwand.</p>
        </div>
        <a
          href="/api/lms/compliance/tenant?format=csv"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          <Download className="h-4 w-4" /> CSV exportieren
        </a>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard
          icon={BarChart3}
          label="Ø Punkte alle Kurse"
          value={`${
            Math.round(
              courseStats.filter((s) => s.avgScore > 0).reduce((sum, s) => sum + s.avgScore, 0) /
                Math.max(1, courseStats.filter((s) => s.avgScore > 0).length),
            )
          } %`}
        />
        <KpiCard icon={PieChart} label="Ausgestellte Zertifikate" value={`${d.certificates.length}`} />
        <KpiCard icon={TrendingDown} label="Laufende Kurse" value={`${d.enrollments.filter((e) => !e.completedAt).length}`} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Kurs-Metriken</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="py-2">Kurs</th>
                <th>Abschlüsse</th>
                <th>Ø Punktzahl</th>
                <th>Abbruchquote</th>
                <th>Ø Zeitaufwand</th>
              </tr>
            </thead>
            <tbody>
              {courseStats.map((s) => (
                <tr key={s.course.id} className="border-t border-border">
                  <td className="py-2.5 font-semibold">
                    {s.course.thumbnailEmoji} {s.course.title}
                  </td>
                  <td>{s.completions}</td>
                  <td>{s.avgScore} %</td>
                  <td>{s.completionRate > 0 ? `${100 - s.completionRate} %` : "—"}</td>
                  <td>{s.avgTimeMin} Min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

function KpiCard({ icon: Icon, label, value }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-5">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
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
