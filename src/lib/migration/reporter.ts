/**
 * Formatter für Import-Reports — als Text, HTML-Zusammenfassung oder CSV-Log.
 * Keine I/O — nur reines Rendering.
 */

import type { ImportReport, ValidationError } from "./types";

export function formatReportText(r: ImportReport): string {
  const lines: string[] = [];
  lines.push(`CareAI Migration Report — Batch ${r.batchId}`);
  lines.push(`Quelle: ${r.source}`);
  lines.push(`Start: ${r.startedAt}`);
  lines.push(`Ende:  ${r.finishedAt} (${Math.round(r.durationMs / 1000)}s)`);
  lines.push("");
  lines.push(`Datensätze gesamt:  ${r.totalRecords}`);
  lines.push(`  importiert:       ${r.imported}`);
  lines.push(`  übersprungen:     ${r.skipped}`);
  lines.push(`  fehlgeschlagen:   ${r.failed}`);
  lines.push("");
  if (r.errors.length) {
    lines.push(`--- Fehler (${r.errors.length}) ---`);
    r.errors.slice(0, 100).forEach((e) => lines.push(formatIssue(e)));
  }
  if (r.warnings.length) {
    lines.push("");
    lines.push(`--- Warnungen (${r.warnings.length}) ---`);
    r.warnings.slice(0, 100).forEach((e) => lines.push(formatIssue(e)));
  }
  lines.push("");
  lines.push(r.rollbackHint);
  return lines.join("\n");
}

export function formatReportCsv(r: ImportReport): string {
  const header = "row;severity;code;field;message";
  const rows = [...r.errors, ...r.warnings].map((e) =>
    [e.row, e.severity, e.code, e.field ?? "", `"${e.message.replace(/"/g, '""')}"`].join(";"),
  );
  return [header, ...rows].join("\n");
}

function formatIssue(e: ValidationError): string {
  return `  Zeile ${e.row}${e.field ? ` · ${e.field}` : ""} — [${e.code}] ${e.message}`;
}

export function summarizeReport(r: ImportReport): {
  headline: string;
  tone: "success" | "warning" | "error";
} {
  if (r.failed === 0 && r.imported > 0) {
    return {
      headline: `Erfolgreich importiert: ${r.imported} Bewohner:innen.`,
      tone: "success",
    };
  }
  if (r.failed > 0 && r.imported > 0) {
    return {
      headline: `Teilweise erfolgreich: ${r.imported} importiert, ${r.failed} fehlgeschlagen.`,
      tone: "warning",
    };
  }
  return {
    headline: `Import fehlgeschlagen: ${r.failed} Fehler, keine Datensätze importiert.`,
    tone: "error",
  };
}
