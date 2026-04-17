import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Casi studio", alternates: { canonical: "/it/casi-studio" } };

const cases = [
  { slug: "seniorenresidenz-hietzing", org: "Seniorenresidenz Hietzing", country: "Austria", beds: 80, summary: "90 minuti in più per turno dopo 6 settimane. Turnover giù del 21%.", results: [{ k: "Tempo documentazione", v: "−67%" }, { k: "Turnover", v: "−21%" }, { k: "Voto MDK", v: "1,2 → 1,0" }] },
  { slug: "pflege-aktiv-sued", org: "Pflege Aktiv Süd", country: "Germania", beds: 140, summary: "Rollout Enterprise su 3 sedi. On-prem, SSO, export MDK personalizzato.", results: [{ k: "Sedi attive", v: "3 / 3" }, { k: "Straordinari", v: "−35%" }, { k: "Report turno", v: "3 min" }] },
];

export default function ItCaseStudiesPage() {
  return (
    <div className="container py-20">
      <Badge variant="outline" className="mb-4">Casi studio</Badge>
      <h1 className="font-serif text-5xl font-semibold">Risultati reali.</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">Risultati misurati dai clienti CareAI.</p>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {cases.map((c) => (
          <Card key={c.slug}><CardContent className="p-6">
            <div className="flex items-center gap-2"><Badge>{c.country}</Badge><span className="text-sm text-muted-foreground">{c.beds} posti letto</span></div>
            <h2 className="mt-3 font-serif text-2xl font-semibold">{c.org}</h2>
            <p className="mt-2 text-muted-foreground">{c.summary}</p>
            <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">{c.results.map((r) => <div key={r.k}><dt className="text-muted-foreground">{r.k}</dt><dd className="font-semibold">{r.v}</dd></div>)}</dl>
          </CardContent></Card>
        ))}
      </div>
    </div>
  );
}
