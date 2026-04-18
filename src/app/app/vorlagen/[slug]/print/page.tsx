/**
 * /app/vorlagen/[slug]/print — druckbare Vollbild-Version.
 * Einrichtungs-Logo oben, Unterschriften-Block unten.
 */
import { notFound } from "next/navigation";
import { db } from "@/db/client";
import { auth } from "@/lib/auth";
import { residents, exportRecords } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getTemplate, fillTemplate } from "@/lib/templates";
import { renderMarkdown } from "@/lib/content/markdown";

async function hashText(s: string): Promise<string> {
  const enc = new TextEncoder().encode(s);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default async function TemplatePrintPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ resident?: string }>;
}) {
  const { slug: slugRaw } = await params;
  const sp = await searchParams;
  const slug = decodeURIComponent(slugRaw);
  const tpl = getTemplate(slug);
  if (!tpl) notFound();

  const session = await auth();
  const tenantId = session?.user?.tenantId;

  let filled = tpl.body;
  if (sp.resident && tenantId) {
    const [r] = await db.select().from(residents).where(eq(residents.id, sp.resident)).limit(1);
    if (r) {
      const [vorname, ...rest] = (r.fullName ?? "").split(" ");
      filled = fillTemplate(tpl.body, {
        "resident.name": r.fullName,
        "resident.vorname": vorname,
        "resident.nachname": rest.join(" "),
        "resident.geburtsdatum": r.birthdate ? new Date(r.birthdate).toISOString().slice(0, 10) : "",
        datum: new Date().toISOString().slice(0, 10),
        autor: session?.user?.name ?? "",
        "autor.name": session?.user?.name ?? "",
      });

      // Audit: protokolliere Export — Best-Effort (ignore Fehler).
      try {
        const hash = await hashText(`${tpl.id}|${r.id}|${new Date().toISOString()}`);
        await db.insert(exportRecords).values({
          tenantId,
          residentId: r.id,
          kind: `template:${tpl.id}`,
          filename: `${slug}.pdf`,
          hash,
          userId: session?.user?.id ?? null,
        } as typeof exportRecords.$inferInsert);
      } catch {
        /* non-critical */
      }
    }
  }

  const { html } = renderMarkdown(filled);

  return (
    <html lang="de">
      <head>
        <title>{tpl.title}</title>
        <style>{`
          @media print {
            body { margin: 0; padding: 20mm; font-family: system-ui, sans-serif; color: #111; }
            header.print-header { border-bottom: 2px solid #111; padding-bottom: 6mm; margin-bottom: 10mm; }
            footer.print-footer { margin-top: 15mm; border-top: 1px solid #ccc; padding-top: 5mm; font-size: 10pt; }
            h1, h2, h3 { page-break-after: avoid; }
            table { page-break-inside: avoid; }
          }
          body { font-family: system-ui, -apple-system, sans-serif; max-width: 210mm; margin: 0 auto; padding: 20mm; line-height: 1.55; }
          header.print-header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid #111; padding-bottom: 10px; margin-bottom: 20px; }
          .logo { font-weight: 600; font-size: 14pt; }
          h1 { font-size: 20pt; margin: 20px 0 10px; }
          h2 { font-size: 14pt; margin-top: 18px; }
          h3 { font-size: 12pt; margin-top: 14px; }
          p, li { font-size: 11pt; }
          table { border-collapse: collapse; width: 100%; margin: 10px 0; }
          th, td { border: 1px solid #ccc; padding: 4px 8px; font-size: 10pt; text-align: left; }
          footer.print-footer { margin-top: 30px; border-top: 1px solid #ccc; padding-top: 15px; font-size: 9pt; color: #666; }
          .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-top: 40px; }
          .sig-line { border-top: 1px solid #111; padding-top: 4px; font-size: 9pt; }
        `}</style>
      </head>
      <body>
        <header className="print-header">
          <div>
            <div className="logo">CareAI · Pflegedokumentation</div>
            <div style={{ fontSize: "10pt", color: "#666" }}>{session?.user?.name ?? "—"} · {new Date().toLocaleDateString("de-AT")}</div>
          </div>
          <div style={{ fontSize: "9pt", color: "#999" }}>
            Dokument-ID: {tpl.id} · Stand {tpl.version_date}
          </div>
        </header>

        <main dangerouslySetInnerHTML={{ __html: html }} />

        <div className="signatures">
          <div>
            <div className="sig-line">Datum / Unterschrift Pflegekraft</div>
          </div>
          <div>
            <div className="sig-line">Datum / Unterschrift Bewohner:in / Vertretung</div>
          </div>
        </div>

        <footer className="print-footer">
          <div><strong>Rechtsgrundlage:</strong> {tpl.legal_reference}</div>
          {tpl.source_url && <div><strong>Quelle:</strong> {tpl.source_url}</div>}
          <div style={{ marginTop: 4 }}>Generiert mit CareAI — https://repocare.vercel.app</div>
        </footer>
      </body>
    </html>
  );
}
