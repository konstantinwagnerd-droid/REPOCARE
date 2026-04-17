// Erzeugt anonymisierten Export als JSON oder CSV.

import type { AnonymizationResult, AnonymizedRecord } from "./types";

export function exportAsJson(result: AnonymizationResult): Blob {
  const payload = {
    meta: {
      source: result.source,
      generatedAt: result.generatedAt,
      strategies: result.rules.map((r) => ({ id: r.id, params: r.params ?? {} })),
      riskScore: result.riskScore,
    },
    rows: result.rows.map((r) => r.anonymized),
  };
  return new Blob([JSON.stringify(payload, null, 2)], { type: "application/json;charset=utf-8" });
}

export function exportAsCsv(result: AnonymizationResult): Blob {
  if (result.rows.length === 0) return new Blob([""], { type: "text/csv;charset=utf-8" });
  const allKeys = new Set<string>();
  for (const r of result.rows) for (const k of Object.keys(r.anonymized)) allKeys.add(k);
  const headers = Array.from(allKeys);
  const escape = (v: AnonymizedRecord[string]) => {
    const s = v == null ? "" : String(v);
    return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [headers.join(";"), ...result.rows.map((r) => headers.map((h) => escape(r.anonymized[h])).join(";"))];
  return new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
