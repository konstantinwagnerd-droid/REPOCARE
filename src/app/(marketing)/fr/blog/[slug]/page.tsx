import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";

function parse(raw: string): { meta: Record<string, string>; body: string } {
  const m = raw.match(/^---\s*\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: raw };
  const meta: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const i = line.indexOf(":");
    if (i === -1) continue;
    meta[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^"|"$/g, "");
  }
  return { meta, body: m[2] };
}

function md(src: string): string {
  const lines = src.split("\n");
  const out: string[] = [];
  let list = false;
  for (const l of lines) {
    if (/^## /.test(l)) { if (list) { out.push("</ul>"); list = false; } out.push(`<h2>${l.slice(3)}</h2>`); }
    else if (/^### /.test(l)) { if (list) { out.push("</ul>"); list = false; } out.push(`<h3>${l.slice(4)}</h3>`); }
    else if (/^- /.test(l)) { if (!list) { out.push("<ul>"); list = true; } out.push(`<li>${l.slice(2).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")}</li>`); }
    else if (l.trim() === "") { if (list) { out.push("</ul>"); list = false; } out.push(""); }
    else { if (list) { out.push("</ul>"); list = false; } out.push(`<p>${l.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")}</p>`); }
  }
  if (list) out.push("</ul>");
  return out.join("\n");
}

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), "content", "blog-fr");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => ({ slug: f.replace(/\.md$/, "") }));
}

export default async function FrBlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const file = path.join(process.cwd(), "content", "blog-fr", `${slug}.md`);
  if (!fs.existsSync(file)) return notFound();
  const { meta, body } = parse(fs.readFileSync(file, "utf8"));
  return (
    <article className="container max-w-3xl py-20">
      <Badge variant="outline">{meta.category}</Badge>
      <h1 className="mt-4 font-serif text-5xl font-semibold">{meta.title}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{meta.description}</p>
      <p className="mt-2 text-sm text-muted-foreground">{meta.author} · {meta.publishedAt}</p>
      <div className="prose prose-slate mt-10 max-w-none" dangerouslySetInnerHTML={{ __html: md(body) }} />
    </article>
  );
}
