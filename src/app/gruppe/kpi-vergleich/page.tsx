import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { resolveActiveGroup, currentMonth } from "../_lib/context";
import { buildCompareMatrix, bestPracticeFacility } from "@/lib/multi-tenant/comparator";
import { CompareMatrix } from "@/components/multi-tenant/CompareMatrix";
import type { NumericKpiKey } from "@/lib/multi-tenant/rollup";

const METRICS: NumericKpiKey[] = [
  "occupancyPct", "avgPflegegrad", "staffTurnoverPct", "documentationRatePct",
  "incidentRate", "complianceQuotePct", "complaints", "revenueEur", "ebitdaEur",
];

const LABELS: Record<NumericKpiKey, string> = {
  occupancyPct: "Belegung %",
  avgPflegegrad: "Ø Pflegegrad",
  staffTurnoverPct: "MA-Fluktuation %",
  documentationRatePct: "Doku-Quote %",
  incidentRate: "Incidents /1000d",
  complianceQuotePct: "Compliance-Quote %",
  complaints: "Beschwerden",
  revenueEur: "Umsatz",
  ebitdaEur: "EBITDA",
  mdCheckOpenFindings: "Offene MD-Befunde",
};

export default async function KpiComparePage({ searchParams }: { searchParams?: Promise<Record<string, string | undefined>> }) {
  const sp = (await searchParams) ?? {};
  const group = resolveActiveGroup(sp.gruppe);
  const month = currentMonth();
  const rows = buildCompareMatrix(group, month, METRICS);
  const best = bestPracticeFacility(group, month);

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6 lg:p-10">
      <header>
        <h1 className="font-serif text-3xl font-semibold tracking-tight">KPI-Vergleich</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Benchmark jeder Einrichtung gegen den Median der Gruppe. Best-Practice-Haus ist hervorgehoben.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="font-serif">Matrix · {month}</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <CompareMatrix rows={rows} metrics={METRICS} bestId={best.facilityId} labels={LABELS} />
        </CardContent>
      </Card>
    </div>
  );
}
