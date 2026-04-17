"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Coffee, LogIn, LogOut, Play, Calendar, TrendingUp, AlertTriangle, Umbrella } from "lucide-react";
import type { ClockEventType, TimeSheetMonth, TimeStatus } from "@/lib/zeiterfassung/types";

type Props = { initialStatus: TimeStatus; initialSheet: TimeSheetMonth; userName: string };

function fmtHrs(min: number): string { const sign = min < 0 ? "-" : ""; const m = Math.abs(min); return `${sign}${Math.floor(m / 60)}h ${m % 60}m`; }
function fmtTime(ts: number | null): string { return ts ? new Date(ts).toLocaleTimeString("de-AT", { hour: "2-digit", minute: "2-digit" }) : "—"; }

export function ZeiterfassungClient({ initialStatus, initialSheet, userName }: Props) {
  const [status, setStatus] = useState(initialStatus);
  const [sheet, setSheet] = useState(initialSheet);
  const [now, setNow] = useState<number>(Date.now());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);

  async function fire(type: ClockEventType) {
    setBusy(true); setError(null);
    const r = await fetch("/api/zeiterfassung/clock", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type }) });
    const j = await r.json();
    if (!r.ok) { setError(j.error ?? "Fehler"); setBusy(false); return; }
    setStatus(j.status);
    const ym = new Date().toISOString().slice(0, 7);
    const s = await fetch(`/api/zeiterfassung/timesheet?ym=${ym}`).then((x) => x.json());
    setSheet(s.sheet);
    setBusy(false);
  }

  const liveMin = status.state === "in" && status.since ? status.todayWorkedMinutes + Math.floor((now - status.since) / 60000) : status.todayWorkedMinutes;
  const livePauseMin = status.state === "pause" && status.since ? status.todayPauseMinutes + Math.floor((now - status.since) / 60000) : status.todayPauseMinutes;
  const stateLabel = status.state === "in" ? "Eingestempelt" : status.state === "pause" ? "In Pause" : "Ausgestempelt";
  const stateTone = status.state === "in" ? "bg-emerald-500" : status.state === "pause" ? "bg-amber-500" : "bg-muted";

  return (
    <div className="space-y-8 p-6 lg:p-10">
      <div>
        <h1 className="font-serif text-4xl font-semibold tracking-tight">Zeiterfassung</h1>
        <p className="mt-1 text-muted-foreground">Hallo {userName}, stemple ein/aus oder pausiere — dein Dienstplan-Soll wird automatisch verglichen.</p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center gap-6 p-10">
          <div className="flex items-center gap-3">
            <span className={`h-3 w-3 rounded-full ${stateTone} ${status.state === "in" ? "animate-pulse" : ""}`} aria-hidden />
            <span className="text-xl font-semibold">{stateLabel}</span>
            {status.since && <span className="text-sm text-muted-foreground">seit {fmtTime(status.since)}</span>}
          </div>
          <div className="font-serif text-7xl font-semibold tabular-nums" aria-live="polite">{fmtHrs(liveMin)}</div>
          <p className="text-sm text-muted-foreground">heute gearbeitet · {fmtHrs(livePauseMin)} Pause</p>

          <div className="flex w-full max-w-xl flex-wrap justify-center gap-3">
            {status.state === "out" && (
              <Button size="lg" className="h-20 flex-1 text-lg" onClick={() => fire("in")} disabled={busy}>
                <LogIn className="mr-2 h-6 w-6" />Einstempeln
              </Button>
            )}
            {status.state === "in" && (
              <>
                <Button size="lg" variant="outline" className="h-20 flex-1 text-lg" onClick={() => fire("pause-start")} disabled={busy}>
                  <Coffee className="mr-2 h-6 w-6" />Pause
                </Button>
                <Button size="lg" variant="destructive" className="h-20 flex-1 text-lg" onClick={() => fire("out")} disabled={busy}>
                  <LogOut className="mr-2 h-6 w-6" />Ausstempeln
                </Button>
              </>
            )}
            {status.state === "pause" && (
              <Button size="lg" className="h-20 flex-1 text-lg" onClick={() => fire("pause-end")} disabled={busy}>
                <Play className="mr-2 h-6 w-6" />Pause beenden
              </Button>
            )}
          </div>
          {error && <div className="rounded-lg bg-destructive/10 px-4 py-2 text-sm text-destructive" role="alert">{error}</div>}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-4">
        <Stat icon={<Clock className="h-5 w-5" />} label="Ist (Monat)" value={fmtHrs(sheet.totalWorkedMinutes)} />
        <Stat icon={<Calendar className="h-5 w-5" />} label="Soll (Monat)" value={fmtHrs(sheet.totalSollMinutes)} tone="text-accent bg-accent/10" />
        <Stat icon={<TrendingUp className="h-5 w-5" />} label="Überstunden" value={fmtHrs(sheet.totalOvertimeMinutes)} tone={sheet.totalOvertimeMinutes >= 0 ? "text-emerald-700 bg-emerald-100" : "text-amber-700 bg-amber-100"} />
        <Stat icon={<Umbrella className="h-5 w-5" />} label="Urlaubstage Rest" value={String(sheet.vacationDaysRemaining)} tone="text-sky-700 bg-sky-100" />
      </div>

      <Card>
        <CardHeader><CardTitle>Tage dieser Monat ({sheet.days.length})</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {sheet.days.slice().reverse().map((d) => (
            <div key={d.date} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-3 text-sm">
              <div className="min-w-[8rem] font-semibold">{new Date(d.date).toLocaleDateString("de-AT", { weekday: "short", day: "2-digit", month: "2-digit" })}</div>
              <div className="flex-1 text-xs text-muted-foreground">{d.events.map((e) => `${e.type} ${fmtTime(e.timestamp)}`).join(" · ")}</div>
              <div className="flex items-center gap-3">
                <span>{fmtHrs(d.workedMinutes)}</span>
                <Badge variant={d.overtimeMinutes >= 0 ? "success" : "warning"}>{d.overtimeMinutes >= 0 ? "+" : ""}{fmtHrs(d.overtimeMinutes)}</Badge>
                {d.violations.length > 0 && <Badge variant="danger" className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" />{d.violations.length}</Badge>}
              </div>
            </div>
          ))}
          {sheet.days.length === 0 && <p className="text-sm text-muted-foreground">Noch keine Stempel-Einträge in diesem Monat.</p>}
        </CardContent>
      </Card>
    </div>
  );
}

function Stat({ icon, label, value, tone = "text-primary bg-primary/10" }: { icon: React.ReactNode; label: string; value: string; tone?: string }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${tone}`}>{icon}</span>
        <div>
          <div className="font-serif text-2xl font-semibold tabular-nums">{value}</div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
        </div>
      </CardContent>
    </Card>
  );
}
