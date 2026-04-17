"use client";

import { useState } from "react";
import { CalendarRange, Play, Download, FileDown, Sparkles, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SolverResult } from "@/components/scheduling/SolverResult";
import { solve } from "@/lib/scheduling/solver";
import { demoSlots, demoStaff } from "@/lib/scheduling/demo";
import type { ShiftSlot, Solution, StaffMember } from "@/lib/scheduling/types";
import { SHIFT_LABEL } from "@/lib/scheduling/types";

export default function DienstplanSolverPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [slots, setSlots] = useState<ShiftSlot[]>([]);
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [days, setDays] = useState(7);
  const [earlyReq, setEarlyReq] = useState(3);
  const [lateReq, setLateReq] = useState(3);
  const [nightReq, setNightReq] = useState(2);
  const [solution, setSolution] = useState<Solution | null>(null);
  const [running, setRunning] = useState(false);

  const loadDemo = () => {
    setStaff(demoStaff());
    setSlots(demoSlots(new Date(startDate), days));
  };

  const buildSlots = (): ShiftSlot[] => {
    const out: ShiftSlot[] = [];
    const s = new Date(startDate);
    for (let d = 0; d < days; d++) {
      const date = new Date(s.getTime() + d * 86_400_000).toISOString().slice(0, 10);
      out.push({ date, type: "frueh", required: earlyReq, minFachkraft: 1 });
      out.push({ date, type: "spaet", required: lateReq, minFachkraft: 1 });
      out.push({ date, type: "nacht", required: nightReq, minFachkraft: 1 });
    }
    return out;
  };

  const run = async () => {
    const s = staff.length ? staff : demoStaff();
    const sl = slots.length ? slots : buildSlots();
    setStaff(s);
    setSlots(sl);
    setRunning(true);
    setSolution(null);

    // Defer to next tick so UI can update, then run sync solver.
    // For >3s budgets we'd use a Web Worker; here 3s is the cap.
    setTimeout(() => {
      try {
        const result = solve({ staff: s, slots: sl, timeBudgetMs: 3000 });
        setSolution(result);
      } finally {
        setRunning(false);
      }
    }, 10);
  };

  const exportCsv = () => {
    if (!solution) return;
    const lines = ["datum,schicht,mitarbeiter"];
    const staffMap = new Map(staff.map((s) => [s.id, s.name]));
    for (const a of solution.assignments) {
      const slot = slots[a.slotIndex];
      if (!slot) continue;
      lines.push(`${slot.date},${slot.type},"${staffMap.get(a.staffId) ?? a.staffId}"`);
    }
    download("dienstplan.csv", lines.join("\n"), "text/csv");
  };

  const exportIcs = () => {
    if (!solution) return;
    const staffMap = new Map(staff.map((s) => [s.id, s.name]));
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//CareAI//Dienstplan//DE"];
    const shiftTime: Record<string, [string, string]> = {
      frueh: ["060000", "140000"],
      spaet: ["140000", "220000"],
      nacht: ["220000", "080000"],
    };
    for (const a of solution.assignments) {
      const slot = slots[a.slotIndex];
      if (!slot) continue;
      const [startH, endH] = shiftTime[slot.type];
      const d = slot.date.replace(/-/g, "");
      lines.push(
        "BEGIN:VEVENT",
        `UID:${slot.date}-${slot.type}-${a.staffId}@careai`,
        `DTSTART:${d}T${startH}`,
        `DTEND:${d}T${endH}`,
        `SUMMARY:${SHIFT_LABEL[slot.type]} — ${staffMap.get(a.staffId) ?? a.staffId}`,
        "END:VEVENT",
      );
    }
    lines.push("END:VCALENDAR");
    download("dienstplan.ics", lines.join("\r\n"), "text/calendar");
  };

  return (
    <div className="mx-auto max-w-7xl p-6 md:p-10">
      <header className="mb-8">
        <div className="flex items-center gap-3">
          <CalendarRange className="h-10 w-10 text-primary-600" aria-hidden />
          <h1 className="font-serif text-4xl font-semibold">Dienstplan-Solver</h1>
        </div>
        <p className="mt-2 text-muted-foreground">
          Automatisch optimale Verteilung von Schichten unter Beruecksichtigung von Arbeitszeitgesetz, Qualifikationen
          und Mitarbeiter-Wuenschen. Demo-Modus — Ergebnis wird nicht persistiert.
        </p>
      </header>

      <div className="mb-8 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm dark:border-amber-900 dark:bg-amber-950/30">
        <div className="flex items-start gap-3">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden />
          <p>
            <span className="font-semibold">Mock-Demo:</span> Ergebnis wird nicht in der Datenbank persistiert. In der
            Produktion wuerde &ldquo;In Dienstplan uebernehmen&rdquo; die shifts-Tabelle aktualisieren.
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside>
          <Card>
            <CardHeader>
              <CardTitle>Eingaben</CardTitle>
              <CardDescription>Zeitraum und Mindestbesetzung</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="start">Startdatum</Label>
                <Input
                  id="start"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="days">Tage</Label>
                <Input
                  id="days"
                  type="number"
                  min={1}
                  max={31}
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="fr">Frueh</Label>
                  <Input
                    id="fr"
                    type="number"
                    min={0}
                    max={10}
                    value={earlyReq}
                    onChange={(e) => setEarlyReq(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="sp">Spaet</Label>
                  <Input
                    id="sp"
                    type="number"
                    min={0}
                    max={10}
                    value={lateReq}
                    onChange={(e) => setLateReq(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="na">Nacht</Label>
                  <Input
                    id="na"
                    type="number"
                    min={0}
                    max={10}
                    value={nightReq}
                    onChange={(e) => setNightReq(Number(e.target.value))}
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Button onClick={loadDemo} variant="outline">
                  <Sparkles className="h-4 w-4" aria-hidden /> Demo-Daten laden
                </Button>
                <Button onClick={run} disabled={running} variant="default">
                  <Play className="h-4 w-4" aria-hidden /> {running ? "Optimiere…" : "Plan generieren"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {staff.length > 0 && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Mitarbeiter ({staff.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-1 text-sm">
                  {staff.map((s) => (
                    <li key={s.id} className="flex justify-between gap-2">
                      <span>{s.name}</span>
                      <span className="text-muted-foreground">{s.qualification}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </aside>

        <section>
          {!solution && !running && (
            <Card className="flex min-h-[400px] items-center justify-center">
              <CardContent className="text-center">
                <CalendarRange className="mx-auto mb-4 h-12 w-12 text-muted-foreground" aria-hidden />
                <p className="text-lg font-medium">Noch kein Plan</p>
                <p className="text-sm text-muted-foreground">Laden Sie Demo-Daten und generieren Sie einen Plan.</p>
              </CardContent>
            </Card>
          )}

          {running && (
            <Card className="flex min-h-[400px] items-center justify-center">
              <CardContent className="text-center">
                <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary-300 border-t-primary-600" />
                <p className="text-lg font-medium">Solver laeuft…</p>
                <p className="text-sm text-muted-foreground">Simulated Annealing, max. 3 Sekunden</p>
              </CardContent>
            </Card>
          )}

          {solution && (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-3">
                <Button onClick={exportCsv} variant="outline">
                  <Download className="h-4 w-4" aria-hidden /> CSV
                </Button>
                <Button onClick={exportIcs} variant="outline">
                  <FileDown className="h-4 w-4" aria-hidden /> ICS-Kalender
                </Button>
                <Button onClick={() => window.print()} variant="outline">
                  Drucken (A3 quer)
                </Button>
                <Button
                  onClick={() => alert("Mock — nicht persistiert in dieser Demo")}
                  variant="default"
                >
                  In Dienstplan uebernehmen
                </Button>
              </div>
              <SolverResult solution={solution} slots={slots} staff={staff} />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function download(name: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}
