import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MediaGrid } from "@/components/presse/MediaGrid";
import { mediaAssets } from "@/components/presse/data";

export const metadata = {
  title: "Mediathek | Presse | CareAI",
  description: "Logos, Fotos, Videos, Decks — alle CareAI-Assets für Medien und Partner.",
};

export default function MediathekPage() {
  const logos = mediaAssets.filter((a) => a.kind === "logo");
  const photos = mediaAssets.filter((a) => a.kind === "photo");
  const videos = mediaAssets.filter((a) => a.kind === "video");
  const decks = mediaAssets.filter((a) => a.kind === "deck");
  const illus = mediaAssets.filter((a) => a.kind === "illustration");

  return (
    <div className="container max-w-6xl space-y-10 py-12">
      <Link
        href="/presse"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Zurück zum Presse-Hub
      </Link>

      <header className="space-y-3">
        <Badge variant="outline">Mediathek</Badge>
        <h1 className="font-serif text-3xl font-semibold md:text-4xl">
          Logos, Fotos, Videos &amp; Decks
        </h1>
        <p className="max-w-3xl text-muted-foreground">
          Alle Assets frei für redaktionelle Nutzung. Bitte nicht verändern,
          keine kommerzielle Re-Veröffentlichung ohne Rücksprache.
          Bei technischen Fragen zu Formaten: presse@careai.health.
        </p>
      </header>

      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="flex items-start gap-3 p-5">
          <Info className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
          <div className="text-sm">
            <strong>Nutzungsrechte:</strong> Alle Logos, Fotos und Grafiken stehen
            Medien-Schaffenden frei zur redaktionellen Nutzung zur Verfügung, sofern
            die Quelle &bdquo;CareAI&ldquo; genannt wird. Für werbliche oder kommerzielle
            Nutzung ist vorherige schriftliche Zustimmung erforderlich.
          </div>
        </CardContent>
      </Card>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl font-semibold">Logos &amp; Marken</h2>
        <MediaGrid assets={logos} />
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl font-semibold">Fotos</h2>
        <MediaGrid assets={photos} />
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl font-semibold">Videos</h2>
        <MediaGrid assets={videos} />
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl font-semibold">Decks &amp; PDFs</h2>
        <MediaGrid assets={decks} />
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-2xl font-semibold">Illustrationen &amp; Infografiken</h2>
        <MediaGrid assets={illus} />
      </section>
    </div>
  );
}
