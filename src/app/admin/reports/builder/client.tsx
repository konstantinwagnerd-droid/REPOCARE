"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { EntityKey, FieldDef, Filter, Operator, QuerySpec } from "@/lib/reports/query-builder";
import { Plus, Play, Save, Trash2, Download } from "lucide-react";

type EntityOpt = { key: EntityKey; label: string; fields: FieldDef[] };

const OPERATORS: { value: Operator; label: string }[] = [
  { value: "=", label: "=" },
  { value: "!=", label: "≠" },
  { value: ">", label: ">" },
  { value: "<", label: "<" },
  { value: ">=", label: "≥" },
  { value: "<=", label: "≤" },
  { value: "contains", label: "enthält" },
  { value: "in", label: "ist in Liste" },
  { value: "is_null", label: "ist leer" },
  { value: "is_not_null", label: "ist nicht leer" },
];

export function BuilderClient({ entities }: { entities: EntityOpt[] }) {
  const [entity, setEntity] = useState<EntityKey>(entities[0].key);
  const currentEntity = entities.find((e) => e.key === entity)!;
  const [filters, setFilters] = useState<Filter[]>([]);
  const [columns, setColumns] = useState<string[]>(currentEntity.fields.slice(0, 5).map((f) => f.key));
  const [sortField, setSortField] = useState<string>("");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [limitRows, setLimitRows] = useState(100);
  const [reportName, setReportName] = useState("");
  const [preview, setPreview] = useState<{ rows: Record<string, unknown>[]; columns: string[] } | null>(null);
  const [running, setRunning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  function switchEntity(key: EntityKey) {
    setEntity(key);
    const newEnt = entities.find((e) => e.key === key)!;
    setFilters([]);
    setColumns(newEnt.fields.slice(0, 5).map((f) => f.key));
    setSortField("");
    setPreview(null);
  }

  function addFilter() {
    setFilters((s) => [...s, { field: currentEntity.fields[0].key, op: "=", value: "", logic: "AND" }]);
  }

  function buildSpec(): QuerySpec {
    return {
      entity,
      filters: filters.map((f) => ({
        ...f,
        value: f.op === "in" && typeof f.value === "string" ? f.value.split(",").map((s) => s.trim()) : f.value,
      })),
      columns,
      sort: sortField ? { field: sortField, dir: sortDir } : undefined,
      limit: limitRows,
    };
  }

  async function run() {
    setRunning(true);
    setMsg("");
    try {
      const res = await fetch("/api/reports/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(buildSpec()),
      });
      const json = (await res.json()) as { rows?: Record<string, unknown>[]; columns?: string[]; error?: string };
      if (!res.ok) throw new Error(json.error ?? "Query fehlgeschlagen");
      setPreview({ rows: json.rows ?? [], columns: json.columns ?? [] });
      setMsg(`${json.rows?.length ?? 0} Zeilen geladen.`);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : String(e));
      setPreview(null);
    }
    setRunning(false);
  }

  async function save() {
    if (!reportName.trim()) {
      setMsg("Bitte Namen vergeben.");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/reports/saved", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: reportName, spec: buildSpec() }),
    });
    setSaving(false);
    if (res.ok) {
      setMsg(`Report "${reportName}" gespeichert.`);
    } else {
      setMsg("Speichern fehlgeschlagen.");
    }
  }

  function exportCsv() {
    if (!preview) return;
    const header = preview.columns.join(",");
    const escape = (v: unknown) => {
      const s = v === null || v === undefined ? "" : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const body = preview.rows.map((r) => preview.columns.map((c) => escape(r[c])).join(",")).join("\n");
    const blob = new Blob([header + "\n" + body], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report-${entity}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportJson() {
    if (!preview) return;
    const blob = new Blob([JSON.stringify(preview.rows, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `report-${entity}-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><CardTitle>1. Welche Entität?</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {entities.map((e) => (
              <button
                key={e.key}
                onClick={() => switchEntity(e.key)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  entity === e.key
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:bg-muted"
                }`}
              >
                {e.label}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>2. Filter</CardTitle></CardHeader>
        <CardContent>
          {filters.length === 0 && (
            <p className="mb-3 text-sm text-muted-foreground">Keine Filter — alle Datensätze werden geladen.</p>
          )}
          <div className="space-y-2">
            {filters.map((f, i) => {
              const field = currentEntity.fields.find((x) => x.key === f.field);
              return (
                <div key={i} className="grid gap-2 md:grid-cols-[60px_1.3fr_1fr_1.6fr_auto]">
                  {i > 0 ? (
                    <select
                      value={f.logic ?? "AND"}
                      onChange={(e) => setFilters((s) => s.map((x, j) => (j === i ? { ...x, logic: e.target.value as "AND" | "OR" } : x)))}
                      className="h-10 rounded-md border border-input bg-background px-2 text-xs font-semibold"
                    >
                      <option>AND</option>
                      <option>OR</option>
                    </select>
                  ) : (
                    <div className="flex h-10 items-center px-2 text-xs text-muted-foreground">WHERE</div>
                  )}
                  <select
                    value={f.field}
                    onChange={(e) => setFilters((s) => s.map((x, j) => (j === i ? { ...x, field: e.target.value } : x)))}
                    className="h-10 rounded-md border border-input bg-background px-2 text-sm"
                  >
                    {currentEntity.fields.map((fld) => (
                      <option key={fld.key} value={fld.key}>
                        {fld.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={f.op}
                    onChange={(e) => setFilters((s) => s.map((x, j) => (j === i ? { ...x, op: e.target.value as Operator } : x)))}
                    className="h-10 rounded-md border border-input bg-background px-2 text-sm"
                  >
                    {OPERATORS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </select>
                  {f.op !== "is_null" && f.op !== "is_not_null" ? (
                    field?.type === "enum" && field.enumValues ? (
                      <select
                        value={typeof f.value === "string" ? f.value : ""}
                        onChange={(e) => setFilters((s) => s.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))}
                        className="h-10 rounded-md border border-input bg-background px-2 text-sm"
                      >
                        <option value="">—</option>
                        {field.enumValues.map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        type={field?.type === "number" ? "number" : field?.type === "date" ? "date" : "text"}
                        value={typeof f.value === "string" || typeof f.value === "number" ? String(f.value) : ""}
                        onChange={(e) => setFilters((s) => s.map((x, j) => (j === i ? { ...x, value: e.target.value } : x)))}
                        placeholder={f.op === "in" ? "Werte durch Komma getrennt" : "Wert"}
                      />
                    )
                  ) : (
                    <div />
                  )}
                  <Button variant="ghost" size="icon" onClick={() => setFilters((s) => s.filter((_, j) => j !== i))}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
          <Button variant="outline" size="sm" onClick={addFilter} className="mt-3">
            <Plus className="mr-1 h-4 w-4" /> Filter hinzufügen
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>3. Spalten</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-3">
            {currentEntity.fields.map((f) => (
              <label key={f.key} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={columns.includes(f.key)}
                  onChange={(e) =>
                    setColumns((s) => (e.target.checked ? [...s, f.key] : s.filter((k) => k !== f.key)))
                  }
                />
                {f.label} <span className="text-xs text-muted-foreground">({f.type})</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>4. Sortierung & Limit</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <Label>Sortieren nach</Label>
              <select
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">— ohne —</option>
                {currentEntity.fields.map((f) => (
                  <option key={f.key} value={f.key}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label>Richtung</Label>
              <select
                value={sortDir}
                onChange={(e) => setSortDir(e.target.value as "asc" | "desc")}
                className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="desc">absteigend</option>
                <option value="asc">aufsteigend</option>
              </select>
            </div>
            <div>
              <Label>Max Zeilen (1–1000)</Label>
              <Input type="number" min={1} max={1000} value={limitRows} onChange={(e) => setLimitRows(Number(e.target.value))} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>5. Vorschau & Speichern</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={run} disabled={running}>
              <Play className="mr-2 h-4 w-4" /> {running ? "Lade…" : "Ausführen"}
            </Button>
            <Input
              placeholder="Report-Name (zum Speichern)"
              value={reportName}
              onChange={(e) => setReportName(e.target.value)}
              className="max-w-xs"
            />
            <Button variant="outline" onClick={save} disabled={saving || !reportName.trim()}>
              <Save className="mr-2 h-4 w-4" /> Speichern
            </Button>
            {preview && (
              <>
                <Button variant="outline" onClick={exportCsv}>
                  <Download className="mr-2 h-4 w-4" /> CSV
                </Button>
                <Button variant="outline" onClick={exportJson}>
                  <Download className="mr-2 h-4 w-4" /> JSON
                </Button>
              </>
            )}
            {msg && <span className="text-sm text-muted-foreground">{msg}</span>}
          </div>

          {preview && preview.rows.length > 0 && (
            <div className="mt-4 overflow-auto rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="bg-muted/60">
                  <tr>
                    {preview.columns.map((c) => (
                      <th key={c} className="px-3 py-2 text-left font-semibold">
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.rows.slice(0, 100).map((r, i) => (
                    <tr key={i} className="border-t border-border">
                      {preview.columns.map((c) => (
                        <td key={c} className="px-3 py-2">
                          {formatCell(r[c])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {preview && preview.rows.length === 0 && (
            <div className="mt-4 rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
              Keine Treffer — Filter anpassen.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function formatCell(v: unknown): string {
  if (v === null || v === undefined) return "—";
  if (v instanceof Date) return v.toLocaleString("de-DE");
  if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}T/.test(v)) return new Date(v).toLocaleString("de-DE");
  return String(v);
}
