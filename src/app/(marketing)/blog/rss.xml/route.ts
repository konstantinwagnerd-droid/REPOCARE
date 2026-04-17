import { getAllBlogPosts } from "@/lib/content/blog";

export const dynamic = "force-static";

export async function GET() {
  const posts = getAllBlogPosts();
  const base = "https://careai.eu";

  const items = posts
    .map(
      (p) => `  <item>
    <title><![CDATA[${p.title}]]></title>
    <link>${base}/blog/${p.slug}</link>
    <guid>${base}/blog/${p.slug}</guid>
    <pubDate>${new Date(p.publishedAt).toUTCString()}</pubDate>
    <description><![CDATA[${p.description}]]></description>
    <category>${p.category}</category>
    <author>${p.author}</author>
  </item>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>CareAI Blog</title>
  <link>${base}/blog</link>
  <description>Fachartikel zu Pflegedokumentation, Recht, KI und Praxis in der Pflege.</description>
  <language>de-DE</language>
  <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
