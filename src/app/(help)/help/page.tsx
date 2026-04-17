import Link from "next/link";
import { PageHero } from "@/components/marketing/sections/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { HelpSearch } from "./search";
import { articles, categories } from "./articles";
import { BookOpen, Mic, Sparkles, FileCheck, ShieldCheck, HelpCircle, HeartHandshake } from "lucide-react";

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "Erste Schritte": BookOpen,
  Spracheingabe: Mic,
  SIS: Sparkles,
  "Abrechnung & Pruefung": FileCheck,
  "DSGVO & Rechte": ShieldCheck,
  Dokumentation: FileCheck,
  Angehoerige: HeartHandshake,
  Dienstplan: BookOpen,
  FAQs: HelpCircle,
};

export const metadata = { title: "Hilfe-Center — CareAI" };

export default function HelpIndex() {
  return (
    <>
      <PageHero
        eyebrow="Hilfe-Center"
        title="So holen Sie das Beste aus CareAI heraus."
        description="15 Artikel, nach Kategorie sortiert. Oder suchen Sie direkt."
      />
      <section className="container py-10">
        <HelpSearch articles={articles} />
      </section>

      <section className="container pb-14">
        <h2 className="font-serif text-3xl font-semibold tracking-tight">Kategorien</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat] ?? HelpCircle;
            const items = articles.filter((a) => a.category === cat);
            return (
              <Card key={cat}>
                <CardContent className="p-6">
                  <span className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-serif text-lg font-semibold">{cat}</h3>
                  <ul className="mt-3 space-y-1.5 text-sm">
                    {items.map((a) => (
                      <li key={a.slug}>
                        <Link href={`/help/${a.slug}`} className="text-muted-foreground hover:text-primary">
                          {a.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </>
  );
}
