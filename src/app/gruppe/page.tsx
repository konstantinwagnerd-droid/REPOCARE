import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertTriangle, HeartHandshake, Percent, TrendingUp, UserCog, Building2, Euro } from "lucide-react";
import { resolveActiveGroup, currentMonth } from "./_lib/context";
import { rollupGroup, rollupTrend } from "@/lib/multi-tenant/rollup";
import { last12Months } from "@/lib/multi-tenant/seed";
import { FacilityMap } from "@/components/multi-tenant/FacilityMap";
import { TrendChart } from "@/components/multi-tenant/TrendChart";
import {
  PageContainer, PageHeader, PageSection, PageGrid, StatCard,
} from "@/components/admin/page-shell";

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

  const occupancyTrend = trend.map((t) => t.occupancy);
  const incidentTrend = trend.map((t) => t.incidents);

  return (
    <PageContainer className="mx-auto max-w-7xl">
      <PageHeader
        title={group.name}
        subtitle={`Gruppen-weiter Überblick · ${rollup.totals.facilities} Einrichtungen · ${rollup.totals.beds} Betten · ${rollup.totals.staff} Mitarbeitende`}
        icon={Building2}
        actions={
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Trägerart: {group.traegerType}</Badge>
            <Badge variant="outline">Gegründet {group.foundedYear}</Badge>
            <Badge variant="success">Gruppe aktiv</Badge>
          </div>
        }
      />

      <PageSection heading="Kennzahlen" description="Gruppen-Durchschnitte im laufenden Monat.">
        <PageGrid columns={6} gap="sm">
          <StatCard label="Ø Belegung" value={`${rollup.averages.occupancyPct.toFixed(1)}%`} sublabel={`Median ${rollup.medians.occupancyPct}%`} icon={Percent} tone="primary" sparkline={occupancyTrend} />
          <StatCard label="Ø Pflegegrad" value={rollup.averages.avgPflegegrad.toFixed(2)} sublabel="Bewohner:innen-Schnitt" icon={HeartHandshake} tone="accent" />
          <StatCard label="MA-Fluktuation" value={`${rollup.averages.staffTurnoverPct.toFixed(1)}%`} sublabel="annualisiert" icon={UserCog} tone="warning" />
          <StatCard label="Dokumentation" value={`${rollup.averages.documentationRatePct.toFixed(1)}%`} sublabel="Pflichteinträge" icon={Activity} tone="success" />
          <StatCard label="Incident-Rate" value={rollup.averages.incidentRate.toFixed(2)} sublabel="je 1000 Belegtage" icon={AlertTriangle} tone="warning" sparkline={incidentTrend} />
          <StatCard label="Beschwerden" value={rollup.totalsAdditional.complaints} sublabel="laufender Monat" icon={TrendingUp} tone="danger" />
        </PageGrid>
      </PageSection>

      <PageSection heading="Standorte &amp; Finanzen">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="font-serif text-lg">Standorte</CardTitle>
              <span className="text-xs text-muted-foreground">{group.facilities.length} Einrichtungen · {group.country}</span>
            </CardHeader>
            <CardContent>
              <FacilityMap facilities={group.facilities} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-serif text-lg">
                <Euro className="h-5 w-5 text-primary" /> Umsatz &amp; EBITDA letzte 12 Monate
              </CardTitle>
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
        </div>
      </PageSection>

      <PageSection heading="Betriebs-Trend" description="Belegung und Incidents im Zeitverlauf.">
        <Card>
          <CardContent className="p-6">
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
      </PageSection>
    </PageContainer>
  );
}
