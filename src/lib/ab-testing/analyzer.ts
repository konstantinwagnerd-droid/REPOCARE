import { abStore } from "./store";
import type { Experiment, ExperimentResult, VariantStats } from "./types";

/** Normal distribution CDF approximation (Abramowitz & Stegun 26.2.17). */
function normCdf(z: number): number {
  const sign = z < 0 ? -1 : 1;
  const x = Math.abs(z);
  // constants
  const b1 = 0.319381530;
  const b2 = -0.356563782;
  const b3 = 1.781477937;
  const b4 = -1.821255978;
  const b5 = 1.330274429;
  const p = 0.2316419;
  const t = 1 / (1 + p * x);
  const pdf = Math.exp((-x * x) / 2) / Math.sqrt(2 * Math.PI);
  const y = 1 - pdf * (b1 * t + b2 * t ** 2 + b3 * t ** 3 + b4 * t ** 4 + b5 * t ** 5);
  return 0.5 * (1 + sign * (2 * y - 1));
}

/** Wilson score interval for binary proportion (95% default) */
function wilson(successes: number, trials: number, z = 1.96): [number, number] {
  if (trials === 0) return [0, 0];
  const p = successes / trials;
  const denom = 1 + (z * z) / trials;
  const center = p + (z * z) / (2 * trials);
  const margin = z * Math.sqrt((p * (1 - p) + (z * z) / (4 * trials)) / trials);
  return [(center - margin) / denom, (center + margin) / denom];
}

/**
 * Two-proportion z-test. Returns two-sided p-value.
 * Compares two variants' conversion rates.
 */
function zTestTwoProportion(c1: number, n1: number, c2: number, n2: number): number {
  if (n1 === 0 || n2 === 0) return 1;
  const p1 = c1 / n1;
  const p2 = c2 / n2;
  const pPool = (c1 + c2) / (n1 + n2);
  const se = Math.sqrt(pPool * (1 - pPool) * (1 / n1 + 1 / n2));
  if (se === 0) return 1;
  const z = (p1 - p2) / se;
  // two-sided
  return 2 * (1 - normCdf(Math.abs(z)));
}

/**
 * Chi-squared test (2xk contingency) for experiments with >2 variants.
 * Returns p-value; uses Welch-Satterthwaite approximation of the gamma function.
 */
function chiSquaredP(chi: number, df: number): number {
  if (chi <= 0 || df <= 0) return 1;
  // Wilson–Hilferty approximation
  const t = Math.pow(chi / df, 1 / 3);
  const mean = 1 - 2 / (9 * df);
  const stddev = Math.sqrt(2 / (9 * df));
  return 1 - normCdf((t - mean) / stddev);
}

/** Analyze binary metric across multiple variants */
function analyzeBinary(exp: Experiment, metricId: string): ExperimentResult {
  const variantStats: VariantStats[] = exp.variants.map((v) => {
    const impressions = abStore.getImpressions(exp.id, v.id);
    const conversions = abStore.getConversions(exp.id, v.id, metricId).length;
    const rate = impressions > 0 ? conversions / impressions : 0;
    const [ciLower, ciUpper] = wilson(conversions, impressions);
    return { variantId: v.id, variantName: v.name, impressions, conversions, conversionRate: rate, ciLower, ciUpper };
  });

  const sampleSizeReached = variantStats.every((s) => s.impressions >= exp.minSampleSize);

  let pValue: number | null = null;
  let leadingVariantId: string | null = null;
  let significant = false;

  if (variantStats.length === 2 && variantStats.every((s) => s.impressions > 0)) {
    pValue = zTestTwoProportion(variantStats[0].conversions, variantStats[0].impressions, variantStats[1].conversions, variantStats[1].impressions);
  } else if (variantStats.length > 2) {
    // Chi-squared 2×k
    const rowTotals = [variantStats.map((s) => s.conversions).reduce((a, b) => a + b, 0), variantStats.map((s) => s.impressions - s.conversions).reduce((a, b) => a + b, 0)];
    const colTotals = variantStats.map((s) => s.impressions);
    const grand = rowTotals[0] + rowTotals[1];
    if (grand > 0) {
      let chi = 0;
      for (let j = 0; j < variantStats.length; j++) {
        for (let i = 0; i < 2; i++) {
          const observed = i === 0 ? variantStats[j].conversions : variantStats[j].impressions - variantStats[j].conversions;
          const expected = (rowTotals[i] * colTotals[j]) / grand;
          if (expected > 0) chi += ((observed - expected) ** 2) / expected;
        }
      }
      pValue = chiSquaredP(chi, variantStats.length - 1);
    }
  }

  if (pValue !== null && pValue < 0.05 && sampleSizeReached) {
    significant = true;
    leadingVariantId = [...variantStats].sort((a, b) => b.conversionRate - a.conversionRate)[0]?.variantId ?? null;
  }

  return {
    experimentId: exp.id,
    experimentName: exp.name,
    status: exp.status,
    metricId,
    variants: variantStats,
    pValue,
    significant,
    leadingVariantId,
    sampleSizeReached,
    generatedAt: new Date().toISOString(),
  };
}

/** Public API: analyze a metric for an experiment */
export function analyzeExperiment(expId: string, metricId?: string): ExperimentResult | null {
  const exp = abStore.getById(expId);
  if (!exp) return null;
  const metric = metricId ? exp.metrics.find((m) => m.id === metricId) : exp.metrics[0];
  if (!metric) return null;
  // For now treat continuous same as binary (only impression/conversion counts)
  return analyzeBinary(exp, metric.id);
}
