import type { MetadataRoute } from "next";
import { getAllBlogPosts } from "@/lib/content/blog";
import { getAllGlossaryEntries } from "@/lib/content/glossar";
import { getAllResources } from "@/lib/content/resources";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://careai.at";

// DE marketing routes (canonical).
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
  "/partner",
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
  "/presse",
  "/presse/pressemeldungen",
  "/presse/mediathek",
  "/presse/experten-themen",
  "/presse/ueber-careai",
  "/presse/kontakt",
];

// EN marketing routes.
const enPaths = [
  "/en",
  "/en/about",
  "/en/contact",
  "/en/careers",
  "/en/case-studies",
  "/en/integrations",
  "/en/trust",
  "/en/roi-calculator",
  "/en/blog",
];

// Help center (static).
const helpPaths = ["/help"];

// hreflang alternates — map DE canonical → EN equivalent where one exists.
const hreflangMap: Record<string, string> = {
  "": "/en",
  "/ueber-uns": "/en/about",
  "/kontakt": "/en/contact",
  "/karriere": "/en/careers",
  "/case-studies": "/en/case-studies",
  "/integrations": "/en/integrations",
  "/trust": "/en/trust",
  "/roi-rechner": "/en/roi-calculator",
  "/blog": "/en/blog",
};

function withHreflang(path: string, base: string) {
  const en = hreflangMap[path];
  if (!en) return undefined;
  return {
    languages: {
      de: `${base}${path}`,
      en: `${base}${en}`,
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const base: MetadataRoute.Sitemap = marketingPaths.map((p) => ({
    url: `${BASE}${p}`,
    lastModified: now,
    changeFrequency: (p === "" ? "weekly" : "monthly") as "weekly" | "monthly",
    priority: p === "" ? 1 : p.startsWith("/demo") ? 0.9 : 0.7,
    alternates: withHreflang(p, BASE),
  }));

  const en: MetadataRoute.Sitemap = enPaths.map((p) => ({
    url: `${BASE}${p}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const help: MetadataRoute.Sitemap = helpPaths.map((p) => ({
    url: `${BASE}${p}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const blogDe = getAllBlogPosts().map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.updatedAt ?? p.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // EN blog slugs — fall back to same slugs as DE (best-effort).
  const blogEn = getAllBlogPosts().map((p) => ({
    url: `${BASE}/en/blog/${p.slug}`,
    lastModified: new Date(p.updatedAt ?? p.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
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

  return [...base, ...en, ...help, ...blogDe, ...blogEn, ...glossar, ...resources];
}
