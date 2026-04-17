"use client";

import { useMemo, useState } from "react";
import type { BenchmarkReport, Bundesland, FacilitySize, QualityIndicator, TraegerType } from "@/lib/quality-benchmarks/types";
import { makePeerGroup } from "@/lib/quality-benchmarks/reference-data";
import { calculateBenchmark } from "@/lib/quality-benchmarks/calculator";
import { TrendingUp, TrendingDown, Target, Download, Info } from "lucide-react";

type Props = {
  qis: QualityIndicator[];
  bundeslaender: Bundesland[];
  sizes: Array<{ id: FacilitySize; label: string }> | FacilitySize[];
  traeger: Array<{ id: TraegerType; label: string }> | TraegerType[];
  initialReport: BenchmarkReport;
};

const TRAEGER_LABEL: Record<TraegerType, string> = {
  public: "Öffentlich",
  church: "Kirchlich",
  private: "Privat",
  nonprofit: "Gemeinnützig",
};

function toOptions<T extends string>(items: Array<{ id: T; label: string }> | T[]): Array<{ id: T; label: string }> {
  return items.map((x) => (typeof x === "string" ? { id: x, label: x } : x));
}

const STATUS_TONE: Record<"green" | "yellow" | "red", string> = {
  green: "border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-950/40 dark:text-emerald-200",
  yellow: "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-200",
  red: "border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-200",
};

