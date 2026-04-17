import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Financial Model — CareAI Data Room" };

const years = [
  { y: "2026", arr: 450000, customers: 11, ebitda: -280000, headcount: 7 },
  { y: "2027", arr: 1800000, customers: 42, ebitda: -120000, headcount: 18 },
  { y: "2028", arr: 5400000, customers: 120, ebitda: 420000, headcount: 36 },
  { y: "2029", arr: 12000000, customers: 250, ebitda: 2100000, headcount: 62 },
];

export default function FinancialModelPage() {
  return (
    <div className="container py-10">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold">Financial Model</h1>
          <p className="mt-2 text-muted-foreground">36-Monate-Planung mit konservativem Base-Case.</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/investors/exports/careai-financial-model.xlsx"><Download className="mr-2 h-4 w-4" /> Excel-Export</Link>
        </Button>
      </div>

      <section className="mt-6">
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="border-b border-border text-left">
                <tr>
                  <th className="px-4 py-3">Jahr</th>
                  <th className="px-4 py-3">ARR</th>
                  <th className="px-4 py-3">Kunden</th>
                  <th className="px-4 py-3">EBITDA</th>
                  <th className="px-4 py-3">Headcount</th>
                </tr>
              </thead>
              <tbody>
                {years.map((y) => (
                  <tr key={y.y} className="border-b border-border/60">
                    <td className="px-4 py-3 font-serif font-semibold">{y.y}</td>
                    <td className="px-4 py-3">€ {y.arr.toLocaleString("de-DE")}</td>
                    <td className="px-4 py-3">{y.customers}</td>
                    <td className={`px-4 py-3 ${y.ebitda < 0 ? "text-destructive" : "text-primary"}`}>
                      € {y.ebitda.toLocaleString("de-DE")}
                    </td>
                    <td className="px-4 py-3">{y.headcount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </section>

      <section className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h2 className="font-serif text-xl font-semibold">Annahmen Base-Case</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>· Avg. Contract Value (ACV): 42.000 EUR / Heim / Jahr</li>
              <li>· Net Revenue Retention: 115% (Upsells + Expansion)</li>
              <li>· Gross Margin: 82% (SaaS-typisch mit Voice-Infra-Kosten)</li>
              <li>· Sales Efficiency (Magic Number): 1,2</li>
              <li>· CAC Payback: 14 Monate</li>
              <li>· Churn: unter 5% jaehrlich (Pflegeheime = langfristig)</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="font-serif text-xl font-semibold">Use of Funds (500k SAFE)</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>· Engineering (CTO + 2 Dev): 240.000 EUR</li>
              <li>· Pflege-Expert:in + Sales: 95.000 EUR</li>
              <li>· Infrastruktur (Hetzner, Voice-Modelle): 45.000 EUR</li>
              <li>· Marketing + Messen: 35.000 EUR</li>
              <li>· Legal + Compliance (EU AI Act CE): 40.000 EUR</li>
              <li>· Puffer: 45.000 EUR</li>
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
