"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Check, X, Download, Clock, AlertTriangle, Users, TrendingUp } from "lucide-react";
import type { TimeSheetMonth } from "@/lib/zeiterfassung/types";

type Props = { initialSheets: TimeSheetMonth[]; ym: string };

function fmtHrs(min: number): string { const sign = min < 0 ? "-" : ""; const m = Math.abs(min); return `${sign}${Math.floor(m / 60)}h ${m % 60}m`; }

export function ZeiterfassungAdminClient({ initialSheets, ym }: Props) {
  const [sheets, setSheets] = useState(initialSheets);
  const [month, setMonth] = useState(ym);
  const [filter, setFilter] = useState("");

  const filtered = useMemo(() => sheets.filter((s) => s.userName.toLowerCase().includes(filter.toLowerCase())), [sheets, filter]);
  const totalOvertime = sheets.reduce((a, s) => a + s.totalOvertimeMinutes, 0);
  const pendingApprovals = sheets.filter((s) => s.approvalStatus === "pending").length;
  const violations = sheets.reduce((a, s) => a + s.days.reduce((b, d) => b + d.violations.length, 0), 0);

  async function decide(userId: string, action: "approve" | "reject") {
    const r = await fetch("/api/zeiterfassung/timesheet", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, ym: month, action }),
    });
    if (r.ok) setSheets((prev) => prev.map((s) => s.userId === userId ? { ...s, approvalStatus: action === "approve" ? "approved" : "rejected" } : s));
  }

  async function reload(newYm: string) {
    setMonth(newYm);
    const r = await fetch(`/api/zeiterfassung/timesheet?scope=all&ym=${newYm}`).then((x) => x.json());
    setSheets(r.sheets ?? []);
  }

  return (
    <div className="space-y-8 p-6 lg:p-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-semibold tracking-tight">Zeiterfassung · Admin</h1>
          <p className="mt-1 text-muted-foreground">Monatsübersicht aller Mitarbeitenden · Genehmigung · Report-Export.</p>
        </div>
        <div className="flex items-center gap-2">
          <Input type="month" value={month} onChange={(e) => reload(e.target.value)} className="w-44" />
          <a href={`/api/zeiterfassung/timesheet?scope=all&ym=${month}&format=csv`}>
            <Button variant="outline"><Download className="mr-2 h-4 w-4" />CSV-Export</Button>
          </a>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Stat icon={<Users className="h-5 w-5" />} label="Mitarbeitende" value={String(sheets.length)} />
        <Stat icon={<Clock className="h-5 w-5" />} label="Offene Genehmigungen" value={String(pendingApprovals)} tone="text-amber-700 bg-amber-100" />
        <Stat icon={<TrendingUp className="h-5 w-5" />} label="Summe Überstunden" value={fmtHrs(totalOvertime)} tone={totalOvertime >= 0 ? "text-emerald-700 bg-emerald-100" : "text-amber-700 bg-amber-100"} />
        <Stat icon={<AlertTriangle className="h-5 w-5" />} label="Regelverstöße" value={String(violations)} tone={violations ? "text-destructive bg-destructive/10" : "text-primary bg-primary/10"} />
      </div>

      <Input placeholder="Mitarbeiter:in suchen …" value={filter} onChange={(e) => setFilter(e.target.value)} className="md:max-w-sm" />

      <div className="grid gap-3">
        {filtered.map((s) => {
          const dayViolations = s.days.reduce((a, d) => a + d.violations.length, 0);
          return (
            <Card key={s.userId}>
              <CardHeader>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <CardTitle>{s.userName}</CardTitle>
                    <p className="text-xs text-muted-foreground">Monat {s.ym} · {s.days.length} Arbeitstage · Urlaub genommen {s.vacationDaysTaken}/{s.vacationDaysTaken + s.vacationDaysRemaining}</p>
                  </div>
                  <Badge variant={s.approvalStatus === "approved" ? "success" : s.approvalStatus === "rejected" ? "danger" : "outline"}>{s.approvalStatus}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 md:grid-cols-5">
                  <KPI label="Ist" value={fmtHrs(s.totalWorkedMinutes)} />
                  <KPI label="Soll" value={fmtHrs(s.totalSollMinutes)} />
                  <KPI label="Δ" value={fmtHrs(s.totalOvertimeMinutes)} warn={s.totalOvertimeMinutes < 0} />
                  <KPI label="Pausen" value={fmtHrs(s.totalPauseMinutes)} />
                  <KPI label="Verstöße" value={String(dayViolations)} warn={dayViolations > 0} />
                </div>
                {s.approvalStatus === "pending" && (
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" onClick={() => decide(s.userId, "approve")}><Check className="mr-1 h-4 w-4" />Genehmigen</Button>
                    <Button size="sm" variant="outline" onClick={() => decide(s.userId, "reject")}><X className="mr-1 h-4 w-4" />Ablehnen</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function Stat({ icon, label, value, tone = "text-primary bg-primary/10" }: { icon: React.ReactNode; label: string; value: string; tone?: string }) {
  return (
    <Card><CardContent className="flex items-center gap-4 p-6">
      <span className={`flex h-12 w-12 items-center justify-center rounded-xl ${tone}`}>{icon}</span>
      <div><div className="font-serif text-2xl font-semibold">{value}</div><div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div></div>
    </CardContent></Card>
  );
}

function KPI({ label, value, warn = false }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className="rounded-xl border border-border p-3 text-center">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-1 font-serif text-xl font-semibold ${warn ? "text-destructive" : ""}`}>{value}</div>
    </div>
  );
}
