import { notFound } from "next/navigation";
import { PrintPage } from "@/components/print/print-page";
import { PrintHeader } from "@/components/print/print-header";
import { PrintFooter } from "@/components/print/print-footer";
import { PrintSection } from "@/components/print/print-section";
import { PrintTable } from "@/components/print/print-table";
import { fmtDate, getPrintContext } from "@/lib/print-context";
import {
  BENCHMARK_KPI_LABELS,
  DACH_BENCHMARKS,
  type BenchmarkKpiKey,
  type CountryCode,
} from "@/data/benchmarks";
import { computeAllKPIs, type TimeWindowDays } from "@/lib/benchmarking/metrics";
import { classifyAgainstBenchmark } from "@/lib/benchmarking/classifier";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ country?: string; window?: string; quarter?: string }>;

export default async function BenchmarkingPrintPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const country: CountryCode = sp.country === "AT" ? "AT" : "DE";
  const windowDays: TimeWindowDays = sp.window === "30" ? 30 : sp.window === "365" ? 365 : 90;
  const quarter = sp.quarter ?? currentQuarterLabel();

  const ctx = await getPrintContext();
  if (!ctx.tenantId) notFound();

  const kpis = await computeAllKPIs(ctx.tenantId, windowDays, country);
  const benchmarks = DACH_BENCHMARKS[country];

  const rows = (Object.keys(benchmarks) as BenchmarkKpiKey[]).map((key) => {
    const b = benchmarks[key]!;
    const r = kpis[key];
    const cls = r.value !== null ? classifyAgainstBenchmark(r.value, b) : null;
    return {
      kpi: BENCHMARK_KPI_LABELS[key],
      ownValue: r.value !== null ? `${r.value} ${b.unit}` : "—",
      median: `${b.median} ${b.unit}`,
      p25: String(b.p25),
      p75: String(b.p75),
      best: String(b.best),
      klassifikation: cls?.label ?? "Keine Daten",
      quelle: b.source,
    };
  });

  return (
    <PrintPage title={`Benchmarking-Bericht ${quarter}`}>
      <PrintHeader
        facilityName={ctx.facilityName}
        facilityAddress={ctx.facilityAddress}
        documentType="DACH-Benchmarking"
        title={`Benchmarking-Bericht ${quarter}`}
        subtitle={`Land: ${country === "DE" ? "Deutschland" : "Oesterreich"} · Zeitraum: letzte ${windowDays} Tage`}
        meta={[
          { label: "Erstellt am", value: fmtDate(new Date()) },
          { label: "Quartal", value: quarter },
        ]}
      />

      <PrintSection title="Vergleich gegen DACH-Branchendurchschnitt">
        <PrintTable
          columns={[
            { key: "kpi", label: "KPI" },
            { key: "ownValue", label: "Eigener Wert", align: "right" },
            { key: "median", label: "Branchenmedian", align: "right" },
            { key: "p25", label: "p25", align: "right" },
            { key: "p75", label: "p75", align: "right" },
            { key: "best", label: "Best", align: "right" },
            { key: "klassifikation", label: "Einordnung" },
          ]}
          rows={rows}
        />
      </PrintSection>

      <PrintSection title="Quellen & Methodik">
        <ul className="list-disc pl-5 text-sm">
          {rows.map((r) => (
            <li key={r.kpi}>
              <strong>{r.kpi}:</strong> {r.quelle}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          Haftungsausschluss: Die Werte repraesentieren Branchenmediane. Individuelle Kontextfaktoren
          (Traegerstruktur, Region, Bewohnerschwerpunkt) sind zu beruecksichtigen.
        </p>
      </PrintSection>

      <PrintFooter facilityName={ctx.facilityName} />
    </PrintPage>
  );
}

function currentQuarterLabel(): string {
  const d = new Date();
  const q = Math.floor(d.getMonth() / 3) + 1;
  return `Q${q}-${d.getFullYear()}`;
}