export function BenchmarksClient({ qis, bundeslaender, sizes, traeger, initialReport }: Props) {
  const [bundesland, setBundesland] = useState<Bundesland>(initialReport.peerGroup.bundesland);
  const [size, setSize] = useState<FacilitySize>(initialReport.peerGroup.size);
  const [trg, setTrg] = useState<TraegerType>(initialReport.peerGroup.traegerType);
  const [openQi, setOpenQi] = useState<string | null>(null);

  const report = useMemo(() => {
    const peer = makePeerGroup(bundesland, size, trg);
    return calculateBenchmark(initialReport.facilityId, initialReport.facilityName, initialReport.period, peer);
  }, [bundesland, size, trg, initialReport.facilityId, initialReport.facilityName, initialReport.period]);

  const byQi = new Map(report.values.map((v) => [v.qiId, v]));
  const selectedQi = openQi ? qis.find((q) => q.id === openQi) ?? null : null;
  const selectedValue = openQi ? byQi.get(openQi) : null;

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid gap-3 rounded-xl border border-border bg-background p-4 md:grid-cols-4">
        <label className="text-sm">
          <span className="mb-1 block font-medium">Bundesland</span>
          <select
            value={bundesland}
            onChange={(e) => setBundesland(e.target.value as Bundesland)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2"
          >
            {bundeslaender.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium">Einrichtungsgröße</span>
          <select
            value={size}
            onChange={(e) => setSize(e.target.value as FacilitySize)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2"
          >
            {toOptions(sizes).map((s) => (
              <option key={s.id} value={s.id}>{s.label}</option>
            ))}
          </select>
        </label>
        <label className="text-sm">
          <span className="mb-1 block font-medium">Trägerschaft</span>
          <select
            value={trg}
            onChange={(e) => setTrg(e.target.value as TraegerType)}
            className="w-full rounded-lg border border-border bg-background px-3 py-2"
          >
            {toOptions(traeger).map((t) => (
              <option key={t.id} value={t.id}>{t.label || TRAEGER_LABEL[t.id]}</option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Download size={16} aria-hidden /> PDF-Report
        </button>
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-background p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Target size={16} aria-hidden /> Gesamt-Score
          </div>
          <div className="mt-2 font-serif text-4xl font-semibold">{report.overallScore}/100</div>
        </div>
        <div className="rounded-xl border border-border bg-background p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TrendingUp size={16} aria-hidden /> Ranking
          </div>
          <div className="mt-2 font-serif text-4xl font-semibold">
            {report.rank.position}/{report.rank.outOf}
          </div>
          <div className="text-xs text-muted-foreground">in der Peer-Group (N={report.peerGroup.sampleN})</div>
        </div>
        <div className="rounded-xl border border-border bg-background p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Info size={16} aria-hidden /> Zeitraum
          </div>
          <div className="mt-2 font-serif text-4xl font-semibold">{report.period}</div>
          <div className="text-xs text-muted-foreground">Generiert: {new Date(report.generatedAt).toLocaleDateString("de-DE")}</div>
        </div>
      </div>

      {/* QI Grid */}
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {qis.map((qi) => {
          const v = byQi.get(qi.id);
          if (!v) return null;
          const trend = v.trendDeltaPct;
          return (
            <button
              key={qi.id}
              type="button"
              onClick={() => setOpenQi(qi.id)}
              className={`rounded-xl border p-4 text-left transition hover:shadow ${STATUS_TONE[v.status]}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-xs opacity-70">{qi.code}</div>
                  <div className="font-medium leading-snug">{qi.label}</div>
                </div>
                {trend > 0 ? <TrendingUp size={18} aria-hidden /> : trend < 0 ? <TrendingDown size={18} aria-hidden /> : null}
              </div>
              <div className="mt-3 flex items-baseline gap-3">
                <div className="font-serif text-2xl font-semibold">
                  {qi.unit === "percent" ? `${v.own.toFixed(1)}%` : qi.unit === "per1000" ? v.own.toFixed(2) : v.own.toFixed(2)}
                </div>
                <div className="text-xs opacity-80">
                  Peer-Median {qi.unit === "percent" ? `${v.peerMedian.toFixed(1)}%` : v.peerMedian.toFixed(2)}
                </div>
              </div>
              <div className="mt-1 text-xs opacity-80">Percentile {v.percentile.toFixed(0)}</div>
            </button>
          );
        })}
      </div>

      {/* Strengths / Handlungsfelder */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-background p-4">
          <h2 className="font-medium">Stärken</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {report.strengths.map((id) => {
              const q = qis.find((q) => q.id === id);
              return q ? <li key={id}>• {q.label}</li> : null;
            })}
          </ul>
        </div>
        <div className="rounded-xl border border-border bg-background p-4">
          <h2 className="font-medium">Handlungsfelder</h2>
          <ul className="mt-2 space-y-1 text-sm">
            {report.handlungsfelder.map((id) => {
              const q = qis.find((q) => q.id === id);
              return q ? <li key={id}>• {q.label}</li> : null;
            })}
          </ul>
        </div>
      </div>

      {/* Modal */}
      {selectedQi && selectedValue ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpenQi(null)}
        >
          <div
            className="max-h-[85vh] w-full max-w-2xl overflow-auto rounded-xl border border-border bg-background p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs text-muted-foreground">{selectedQi.code}</div>
                <h2 className="font-serif text-2xl font-semibold">{selectedQi.label}</h2>
              </div>
              <button
                type="button"
                onClick={() => setOpenQi(null)}
                className="rounded-lg border border-border px-3 py-1 text-sm"
              >
                Schließen
              </button>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{selectedQi.description}</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-border p-3 text-sm">
                <div className="text-xs text-muted-foreground">Dein Wert</div>
                <div className="font-serif text-xl">
                  {selectedQi.unit === "percent" ? `${selectedValue.own.toFixed(1)}%` : selectedValue.own.toFixed(2)}
                </div>
                <div className="mt-1 text-xs text-muted-foreground">
                  CI95 {selectedValue.ci95[0].toFixed(2)} – {selectedValue.ci95[1].toFixed(2)}
                </div>
              </div>
              <div className="rounded-lg border border-border p-3 text-sm">
                <div className="text-xs text-muted-foreground">Peer-Median</div>
                <div className="font-serif text-xl">{selectedValue.peerMedian.toFixed(2)}</div>
                <div className="mt-1 text-xs text-muted-foreground">
                  SD {selectedValue.peerSd.toFixed(2)} · Percentile {selectedValue.percentile.toFixed(0)}
                </div>
              </div>
            </div>
            <div className="mt-4">
              <h3 className="font-medium">Verbesserungs-Vorschläge</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {selectedQi.improvementHints.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            </div>
            <div className="mt-4 rounded-lg border border-dashed border-border p-3 text-xs text-muted-foreground">
              Quelle: {selectedQi.source}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
