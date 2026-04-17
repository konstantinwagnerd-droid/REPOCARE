import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Études de cas", alternates: { canonical: "/fr/etudes-de-cas" } };

const cases = [
  { slug: "seniorenresidenz-hietzing", org: "Seniorenresidenz Hietzing", country: "Autriche", beds: 80, summary: "90 minutes de plus par service après 6 semaines. Turnover en baisse de 21%.", results: [{ k: "Temps documentation", v: "−67%" }, { k: "Turnover", v: "−21%" }, { k: "Note MDK", v: "1,2 → 1,0" }] },
  { slug: "pflege-aktiv-sued", org: "Pflege Aktiv Süd", country: "Allemagne", beds: 140, summary: "Déploiement Enterprise sur 3 sites. On-prem, SSO, export MDK personnalisé.", results: [{ k: "Sites en prod", v: "3 / 3" }, { k: "Heures sup", v: "−35%" }, { k: "Rapports", v: "3 min" }] },
];

export default function FrCaseStudiesPage() {
  return (
    <div className="container py-20">
      <Badge variant="outline" className="mb-4">Études de cas</Badge>
      <h1 className="font-serif text-5xl font-semibold">Des résultats réels.</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">Résultats mesurés chez les clients CareAI.</p>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {cases.map((c) => (
          <Card key={c.slug}><CardContent className="p-6">
            <div className="flex items-center gap-2"><Badge>{c.country}</Badge><span className="text-sm text-muted-foreground">{c.beds} lits</span></div>
            <h2 className="mt-3 font-serif text-2xl font-semibold">{c.org}</h2>
            <p className="mt-2 text-muted-foreground">{c.summary}</p>
            <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">{c.results.map((r) => <div key={r.k}><dt className="text-muted-foreground">{r.k}</dt><dd className="font-semibold">{r.v}</dd></div>)}</dl>
          </CardContent></Card>
        ))}
      </div>
    </div>
  );
}
