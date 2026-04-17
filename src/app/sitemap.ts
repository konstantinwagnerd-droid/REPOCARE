import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/content/blog";
import { getAllGlossaryEntries } from "@/lib/content/glossar";
import { getAllResources } from "@/lib/content/resources";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://careai.at";

const marketingPaths = [
  "",
  "/demo-anfrage",
  "/ueber-uns",
  "/kontakt",
  "/karriere",
  "/security",
  "/trust",
  "/status",
  "/changelog",
  "/integrations",
  "/case-studies",
  "/roi-rechner",
  "/agb",
  "/impressum",
  "/datenschutz",
  "/av-vertrag",
  "/blog",
  "/glossar",
  "/ressourcen",
  "/rechtliches",
  "/rechtliches/cookies",
  "/rechtliches/barrierefreiheit",
  "/rechtliches/hinweisgeberschutz",
  "/rechtliches/nachhaltigkeit",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const base = marketingPaths.map((p) => ({
    url: `${BASE}${p}`,
    lastModified: now,
    changeFrequency: (p === "" ? "weekly" : "monthly") as "weekly" | "monthly",
    priority: p === "" ? 1 : p.startsWith("/demo") ? 0.9 : 0.7,
  }));

  const blog = getAllBlogPosts().map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.updatedAt ?? p.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const glossar = getAllGlossaryEntries().map((g) => ({
    url: `${BASE}/glossar#${g.slug}`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  const resources = getAllResources().map((r) => ({
    url: `${BASE}/ressourcen/${r.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...base, ...blog, ...glossar, ...resources];
}
