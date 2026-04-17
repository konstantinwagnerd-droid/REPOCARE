import { db } from "@/db/client";
import { auth } from "@/lib/auth";
import { shifts, users } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { format, startOfWeek, addDays } from "date-fns";
import { de } from "date-fns/locale";

export default async function SchedulePage() {
  const session = await auth();
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const allShifts = await db
    .select({ s: shifts, u: users })
    .from(shifts)
    .leftJoin(users, eq(users.id, shifts.userId))
    .where(eq(shifts.tenantId, session!.user.tenantId))
    .orderBy(asc(shifts.startsAt));

  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="space-y-8 p-6 lg:p-10">
      <div>
        <h1 className="font-serif text-4xl font-semibold tracking-tight">Dienstplan</h1>
        <p className="mt-1 text-muted-foreground">Woche vom {formatDate(weekStart)} — {allShifts.length} geplante Schichten.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-7">
        {days.map((d) => {
          const dayShifts = allShifts.filter(({ s }) => format(s.startsAt, "yyyy-MM-dd") === format(d, "yyyy-MM-dd"));
          return (
            <Card key={d.toISOString()}>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">
                  <div className="text-xs uppercase text-muted-foreground">{format(d, "EEEE", { locale: de })}</div>
                  <div>{format(d, "d. MMM", { locale: de })}</div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 p-3 pt-0">
                {dayShifts.length === 0 && <p className="text-xs text-muted-foreground">—</p>}
                {dayShifts.map(({ s, u }) => (
                  <div key={s.id} className="rounded-lg border border-border p-2 text-xs">
                    <div className="font-semibold">{u?.fullName?.split(" ")[0] ?? "?"}</div>
                    <div className="text-muted-foreground">{format(s.startsAt, "HH:mm")}–{format(s.endsAt, "HH:mm")}</div>
                    <Badge variant="outline" className="mt-1">{s.station}</Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
