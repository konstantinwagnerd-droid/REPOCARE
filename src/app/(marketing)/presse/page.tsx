import Link from "next/link";
import { ArrowRight, Newspaper, BookOpen, Image as ImageIcon, MessageSquareQuote, Mail, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { pressReleases } from "@/components/presse/data";
import { PressCard } from "@/components/presse/PressCard";

export const metadata = {
  title: "Presse | CareAI",
  description:
    "Presse-Kit: Fact-Sheet, Pressemeldungen, Mediathek, Experten-Zitate und Pressekontakt. Alles an einem Ort.",
};

const SECTIONS = [
  {
    icon: BookOpen,
    title: "Fact-Sheet",
    desc: "Die wichtigsten Zahlen und Fakten auf einer Seite — druckbar.",
    href: "/presse/ueber-careai",
    cta: "Fact-Sheet öffnen",
  },
  {
    icon: Newspaper,
    title: "Pressemeldungen",
    desc: "Alle Pressemeldungen seit Gründung. Mit O-Ton und Kontakt.",
    href: "/presse/pressemeldungen",
    cta: "Archiv ansehen",
  },
  {
    icon: ImageIcon,
    title: "Mediathek",
    desc: "Logos, Fotos, Videos, Decks — frei für redaktionelle Nutzung.",
    href: "/presse/mediathek",
    cta: "Assets laden",
  },
  {
    icon: MessageSquareQuote,
    title: "Experten-Zitate",
    desc: "O-Ton-Bibliothek zu 10 Pflege-Themen. Copy-and-Paste-fertig.",
    href: "/presse/experten-themen",
    cta: "Zitate finden",
  },
  {
    icon: Mail,
    title: "Pressekontakt",
    desc: "Anfragen, Interviews, Hintergrundgespräche — direkt zu uns.",
    href: "/presse/kontakt",
    cta: "Kontakt aufnehmen",
  },
];

export default function PressePage() {
  const latest = pressReleases.slice(0, 3);
  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="container grid gap-10 py-16 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-7">
            <Badge variant="outline" className="mb-5 gap-1.5">
              <Newspaper className="size-3.5" />
              Presse
            </Badge>
            <h1 className="font-serif text-4xl font-semibold leading-tight md:text-5xl">
              CareAI in den Medien.
            </h1>
            <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
              Für Journalist:innen, Podcast-Hosts, Konferenz-Organisator:innen:
              alles was du für eine Geschichte über CareAI, KI in der Pflege
              oder den DACH-Pflegemarkt brauchst — Fact-Sheet, O-Töne,
              Bilder und Kontakte. Deutsch, Open-Access, kuratiert.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/presse/kontakt">
                  Anfrage starten <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/presse/mediathek">
                  <Download className="size-4" /> Presse-Kit laden
                </Link>
              </Button>
            </div>
          </div>
          <div className="lg:col-span-5">
            <Card>
              <CardContent className="p-6">
                <h2 className="font-serif text-lg font-semibold">Pressekontakt</h2>
                <dl className="mt-4 space-y-2 text-sm">
                  <div className="flex justify-between gap-2">
                    <dt className="text-muted-foreground">E-Mail</dt>
                    <dd><a className="text-primary hover:underline" href="mailto:presse@careai.health">presse@careai.health</a></dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-muted-foreground">Telefon</dt>
                    <dd>+43 1 xxx xxxx (Mo–Fr 9–17 Uhr)</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-muted-foreground">Sprecher</dt>
                    <dd>Konstantin Wagner, CEO</dd>
                  </div>
                  <div className="flex justify-between gap-2">
                    <dt className="text-muted-foreground">Sprachen</dt>
                    <dd>Deutsch, Englisch</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="container py-16">
        <h2 className="font-serif text-2xl font-semibold">Presse-Kit auf einen Klick</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Fünf Bereiche, damit du schnell findest, was du brauchst.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {SECTIONS.map((s) => (
            <Card key={s.title} className="h-full transition-all hover:border-primary/50 hover:shadow-md">
              <CardContent className="flex h-full flex-col gap-3 p-6">
                <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <s.icon className="size-6" aria-hidden="true" />
                </div>
                <h3 className="font-serif text-xl font-semibold">{s.title}</h3>
                <p className="flex-1 text-sm text-muted-foreground">{s.desc}</p>
                <Link
                  href={s.href}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  {s.cta} <ArrowRight className="size-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-t border-border bg-muted/20">
        <div className="container py-16">
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="font-serif text-2xl font-semibold">Aktuelle Pressemeldungen</h2>
            <Link href="/presse/pressemeldungen" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
              Alle ansehen <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {latest.map((r) => (
              <PressCard key={r.slug} item={r} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
