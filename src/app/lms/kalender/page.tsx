import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { COURSES } from "@/lib/lms/courses";
import { db, DEMO_CURRENT_USER } from "@/lib/lms/store";
import { computeComplianceForStaff } from "@/lib/lms/compliance";
import { Download, CalendarDays } from "lucide-react";

export default function KalenderPage() {
  const user = DEMO_CURRENT_USER;
  const d = db();
  const mandatory = COURSES.filter((c) => c.category === "pflicht");
  const row = computeComplianceForStaff(
    { id: user.id, name: user.name, role: user.role, team: user.team },
    mandatory,
    d.assignments.filter((a) => a.userId === user.id),
    d.certificates.filter((c) => c.userId === user.id),
  );

  const deadlines = row.breakdown
    .filter((b) => b.dueDate)
    .map((b) => ({
      title: b.course.title,
      emoji: b.course.thumbnailEmoji,
      state: b.state,
      dueDate: new Date(b.dueDate!),
      courseId: b.course.id,
    }))
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

  // 3-Monatige Grid-Ansicht
  const now = new Date();
  const months = [0, 1, 2, 3, 4, 5].map((offset) => {
    const m = new Date(now.getFullYear(), now.getMonth() + offset, 1);
    const events = deadlines.filter(
      (d) => d.dueDate.getFullYear() === m.getFullYear() && d.dueDate.getMonth() === m.getMonth(),
    );
    return { date: m, events };
  });

  return (
    <div className="space-y-6 p-6 lg:p-10">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-4xl font-semibold tracking-tight">Fristen-Kalender</h1>
          <p className="mt-1 text-muted-foreground">Alle Pflichtschulungen und ihre Auffrischungstermine.</p>
        </div>
        <a
          href="/api/lms/compliance/me?format=ics"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          <Download className="h-4 w-4" /> ICS exportieren
        </a>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {months.map((m) => (
          <Card key={m.date.toISOString()}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <CalendarDays className="h-4 w-4 text-primary" />
                {m.date.toLocaleDateString("de-AT", { month: "long", year: "numeric" })}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {m.events.length === 0 ? (
                <p className="text-xs text-muted-foreground">Keine Fristen</p>
              ) : (
                m.events.map((e) => (
                  <div
                    key={e.courseId + e.dueDate.toISOString()}
                    className={`flex items-center justify-between gap-2 rounded-lg border p-2 text-xs ${
                      e.state === "rot"
                        ? "border-red-200 bg-red-50"
                        : e.state === "gelb"
                        ? "border-amber-200 bg-amber-50"
                        : "border-border"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span aria-hidden>{e.emoji}</span>
                      <span className="font-medium">{e.title}</span>
                    </div>
                    <span className="text-muted-foreground">
                      {e.dueDate.toLocaleDateString("de-AT", { day: "2-digit", month: "short" })}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
