export type Severity = "critical" | "serious" | "moderate" | "minor";

export interface A11yRule {
  id: string;
  wcag: string; // e.g. "1.1.1"
  level: "A" | "AA" | "AAA";
  title: string;
  description: string;
  severity: Severity;
  /** Return array of violation snippets found in the source. */
  check: (source: string, file: string) => RuleMatch[];
}

export interface RuleMatch {
  line: number;
  snippet: string;
  message: string;
}

export interface Violation {
  ruleId: string;
  wcag: string;
  level: "A" | "AA" | "AAA";
  severity: Severity;
  title: string;
  file: string;
  line: number;
  snippet: string;
  message: string;
  recommendation: string;
  fixEffort: "trivial" | "low" | "medium" | "high";
}

export interface AuditResult {
  timestamp: string;
  filesScanned: number;
  rulesEvaluated: number;
  violations: Violation[];
  summary: {
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
    total: number;
    passRate: number; // files with zero violations / total
  };
  durationMs: number;
}
