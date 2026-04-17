import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllBlogPosts, getBlogPost, getRelatedBlogPosts } from "@/lib/content/blog";
import { renderMarkdown } from "@/lib/content/markdown";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ReadingProgress } from "@/components/marketing/blog/reading-progress";
import { ShareButtons } from "@/components/marketing/blog/share-buttons";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return getAllBlogPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — CareAI Blog`,
    description: post.description,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return notFound();
  const { html, toc } = renderMarkdown(post.content);
  const related = getRelatedBlogPosts(slug, 3);

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    author: { "@type": "Person", name: post.author },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    publisher: {
      "@type": "Organization",
      name: "CareAI",
      logo: { "@type": "ImageObject", url: "/logo.svg" },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `https://careai.eu/blog/${slug}` },
    keywords: post.tags.join(", "),
    wordCount: post.wordCount,
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Blog", item: "https://careai.eu/blog" },
      { "@type": "ListItem", position: 2, name: post.title, item: `https://careai.eu/blog/${slug}` },
    ],
  };

  return (
    <>
      <ReadingProgress />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      <article className="container py-12 md:py-16">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
          <Link href="/blog" className="hover:text-foreground">Blog</Link>
          <span className="mx-2">/</span>
          <span>{post.category}</span>
        </nav>

        <header className="mx-auto max-w-3xl">
          <Badge variant="outline" className="mb-4 rounded-full border-primary/20 bg-primary/5 text-primary">
            {post.category}
          </Badge>
          <h1 className="text-balance font-serif text-4xl font-semibold leading-[1.15] tracking-tight md:text-5xl">
            {post.title}
          </h1>
          <p className="mt-5 text-lg text-muted-foreground">{post.description}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <span>Von {post.author}</span>
            <span aria-hidden>·</span>
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </time>
            <span aria-hidden>·</span>
            <span>{post.readingMinutes} Min. Lesezeit</span>
            <span aria-hidden>·</span>
            <span>{post.wordCount} Worte</span>
          </div>
        </header>

        <div className="mx-auto mt-12 grid max-w-6xl gap-12 lg:grid-cols-12">
          {/* TOC */}
          {toc.length > 2 && (
            <aside className="lg:col-span-3">
              <div className="sticky top-24">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Inhalt
                </p>
                <nav aria-label="Inhaltsverzeichnis" className="space-y-2 text-sm">
                  {toc.map((t) => (
                    <a
                      key={t.id}
                      href={`#${t.id}`}
                      className={`block text-muted-foreground hover:text-foreground ${t.level === 3 ? "pl-3 text-xs" : ""}`}
                    >
                      {t.text}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>
          )}

          {/* Content */}
          <div className={toc.length > 2 ? "lg:col-span-9" : "mx-auto lg:col-span-9"}>
            <div
              className="prose-custom max-w-none text-base"
              dangerouslySetInnerHTML={{ __html: html }}
            />

            {/* Tags */}
            <div className="mt-10 flex flex-wrap gap-2">
              {post.tags.map((t) => (
                <Badge key={t} variant="outline" className="rounded-full">
                  #{t}
                </Badge>
              ))}
            </div>

            {/* Share */}
            <div className="mt-8">
              <ShareButtons title={post.title} />
            </div>

            {/* Author-Card */}
            <Card className="mt-12">
              <CardContent className="flex items-start gap-5 p-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground font-serif text-xl">
                  {post.author
                    .split(" ")
                    .map((p) => p[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <div>
                  <p className="font-serif text-lg font-semibold">{post.author}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Teil des CareAI-Autor:innen-Teams. Schreibt ueber Pflegepraxis, Recht und Technik.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Verwandte Artikel */}
        {related.length > 0 && (
          <section className="mx-auto mt-16 max-w-6xl border-t border-border/60 pt-12">
            <h2 className="mb-6 font-serif text-2xl font-semibold">Verwandte Artikel</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {related.map((r) => (
                <Link key={r.slug} href={`/blog/${r.slug}`} className="group">
                  <Card className="h-full transition-transform hover:-translate-y-0.5">
                    <CardContent className="p-5">
                      <p className="mb-2 text-xs text-primary">{r.category}</p>
                      <h3 className="font-serif text-base font-semibold group-hover:text-primary">{r.title}</h3>
                      <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{r.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
