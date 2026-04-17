"use client";

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Sparkles, Share2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

type Inputs = { beds: number; docHours: number; staff: number; wage: number };

const DEFAULTS: Inputs = { beds: 60, docHours: 3, staff: 20, wage: 26 };

function priceForBeds(beds: number): number {
  if (beds <= 25) return 299;
  if (beds <= 80) return 599;
  return 999;
}

function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [displayed, setDisplayed] = useState(value);
  useEffect(() => {
    const start = displayed;
    const diff = value - start;
    const duration = 400;
    const t0 = performance.now();
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplayed(Math.round(start + diff * eased));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return (
    <span>
      {prefix}
      {displayed.toLocaleString("de-AT")}
      {suffix}
    </span>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
}) {
  const id = label.toLowerCase().replace(/\s/g, "-");
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        <span className="font-serif text-lg font-semibold">
          {value.toLocaleString("de-AT")}
          {unit ? ` ${unit}` : ""}
        </span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-3 h-2 w-full cursor-pointer appearance-none rounded-full bg-primary/10 accent-primary"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
      />
      <div className="mt-1 flex justify-between text-xs text-muted-foreground">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
}

export function RoiCalculator() {
  const [i, setI] = useState<Inputs>(DEFAULTS);

  // Read URL params on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const p = new URLSearchParams(window.location.search);
    const read = (k: keyof Inputs, fallback: number) => {
      const v = Number(p.get(k));
      return Number.isFinite(v) && v > 0 ? v : fallback;
    };
    setI({
      beds: read("beds", DEFAULTS.beds),
      docHours: read("docHours", DEFAULTS.docHours),
      staff: read("staff", DEFAULTS.staff),
      wage: read("wage", DEFAULTS.wage),
    });
  }, []);

  const results = useMemo(() => {
    // 40% savings on docu time, 2 shifts/day, 30 days
    const shiftsPerDay = 2;
    const daysPerMonth = 30;
    const saveFactor = 0.4;
    const hoursSavedPerDay = i.docHours * i.staff * shiftsPerDay * saveFactor;
    const monthlySavingsEUR = hoursSavedPerDay * daysPerMonth * i.wage;
    const price = priceForBeds(i.beds);
    const yearlySavingsEUR = monthlySavingsEUR * 12;
    const netYearlySavings = yearlySavingsEUR - price * 12;
    const paybackMonths = monthlySavingsEUR > 0 ? price / monthlySavingsEUR : 0;
    // CO2: ~2 kg Papier/Bewohner/Monat * 1.3 kg CO2/kg Papier
    const co2KgPerMonth = i.beds * 2 * 1.3;
    const co2KgPerYear = co2KgPerMonth * 12;
    return {
      monthlySavingsEUR: Math.round(monthlySavingsEUR),
      yearlySavingsEUR: Math.round(yearlySavingsEUR),
      netYearlySavings: Math.round(netYearlySavings),
      hoursSavedPerMonth: Math.round(hoursSavedPerDay * daysPerMonth),
      price,
      paybackDays: Math.round(paybackMonths * 30),
      co2KgPerYear: Math.round(co2KgPerYear),
    };
  }, [i]);

  const shareUrl = () => {
    if (typeof window === "undefined") return "";
    const p = new URLSearchParams({
      beds: String(i.beds),
      docHours: String(i.docHours),
      staff: String(i.staff),
      wage: String(i.wage),
    });
    return `${window.location.origin}/roi-rechner?${p.toString()}`;
  };

  const demoHref = `/demo-anfrage?beds=${i.beds}&docHours=${i.docHours}&staff=${i.staff}&wage=${i.wage}`;

  const copyShareLink = async () => {
    const url = shareUrl();
    if (navigator.clipboard) await navigator.clipboard.writeText(url);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-5">
      <Card className="lg:col-span-2">
        <CardContent className="space-y-7 p-7">
          <div>
            <h3 className="font-serif text-xl font-semibold">Ihre Einrichtung</h3>
            <p className="mt-1 text-sm text-muted-foreground">Schieben Sie die Regler — Ergebnis aktualisiert live.</p>
          </div>
          <Slider label="Anzahl Betten" value={i.beds} min={10} max={500} onChange={(v) => setI({ ...i, beds: v })} />
          <Slider
            label="Doku-Zeit pro Schicht"
            value={i.docHours}
            min={1}
            max={6}
            step={0.5}
            unit="h"
            onChange={(v) => setI({ ...i, docHours: v })}
          />
          <Slider label="Pflegekraefte" value={i.staff} min={5} max={200} onChange={(v) => setI({ ...i, staff: v })} />
          <Slider
            label="Gehalt pro Stunde"
            value={i.wage}
            min={20}
            max={40}
            unit="EUR"
            onChange={(v) => setI({ ...i, wage: v })}
          />
        </CardContent>
      </Card>

      <div className="space-y-5 lg:col-span-3">
        <Card className="bg-gradient-to-br from-primary-700 via-primary-800 to-primary-900 text-primary-foreground">
          <CardContent className="p-8">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider opacity-80">
              <Sparkles className="h-4 w-4" /> Ihre Ersparnis
            </div>
            <motion.div
              key={results.yearlySavingsEUR}
              initial={{ opacity: 0.7, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 font-serif text-6xl font-semibold tracking-tight"
            >
              <AnimatedNumber value={results.yearlySavingsEUR} prefix="" suffix=" EUR" />
            </motion.div>
            <div className="mt-2 text-primary-100">pro Jahr — vor CareAI-Kosten</div>

            <div className="mt-6 grid gap-4 rounded-xl bg-primary-900/40 p-5 md:grid-cols-3">
              <div>
                <div className="text-xs uppercase tracking-wider opacity-70">Pro Monat</div>
                <div className="mt-1 font-serif text-xl font-semibold">
                  <AnimatedNumber value={results.monthlySavingsEUR} suffix=" EUR" />
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider opacity-70">Netto / Jahr</div>
                <div className="mt-1 font-serif text-xl font-semibold">
                  <AnimatedNumber value={results.netYearlySavings} suffix=" EUR" />
                </div>
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider opacity-70">Payback</div>
                <div className="mt-1 font-serif text-xl font-semibold">
                  <AnimatedNumber value={results.paybackDays} suffix=" Tage" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Zeitgewinn</div>
              <div className="mt-2 font-serif text-3xl font-semibold">
                <AnimatedNumber value={results.hoursSavedPerMonth} suffix=" h/Monat" />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Mehr Zeit am Bewohner, weniger Burnout.</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">CO2-Einsparung</div>
              <div className="mt-2 font-serif text-3xl font-semibold">
                <AnimatedNumber value={results.co2KgPerYear} suffix=" kg/Jahr" />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Durch Papier-Reduktion. Ergaenzt Ihre ESG-Berichte.</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="flex flex-col items-start gap-4 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="font-serif text-lg font-semibold">Empfohlener Tarif: {results.price} EUR / Monat</div>
              <p className="mt-1 text-sm text-muted-foreground">
                Basiert auf {i.beds} Betten — transparent, kein versteckter Pro-User-Preis.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={copyShareLink}>
                <Share2 className="mr-1 h-4 w-4" /> Link kopieren
              </Button>
              <Button asChild variant="accent" size="sm">
                <Link href={demoHref}>
                  Demo anfragen <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground">
          Berechnungs-Grundlagen: 40% Doku-Zeitersparnis (konservative Annahme; voize-Referenzstudien zeigen bis zu 60%).
          2 Schichten/Tag, 30 Tage/Monat, 2 kg Papier/Bewohner/Monat bei 1,3 kg CO2/kg Papier.
        </p>
      </div>
    </div>
  );
}
