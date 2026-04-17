"use client";

import { useMemo } from "react";
import type { NumericKpiKey } from "@/lib/multi-tenant/rollup";
import { cellStatus, type KpiRow } from "@/lib/multi-tenant/comparator";
import { cn } from "@/lib/utils";

const FORMATTERS: Partial<Record<NumericKpiKey, (v: number) => string>> = {
  occupancyPct: (v) => `${v.toFixed(1)}%`,
  documentationRatePct: (v) => `${v.toFixed(1)}%`,
  complianceQuotePct: (v) => `${v.toFixed(1)}%`,
  staffTurnoverPct: (v) => `${v.toFixed(1)}%`,
  avgPflegegrad: (v) => v.toFixed(2),
  incidentRate: (v) => v.toFixed(2),
  complaints: (v) => String(Math.round(v)),
  mdCheckOpenFindings: (v) => String(Math.round(v)),
  revenueEur: (v) => `${Math.round(v / 1000)}k €`,
  ebitdaEur: (v) => `${Math.round(v / 1000)}k €`,
};

export function CompareMatrix({ rows, metrics, bestId, labels }: {
  rows: KpiRow[];
  metrics: NumericKpiKey[];
  bestId?: string;
  labels: Record<NumericKpiKey, string>;
}) {
  const exportCsv = () => {
    const header = ["Einrichtung", "Stadt", ...metrics.map((m) => labels[m])];
    const lines = [header.join(";")];
    for (const r of rows) {
      lines.push([r.facilityName, r.city, ...metrics.map((m) => (FORMATTERS[m] ?? ((v) => String(v)))(r.values[m]))].join(";"));
    }
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `kpi-vergleich.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const tone = useMemo(() => ({
    good: "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200",
    ok: "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-200",
    bad: "bg-rose-50 text-rose-800 dark:bg-rose-950/40 dark:text-rose-200",
  }), []);

  return (
    <div>
      <div className="flex items-center justify-between border-b border-border p-3">
        <div className="text-xs text-muted-foreground">Color-Coding: grün = besser als Median, gelb = um Median, rot = &gt;5% schlechter</div>
        <button onClick={exportCsv} className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-secondary">
          CSV exportieren
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="sticky left-0 z-10 bg-muted/40 px-4 py-3">Einrichtung</th>
              {metrics.map((m) => (
                <th key={m} className="px-3 py-3 text-right">{labels[m]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.facilityId} className={cn("border-t border-border", bestId === r.facilityId && "bg-emerald-50/50 dark:bg-emerald-950/20")}>
                <td className="sticky left-0 z-10 bg-inherit px-4 py-2.5 font-medium">
                  <div className="flex items-center gap-2">
                    {bestId === r.facilityId && <span title="Best Practice" className="inline-block h-2 w-2 rounded-full bg-emerald-500" />}
                    <span>{r.facilityName}</span>
                  </div>
                  <div className="text-[11px] text-muted-foreground">{r.city}</div>
                </td>
                {metrics.map((m) => {
                  const v = r.values[m];
                  const med = r.medians[m];
                  const status = cellStatus(v, med, m);
                  const fmt = FORMATTERS[m] ?? ((x: number) => String(x));
                  return (
                    <td key={m} className={cn("px-3 py-2.5 text-right tabular-nums", tone[status])}>
                      {fmt(v)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-muted/20 text-xs text-muted-foreground">
            <tr className="border-t border-border">
              <td className="px-4 py-2 font-semibold">Median</td>
              {metrics.map((m) => (
                <td key={m} className="px-3 py-2 text-right tabular-nums">
                  {(FORMATTERS[m] ?? ((x: number) => String(x)))(rows[0]?.medians[m] ?? 0)}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
