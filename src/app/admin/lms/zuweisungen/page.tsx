import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/lms/store";
import { COURSES } from "@/lib/lms/courses";
import { ClipboardList, Plus, BellRing } from "lucide-react";
import { REMINDER_OFFSETS_DAYS } from "@/lib/lms/scheduler";

export default function ZuweisungenPage() {
  const d = db();
  const assignments = d.assignments;
  return (
    <div className="space-y-6 p-6 lg:p-10">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-4xl font-semibold tracking-tight">Zuweisungen</h1>
          <p className="mt-1 text-muted-foreground">
            {assignments.length} aktive Zuweisungen · Erinnerungen automatisch {REMINDER_OFFSETS_DAYS.join(", ")} Tage vor Frist.
          </p>
        </div>
        <Button>
          <Plus className="mr-1 h-4 w-4" /> Bulk-Zuweisung
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellRing className="h-5 w-5 text-primary" /> Erinnerungs-Rhythmus
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {REMINDER_OFFSETS_DAYS.map((d) => (
            <Badge key={d} variant="outline">
              {d} {d === 1 ? "Tag" : "Tage"} vor Frist
            </Badge>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-primary" /> Alle Zuweisungen
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="py-2">Mitarbeiter:in</th>
                <th>Kurs</th>
                <th>Fällig am</th>
                <th>Pflicht</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((a) => {
                const user = d.staff.find((u) => u.id === a.userId);
                const course = COURSES.find((c) => c.id === a.courseId);
                const cert = d.certificates.find(
                  (c) => c.userId === a.userId && c.courseId === a.courseId,
                );
                const due = new Date(a.dueDate);
                const overdue = !cert && due < new Date();
                return (
                  <tr key={a.id} className="border-t border-border">
                    <td className="py-2.5 font-semibold">{user?.name ?? a.userId}</td>
                    <td>{course?.title}</td>
                    <td>{due.toLocaleDateString("de-AT")}</td>
                    <td>
                      {a.mandatory ? (
                        <Badge variant="warning">Pflicht</Badge>
                      ) : (
                        <Badge variant="outline">Optional</Badge>
                      )}
                    </td>
                    <td>
                      {cert ? (
                        <Badge variant="success">Abgeschlossen</Badge>
                      ) : overdue ? (
                        <Badge variant="danger">Überfällig</Badge>
                      ) : (
                        <Badge variant="info">Offen</Badge>
                      )}
                    </td>
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
