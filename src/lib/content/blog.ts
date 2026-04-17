/**
 * Blog-Registry. Liest Markdown-Files aus /content/blog/ zur Build-Zeit.
 * Wird von Listen-Seite, Detail-Seite, RSS und Sitemap genutzt.
 */
import fs from "node:fs";
import path from "node:path";
import { countWords, estimateReadingMinutes } from "./markdown";

export type BlogFrontmatter = {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  author: string;
  category: string;
  tags: string[];
  cover?: string;
};

export type BlogPost = BlogFrontmatter & {
  slug: string;
  content: string;
  wordCount: number;
  readingMinutes: number;
};

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

function parseFrontmatter(raw: string): { meta: BlogFrontmatter; body: string } {
  const m = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(raw);
  if (!m) throw new Error("Frontmatter fehlt");
  const body = m[2].trim();
  const lines = m[1].split("\n");
  const meta: Record<string, unknown> = {};
  for (const line of lines) {
    const kv = /^([a-zA-Z]+):\s*(.*)$/.exec(line);
    if (!kv) continue;
    const key = kv[1];
    let val: string | string[] = kv[2].trim();
    if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
    if (val.startsWith("[") && val.endsWith("]")) {
      val = val
        .slice(1, -1)
        .split(",")
        .map((s) => s.trim().replace(/^"|"$/g, ""))
        .filter(Boolean);
    }
    meta[key] = val;
  }
  return { meta: meta as unknown as BlogFrontmatter, body };
}

let cache: BlogPost[] | null = null;

export function getAllBlogPosts(): BlogPost[] {
  if (cache) return cache;
  if (!fs.existsSync(CONTENT_DIR)) return [];
  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));
  const posts: BlogPost[] = files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
    const { meta, body } = parseFrontmatter(raw);
    return {
      ...meta,
      slug,
      content: body,
      wordCount: countWords(body),
      readingMinutes: estimateReadingMinutes(body),
    };
  });
  posts.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
  cache = posts;
  return posts;
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return getAllBlogPosts().find((p) => p.slug === slug);
}

export function getRelatedBlogPosts(slug: string, limit = 3): BlogPost[] {
  const current = getBlogPost(slug);
  if (!current) return [];
  const others = getAllBlogPosts().filter((p) => p.slug !== slug);
  return others
    .map((p) => ({
      post: p,
      score:
        p.tags.filter((t) => current.tags.includes(t)).length * 2 +
        (p.category === current.category ? 3 : 0),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.post);
}

export function getAllBlogCategories(): string[] {
  return Array.from(new Set(getAllBlogPosts().map((p) => p.category))).sort();
}
