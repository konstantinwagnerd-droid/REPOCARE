import fs from "node:fs";
import path from "node:path";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { summarizeRun, evaluateBenchmark } from "@/lib/performance-baseline/analyzer";
import type { BaselineRun } from "@/lib/performance-baseline/types";

export const dynamic = "force-dynamic";

function loadRuns(): BaselineRun[] {
  const dir = path.join(process.cwd(), "docs", "performance");
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((f) => f.startsWith("baseline-") && f.endsWith(".json"))
    .sort()
    .reverse()
    .slice(0, 10)
    .map((f) => JSON.parse(fs.readFileSync(path.join(dir, f), "utf8")) as BaselineRun);
}

export default async function PerformancePage() {
  const runs = loadRuns();
  const latest = runs[0];

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold">Performance Baseline</h1>
        <p className="text-sm text-muted-foreground">Core Web Vitals baselines vs. budgets. Run <code>node scripts/performance-baseline.mjs</code> to add a new baseline.</p>
      </div>

      {!latest && (
        <Card><CardContent className="p-6">
          <p>No baselines yet. Run:</p>
          <pre className="mt-2 rounded bg-muted p-3 text-sm"><code>node scripts/performance-baseline.mjs</code></pre>
        </CardContent></Card>
      )}

      {latest && (() => {
        const summary = summarizeRun(latest);
        return (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Compliance</p><p className="text-2xl font-semibold">{(summary.compliance * 100).toFixed(0)}%</p></CardContent></Card>
              <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Good</p><p className="text-2xl font-semibold text-green-700">{summary.good}</p></CardContent></Card>
              <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Needs-improvement</p><p className="text-2xl font-semibold text-yellow-700">{summary.needsImprovement}</p></CardContent></Card>
              <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Poor</p><p className="text-2xl font-semibold text-red-700">{summary.poor}</p></CardContent></Card>
            </div>

            <Card><CardContent className="p-0 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50"><tr>
                  <th className="p-3 text-left">Route</th><th className="p-3 text-left">Type</th>
                  <th className="p-3 text-right">LCP</th><th className="p-3 text-right">FCP</th>
                  <th className="p-3 text-right">CLS</th><th className="p-3 text-right">TBT</th>
                  <th className="p-3 text-right">TTI</th><th className="p-3 text-left">Status</th>
                </tr></thead>
                <tbody>
                  {latest.benchmarks.map((b) => {
                    const get = (n: string) => b.metrics.find((m) => m.name === n)?.value ?? 0;
                    const status = evaluateBenchmark(b);
                    const worst = status.some((s) => s.status === "poor") ? "poor" : status.some((s) => s.status === "needs-improvement") ? "warn" : "good";
                    return (
                      <tr key={b.url} className="border-t">
                        <td className="p-3"><code className="text-xs">{b.route}</code></td>
                        <td className="p-3"><Badge variant="outline">{b.routeType}</Badge></td>
                        <td className="p-3 text-right">{get("LCP").toFixed(0)} ms</td>
                        <td className="p-3 text-right">{get("FCP").toFixed(0)} ms</td>
                        <td className="p-3 text-right">{get("CLS").toFixed(3)}</td>
                        <td className="p-3 text-right">{get("TBT").toFixed(0)} ms</td>
                        <td className="p-3 text-right">{get("TTI").toFixed(0)} ms</td>
                        <td className="p-3"><span className={worst === "good" ? "text-green-700" : worst === "warn" ? "text-yellow-700" : "text-red-700"}>{worst === "good" ? "✅ On budget" : worst === "warn" ? "⚠️ Watch" : "❌ Over"}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent></Card>

            <Card><CardContent className="p-6">
              <h2 className="font-semibold">Recent runs</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {runs.map((r) => (
                  <li key={r.id} className="flex justify-between">
                    <span><code>{r.id}</code> <Badge variant="outline" className="ml-2">{r.mode}</Badge></span>
                    <span className="text-muted-foreground">{new Date(r.timestamp).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </CardContent></Card>
          </>
        );
      })()}
    </div>
  );
}
