"use client";

import { useMemo, useState } from "react";
import { Calculator, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const TIER_RATES = {
  reseller: 0.2,
  implementation: 0.15,
  integration: 0.1,
  consulting: 0.15,
} as const;

function planForPlaces(places: number): { plan: string; monthly: number } {
  if (places <= 25) return { plan: "Starter", monthly: 299 };
  if (places <= 80) return { plan: "Professional", monthly: 599 };
  return { plan: "Enterprise", monthly: 999 };
}

function formatEuro(n: number): string {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

export function CommissionCalculator() {
  const [tier, setTier] = useState<keyof typeof TIER_RATES>("reseller");
  const [places, setPlaces] = useState(60);
  const [dealsPerYear, setDealsPerYear] = useState(4);

  const result = useMemo(() => {
    const rate = TIER_RATES[tier];
    const { plan, monthly } = planForPlaces(places);
    const annualDeal = monthly * 12;
    const commissionAnnual = annualDeal * rate;
    const totalAnnual = commissionAnnual * dealsPerYear;
    return { plan, monthly, annualDeal, rate, commissionAnnual, totalAnnual };
  }, [tier, places, dealsPerYear]);

  return (
    <Card>
      <CardContent className="grid gap-8 p-6 md:grid-cols-2">
        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Calculator className="size-3.5" />
            Provisions-Rechner
          </div>

          <div className="space-y-2">
            <Label>Partner-Typ</Label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(TIER_RATES) as Array<keyof typeof TIER_RATES>).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTier(t)}
                  className={
                    "rounded-xl border px-3 py-2 text-sm transition-colors " +
                    (tier === t
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-background hover:border-primary/50")
                  }
                >
                  <span className="block capitalize">{labelFor(t)}</span>
                  <span className={"block text-xs " + (tier === t ? "text-primary-foreground/80" : "text-muted-foreground")}>
                    {(TIER_RATES[t] * 100).toFixed(0)} % Provision
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cc-places">Plätze je Einrichtung: <strong>{places}</strong></Label>
            <input
              id="cc-places"
              type="range"
              min={10}
              max={200}
              step={5}
              value={places}
              onChange={(e) => setPlaces(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cc-deals">Abschlüsse pro Jahr: <strong>{dealsPerYear}</strong></Label>
            <input
              id="cc-deals"
              type="range"
              min={1}
              max={20}
              step={1}
              value={dealsPerYear}
              onChange={(e) => setDealsPerYear(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
        </div>

        <div className="flex flex-col gap-4 rounded-2xl bg-primary/5 p-6">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Passender Plan</p>
            <p className="font-serif text-2xl font-semibold">{result.plan}</p>
            <p className="text-sm text-muted-foreground">{formatEuro(result.monthly)}/Monat · {formatEuro(result.annualDeal)} Jahres-Deal</p>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-background p-3">
            <TrendingUp className="size-5 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Provision je Deal (Jahr 1)</p>
              <p className="font-semibold tabular-nums">{formatEuro(result.commissionAnnual)}</p>
            </div>
          </div>
          <div className="rounded-xl bg-primary p-4 text-primary-foreground">
            <p className="text-xs uppercase opacity-80">Dein Jahres-Ertrag</p>
            <p className="font-serif text-3xl font-semibold tabular-nums">{formatEuro(result.totalAnnual)}</p>
            <p className="mt-1 text-xs opacity-80">
              bei {dealsPerYear} {dealsPerYear === 1 ? "Abschluss" : "Abschlüssen"} mit je {places} Plätzen, {(result.rate * 100).toFixed(0)} % Rate
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Provisionen werden ab dem ersten Umsatzmonat des Deals und für 12 Monate ausgezahlt.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function labelFor(t: keyof typeof TIER_RATES): string {
  switch (t) {
    case "reseller": return "Reseller";
    case "implementation": return "Implementation";
    case "integration": return "Integration";
    case "consulting": return "Consulting";
  }
}
