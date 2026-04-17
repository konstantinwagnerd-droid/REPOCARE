import Link from "next/link";
import { PageHero } from "@/components/marketing/sections/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { getAllGlossaryEntries, groupGlossaryByLetter } from "@/lib/content/glossar";

export const metadata = {
  title: "Glossar — CareAI",
  description:
    "Glossar fuer Pflege, Recht und Technik. Ueber 50 Begriffe kompakt erklaert — von SIS ueber DSGVO bis FHIR.",
  alternates: { canonical: "/glossar" },
};

export default function GlossarPage() {
  const groups = groupGlossaryByLetter();
  const letters = Object.keys(groups).sort();
  const total = getAllGlossaryEntries().length;

  return (
    <>
      <PageHero
        eyebrow="Glossar"
        title="Pflege, Recht, Technik — auf den Punkt erklaert."
        description={`${total} Begriffe aus unserem Alltag. Kurz, klar, verlinkt auf vertiefende Artikel.`}
      />

      {/* A-Z-Navigation */}
      <section className="sticky top-16 z-30 border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="container flex flex-wrap gap-1 py-3 text-sm">
          {letters.map((l) => (
            <a
              key={l}
              href={`#${l}`}
              className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              {l}
            </a>
          ))}
        </div>
      </section>

      <section className="container py-12">
        {letters.map((letter) => (
          <div key={letter} id={letter} className="mb-12 scroll-mt-32">
            <h2 className="mb-4 font-serif text-3xl font-semibold text-primary">{letter}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {groups[letter].map((e) => (
                <Card key={e.slug} id={e.slug} className="scroll-mt-32">
                  <CardContent className="p-5">
                    <div className="mb-1 flex items-center justify-between">
                      <h3 className="font-serif text-lg font-semibold">{e.term}</h3>
                      <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary">{e.category}</span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{e.definition}</p>
                    <p className="mt-2 text-xs text-muted-foreground/80">{e.context}</p>

                    {(e.related?.length || e.blogSlug) && (
                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                        {e.blogSlug && (
                          <Link
                            href={`/blog/${e.blogSlug}`}
                            className="rounded-full bg-primary/10 px-2.5 py-1 text-primary hover:bg-primary/20"
                          >
                            Mehr im Blog →
                          </Link>
                        )}
                        {e.related?.map((r) => (
                          <span key={r} className="text-muted-foreground">
                            #{r}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
