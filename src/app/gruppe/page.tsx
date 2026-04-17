import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertTriangle, Bed, HeartHandshake, Percent, TrendingUp, UserCog, Users } from "lucide-react";
import { resolveActiveGroup, currentMonth } from "./_lib/context";
import { rollupGroup, rollupTrend } from "@/lib/multi-tenant/rollup";
import { last12Months } from "@/lib/multi-tenant/seed";
import { FacilityMap } from "@/components/multi-tenant/FacilityMap";
import { TrendChart } from "@/components/multi-tenant/TrendChart";

function euro(n: number): string {
  return new Intl.NumberFormat("de-AT", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

export default async function GruppeOverview({ searchParams }: { searchParams?: Promise<Record<string, string | undefined>> }) {
  const sp = (await searchParams) ?? {};
  const group = resolveActiveGroup(sp.gruppe);
  const month = currentMonth();
  const rollup = rollupGroup(group, month);
  const months = last12Months();
  const trend = rollupTrend(group, months);

  const kpis = [
    { icon: Percent, label: "Ø Belegung", value: `${rollup.averages.occupancyPct.toFixed(1)}%`, hint: `Median ${rollup.medians.occupancyPct}%`, tone: "text-primary bg-primary/10" },
    { icon: HeartHandshake, label: "Ø Pflegegrad", value: rollup.averages.avgPflegegrad.toFixed(2), hint: "Bewohner:innen-Schnitt", tone: "text-accent bg-accent/10" },
    { icon: UserCog, label: "MA-Fluktuation", value: `${rollup.averages.staffTurnoverPct.toFixed(1)}%`, hint: "annualisiert", tone: "text-sky-700 bg-sky-100" },
    { icon: Activity, label: "Dokumentations-Quote", value: `${rollup.averages.documentationRatePct.toFixed(1)}%`, hint: "Pflicht-Einträge", tone: "text-emerald-700 bg-emerald-100" },
    { icon: AlertTriangle, label: "Incident-Rate", value: rollup.averages.incidentRate.toFixed(2), hint: "je 1000 Belegtage", tone: "text-amber-700 bg-amber-100" },
    { icon: TrendingUp, label: "Beschwerden", value: rollup.totalsAdditional.complaints, hint: `laufender Monat`, tone: "text-rose-700 bg-rose-100" },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-6 lg:p-10">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="font-serif text-4xl font-semibold tracking-tight">{group.name}</h1>
          <p className="mt-1 text-muted-foreground">Gruppen-weiter Überblick · {rollup.totals.facilities} Einrichtungen · {rollup.totals.beds} Betten · {rollup.totals.staff} Mitarbeitende</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">Trägerart: {group.traegerType}</Badge>
          <Badge variant="outline">Gegründet {group.foundedYear}</Badge>
          <Badge variant="success">Gruppe aktiv</Badge>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
        {kpis.map((k) => (
          <Card key={k.label}>
            <CardContent className="p-5">
              <div className={`mb-3 inline-flex h-9 w-9 items-center justify-center rounded-lg ${k.tone}`}>
                <k.icon className="h-4 w-4" />
              </div>
              <div className="text-2xl font-semibold tracking-tight">{k.value}</div>
              <div className="mt-0.5 text-xs font-medium text-foreground/80">{k.label}</div>
              <div className="text-[11px] text-muted-foreground">{k.hint}</div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="font-serif">Standorte</CardTitle>
            <span className="text-xs text-muted-foreground">{group.facilities.length} Einrichtungen · {group.country}</span>
          </CardHeader>
          <CardContent>
            <FacilityMap facilities={group.facilities} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Umsatz &amp; EBITDA letzte 12 Monate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-2 flex gap-6 text-sm">
              <div><span className="text-muted-foreground">Umsatz MTD:</span> <span className="font-semibold">{euro(rollup.totals.revenueEur)}</span></div>
              <div><span className="text-muted-foreground">EBITDA MTD:</span> <span className="font-semibold text-emerald-700">{euro(rollup.totals.ebitdaEur)}</span></div>
            </div>
            <TrendChart
              labels={months}
              series={[
                { label: "Umsatz", color: "#0f766e", values: trend.map((t) => t.revenue) },
                { label: "EBITDA", color: "#e11d48", values: trend.map((t) => t.ebitda) },
              ]}
              format={(n) => `${Math.round(n / 1000)}k`}
            />
          </CardContent>
        </Card>
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle className="font-serif">Betriebs-Trend · Belegung &amp; Incidents</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendChart
              labels={months}
              series={[
                { label: "Ø Belegung %", color: "#0f766e", values: trend.map((t) => t.occupancy) },
                { label: "Incidents /1000d", color: "#f59e0b", values: trend.map((t) => t.incidents * 10) },
              ]}
              format={(n) => `${n.toFixed(0)}`}
            />
            <p className="mt-3 text-xs text-muted-foreground">
              Incident-Rate skaliert ×10 zur Darstellung. Originalwerte in &quot;KPI-Vergleich&quot;.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
