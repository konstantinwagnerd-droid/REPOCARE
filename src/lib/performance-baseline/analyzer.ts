import { BUDGETS } from "./budgets";
import type { BaselineRun, Benchmark, BudgetCompliance, MetricName } from "./types";

export function evaluateBenchmark(b: Benchmark): BudgetCompliance[] {
  const budget = BUDGETS[b.routeType];
  const out: BudgetCompliance[] = [];
  for (const m of b.metrics) {
    const threshold = budget.thresholds.find((t) => t.metric === m.name);
    if (!threshold) continue;
    let status: BudgetCompliance["status"];
    if (m.value <= threshold.good) status = "good";
    else if (m.value <= threshold.needsImprovement) status = "needs-improvement";
    else status = "poor";
    out.push({ url: b.url, metric: m.name, value: m.value, status, budget: threshold.good });
  }
  return out;
}

export function summarizeRun(run: BaselineRun): {
  total: number;
  good: number;
  needsImprovement: number;
  poor: number;
  compliance: number;
  byMetric: Record<string, { avg: number; min: number; max: number }>;
} {
  const all = run.benchmarks.flatMap(evaluateBenchmark);
  const total = all.length;
  const good = all.filter((a) => a.status === "good").length;
  const needsImprovement = all.filter((a) => a.status === "needs-improvement").length;
  const poor = all.filter((a) => a.status === "poor").length;
  const byMetric: Record<string, { avg: number; min: number; max: number }> = {};
  const metricNames = new Set(run.benchmarks.flatMap((b) => b.metrics.map((m) => m.name)));
  for (const name of metricNames) {
    const values = run.benchmarks.flatMap((b) => b.metrics.filter((m) => m.name === name).map((m) => m.value));
    if (values.length === 0) continue;
    byMetric[name] = {
      avg: values.reduce((a, b) => a + b, 0) / values.length,
      min: Math.min(...values),
      max: Math.max(...values),
    };
  }
  return { total, good, needsImprovement, poor, compliance: total ? good / total : 1, byMetric };
}

export function compareRuns(current: BaselineRun, previous: BaselineRun): {
  regressions: Array<{ url: string; metric: MetricName; delta: number; before: number; after: number }>;
  improvements: Array<{ url: string; metric: MetricName; delta: number; before: number; after: number }>;
} {
  const regressions: ReturnType<typeof compareRuns>["regressions"] = [];
  const improvements: ReturnType<typeof compareRuns>["improvements"] = [];
  for (const bCur of current.benchmarks) {
    const bPrev = previous.benchmarks.find((p) => p.url === bCur.url);
    if (!bPrev) continue;
    for (const mCur of bCur.metrics) {
      const mPrev = bPrev.metrics.find((m) => m.name === mCur.name);
      if (!mPrev) continue;
      const delta = mCur.value - mPrev.value;
      const higherIsBad = mCur.name !== "TTFB" ? true : true; // all current metrics: lower is better
      if (Math.abs(delta) < 1) continue;
      const entry = { url: bCur.url, metric: mCur.name, delta, before: mPrev.value, after: mCur.value };
      if ((higherIsBad && delta > 0) || (!higherIsBad && delta < 0)) regressions.push(entry);
      else improvements.push(entry);
    }
  }
  return { regressions, improvements };
}
