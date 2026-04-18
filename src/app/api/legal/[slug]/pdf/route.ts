import { NextRequest } from "next/server";
import { promises as fs } from "node:fs";
import path from "node:path";
import { renderPdf, pdfResponse } from "@/lib/pdf/render";
import { LegalMarkdownDoc, type LegalMdData } from "@/lib/pdf/legal-markdown";

export const runtime = "nodejs";

const ALLOWED_SLUGS = new Set([
  "datenschutz-1pager-de",
  "datenschutz-1pager-at",
  "av-vertrag-entwurf",
  "dsfa-careai",
  "tom-careai",
  "subprocessors",
  "abrechnung-krankenkassen",
]);

const TITLES: Record<string, { title: string; subtitle?: string }> = {
  "datenschutz-1pager-de": { title: "Datenschutz-Überblick", subtitle: "1-Pager für Einrichtungen · Deutschland" },
  "datenschutz-1pager-at": { title: "Datenschutz-Überblick", subtitle: "1-Pager für Einrichtungen · Österreich" },
  "av-vertrag-entwurf": { title: "AV-Vertrag (Art. 28 DSGVO)", subtitle: "Vertrag zur Auftragsverarbeitung — Entwurf" },
  "dsfa-careai": { title: "Datenschutz-Folgenabschätzung", subtitle: "DSFA gemäß Art. 35 DSGVO" },
  "tom-careai": { title: "Technische und Organisatorische Maßnahmen", subtitle: "TOM gemäß Art. 32 DSGVO" },
  "subprocessors": { title: "Subprocessor-Liste", subtitle: "Aktive Unter-Auftragsverarbeiter" },
  "abrechnung-krankenkassen": { title: "Abrechnung mit Krankenkassen", subtitle: "1-Pager für PDL" },
};

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ slug: string }> },
) {
  const { slug } = await ctx.params;
  if (!ALLOWED_SLUGS.has(slug)) {
    return new Response("Not Found", { status: 404 });
  }

  const url = new URL(req.url);
  const facilityName = url.searchParams.get("facility") ?? "CareAI Demo Einrichtung";
  const facilityAddress = url.searchParams.get("address") ?? undefined;

  // Load markdown from content/legal
  const filePath = path.join(process.cwd(), "content", "legal", `${slug}.md`);
  let markdown: string;
  try {
    markdown = await fs.readFile(filePath, "utf-8");
  } catch {
    return new Response("Document not found", { status: 404 });
  }

  // Pre-fill common placeholders for viewing (unsigned draft)
  const placeholders: Record<string, string> = {
    EINRICHTUNG_NAME: facilityName,
    EINRICHTUNG_ADRESSE: facilityAddress ?? "[Adresse der Einrichtung]",
    VERTRETUNGSBERECHTIGTER: "[Vertretungsberechtigte Person]",
    CAREAI_ADRESSE: "Wien, Österreich",
    DATUM: new Date().toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }),
    DATUM_HAUPTVERTRAG: "[Datum des Hauptvertrags]",
    ORT: "Wien",
    GESCHAEFTSFUEHRUNG: "[Geschäftsführung]",
    DSB_NAME: "[Datenschutzbeauftragter]",
    PFL_NAME: "[Pflegefachliche Leitung]",
  };

  const meta = TITLES[slug];
  const data: LegalMdData = { markdown, placeholders };

  const { buffer, hash, filename } = await renderPdf(
    LegalMarkdownDoc,
    data,
    {
      facilityName,
      facilityAddress,
      title: meta.title,
      subtitle: meta.subtitle,
      confidential: slug.startsWith("av-vertrag") || slug.startsWith("dsfa"),
      watermark: slug === "av-vertrag-entwurf" ? "ENTWURF" : undefined,
    },
  );

  return pdfResponse(buffer, filename, hash);
}
