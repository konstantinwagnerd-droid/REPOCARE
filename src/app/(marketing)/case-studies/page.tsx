import Link from "next/link";
import { PageHero } from "@/components/marketing/sections/page-hero";
import { SecondaryNav } from "@/components/marketing/sections/secondary-nav";
import { Qualitaet } from "@/design-system/illustrations";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { caseStudies } from "./data";

export const metadata = { title: "Fallstudien — CareAI" };

export default function CaseStudiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Fallstudien"
        title="Reale Einrichtungen. Reale Zahlen."
        description="Drei Pilot-Einrichtungen, drei Kontexte, ein Ergebnis: Mehr Zeit fuer Menschen, weniger fuer Papierkram."
        illustration={<Qualitaet className="h-72 w-72" />}
      />
      <SecondaryNav active="/case-studies" />
      <section className="container py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map((c) => (
            <Link key={c.slug} href={`/case-studies/${c.slug}`} className="group">
              <Card className="h-full transition-shadow hover:shadow-lg">
                <CardContent className="flex h-full flex-col p-7">
                  <Badge variant="secondary" className="mb-4 w-fit">
                    {c.city} · {c.beds} Betten
                  </Badge>
                  <h3 className="font-serif text-2xl font-semibold">{c.facility}</h3>
                  <p className="mt-2 text-lg text-accent-700 dark:text-accent-400">{c.tagline}</p>
                  <p className="mt-4 flex-1 text-sm text-muted-foreground">{c.summary}</p>
                  <div className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                    Fallstudie lesen <ArrowRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
