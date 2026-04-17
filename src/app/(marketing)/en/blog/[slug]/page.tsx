import fs from "node:fs";
import path from "node:path";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const m = raw.match(/^---\s*\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: raw };
  const meta: Record<string, string> = {};
  for (const line of m[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim().replace(/^"|"$/g, "");
  }
  return { meta, body: m[2] };
}

function mdToHtml(md: string): string {
  // minimal MD renderer: headings, paragraphs, bold, lists
  const lines = md.split("\n");
  const out: string[] = [];
  let inList = false;
  for (const line of lines) {
    if (/^## /.test(line)) {
      if (inList) { out.push("</ul>"); inList = false; }
      out.push(`<h2>${line.slice(3)}</h2>`);
    } else if (/^### /.test(line)) {
      if (inList) { out.push("</ul>"); inList = false; }
      out.push(`<h3>${line.slice(4)}</h3>`);
    } else if (/^- /.test(line)) {
      if (!inList) { out.push("<ul>"); inList = true; }
      out.push(`<li>${line.slice(2).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")}</li>`);
    } else if (/^\d+\. /.test(line)) {
      out.push(`<p>${line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")}</p>`);
    } else if (line.trim() === "") {
      if (inList) { out.push("</ul>"); inList = false; }
      out.push("");
    } else {
      if (inList) { out.push("</ul>"); inList = false; }
      out.push(`<p>${line.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")}</p>`);
    }
  }
  if (inList) out.push("</ul>");
  return out.join("\n");
}

export async function generateStaticParams() {
  const dir = path.join(process.cwd(), "content", "blog-en");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(".md")).map((f) => ({ slug: f.replace(/\.md$/, "") }));
}

export default async function EnBlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const file = path.join(process.cwd(), "content", "blog-en", `${slug}.md`);
  if (!fs.existsSync(file)) return notFound();
  const { meta, body } = parseFrontmatter(fs.readFileSync(file, "utf8"));
  const html = mdToHtml(body);
  return (
    <article className="container max-w-3xl py-20">
      <Badge variant="outline">{meta.category}</Badge>
      <h1 className="mt-4 font-serif text-5xl font-semibold">{meta.title}</h1>
      <p className="mt-4 text-lg text-muted-foreground">{meta.description}</p>
      <p className="mt-2 text-sm text-muted-foreground">{meta.author} · {meta.publishedAt}</p>
      <div className="prose prose-slate mt-10 max-w-none" dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}
