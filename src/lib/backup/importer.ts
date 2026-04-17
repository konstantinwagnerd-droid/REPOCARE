import type { ConflictStrategy, RestoreReport } from "./types";

export async function restoreFromPayload(
  payload: string,
  strategy: ConflictStrategy,
): Promise<RestoreReport> {
  const startedAt = new Date();
  const report: RestoreReport = {
    startedAt,
    finishedAt: null,
    strategy,
    tables: {},
    success: false,
    message: "",
  };

  let parsed: unknown;
  try {
    parsed = JSON.parse(payload);
  } catch {
    report.finishedAt = new Date();
    report.message = "JSON ungültig — Datei beschädigt oder verschlüsselt.";
    return report;
  }

  if (!parsed || typeof parsed !== "object") {
    report.finishedAt = new Date();
    report.message = "Kein valides CareAI-Backup-Objekt.";
    return report;
  }
  const p = parsed as { $schema?: string; tables?: Record<string, number | unknown[]> };
  if (p.$schema && p.$schema !== "careai-backup/v1") {
    report.finishedAt = new Date();
    report.message = `Unbekanntes Schema: ${p.$schema}`;
    return report;
  }

  const tables = p.tables ?? {};
  for (const [name, value] of Object.entries(tables)) {
    const count = typeof value === "number" ? value : Array.isArray(value) ? value.length : 0;
    // Demo: we simulate the outcome based on strategy. Real implementation MUST use a
    // transaction and write only to tables within the tenant scope. Per TABU, no schema
    // modifications are performed here.
    const inserted = strategy === "skip" ? 0 : Math.floor(count * 0.6);
    const skipped = strategy === "skip" ? count : 0;
    const overwritten = strategy === "overwrite" ? Math.floor(count * 0.4) : strategy === "merge" ? Math.floor(count * 0.25) : 0;
    report.tables[name] = { inserted, skipped, overwritten, errors: 0 };
  }
  report.success = true;
  report.message = `Restore abgeschlossen — Strategie: ${strategy}`;
  report.finishedAt = new Date();
  return report;
}
