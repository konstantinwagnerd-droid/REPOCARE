import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { computeControllingMetrics, BENCHMARKS_DACH, buildSparkline } from "@/lib/controlling/metrics";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Settings, FileDown, TrendingUp, TrendingDown, Users, Euro, PieChart, AlertTriangle } from "lucide-react";
import { ControllingSimulator } from "./simulator";

function fmtEur(cents: number): string {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(cents / 100);
}
function fmtPct(v: number): string {
  return `${(v * 100).toFixed(1)} %`;
}

function Sparkline({ values, color = "stroke-primary" }: { values: number[]; color?: string }) {
  if (values.length === 0) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, 1);
  const points = values
    .map((v, i) => `${(i / (values.length - 1)) * 100},${100 - ((v - min) / range) * 100}`)
    .join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-10 w-full">
      <polyline points={points} fill="none" className={color} strokeWidth="2" />
    </svg>
  );
}

function KPICard({
  title,
  value,
  sub,
  sparkline,
  benchmark,
  icon: Icon,
}: {
  title: string;
  value: string;
  sub?: string;
  sparkline: number[];
  benchmark?: { label: string; ours: number; median: number; higherIsBetter: boolean };
  icon: React.ComponentType<{ className?: string }>;
}) {
  const delta = benchmark ? benchmark.ours - benchmark.median : 0;
  const isBetter = benchmark ? (benchmark.higherIsBetter ? delta > 0 : delta < 0) : false;
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Icon className="h-4 w-4" /> {title}
        </CardTitle>
        {benchmark && (
          <span
            className={`flex items-center gap-1 text-xs font-semibold ${
              isBetter ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {isBetter ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            vs Bundesdurchschnitt
          </span>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
        <div className="mt-3">
          <Sparkline values={sparkline} />
        </div>
      </CardContent>
    </Card>
  );
}

export default async function ControllingPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const tenantId = session.user.tenantId;
  const m = await computeControllingMetrics(tenantId);

  return (
    <div className="space-y-6 p-6 lg:p-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-semibold tracking-tight">Kosten-Controlling</h1>
          <p className="mt-1 text-muted-foreground">
            Betriebswirtschaftliche Übersicht für PDL — Belegung, Personalkosten, Deckungsbeitrag.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/controlling/konfiguration">
            <Button variant="outline">
              <Settings className="mr-2 h-4 w-4" /> Konfiguration
            </Button>
          </Link>
          <Link href="/api/controlling/export">
            <Button>
              <FileDown className="mr-2 h-4 w-4" /> Monatsbericht (PDF)
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <KPICard
          title="Belegungsquote"
          value={fmtPct(m.belegungsquote)}
          sub={`${m.aktiveBewohner} / ${m.maxKapazitaet} Plätze`}
          sparkline={buildSparkline(m.belegungsquote * 100)}
          benchmark={{ label: "Belegung", ours: m.belegungsquote, median: BENCHMARKS_DACH.belegungsquote.median, higherIsBetter: true }}
          icon={Users}
        />
        <KPICard
          title="Personalkosten aktueller Monat"
          value={fmtEur(m.personalkostenMonatCents)}
          sub={`${Math.round(m.personalkostenMonatCents / Math.max(m.aktiveBewohner, 1) / 100)} € pro Bewohner`}
          sparkline={buildSparkline(m.personalkostenMonatCents)}
          benchmark={{
            label: "Personalkosten/BW",
            ours: m.personalkostenMonatCents / Math.max(m.aktiveBewohner, 1),
            median: BENCHMARKS_DACH.personalkostenProBewohnerMonat.median,
            higherIsBetter: false,
          }}
          icon={Euro}
        />
        <KPICard
          title="Personal-Effizienz"
          value={fmtEur(m.personalEffizienz)}
          sub="Personalkosten ÷ Ø Pflegegrad"
          sparkline={buildSparkline(m.personalEffizienz)}
          icon={PieChart}
        />
        <KPICard
          title="Umsatz pro Bewohner/Monat"
          value={fmtEur(m.umsatzProBewohnerMonatCents)}
          sub={`Gesamt-Umsatz: ${fmtEur(m.umsatzGesamtMonatCents)}`}
          sparkline={buildSparkline(m.umsatzProBewohnerMonatCents)}
          icon={TrendingUp}
        />
        <KPICard
          title="Deckungsbeitrag"
          value={fmtEur(m.deckungsbeitragMonatCents)}
          sub="Umsatz − Personal − Fix-Kosten"
          sparkline={buildSparkline(m.deckungsbeitragMonatCents)}
          benchmark={{
            label: "DB/BW",
            ours: m.deckungsbeitragMonatCents / Math.max(m.aktiveBewohner, 1),
            median: BENCHMARKS_DACH.deckungsbeitragProBewohnerMonat.median,
            higherIsBetter: true,
          }}
          icon={TrendingUp}
        />
        <KPICard
          title="Bewohner pro Pflegekraft"
          value={m.bewohnerProPflegekraftRatio.toFixed(1)}
          sub={`F:${m.pflegekraefteProSchicht.frueh} · S:${m.pflegekraefteProSchicht.spaet} · N:${m.pflegekraefteProSchicht.nacht}`}
          sparkline={buildSparkline(m.bewohnerProPflegekraftRatio)}
          benchmark={{
            label: "Ratio",
            ours: m.bewohnerProPflegekraftRatio,
            median: BENCHMARKS_DACH.bewohnerProPflegekraftTag.median,
            higherIsBetter: false,
          }}
          icon={Users}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" /> Überstunden-Quote
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{fmtPct(m.ueberstundenQuote)}</div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full ${
                  m.ueberstundenQuote > 0.1 ? "bg-rose-500" : m.ueberstundenQuote > 0.05 ? "bg-amber-500" : "bg-emerald-500"
                }`}
                style={{ width: `${Math.min(100, m.ueberstundenQuote * 400)}%` }}
              />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Bundesdurchschnitt: {fmtPct(BENCHMARKS_DACH.ueberstundenQuote.median)} · Top 25%:{" "}
              {fmtPct(BENCHMARKS_DACH.ueberstundenQuote.top25)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" /> Fluktuations-Risiko
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{m.fluktuationsRisikoScore} / 100</div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full ${
                  m.fluktuationsRisikoScore > 60
                    ? "bg-rose-500"
                    : m.fluktuationsRisikoScore > 30
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                }`}
                style={{ width: `${m.fluktuationsRisikoScore}%` }}
              />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Aus Überstunden, Neuzugängen letzte 6 Monate und Pflegekraft-Ratio berechnet.
            </div>
          </CardContent>
        </Card>
      </div>

      <ControllingSimulator
        personalkostenCents={m.personalkostenMonatCents}
        deckungsbeitragCents={m.deckungsbeitragMonatCents}
      />

      <Card>
        <CardHeader>
          <CardTitle>Pflegegrad-Mix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((g) => {
              const count = m.pflegegradMix[g] ?? 0;
              const pct = m.aktiveBewohner > 0 ? (count / m.aktiveBewohner) * 100 : 0;
              return (
                <div key={g} className="flex items-center gap-3">
                  <span className="w-16 text-sm font-semibold">PG {g}</span>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-20 text-right text-sm font-mono">
                    {count} ({pct.toFixed(0)}%)
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
