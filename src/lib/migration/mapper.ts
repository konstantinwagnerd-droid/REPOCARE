/**
 * Feld-Mapper: wandelt rohe Quell-Datensätze in CareAI-Ziel-Struktur um.
 * Wendet Transformationen (Trim, Datumsformate, Pflegegrad-Int) an.
 */

import type {
  CareAITargetField,
  MappingRule,
  ParsedRecord,
  ValidationError,
} from "./types";

function parseGermanDate(s: string): string | null {
  // unterstützt: dd.mm.yyyy, dd/mm/yyyy, dd-mm-yyyy
  const m = s.trim().match(/^(\d{1,2})[.\/\-](\d{1,2})[.\/\-](\d{4})$/);
  if (!m) return null;
  const d = m[1].padStart(2, "0");
  const mo = m[2].padStart(2, "0");
  const y = m[3];
  return `${y}-${mo}-${d}`;
}

function parseIsoDate(s: string): string | null {
  const m = s.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
  return m ? `${m[1]}-${m[2]}-${m[3]}` : null;
}

function parseAnyDate(s: string): string | null {
  return parseIsoDate(s) ?? parseGermanDate(s);
}

function parseCareLevel(s: string): number | null {
  const n = parseInt(s.replace(/\D/g, ""), 10);
  if (Number.isNaN(n)) return null;
  if (n < 1 || n > 5) return null;
  return n;
}

function normalizeGender(s: string): "m" | "w" | "d" | null {
  const v = s.trim().toLowerCase();
  if (["m", "männlich", "maennlich", "male"].includes(v)) return "m";
  if (["w", "f", "weiblich", "female"].includes(v)) return "w";
  if (["d", "divers", "diverse"].includes(v)) return "d";
  return null;
}

export interface MapResult {
  mapped: Array<ParsedRecord & { mapped: Partial<Record<CareAITargetField, string | number | boolean | null>> }>;
  errors: ValidationError[];
}

export function applyMapping(records: ParsedRecord[], rules: MappingRule[]): MapResult {
  const errors: ValidationError[] = [];
  const mapped = records.map((rec) => {
    const out: Partial<Record<CareAITargetField, string | number | boolean | null>> = {};
    for (const rule of rules) {
      const raw = rec.raw[rule.sourceField];
      if (raw === undefined || raw === null || raw === "") {
        if (rule.required) {
          errors.push({
            row: rec.row,
            field: rule.targetField,
            severity: "error",
            code: "REQUIRED_MISSING",
            message: `Pflichtfeld "${rule.targetField}" fehlt (Quelle: "${rule.sourceField}").`,
          });
        }
        continue;
      }
      const s = String(raw).trim();
      switch (rule.transform) {
        case "uppercase":
          out[rule.targetField] = s.toUpperCase();
          break;
        case "lowercase":
          out[rule.targetField] = s.toLowerCase();
          break;
        case "trim":
          out[rule.targetField] = s;
          break;
        case "date-de": {
          const d = parseGermanDate(s);
          if (!d) {
            errors.push({
              row: rec.row,
              field: rule.targetField,
              severity: "error",
              code: "INVALID_DATE_DE",
              message: `Ungültiges Datum (DE): "${s}"`,
            });
          } else out[rule.targetField] = d;
          break;
        }
        case "date-iso": {
          const d = parseIsoDate(s);
          if (!d) {
            errors.push({
              row: rec.row,
              field: rule.targetField,
              severity: "error",
              code: "INVALID_DATE_ISO",
              message: `Ungültiges Datum (ISO): "${s}"`,
            });
          } else out[rule.targetField] = d;
          break;
        }
        case "care-level-int": {
          const cl = parseCareLevel(s);
          if (cl == null) {
            errors.push({
              row: rec.row,
              field: rule.targetField,
              severity: "error",
              code: "INVALID_CARE_LEVEL",
              message: `Pflegegrad muss zwischen 1 und 5 liegen: "${s}"`,
            });
          } else out[rule.targetField] = cl;
          break;
        }
        default: {
          // Heuristische Default-Transformation abhängig vom Zielfeld
          if (rule.targetField === "dateOfBirth" || rule.targetField === "admissionDate" || rule.targetField === "dischargeDate") {
            const d = parseAnyDate(s);
            if (!d) {
              errors.push({
                row: rec.row,
                field: rule.targetField,
                severity: "warning",
                code: "DATE_UNPARSED",
                message: `Datum konnte nicht geparst werden: "${s}"`,
              });
              out[rule.targetField] = s;
            } else out[rule.targetField] = d;
          } else if (rule.targetField === "careLevel") {
            const cl = parseCareLevel(s);
            if (cl == null) {
              errors.push({
                row: rec.row,
                field: rule.targetField,
                severity: "warning",
                code: "CARE_LEVEL_UNPARSED",
                message: `Pflegegrad konnte nicht geparst werden: "${s}"`,
              });
              out[rule.targetField] = s;
            } else out[rule.targetField] = cl;
          } else if (rule.targetField === "gender") {
            const g = normalizeGender(s);
            out[rule.targetField] = g ?? s;
          } else {
            out[rule.targetField] = s;
          }
        }
      }
    }
    return { ...rec, mapped: out };
  });
  return { mapped, errors };
}

/** Erzeugt Auto-Mapping-Vorschläge durch Fuzzy-Matching zwischen Quell- und Ziel-Feldnamen. */
export function suggestMapping(
  sourceFields: string[],
  defaultMap: Array<{ source: string; target: string }>,
): MappingRule[] {
  const rules: MappingRule[] = [];
  for (const entry of defaultMap) {
    const match = sourceFields.find(
      (f) => f.toLowerCase().trim() === entry.source.toLowerCase().trim()
    ) ?? sourceFields.find(
      (f) => f.toLowerCase().replace(/[^a-z0-9]/g, "")
        === entry.source.toLowerCase().replace(/[^a-z0-9]/g, "")
    );
    if (match) {
      rules.push({
        sourceField: match,
        targetField: entry.target as CareAITargetField,
        required: entry.target === "lastName" || entry.target === "firstName",
      });
    }
  }
  return rules;
}
