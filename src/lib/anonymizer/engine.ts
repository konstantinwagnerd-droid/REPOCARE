// Anonymizer-Engine: applies strategies sequentially.

import type { AnonymizationResult, AnonymizedRecord, StrategyConfig } from "./types";
import { applyStrategy } from "./strategies";
import { assessRisk } from "./validator";

export function anonymize(
  rows: AnonymizedRecord[],
  source: "bewohner" | "berichte" | "audit-log",
  strategies: StrategyConfig[],
): AnonymizationResult {
  const original = rows.map((r) => ({ ...r }));
  let working = rows.map((r) => ({ ...r }));
  for (const s of strategies) working = applyStrategy(working, s);
  const result: AnonymizationResult = {
    source,
    generatedAt: new Date().toISOString(),
    rules: strategies.filter((s) => s.enabled),
    rows: original.map((o, i) => ({ original: o, anonymized: working[i] ?? {} })),
    riskScore: assessRisk(working),
  };
  return result;
}
