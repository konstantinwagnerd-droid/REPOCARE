import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PressCard } from "@/components/presse/PressCard";
import { pressReleases } from "@/components/presse/data";

export const metadata = {
  title: "Pressemeldungen | Presse | CareAI",
  description: "Archiv aller CareAI-Pressemeldungen seit Gründung.",
};

export default function PressemeldungenPage() {
  const byCategory = Array.from(new Set(pressReleases.map((p) => p.category)));
  return (
    <div className="container max-w-6xl space-y-8 py-12">
      <Link
        href="/presse"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Zurück zum Presse-Hub
      </Link>

      <header className="space-y-3">
        <Badge variant="outline">Pressemeldungen</Badge>
        <h1 className="font-serif text-3xl font-semibold md:text-4xl">
          Archiv aller Meldungen
        </h1>
        <p className="max-w-3xl text-muted-foreground">
          {pressReleases.length} Pressemeldungen. Kategorien: {byCategory.join(" · ")}.
          Für ältere Meldungen bitte per E-Mail anfragen.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {pressReleases.map((r) => (
          <PressCard key={r.slug} item={r} />
        ))}
      </div>
    </div>
  );
}
