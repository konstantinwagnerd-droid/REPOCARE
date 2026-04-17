import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/marketing/sections/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { articles, articleMap } from "../articles";
import { ArticleFeedback } from "./feedback";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const a = articleMap[params.slug];
  return { title: a ? `${a.title} — CareAI Hilfe` : "Artikel — CareAI" };
}

function renderMarkdown(body: string) {
  // Simpler Renderer: ## Heading, - List, Absatz. Keine externen Abhaengigkeiten.
  const blocks = body.split(/\n\n+/);
  return blocks.map((block, i) => {
    if (block.startsWith("## ")) {
      const text = block.replace(/^##\s+/, "");
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return (
        <h2 key={i} id={id} className="mt-10 font-serif text-2xl font-semibold tracking-tight scroll-mt-24">
          {text}
        </h2>
      );
    }
    if (block.split("\n").every((l) => l.startsWith("- "))) {
      return (
        <ul key={i} className="my-4 list-disc space-y-2 pl-6 text-muted-foreground">
          {block.split("\n").map((l, j) => (
            <li key={j}>{l.replace(/^-\s+/, "")}</li>
          ))}
        </ul>
      );
    }
    return (
      <p key={i} className="my-4 leading-relaxed text-muted-foreground">
        {block}
      </p>
    );
  });
}

function extractHeadings(body: string) {
  return body
    .split("\n")
    .filter((l) => l.startsWith("## "))
    .map((l) => {
      const text = l.replace(/^##\s+/, "");
      return { text, id: text.toLowerCase().replace(/[^a-z0-9]+/g, "-") };
    });
}

export default function HelpArticlePage({ params }: { params: { slug: string } }) {
  const a = articleMap[params.slug];
  if (!a) return notFound();
  const toc = extractHeadings(a.body);
  const related = (a.related ?? []).map((s) => articleMap[s]).filter(Boolean);

  return (
    <>
      <PageHero
        eyebrow={a.category}
        title={a.title}
        description={a.excerpt}
        actions={
          <Button asChild variant="outline" size="sm">
            <Link href="/help">
              <ArrowLeft className="mr-1 h-4 w-4" /> Zur Uebersicht
            </Link>
          </Button>
        }
      />
      <section className="container py-12">
        <div className="grid gap-10 lg:grid-cols-4">
          <article className="lg:col-span-3">
            <div className="prose-custom">{renderMarkdown(a.body)}</div>
            <div className="mt-10">
              <ArticleFeedback articleSlug={a.slug} />
            </div>
            {related.length > 0 && (
              <div className="mt-12">
                <h3 className="font-serif text-xl font-semibold">Verwandte Artikel</h3>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  {related.map((r) => (
                    <Card key={r.slug}>
                      <CardContent className="p-5">
                        <Link href={`/help/${r.slug}`} className="group">
                          <div className="text-xs font-medium uppercase tracking-wider text-primary">{r.category}</div>
                          <div className="mt-1 font-semibold group-hover:text-primary">{r.title}</div>
                          <p className="mt-1 text-sm text-muted-foreground">{r.excerpt}</p>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </article>
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Inhaltsverzeichnis
              </div>
              <ul className="mt-3 space-y-1.5 text-sm">
                {toc.map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} className="text-muted-foreground hover:text-primary">
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
