import { abStore } from "./store";
import { analyzeExperiment } from "./analyzer";
import type { ExperimentResult } from "./types";

export interface ExperimentReport {
  experimentId: string;
  name: string;
  description?: string;
  status: string;
  startedAt?: string;
  completedAt?: string;
  winnerVariantId: string | null;
  results: ExperimentResult[];
  recommendation: string;
  generatedAt: string;
}

export function generateReport(expId: string): ExperimentReport | null {
  const exp = abStore.getById(expId);
  if (!exp) return null;
  const results = exp.metrics
    .map((m) => analyzeExperiment(expId, m.id))
    .filter((r): r is ExperimentResult => r !== null);

  const primary = results[0];
  let recommendation = "Not enough data yet — continue collecting impressions.";
  if (primary) {
    if (!primary.sampleSizeReached) recommendation = "Minimum sample size not reached. Keep running.";
    else if (!primary.significant) recommendation = "Results are not statistically significant at p < 0.05. Consider extending the experiment or accepting a null result.";
    else {
      const winner = primary.variants.find((v) => v.variantId === primary.leadingVariantId);
      recommendation = winner
        ? `Declare "${winner.variantName}" the winner (p=${primary.pValue?.toFixed(4)}, rate=${(winner.conversionRate * 100).toFixed(2)}%).`
        : "Significant result detected but winner could not be determined.";
    }
  }

  return {
    experimentId: exp.id,
    name: exp.name,
    description: exp.description,
    status: exp.status,
    startedAt: exp.startedAt,
    completedAt: exp.completedAt,
    winnerVariantId: exp.winnerVariantId,
    results,
    recommendation,
    generatedAt: new Date().toISOString(),
  };
}
