import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { certifications, certificationRequirements } from "@/db/schema";
import { and, eq, asc } from "drizzle-orm";
import { CERTIFICATION_TEMPLATES } from "@/lib/certifications/templates";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = session.user.role;
  if (role !== "admin" && role !== "pdl") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const [cert] = await db
    .select()
    .from(certifications)
    .where(and(eq(certifications.id, id), eq(certifications.tenantId, session.user.tenantId)))
    .limit(1);
  if (!cert) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const reqs = await db
    .select()
    .from(certificationRequirements)
    .where(eq(certificationRequirements.certificationId, id))
    .orderBy(asc(certificationRequirements.category), asc(certificationRequirements.title));

  const tmpl = CERTIFICATION_TEMPLATES[cert.certificationType];
  const title = tmpl?.label ?? cert.certificationType;
  const now = new Date();

  const grouped = reqs.reduce<Record<string, typeof reqs>>((acc, r) => {
    const k = r.category ?? "Sonstiges";
    (acc[k] ??= []).push(r);
    return acc;
  }, {});

  const statusColor = (s: string) =>
    s === "erledigt" ? "#059669" : s === "in-bearbeitung" ? "#d97706" : s === "nicht-anwendbar" ? "#64748b" : "#dc2626";

  const html = `<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<title>Audit-Vorbereitung — ${title}</title>
<style>
  @page { size: A4; margin: 18mm; }
  body { font-family: -apple-system, Segoe UI, Roboto, sans-serif; color: #111; line-height: 1.5; }
  h1 { font-size: 22pt; margin: 0 0 6pt; }
  h2 { font-size: 13pt; margin: 16pt 0 6pt; color: #1e40af; }
  .sub { color: #666; margin-bottom: 14pt; }
  table { width: 100%; border-collapse: collapse; margin: 4pt 0; }
  th, td { text-align: left; padding: 5pt 7pt; border-bottom: 1px solid #eee; font-size: 10pt; vertical-align: top; }
  th { background: #f5f5f5; font-weight: 600; }
  .status-pill { display: inline-block; padding: 2pt 8pt; border-radius: 10pt; font-size: 8pt; font-weight: 700; color: #fff; }
  .meta-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10pt; margin: 10pt 0; }
  .meta { border: 1px solid #e5e5e5; padding: 8pt; border-radius: 6pt; }
  .meta-label { font-size: 8pt; color: #666; text-transform: uppercase; letter-spacing: 0.5pt; }
  .meta-value { font-size: 12pt; font-weight: 600; margin-top: 2pt; }
  .footer { margin-top: 20pt; font-size: 8pt; color: #666; border-top: 1px solid #ccc; padding-top: 6pt; }
  .print-hint { padding: 8pt; background: #fff3cd; border-radius: 4pt; margin-bottom: 14pt; font-size: 9pt; }
  @media print { .print-hint { display: none; } }
</style>
</head>
<body>
<div class="print-hint">Drucken mit Strg+P / ⌘+P → "Als PDF speichern" → fuer Auditor:in zum Mitnehmen.</div>

<h1>Audit-Vorbereitungs-Bericht</h1>
<div class="sub">${title} · Stand ${now.toLocaleDateString("de-DE")}</div>

<div class="meta-grid">
  <div class="meta"><div class="meta-label">Zertifikats-Nr.</div><div class="meta-value">${cert.certificateNumber ?? "—"}</div></div>
  <div class="meta"><div class="meta-label">Auditor</div><div class="meta-value">${cert.auditor ?? "—"}</div></div>
  <div class="meta"><div class="meta-label">Ausgestellt</div><div class="meta-value">${cert.awardedDate ? new Date(cert.awardedDate).toLocaleDateString("de-DE") : "—"}</div></div>
  <div class="meta"><div class="meta-label">Gueltig bis</div><div class="meta-value">${cert.expiresDate ? new Date(cert.expiresDate).toLocaleDateString("de-DE") : "—"}</div></div>
</div>

${Object.entries(grouped)
  .map(
    ([cat, items]) => `
<h2>${cat} (${items.length})</h2>
<table>
  <thead><tr><th style="width:35%">Anforderung</th><th>Beschreibung</th><th style="width:12%">Status</th></tr></thead>
  <tbody>
    ${items
      .map(
        (r) => `<tr>
          <td><strong>${escapeHtml(r.title)}</strong></td>
          <td>${escapeHtml(r.description ?? "")}</td>
          <td><span class="status-pill" style="background:${statusColor(r.status)}">${r.status}</span></td>
        </tr>`,
      )
      .join("")}
  </tbody>
</table>
`,
  )
  .join("")}

<div class="footer">
  ${reqs.length} Anforderungen gesamt · ${reqs.filter((r) => r.status === "erledigt").length} erledigt ·
  ${reqs.filter((r) => r.status === "in-bearbeitung").length} in Bearbeitung ·
  ${reqs.filter((r) => r.status === "offen").length} offen.<br>
  CareAI Zertifizierungs-Tracker · vertraulich.
</div>
</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `inline; filename="Audit-Vorbereitung-${cert.certificationType}-${now.toISOString().slice(0, 10)}.html"`,
    },
  });
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);
}
