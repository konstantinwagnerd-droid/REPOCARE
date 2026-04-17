import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { QuoteBank } from "@/components/presse/QuoteBank";
import { expertQuotes } from "@/components/presse/data";

export const metadata = {
  title: "Experten-Themen | Presse | CareAI",
  description:
    "O-Ton-Bibliothek zu 10 Pflege-Themen: Pflegenotstand, KI, EU AI Act, DSGVO, Pflegegrade, Demenz, Digitalisierung und mehr.",
};

export default function ExpertenThemenPage() {
  const topics = Array.from(new Set(expertQuotes.map((q) => q.topic)));

  return (
    <div className="container max-w-4xl space-y-8 py-12">
      <Link
        href="/presse"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Zurück zum Presse-Hub
      </Link>

      <header className="space-y-3">
        <Badge variant="outline">Experten-Themen</Badge>
        <h1 className="font-serif text-3xl font-semibold md:text-4xl">
          O-Ton-Bibliothek
        </h1>
        <p className="max-w-3xl text-muted-foreground">
          Zitate zu {topics.length} Themen rund um die Pflege — kuratiert und
          freigegeben. Nutzbar in Artikeln, Features, Podcasts. Per Klick kopieren,
          für individuelle O-Töne gerne direkt ein Interview anfragen.
        </p>
      </header>

      <Card>
        <CardContent className="p-5">
          <h2 className="font-serif text-lg font-semibold">Themen-Überblick</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {topics.map((t) => (
              <a
                key={t}
                href={`#${t.toLowerCase().replace(/[^a-z]+/g, "-")}`}
                className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium transition-colors hover:border-primary hover:text-primary"
              >
                {t}
              </a>
            ))}
          </div>
        </CardContent>
      </Card>

      <QuoteBank quotes={expertQuotes} />
    </div>
  );
}
