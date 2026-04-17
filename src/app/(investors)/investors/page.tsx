import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, TrendingUp, Users, Percent, AlertTriangle } from "lucide-react";

export const metadata = { title: "Investor Data Room — CareAI" };

const kpis = [
  { label: "ARR (Committed)", value: "€ 84.000", sub: "3 Pilot-Kunden · Stand April 2026", icon: TrendingUp },
  { label: "MRR", value: "€ 7.000", sub: "100% Wachstum QoQ", icon: TrendingUp },
  { label: "Customers (Pilot)", value: "3", sub: "+5 LOI unterzeichnet", icon: Users },
  { label: "NPS Pilot-Nutzer", value: "+54", sub: "Branchenschnitt: +12", icon: Percent },
  { label: "Customer Churn", value: "0%", sub: "seit Launch Q3/2025", icon: Percent },
  { label: "CAC", value: "€ 1.840", sub: "Sales-geleitet, 120 Betten/Deal", icon: TrendingUp },
  { label: "LTV (modelliert)", value: "€ 82.000", sub: "7-Jahr-Retention @ 95%", icon: TrendingUp },
  { label: "Burn Rate (Net)", value: "€ 18.000/Monat", sub: "Runway: 9 Monate (pre-Seed)", icon: AlertTriangle },
];

export default function InvestorsOverviewPage() {
  return (
    <div className="container py-10">
      <div className="mb-10">
        <p className="text-sm text-muted-foreground">Dashboard</p>
        <h1 className="mt-1 font-serif text-4xl font-semibold tracking-tight">CareAI Investor Data Room</h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Pre-Seed-Runde, 500k EUR SAFE, 10% Equity (Cap 5 Mio EUR). Aktuelle Traktion in DACH-Pflegemarkt, operative Kennzahlen und
          Planwerte bis 2029.
        </p>
      </div>

      {/* KPI-Grid */}
      <section>
        <h2 className="mb-4 font-serif text-2xl font-semibold">Kernkennzahlen</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {kpis.map((k) => {
            const Icon = k.icon;
            return (
              <Card key={k.label}>
                <CardContent className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">{k.label}</p>
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                  <p className="font-serif text-3xl font-semibold">{k.value}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{k.sub}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Highlights */}
      <section className="mt-10 grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-serif text-xl font-semibold">Warum jetzt</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3"><ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> EU AI Act Aug 2026 wirksam — Alternativen zum US-first-Ansatz gefragt.</li>
              <li className="flex gap-3"><ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Pflegekraefte-Mangel treibt Nachfrage nach Entbuerokratisierung.</li>
              <li className="flex gap-3"><ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Medifox/Vivendi sind Legacy — kein Voice, kein KI, kein modernes UX.</li>
              <li className="flex gap-3"><ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Oeffentliche Foerderungen (aws Preseed, EXIST, ZIM) verfuegbar.</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-serif text-xl font-semibold">Naechste 12 Monate</h3>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>· Pilot-Heime auf 15 erweitern (Ziel Q4/2026)</li>
              <li>· ARR auf 450k EUR (Ziel Dec 2026)</li>
              <li>· CTO-Hire + 2 Engineers + 1 Pflege-Expert:in</li>
              <li>· EU-AI-Act-Konformitaetsbewertung abgeschlossen</li>
              <li>· Series A Vorbereitung Q3/2027</li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
