import Link from "next/link";
import { PageHero } from "@/components/marketing/sections/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Video, Download } from "lucide-react";
import { getResourcesByKind } from "@/lib/content/resources";

export const metadata = {
  title: "Ressourcen — CareAI",
  description:
    "Whitepaper, Webinar-Aufzeichnungen und Vorlagen fuer Pflegeeinrichtungen. Kostenlos, DSGVO-konform, praxisnah.",
  alternates: { canonical: "/ressourcen" },
};

export default function ResourcesPage() {
  const whitepapers = getResourcesByKind("whitepaper");
  const webinars = getResourcesByKind("webinar");
  const templates = getResourcesByKind("template");

  return (
    <>
      <PageHero
        eyebrow="Ressourcen"
        title="Wissen, das Pflegeeinrichtungen voranbringt."
        description="Whitepaper, Aufzeichnungen, Vorlagen — alles kostenlos. Einige Materialien gegen E-Mail (mit Opt-in, ohne Newsletter-Zwang)."
      />

      {/* Whitepaper */}
      <section className="container py-14">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-serif text-3xl font-semibold">Whitepaper</h2>
            <p className="mt-1 text-muted-foreground">Tiefgehende Fachpapiere, recherchiert, praxisnah.</p>
          </div>
          <FileText className="h-8 w-8 text-primary" />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {whitepapers.map((r) => (
            <Card key={r.slug}>
              <CardContent className="p-6">
                <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-primary">{r.topic}</span>
                  {r.pages && <span>{r.pages} Seiten</span>}
                </div>
                <h3 className="font-serif text-xl font-semibold">{r.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{r.description}</p>
                <div className="mt-4">
                  <Button asChild variant="accent" size="sm">
                    <Link href={`/ressourcen/${r.slug}`}>
                      <Download className="mr-2 h-4 w-4" />
                      Kostenlos anfordern
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Webinare */}
      <section className="container border-t border-border/60 py-14">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-serif text-3xl font-semibold">Webinar-Aufzeichnungen</h2>
            <p className="mt-1 text-muted-foreground">Unsere Experten-Runden, auf Abruf.</p>
          </div>
          <Video className="h-8 w-8 text-primary" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {webinars.map((r) => (
            <Card key={r.slug}>
              <CardContent className="p-6">
                <div className="mb-3 aspect-video rounded-lg bg-gradient-to-br from-primary/20 to-accent/10" aria-hidden />
                <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-primary">{r.topic}</span>
                  <span>{r.duration}</span>
                </div>
                <h3 className="font-serif text-lg font-semibold">{r.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{r.description}</p>
                <div className="mt-4">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/ressourcen/${r.slug}`}>Aufzeichnung ansehen</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Vorlagen */}
      <section className="container border-t border-border/60 py-14">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="font-serif text-3xl font-semibold">Vorlagen-Bibliothek</h2>
            <p className="mt-1 text-muted-foreground">Bewaehrte Muster-Dokumente fuer den Alltag.</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((r) => (
            <Card key={r.slug}>
              <CardContent className="p-5">
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs text-primary">{r.topic}</span>
                <h3 className="mt-2 font-serif text-base font-semibold">{r.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{r.description}</p>
                <div className="mt-3">
                  <Link
                    href={`/ressourcen/${r.slug}`}
                    className="inline-flex items-center text-sm text-primary hover:underline"
                  >
                    Anfordern →
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </>
  );
}
