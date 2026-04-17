import Link from "next/link";
import { PageHero } from "@/components/marketing/sections/page-hero";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getAllBlogPosts, getAllBlogCategories } from "@/lib/content/blog";

export const metadata = {
  title: "Blog — CareAI",
  description:
    "Fachartikel zu Pflegedokumentation, Recht, KI und Praxis in der Pflege. Kompakt, fundiert, brand-klar.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  const posts = getAllBlogPosts();
  const categories = getAllBlogCategories();

  return (
    <>
      <PageHero
        eyebrow="Blog"
        title="Fachartikel fuer die Pflege von morgen."
        description="Recherche-basiert, praxisorientiert und frei zugaenglich. Wir teilen, was wir in ueber 40 DACH-Einrichtungen gelernt haben."
      />

      {/* Kategorien */}
      <section className="container border-b border-border/60 py-4">
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="rounded-full">Alle</Badge>
          {categories.map((c) => (
            <Badge key={c} variant="outline" className="rounded-full">{c}</Badge>
          ))}
        </div>
      </section>

      {/* Artikel-Liste */}
      <section className="container py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="group">
              <Card className="h-full transition-transform hover:-translate-y-0.5 hover:shadow-lg">
                <CardContent className="p-6">
                  <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-primary">{p.category}</span>
                    <span>·</span>
                    <span>{p.readingMinutes} Min.</span>
                  </div>
                  <h2 className="mb-2 font-serif text-xl font-semibold leading-tight group-hover:text-primary">
                    {p.title}
                  </h2>
                  <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">{p.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{p.author}</span>
                    <time dateTime={p.publishedAt}>
                      {new Date(p.publishedAt).toLocaleDateString("de-DE", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </time>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* RSS-Hinweis */}
      <section className="container border-t border-border/60 py-10">
        <p className="text-sm text-muted-foreground">
          RSS-Feed:{" "}
          <Link href="/blog/rss.xml" className="text-primary underline-offset-4 hover:underline">
            /blog/rss.xml
          </Link>
        </p>
      </section>
    </>
  );
}
