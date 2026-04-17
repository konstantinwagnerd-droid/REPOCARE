import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHero } from "@/components/marketing/sections/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllResources, getResource } from "@/lib/content/resources";
import { LeadForm } from "@/components/marketing/lead-form";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllResources().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const r = getResource(slug);
  if (!r) return {};
  return { title: `${r.title} — CareAI`, description: r.description };
}

export default async function ResourceDetailPage({ params }: Params) {
  const { slug } = await params;
  const r = getResource(slug);
  if (!r) return notFound();

  const kindLabel = r.kind === "whitepaper" ? "Whitepaper" : r.kind === "webinar" ? "Webinar" : "Vorlage";

  return (
    <>
      <PageHero
        eyebrow={kindLabel}
        title={r.title}
        description={r.description}
        actions={
          <Button asChild variant="outline">
            <Link href="/ressourcen">← Alle Ressourcen</Link>
          </Button>
        }
      />
      <section className="container grid gap-8 py-12 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <h2 className="font-serif text-2xl font-semibold">Inhalt</h2>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>· Fachlich fundierte Darstellung</li>
              <li>· Praxisnahe Beispiele aus DACH-Einrichtungen</li>
              <li>· Rechtsstand 2026 inkl. EU AI Act</li>
              <li>· Kompakte Checklisten zum Abhaken</li>
              <li>· Weiterfuehrende Quellen und Literaturhinweise</li>
            </ul>
            {r.pages && <p className="mt-4 text-sm">Umfang: <strong>{r.pages} Seiten</strong></p>}
            {r.duration && <p className="mt-4 text-sm">Dauer: <strong>{r.duration}</strong></p>}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="font-serif text-2xl font-semibold">Anfordern</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Wir senden Ihnen den Download-Link per E-Mail. Keine Newsletter-Anmeldung, kein Weiterverkauf.
            </p>
            <LeadForm resourceSlug={r.slug} />
          </CardContent>
        </Card>
      </section>
    </>
  );
}
