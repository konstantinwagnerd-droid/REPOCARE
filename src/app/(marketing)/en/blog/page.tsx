import fs from "node:fs";
import path from "node:path";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Blog", alternates: { canonical: "/en/blog", languages: { "de-DE": "/blog", "en-US": "/en/blog" } } };

type Post = { slug: string; title: string; description: string; publishedAt: string; author: string; category: string };

function parseFrontmatter(raw: string): Record<string, string> {
  const m = raw.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!m) return {};
  const out: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const k = line.slice(0, idx).trim();
    const v = line.slice(idx + 1).trim().replace(/^"|"$/g, "");
    out[k] = v;
  }
  return out;
}

function getPosts(): Post[] {
  const dir = path.join(process.cwd(), "content", "blog-en");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => {
    const raw = fs.readFileSync(path.join(dir, f), "utf8");
    const fm = parseFrontmatter(raw);
    return {
      slug: f.replace(/\.md$/, ""),
      title: fm.title || f,
      description: fm.description || "",
      publishedAt: fm.publishedAt || "",
      author: fm.author || "",
      category: fm.category || "",
    };
  }).sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export default function EnBlogPage() {
  const posts = getPosts();
  return (
    <div className="container py-20">
      <Badge variant="outline" className="mb-4">Blog</Badge>
      <h1 className="font-serif text-5xl font-semibold">Insights for modern care.</h1>
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <Card key={p.slug}><CardContent className="p-6">
            <Badge variant="outline">{p.category}</Badge>
            <h2 className="mt-3 font-serif text-xl font-semibold">
              <Link href={`/en/blog/${p.slug}`} className="hover:text-primary">{p.title}</Link>
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">{p.description}</p>
            <p className="mt-4 text-xs text-muted-foreground">{p.author} · {p.publishedAt}</p>
          </CardContent></Card>
        ))}
      </div>
    </div>
  );
}
