/**
 * Press-Release-Generator — Typen und Schemas
 *
 * Vollständig typisierte Template-Definitionen mit Input-Schema,
 * damit die UI Felder dynamisch rendern kann und die API Inputs
 * zuverlässig validieren kann.
 */

export type TemplateId =
  | "milestone"
  | "funding"
  | "partner"
  | "product"
  | "event";

export type FieldType = "text" | "textarea" | "date" | "number" | "quote";

export interface TemplateField {
  /** Interner Key, wird im Render als {{key}} eingesetzt */
  key: string;
  /** Label für die UI */
  label: string;
  /** Feld-Typ für die UI-Darstellung */
  type: FieldType;
  /** Kurzer Hilfstext unter dem Feld */
  help?: string;
  /** Platzhalter-Beispiel */
  placeholder?: string;
  /** Pflichtfeld? */
  required?: boolean;
}

export interface Template {
  id: TemplateId;
  title: string;
  description: string;
  /** Standard-Headline-Vorlage */
  defaultHeadline: string;
  /** Alle Felder, die für dieses Template abgefragt werden */
  fields: TemplateField[];
  /** Markdown-Skeleton mit {{key}}-Platzhaltern */
  body: string;
}

export interface GenerateInput {
  templateId: TemplateId;
  values: Record<string, string>;
}

export interface QualityReport {
  wordCount: number;
  score: number; // 0-100
  checks: { id: string; label: string; pass: boolean; hint?: string }[];
}

export interface GenerateOutput {
  markdown: string;
  quality: QualityReport;
}
