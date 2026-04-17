import { evaluateBenchmark, summarizeRun } from "./analyzer";
import { BUDGETS } from "./budgets";
import type { BaselineRun } from "./types";

export function toMarkdown(run: BaselineRun): string {
  const summary = summarizeRun(run);
  const lines: string[] = [];
  lines.push(`# Performance Baseline — ${run.id}`);
  lines.push(``);
  lines.push(`- **Timestamp:** ${run.timestamp}`);
  lines.push(`- **Mode:** ${run.mode}`);
  lines.push(`- **URLs measured:** ${run.benchmarks.length}`);
  lines.push(`- **Budget compliance:** ${(summary.compliance * 100).toFixed(1)}% (${summary.good} good / ${summary.needsImprovement} needs-improvement / ${summary.poor} poor)`);
  if (run.notes) lines.push(`- **Notes:** ${run.notes}`);
  lines.push(``);
  lines.push(`## Metric averages`);
  lines.push(``);
  lines.push(`| Metric | Avg | Min | Max |`);
  lines.push(`|--------|----:|----:|----:|`);
  for (const [name, stats] of Object.entries(summary.byMetric)) {
    const unit = name === "CLS" ? "" : " ms";
    lines.push(`| ${name} | ${stats.avg.toFixed(name === "CLS" ? 3 : 0)}${unit} | ${stats.min.toFixed(name === "CLS" ? 3 : 0)}${unit} | ${stats.max.toFixed(name === "CLS" ? 3 : 0)}${unit} |`);
  }
  lines.push(``);
  lines.push(`## Per-URL details`);
  lines.push(``);
  for (const b of run.benchmarks) {
    lines.push(`### ${b.route} (${b.routeType})`);
    lines.push(`URL: \`${b.url}\``);
    if (b.performanceScore !== undefined) lines.push(`Lighthouse score: ${(b.performanceScore * 100).toFixed(0)}`);
    lines.push(``);
    lines.push(`| Metric | Value | Budget | Status |`);
    lines.push(`|--------|------:|-------:|--------|`);
    for (const cmp of evaluateBenchmark(b)) {
      const badge = cmp.status === "good" ? "✅" : cmp.status === "needs-improvement" ? "⚠️" : "❌";
      const unit = cmp.metric === "CLS" ? "" : " ms";
      lines.push(`| ${cmp.metric} | ${cmp.value.toFixed(cmp.metric === "CLS" ? 3 : 0)}${unit} | ${cmp.budget}${unit} | ${badge} ${cmp.status} |`);
    }
    lines.push(``);
  }
  lines.push(`## Budgets in force`);
  lines.push(``);
  for (const [type, budget] of Object.entries(BUDGETS)) {
    lines.push(`### ${type}`);
    lines.push(`| Metric | Good | Needs-improvement |`);
    lines.push(`|--------|-----:|------------------:|`);
    for (const t of budget.thresholds) lines.push(`| ${t.metric} | ${t.good} | ${t.needsImprovement} |`);
    lines.push(``);
  }
  return lines.join("\n");
}
