/**
 * Journey Export — JSON + HTML (Browser-Print friendly).
 *
 * Kein Zugriff auf src/lib/pdf/. Statt dessen liefern wir einen
 * selfcontained HTML-String, den der Browser per window.print()
 * als PDF speichern kann.
 */

import type { JourneyEvent } from "./types";
import { EVENT_LABELS } from "./types";

export interface ExportMeta {
  residentName: string;
  residentId: string;
  pflegegrad?: number;
  generatedAt?: string;
}

export function exportJson(events: JourneyEvent[], meta: ExportMeta): string {
  return JSON.stringify(
    {
      meta: { ...meta, generatedAt: meta.generatedAt ?? new Date().toISOString() },
      events,
      count: events.length,
    },
    null,
    2,
  );
}

const esc = (s: string): string =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const fmtDate = (iso: string): string => {
  const d = new Date(iso);
  return d.toLocaleString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export function exportHtml(events: JourneyEvent[], meta: ExportMeta): string {
  const rows = events
    .map(
      (e) => `
      <tr class="sev-${esc(e.severity)}">
        <td class="date">${esc(fmtDate(e.occurredAt))}</td>
        <td class="type">${esc(EVENT_LABELS[e.type])}</td>
        <td>
          <strong>${esc(e.title)}</strong>
          <div class="desc">${esc(e.description)}</div>
          ${e.enrichedContext ? `<div class="ctx">${esc(e.enrichedContext)}</div>` : ""}
        </td>
      </tr>`,
    )
    .join("");

  const generated = meta.generatedAt ?? new Date().toISOString();

  return `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8" />
<title>Journey — ${esc(meta.residentName)}</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #111; padding: 32px; }
  h1 { font-size: 24px; margin: 0 0 4px; }
  .meta { color: #555; font-size: 13px; margin-bottom: 24px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th, td { border-bottom: 1px solid #ddd; padding: 10px 8px; vertical-align: top; text-align: left; }
  th { background: #f6f6f6; font-size: 11px; text-transform: uppercase; letter-spacing: .5px; }
  td.date { white-space: nowrap; width: 140px; color: #555; }
  td.type { width: 180px; color: #333; }
  .desc { color: #555; margin-top: 2px; }
  .ctx { color: #777; font-size: 12px; margin-top: 2px; font-style: italic; }
  tr.sev-critical td:first-child { border-left: 4px solid #e11d48; padding-left: 8px; }
  tr.sev-high td:first-child { border-left: 4px solid #f97316; padding-left: 8px; }
  tr.sev-medium td:first-child { border-left: 4px solid #f59e0b; padding-left: 8px; }
  tr.sev-low td:first-child { border-left: 4px solid #10b981; padding-left: 8px; }
  tr.sev-info td:first-child { border-left: 4px solid #0ea5e9; padding-left: 8px; }
  @media print { body { padding: 0; } }
</style>
</head>
<body>
  <h1>Resident-Journey — ${esc(meta.residentName)}</h1>
  <div class="meta">
    ID: ${esc(meta.residentId)}${meta.pflegegrad ? ` · Pflegegrad ${meta.pflegegrad}` : ""}
    · Erstellt ${esc(fmtDate(generated))}
    · ${events.length} Ereignisse
  </div>
  <table>
    <thead><tr><th>Datum</th><th>Typ</th><th>Ereignis</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <script>window.onload = () => { if (location.search.includes("print=1")) setTimeout(() => window.print(), 400); };</script>
</body>
</html>`;
}
