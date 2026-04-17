import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Casos de estudio", alternates: { canonical: "/es/casos-de-estudio" } };

const cases = [
  { slug: "seniorenresidenz-hietzing", org: "Seniorenresidenz Hietzing", country: "Austria", beds: 80, summary: "90 minutos más por turno después de 6 semanas. Rotación bajó 21%.", results: [{ k: "Tiempo documentación", v: "−67%" }, { k: "Rotación", v: "−21%" }, { k: "Nota MDK", v: "1,2 → 1,0" }] },
  { slug: "pflege-aktiv-sued", org: "Pflege Aktiv Süd", country: "Alemania", beds: 140, summary: "Despliegue Enterprise en 3 sedes. On-prem, SSO, exportación MDK personalizada.", results: [{ k: "Sedes activas", v: "3 / 3" }, { k: "Horas extra", v: "−35%" }, { k: "Informes", v: "3 min" }] },
];

export default function EsCaseStudiesPage() {
  return (
    <div className="container py-20">
      <Badge variant="outline" className="mb-4">Casos de estudio</Badge>
      <h1 className="font-serif text-5xl font-semibold">Resultados reales.</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">Resultados medidos de clientes CareAI.</p>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {cases.map((c) => (
          <Card key={c.slug}><CardContent className="p-6">
            <div className="flex items-center gap-2"><Badge>{c.country}</Badge><span className="text-sm text-muted-foreground">{c.beds} camas</span></div>
            <h2 className="mt-3 font-serif text-2xl font-semibold">{c.org}</h2>
            <p className="mt-2 text-muted-foreground">{c.summary}</p>
            <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">{c.results.map((r) => <div key={r.k}><dt className="text-muted-foreground">{r.k}</dt><dd className="font-semibold">{r.v}</dd></div>)}</dl>
          </CardContent></Card>
        ))}
      </div>
    </div>
  );
}
