"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Trash2, Download } from "lucide-react";
import { useRouter } from "next/navigation";

type SavedReport = {
  id: string;
  name: string;
  description: string | null;
  entity: string;
  entityLabel: string;
  filtersJson: unknown;
  columnsJson: unknown;
  sortJson: unknown;
  limitRows: number | null;
  createdAt: string;
};

export function SavedReportsClient({ initial }: { initial: SavedReport[] }) {
  const [reports, setReports] = useState<SavedReport[]>(initial);
  const [running, setRunning] = useState<string | null>(null);
  const [result, setResult] = useState<{ reportId: string; rows: Record<string, unknown>[]; columns: string[] } | null>(null);
  const router = useRouter();

  async function run(r: SavedReport) {
    setRunning(r.id);
    const res = await fetch("/api/reports/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        entity: r.entity,
        filters: r.filtersJson ?? [],
        columns: r.columnsJson ?? [],
        sort: r.sortJson ?? undefined,
        limit: r.limitRows ?? 100,
      }),
    });
    const json = (await res.json()) as { rows: Record<string, unknown>[]; columns: string[] };
    setRunning(null);
    setResult({ reportId: r.id, rows: json.rows ?? [], columns: json.columns ?? [] });
  }

  async function remove(id: string) {
    if (!confirm("Report wirklich löschen?")) return;
    const res = await fetch(`/api/reports/saved?id=${id}`, { method: "DELETE" });
    if (res.ok) {
      setReports((s) => s.filter((r) => r.id !== id));
      router.refresh();
    }
  }

  function exportCsv() {
    if (!result) return;
    const escape = (v: unknown) => {
      const s = v === null || v === undefined ? "" : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const header = result.columns.join(",");
    const body = result.rows.map((r) => result.columns.map((c) => escape(r[c])).join(",")).join("\n");
    const blob = new Blob([header + "\n" + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `saved-report-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-3">
      {reports.map((r) => (
        <Card key={r.id}>
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <div className="font-semibold">{r.name}</div>
              {r.description && <div className="text-sm text-muted-foreground">{r.description}</div>}
              <div className="mt-1 text-xs text-muted-foreground">
                Entität: {r.entityLabel} · {Array.isArray(r.filtersJson) ? (r.filtersJson as unknown[]).length : 0} Filter
                · erstellt {new Date(r.createdAt).toLocaleDateString("de-DE")}
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={() => run(r)} disabled={running === r.id}>
                <Play className="mr-1 h-4 w-4" /> {running === r.id ? "…" : "Ausführen"}
              </Button>
              <Button variant="ghost" size="icon" onClick={() => remove(r.id)} aria-label="löschen">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
          {result && result.reportId === r.id && (
            <CardContent className="border-t border-border">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{result.rows.length} Zeilen</span>
                <Button variant="outline" size="sm" onClick={exportCsv}>
                  <Download className="mr-1 h-4 w-4" /> CSV
                </Button>
              </div>
              <div className="overflow-auto rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/60">
                    <tr>
                      {result.columns.map((c) => (
                        <th key={c} className="px-3 py-2 text-left font-semibold">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.slice(0, 100).map((row, i) => (
                      <tr key={i} className="border-t border-border">
                        {result.columns.map((c) => (
                          <td key={c} className="px-3 py-2">
                            {formatCell(row[c])}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          )}
        </Card>
      ))}
    </div>
  );
}

function formatCell(v: unknown): string {
  if (v === null || v === undefined) return "—";
  if (v instanceof Date) return v.toLocaleString("de-DE");
  if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}T/.test(v)) return new Date(v).toLocaleString("de-DE");
  return String(v);
}
