/**
 * Validator: prüft gemappte Records auf Datenqualität.
 * — Pflichtfelder (Nachname minimum)
 * — Datumsformate (ISO nach Mapping)
 * — Pflegegrad-Range (1–5)
 * — Duplikate (Nachname+Vorname+GebDat)
 */

import type {
  CareAITargetField,
  ParsedRecord,
  ValidationError,
  ValidationResult,
} from "./types";

type MappedRec = ParsedRecord & {
  mapped?: Partial<Record<CareAITargetField, string | number | boolean | null>>;
};

export function validateRecords(records: MappedRec[]): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationError[] = [];
  const duplicates: Array<{ row: number; duplicateOf: number; key: string }> = [];
  const seen = new Map<string, number>();
  let validCount = 0;

  for (const rec of records) {
    const m = rec.mapped ?? {};
    let recordOk = true;

    // 1. Pflichtfeld: Nachname
    if (!m.lastName || String(m.lastName).trim() === "") {
      errors.push({
        row: rec.row,
        field: "lastName",
        severity: "error",
        code: "REQUIRED_LASTNAME",
        message: "Nachname ist Pflichtfeld und fehlt.",
      });
      recordOk = false;
    }

    // 2. Pflegegrad
    if (m.careLevel != null) {
      const cl = typeof m.careLevel === "number" ? m.careLevel : parseInt(String(m.careLevel), 10);
      if (Number.isNaN(cl) || cl < 1 || cl > 5) {
        errors.push({
          row: rec.row,
          field: "careLevel",
          severity: "error",
          code: "CARE_LEVEL_RANGE",
          message: `Pflegegrad "${m.careLevel}" liegt außerhalb 1–5.`,
        });
        recordOk = false;
      }
    }

    // 3. Datum-Prüfungen (ISO)
    const dateFields: CareAITargetField[] = ["dateOfBirth", "admissionDate", "dischargeDate"];
    for (const df of dateFields) {
      const v = m[df];
      if (v && !/^\d{4}-\d{2}-\d{2}/.test(String(v))) {
        warnings.push({
          row: rec.row,
          field: df,
          severity: "warning",
          code: "DATE_FORMAT",
          message: `Feld "${df}" ist kein ISO-Datum: "${v}"`,
        });
      }
    }

    // 4. Plausibilität Geburtsdatum (nicht in Zukunft, nicht vor 1900)
    if (m.dateOfBirth && typeof m.dateOfBirth === "string" && /^\d{4}-\d{2}-\d{2}/.test(m.dateOfBirth)) {
      const d = new Date(m.dateOfBirth);
      const now = new Date();
      if (d > now) {
        errors.push({
          row: rec.row,
          field: "dateOfBirth",
          severity: "error",
          code: "DATE_FUTURE",
          message: `Geburtsdatum in der Zukunft: ${m.dateOfBirth}`,
        });
        recordOk = false;
      } else if (d.getFullYear() < 1900) {
        warnings.push({
          row: rec.row,
          field: "dateOfBirth",
          severity: "warning",
          code: "DATE_TOO_OLD",
          message: `Geburtsdatum vor 1900: ${m.dateOfBirth}`,
        });
      }
    }

    // 5. Duplikat-Erkennung
    const dupKey = `${String(m.lastName ?? "").toLowerCase().trim()}|${String(m.firstName ?? "").toLowerCase().trim()}|${String(m.dateOfBirth ?? "").trim()}`;
    if (dupKey !== "||" && seen.has(dupKey)) {
      duplicates.push({ row: rec.row, duplicateOf: seen.get(dupKey)!, key: dupKey });
      warnings.push({
        row: rec.row,
        severity: "warning",
        code: "DUPLICATE",
        message: `Möglicher Duplikat von Zeile ${seen.get(dupKey)}.`,
      });
    } else if (dupKey !== "||") {
      seen.set(dupKey, rec.row);
    }

    if (recordOk) validCount++;
  }

  return {
    ok: errors.length === 0,
    totalRecords: records.length,
    validRecords: validCount,
    errors,
    warnings,
    duplicates,
  };
}
