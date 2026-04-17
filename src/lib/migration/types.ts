/**
 * Migration-Typen für Import aus Fremd-Systemen (Medifox, DAN, Vivendi, SenSo, CSV).
 * Zentrale Typ-Definitionen — ohne Drizzle-Kopplung.
 */

export type MigrationSource =
  | "medifox"
  | "dan"
  | "vivendi"
  | "senso"
  | "csv-generic";

export type ConflictStrategy = "skip" | "overwrite" | "merge";

export type FieldType =
  | "string"
  | "date"
  | "number"
  | "gender"
  | "care-level"
  | "bool";

export interface MappingRule {
  /** Feld im Quell-System (z. B. "Nachname", "Pflegestufe") */
  sourceField: string;
  /** Ziel-Feld in CareAI (z. B. "lastName", "careLevel") */
  targetField: CareAITargetField;
  /** Optionaler Transformations-Hinweis */
  transform?: "uppercase" | "lowercase" | "trim" | "date-de" | "date-iso" | "care-level-int";
  /** Pflichtfeld? */
  required?: boolean;
}

export type CareAITargetField =
  | "firstName"
  | "lastName"
  | "dateOfBirth"
  | "gender"
  | "careLevel"
  | "room"
  | "admissionDate"
  | "dischargeDate"
  | "insuranceNumber"
  | "diagnosis"
  | "allergies"
  | "medication"
  | "emergencyContact"
  | "emergencyPhone"
  | "legalGuardian"
  | "notes";

export interface MappingPreset {
  id: string;
  name: string;
  source: MigrationSource;
  rules: MappingRule[];
  createdAt: string;
  updatedAt: string;
}

export type ValidationSeverity = "error" | "warning" | "info";

export interface ValidationError {
  row: number;
  field?: string;
  severity: ValidationSeverity;
  code: string;
  message: string;
}

export interface ParsedRecord {
  /** Roh-Daten aus der Quelle */
  raw: Record<string, string | number | null | undefined>;
  /** Gemappte Daten in CareAI-Struktur (nach Anwendung der MappingRules) */
  mapped?: Partial<Record<CareAITargetField, string | number | boolean | null>>;
  /** Zeilennummer im Quell-File (ab 1, Header = 0) */
  row: number;
}

export interface ParseResult {
  source: MigrationSource;
  totalRecords: number;
  detectedFields: string[];
  records: ParsedRecord[];
  parseErrors: ValidationError[];
}

export interface ValidationResult {
  ok: boolean;
  totalRecords: number;
  validRecords: number;
  errors: ValidationError[];
  warnings: ValidationError[];
  duplicates: Array<{ row: number; duplicateOf: number; key: string }>;
}

export interface ImportOptions {
  source: MigrationSource;
  rules: MappingRule[];
  conflictStrategy: ConflictStrategy;
  dryRun?: boolean;
  batchId?: string;
}

export interface ImportProgress {
  phase: "parsing" | "validating" | "importing" | "done" | "error";
  currentRow: number;
  totalRows: number;
  successCount: number;
  skipCount: number;
  errorCount: number;
  message?: string;
}

export interface ImportReport {
  batchId: string;
  source: MigrationSource;
  startedAt: string;
  finishedAt: string;
  durationMs: number;
  totalRecords: number;
  imported: number;
  skipped: number;
  failed: number;
  errors: ValidationError[];
  warnings: ValidationError[];
  rollbackHint: string;
}
