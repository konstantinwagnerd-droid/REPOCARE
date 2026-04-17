import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Case Studies", alternates: { canonical: "/en/case-studies", languages: { "de-DE": "/case-studies", "en-US": "/en/case-studies" } } };

const cases = [
  {
    slug: "seniorenresidenz-hietzing",
    org: "Seniorenresidenz Hietzing",
    country: "Austria",
    beds: 80,
    summary: "90 minutes more time per shift after 6 weeks. Attrition down 21%.",
    results: [
      { k: "Documentation time", v: "−67%" },
      { k: "Staff attrition", v: "−21%" },
      { k: "MDK grade", v: "1.2 → 1.0" },
    ],
  },
  {
    slug: "pflege-aktiv-sued",
    org: "Pflege Aktiv Süd",
    country: "Germany",
    beds: 140,
    summary: "Enterprise rollout across 3 sites. On-prem hosting, SSO, custom MDK export.",
    results: [
      { k: "Sites live", v: "3 / 3" },
      { k: "Overtime hours", v: "−35%" },
      { k: "Shift reports", v: "3 min avg" },
    ],
  },
];

export default function EnCaseStudiesPage() {
  return (
    <div className="container py-20">
      <Badge variant="outline" className="mb-4">Case Studies</Badge>
      <h1 className="font-serif text-5xl font-semibold">Real results from real providers.</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        Measured outcomes from CareAI customers across Austria and Germany.
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {cases.map((c) => (
          <Card key={c.slug}><CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Badge>{c.country}</Badge>
              <span className="text-sm text-muted-foreground">{c.beds} beds</span>
            </div>
            <h2 className="mt-3 font-serif text-2xl font-semibold">{c.org}</h2>
            <p className="mt-2 text-muted-foreground">{c.summary}</p>
            <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
              {c.results.map((r) => (
                <div key={r.k}><dt className="text-muted-foreground">{r.k}</dt><dd className="font-semibold">{r.v}</dd></div>
              ))}
            </dl>
            <Link href={`/en/case-studies/${c.slug}`} className="mt-4 inline-block text-sm font-medium text-primary">Read full story →</Link>
          </CardContent></Card>
        ))}
      </div>
    </div>
  );
}
