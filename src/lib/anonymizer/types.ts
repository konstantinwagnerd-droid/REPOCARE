// Test-Data-Anonymizer — Typen.
// Strategien-System fuer DSGVO-konforme Pseudonymisierung von Echtdaten.

export type StrategyId =
  | "pseudonymize-names"
  | "shift-dates"
  | "generalize-age"
  | "truncate-text"
  | "hash-ids"
  | "k-anonymity";

export interface StrategyConfig {
  id: StrategyId;
  enabled: boolean;
  // Strategie-spezifische Parameter (lose typisiert)
  params?: Record<string, string | number | boolean>;
}

export interface AnonymizerJob {
  source: "bewohner" | "berichte" | "audit-log";
  strategies: StrategyConfig[];
  inputCount: number;
}

export interface AnonymizedRecord {
  [key: string]: string | number | boolean | null | undefined;
}

export interface AnonymizationResult {
  source: "bewohner" | "berichte" | "audit-log";
  generatedAt: string;
  rules: StrategyConfig[];
  rows: { original: AnonymizedRecord; anonymized: AnonymizedRecord }[];
  riskScore: RiskAssessment;
}

export interface RiskAssessment {
  kAnonymity: number;       // realisierte minimum k
  uniqueQuasiIdentifiers: number;
  totalRows: number;
  level: "niedrig" | "mittel" | "hoch";
  hinweise: string[];
}
