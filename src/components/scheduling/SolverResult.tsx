"use client";

import { AlertTriangle, CheckCircle2, Clock, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Solution, ShiftSlot, StaffMember } from "@/lib/scheduling/types";
import { SHIFT_LABEL } from "@/lib/scheduling/types";

export function SolverResult({
  solution,
  slots,
  staff,
}: {
  solution: Solution;
  slots: ShiftSlot[];
  staff: StaffMember[];
}) {
  const staffMap = new Map(staff.map((s) => [s.id, s]));
  const bySlot = new Map<number, string[]>();
  for (const a of solution.assignments) {
    if (!bySlot.has(a.slotIndex)) bySlot.set(a.slotIndex, []);
    bySlot.get(a.slotIndex)!.push(a.staffId);
  }
  const byDate = new Map<string, number[]>();
  slots.forEach((s, i) => {
    if (!byDate.has(s.date)) byDate.set(s.date, []);
    byDate.get(s.date)!.push(i);
  });
  const hardCount = solution.violations.filter((v) => v.severity === "hard").length;
  const softCount = solution.violations.filter((v) => v.severity === "soft").length;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle2 className="h-5 w-5 text-primary-600" aria-hidden /> Score
            </CardTitle>
          </CardHeader>
          <CardContent className="font-mono text-2xl font-semibold">{solution.score.toLocaleString("de-AT")}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-5 w-5 text-red-600" aria-hidden /> Hard Violations
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{hardCount}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-5 w-5 text-amber-600" aria-hidden /> Soft Violations
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{softCount}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-5 w-5 text-muted-foreground" aria-hidden /> Zeit
            </CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">
            {solution.elapsedMs} ms
            <p className="text-xs text-muted-foreground">{solution.iterations} Iterationen</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Wochenansicht</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="p-2 text-left font-medium">Datum</th>
                  <th className="p-2 text-left font-medium">Schicht</th>
                  <th className="p-2 text-left font-medium">Besetzung</th>
                  <th className="p-2 text-left font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {[...byDate.entries()].map(([date, idxs]) =>
                  idxs.map((idx) => {
                    const slot = slots[idx];
                    const ids = bySlot.get(idx) ?? [];
                    const ok = ids.length >= slot.required;
                    return (
                      <tr key={idx} className="border-b border-border/50">
                        <td className="p-2 font-mono">{date}</td>
                        <td className="p-2">{SHIFT_LABEL[slot.type]}</td>
                        <td className="p-2">
                          <div className="flex flex-wrap gap-1">
                            {ids.map((id) => {
                              const s = staffMap.get(id);
                              return (
                                <span
                                  key={id}
                                  className="rounded-full bg-primary-100 px-2 py-0.5 text-xs dark:bg-primary-900/50"
                                >
                                  {s?.name ?? id}
                                </span>
                              );
                            })}
                            {ids.length < slot.required && (
                              <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-800 dark:bg-red-900/50 dark:text-red-200">
                                {slot.required - ids.length} offen
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="p-2">
                          {ok ? (
                            <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-600" aria-hidden />
                          )}
                        </td>
                      </tr>
                    );
                  }),
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" aria-hidden /> Stunden pro Mitarbeiter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="grid gap-2 md:grid-cols-2">
            {staff.map((s) => {
              const actual = solution.hoursByStaff[s.id] ?? 0;
              const target = s.sollStunden;
              const delta = actual - target;
              return (
                <li key={s.id} className="flex items-center justify-between rounded-xl bg-muted/50 p-3">
                  <span className="font-medium">{s.name}</span>
                  <span className="font-mono text-sm">
                    {actual}h <span className="text-muted-foreground">/ {target}h</span>{" "}
                    <span className={delta === 0 ? "" : delta > 0 ? "text-amber-600" : "text-blue-600"}>
                      {delta > 0 ? `+${delta}` : delta}
                    </span>
                  </span>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>

      {solution.violations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Verletzungen</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              {solution.violations.map((v, i) => (
                <li
                  key={i}
                  className={`rounded-xl border p-3 ${
                    v.severity === "hard"
                      ? "border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30"
                      : "border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30"
                  }`}
                >
                  <span className="font-mono text-xs uppercase text-muted-foreground">{v.severity}</span>{" "}
                  <span className="font-medium">{v.kind}</span> — {v.message}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
