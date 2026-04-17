import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHero } from "@/components/marketing/sections/page-hero";
import { SecondaryNav } from "@/components/marketing/sections/secondary-nav";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { caseStudies, caseStudyMap } from "../data";

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const c = caseStudyMap[params.slug];
  return { title: c ? `${c.facility} — Fallstudie CareAI` : "Fallstudie — CareAI" };
}

export default function CaseStudyPage({ params }: { params: { slug: string } }) {
  const c = caseStudyMap[params.slug];
  if (!c) return notFound();

  return (
    <>
      <PageHero
        eyebrow={`${c.city} · ${c.beds} Betten`}
        title={c.facility}
        description={c.tagline}
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href="/case-studies">
              <ArrowLeft className="mr-1 h-4 w-4" /> Alle Fallstudien
            </Link>
          </Button>
        }
      />
      <SecondaryNav active="/case-studies" />

      <section className="container py-14">
        <div className="mx-auto max-w-3xl">
          <h2 className="font-serif text-2xl font-semibold">Kontext</h2>
          <p className="mt-4 text-lg leading-relaxed text-muted-foreground">{c.context}</p>
        </div>
      </section>

      {/* Vorher / Nachher */}
      <section className="border-y border-border/60 bg-muted/30">
        <div className="container py-14">
          <h2 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">Vorher / Nachher</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="p-6">
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Vor CareAI</div>
                <ul className="mt-4 space-y-3">
                  {c.before.map((b) => (
                    <li key={b.label} className="flex items-baseline justify-between border-b border-border/60 pb-2 last:border-0">
                      <span className="text-sm text-muted-foreground">{b.label}</span>
                      <span className="font-serif text-lg font-semibold">{b.value}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card className="border-primary-700 bg-gradient-to-br from-primary-700 to-primary-900 text-primary-foreground">
              <CardContent className="p-6">
                <div className="text-xs font-medium uppercase tracking-wider opacity-80">Mit CareAI</div>
                <ul className="mt-4 space-y-3">
                  {c.after.map((a) => (
                    <li key={a.label} className="flex items-baseline justify-between border-b border-white/10 pb-2 last:border-0">
                      <span className="text-sm opacity-90">{a.label}</span>
                      <span className="font-serif text-lg font-semibold text-accent-300">{a.value}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Zitate */}
      <section className="container py-14">
        <h2 className="font-serif text-3xl font-semibold tracking-tight md:text-4xl">O-Ton aus dem Haus</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {c.quotes.map((q) => (
            <Card key={q.name}>
              <CardContent className="p-6">
                <Quote className="h-6 w-6 text-accent" />
                <p className="mt-3 text-base leading-relaxed">{q.text}</p>
                <div className="mt-5 border-t border-border pt-3">
                  <div className="font-semibold">{q.name}</div>
                  <div className="text-sm text-muted-foreground">{q.role}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Tech + Rollout */}
      <section className="bg-muted/30">
        <div className="container grid gap-6 py-14 md:grid-cols-2">
          <Card>
            <CardContent className="p-6">
              <h3 className="font-serif text-xl font-semibold">Eingesetzte Module</h3>
              <ul className="mt-4 space-y-2">
                {c.tech.map((t) => (
                  <li key={t} className="flex gap-2 text-sm">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    {t}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h3 className="font-serif text-xl font-semibold">Rollout</h3>
              <p className="mt-4 text-4xl font-serif font-semibold">
                {c.rolloutWeeks} <span className="text-xl text-muted-foreground">Wochen</span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Von Kickoff bis Vollproduktion — inkl. Schulung, Datenmigration und MD-freigabe-Check.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="container py-16">
        <Card className="bg-gradient-to-br from-primary-700 to-primary-900 text-primary-foreground">
          <CardContent className="flex flex-col items-start gap-4 p-10 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="font-serif text-2xl font-semibold">Wollen Sie aehnliche Ergebnisse?</h3>
              <p className="mt-2 text-primary-100">
                30-Minuten-Demo, kostenlos, unverbindlich. Wir zeigen Ihnen CareAI mit Ihren Prozessen.
              </p>
            </div>
            <Button asChild variant="accent" size="lg">
              <Link href="/demo-anfrage">
                Demo vereinbaren <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
