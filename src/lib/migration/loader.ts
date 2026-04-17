/**
 * Loader: simuliert den Import in die Bewohner:innen-DB.
 *
 * Hinweis: Dieser Loader ist bewusst DB-agnostisch — er nimmt ein optionales
 * Insert-Callback entgegen. In Produktion wird dieses Callback von
 * `src/db/...` (TABU für diesen Agent) bereitgestellt. Im Admin-UI läuft
 * der Loader im Dry-Run-Modus und liefert nur den Report zurück.
 *
 * So vermeiden wir eine Schema-Änderung, bleiben aber konsistent mit der
 * bestehenden Drizzle-Architektur.
 */

import type {
  CareAITargetField,
  ConflictStrategy,
  ImportOptions,
  ImportProgress,
  ImportReport,
  ParsedRecord,
  ValidationError,
} from "./types";

export interface LoaderDeps {
  /** Optional: bestehenden Bewohner per lastName+firstName+dob suchen. */
  findExisting?: (
    lastName: string,
    firstName: string,
    dob: string | null,
  ) => Promise<{ id: string } | null>;
  /** Optional: Bewohner einfügen. Bekommt `migrated_batch_id` im Payload mit. */
  insertResident?: (
    payload: Record<string, unknown>,
    batchId: string,
  ) => Promise<{ id: string }>;
  /** Optional: bestehenden Bewohner updaten (für ConflictStrategy "overwrite"/"merge"). */
  updateResident?: (
    id: string,
    payload: Record<string, unknown>,
    strategy: ConflictStrategy,
  ) => Promise<void>;
  /** Optional: Progress-Events senden (Server-Sent Events oder Polling-Feed). */
  onProgress?: (p: ImportProgress) => void;
}

type MappedRec = ParsedRecord & {
  mapped?: Partial<Record<CareAITargetField, string | number | boolean | null>>;
};

function generateBatchId(): string {
  return `mig_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function runImport(
  records: MappedRec[],
  opts: ImportOptions,
  deps: LoaderDeps = {},
): Promise<ImportReport> {
  const started = Date.now();
  const batchId = opts.batchId ?? generateBatchId();
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  let imported = 0;
  let skipped = 0;
  let failed = 0;

  const total = records.length;
  for (let i = 0; i < records.length; i++) {
    const rec = records[i];
    const m = rec.mapped ?? {};
    const payload: Record<string, unknown> = { ...m };

    deps.onProgress?.({
      phase: "importing",
      currentRow: i + 1,
      totalRows: total,
      successCount: imported,
      skipCount: skipped,
      errorCount: failed,
      message: `Zeile ${i + 1} von ${total}`,
    });

    if (!m.lastName) {
      failed++;
      errors.push({
        row: rec.row,
        severity: "error",
        code: "MISSING_LASTNAME",
        message: "Import übersprungen — kein Nachname.",
      });
      continue;
    }

    try {
      if (opts.dryRun || !deps.insertResident) {
        imported++;
        continue;
      }

      const existing = deps.findExisting
        ? await deps.findExisting(
            String(m.lastName),
            String(m.firstName ?? ""),
            (m.dateOfBirth as string) ?? null,
          )
        : null;

      if (existing) {
        if (opts.conflictStrategy === "skip") {
          skipped++;
          warnings.push({
            row: rec.row,
            severity: "info",
            code: "SKIPPED_DUP",
            message: `Übersprungen — existiert bereits (ID ${existing.id}).`,
          });
        } else if (deps.updateResident) {
          await deps.updateResident(existing.id, payload, opts.conflictStrategy);
          imported++;
        } else {
          skipped++;
        }
      } else {
        await deps.insertResident(payload, batchId);
        imported++;
      }
    } catch (err) {
      failed++;
      errors.push({
        row: rec.row,
        severity: "error",
        code: "INSERT_FAIL",
        message: `Fehler beim Einfügen: ${(err as Error).message}`,
      });
    }
  }

  const finished = Date.now();
  deps.onProgress?.({
    phase: "done",
    currentRow: total,
    totalRows: total,
    successCount: imported,
    skipCount: skipped,
    errorCount: failed,
  });

  return {
    batchId,
    source: opts.source,
    startedAt: new Date(started).toISOString(),
    finishedAt: new Date(finished).toISOString(),
    durationMs: finished - started,
    totalRecords: total,
    imported,
    skipped,
    failed,
    errors,
    warnings,
    rollbackHint:
      `Rollback: UPDATE residents SET deleted_at = NOW() WHERE migrated_batch_id = '${batchId}'. ` +
      `Die Batch-ID ist in jedem importierten Datensatz gespeichert.`,
  };
}
