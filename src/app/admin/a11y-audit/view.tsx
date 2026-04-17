"use client";
import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AuditResult, Severity } from "@/lib/a11y-audit/types";
import { Download, FileJson, Gauge } from "lucide-react";

const SEV_COLOR: Record<Severity, string> = {
  critical: "bg-red-100 text-red-800 border-red-200",
  serious: "bg-orange-100 text-orange-800 border-orange-200",
  moderate: "bg-yellow-100 text-yellow-800 border-yellow-200",
  minor: "bg-slate-100 text-slate-700 border-slate-200",
};

export function A11yAuditView({ initialResult }: { initialResult: AuditResult }) {
  const [result] = useState<AuditResult>(initialResult);
  const [filter, setFilter] = useState("");
  const [sev, setSev] = useState<Severity | "all">("all");

  const filtered = useMemo(() => {
    return result.violations.filter((v) =>
      (sev === "all" || v.severity === sev) &&
      (filter === "" || v.file.includes(filter) || v.ruleId.includes(filter) || v.message.toLowerCase().includes(filter.toLowerCase()))
    );
  }, [result, filter, sev]);

  const downloadJson = () => {
    const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `a11y-audit-${Date.now()}.json`; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-semibold">A11y Audit</h1>
          <p className="text-sm text-muted-foreground">WCAG 2.2 AA static analysis across React source — {result.filesScanned} files, {result.rulesEvaluated} rules, {result.durationMs} ms.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={downloadJson}><FileJson className="h-4 w-4 mr-2" />Export JSON</Button>
          <Button variant="outline" asChild><a href="/api/a11y-audit/report.html" target="_blank" rel="noreferrer"><Download className="h-4 w-4 mr-2" />HTML report</a></Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card><CardContent className="p-4"><Gauge className="h-4 w-4 text-primary" /><p className="mt-2 text-xs text-muted-foreground">Pass rate</p><p className="text-2xl font-semibold">{(result.summary.passRate * 100).toFixed(0)}%</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Critical</p><p className="text-2xl font-semibold text-red-700">{result.summary.critical}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Serious</p><p className="text-2xl font-semibold text-orange-700">{result.summary.serious}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Moderate</p><p className="text-2xl font-semibold text-yellow-700">{result.summary.moderate}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-xs text-muted-foreground">Minor</p><p className="text-2xl font-semibold">{result.summary.minor}</p></CardContent></Card>
      </div>

      <Card><CardContent className="p-4">
        <div className="flex flex-wrap gap-2">
          <Input placeholder="Filter by file, rule, or message..." value={filter} onChange={(e) => setFilter(e.target.value)} className="max-w-sm" />
          {(["all", "critical", "serious", "moderate", "minor"] as const).map((s) => (
            <Button key={s} size="sm" variant={sev === s ? "default" : "outline"} onClick={() => setSev(s)}>{s}</Button>
          ))}
          <span className="ml-auto text-sm text-muted-foreground self-center">{filtered.length} of {result.violations.length}</span>
        </div>
      </CardContent></Card>

      <Card><CardContent className="p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50"><tr>
            <th className="p-3 text-left">Sev</th>
            <th className="p-3 text-left">Rule</th>
            <th className="p-3 text-left">File</th>
            <th className="p-3 text-left">Message</th>
            <th className="p-3 text-left">Fix</th>
          </tr></thead>
          <tbody>
            {filtered.slice(0, 300).map((v, i) => (
              <tr key={i} className="border-t">
                <td className="p-3"><span className={`inline-block rounded border px-2 py-0.5 text-xs ${SEV_COLOR[v.severity]}`}>{v.severity}</span></td>
                <td className="p-3"><code className="text-xs">{v.ruleId}</code><br /><span className="text-xs text-muted-foreground">WCAG {v.wcag} {v.level}</span></td>
                <td className="p-3"><code className="text-xs">{v.file}:{v.line}</code></td>
                <td className="p-3">{v.message}</td>
                <td className="p-3 text-xs text-muted-foreground">{v.fixEffort}<br /><span>{v.recommendation}</span></td>
              </tr>
            ))}
            {filtered.length === 0 && <tr><td colSpan={5} className="p-6 text-center text-muted-foreground">No violations match the filter.</td></tr>}
          </tbody>
        </table>
      </CardContent></Card>

      <p className="text-xs text-muted-foreground">Static analysis has a ~15% false-positive rate on heuristic rules (contrast, touch targets). Combine with dynamic axe-core via Playwright for full coverage. See <code>docs/A11Y-AUDIT.md</code>.</p>
    </div>
  );
}
