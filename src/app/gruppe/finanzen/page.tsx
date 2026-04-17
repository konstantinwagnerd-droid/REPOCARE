import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { resolveActiveGroup, currentMonth } from "../_lib/context";
import { snapshotsForGroup, last12Months } from "@/lib/multi-tenant/seed";
import { rollupTrend } from "@/lib/multi-tenant/rollup";
import { TrendChart } from "@/components/multi-tenant/TrendChart";
import { FinancialsTable } from "@/components/multi-tenant/FinancialsTable";

function euro(n: number): string {
  return new Intl.NumberFormat("de-AT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

export default async function FinanzenPage({ searchParams }: { searchParams?: Promise<Record<string, string | undefined>> }) {
  const sp = (await searchParams) ?? {};
  const group = resolveActiveGroup(sp.gruppe);
  const month = currentMonth();
  const snaps = snapshotsForGroup(group, month);
  const snapMap = new Map(snaps.map((s) => [s.facilityId, s]));
  const months = last12Months();
  const trend = rollupTrend(group, months);

  const totalRev = snaps.reduce((s, x) => s + x.revenueEur, 0);
  const totalCost = snaps.reduce((s, x) => s + x.costEur, 0);
  const totalEbitda = snaps.reduce((s, x) => s + x.ebitdaEur, 0);
  const ebitdaMarge = totalRev > 0 ? (totalEbitda / totalRev) * 100 : 0;

  return (
    <div className="mx-auto max-w-7xl space-y-6 p-6 lg:p-10">
      <header>
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Finanzen · Gruppe</h1>
        <p className="mt-1 text-sm text-muted-foreground">Aggregierte Financials über alle Häuser. Demo-Daten — in Produktion via Omie/DATEV.</p>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="p-6">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Umsatz (Monat)</div>
          <div className="mt-1 text-2xl font-semibold">{euro(totalRev)}</div>
        </CardContent></Card>
        <Card><CardContent className="p-6">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Kosten (Monat)</div>
          <div className="mt-1 text-2xl font-semibold">{euro(totalCost)}</div>
        </CardContent></Card>
        <Card><CardContent className="p-6">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">EBITDA</div>
          <div className="mt-1 text-2xl font-semibold text-emerald-700">{euro(totalEbitda)}</div>
        </CardContent></Card>
        <Card><CardContent className="p-6">
          <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">EBITDA-Marge</div>
          <div className="mt-1 text-2xl font-semibold">{ebitdaMarge.toFixed(1)}%</div>
        </CardContent></Card>
      </section>

      <Card>
        <CardHeader><CardTitle className="font-serif">12-Monats-Trend (Gruppe)</CardTitle></CardHeader>
        <CardContent>
          <TrendChart
            labels={months}
            series={[
              { label: "Umsatz", color: "#0f766e", values: trend.map((t) => t.revenue) },
              { label: "EBITDA", color: "#16a34a", values: trend.map((t) => t.ebitda) },
            ]}
            format={(n) => `${Math.round(n / 1000)}k`}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="font-serif">Pro Einrichtung</CardTitle></CardHeader>
        <CardContent className="p-0">
          <FinancialsTable
            rows={group.facilities.map((f) => {
              const s = snapMap.get(f.id)!;
              return { id: f.id, name: f.name, city: f.city, revenue: s.revenueEur, cost: s.costEur, ebitda: s.ebitdaEur };
            })}
          />
        </CardContent>
      </Card>
    </div>
  );
}
