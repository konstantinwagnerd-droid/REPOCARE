"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import type { FacilityKpiSnapshot, FacilityRef } from "@/lib/multi-tenant/types";

interface Row { facility: FacilityRef; snapshot: FacilityKpiSnapshot; }

export function FacilityTable({ rows }: { rows: Row[] }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"all" | "active" | "audit-review" | "paused">("all");

  const filtered = useMemo(() => {
    return rows.filter((r) => {
      if (status !== "all" && r.facility.status !== status) return false;
      if (!q) return true;
      const t = `${r.facility.name} ${r.facility.city} ${r.facility.region}`.toLowerCase();
      return t.includes(q.toLowerCase());
    });
  }, [rows, q, status]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 border-b border-border p-4">
        <Input placeholder="Einrichtung oder Stadt suchen…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
        <div className="flex gap-1 rounded-lg border border-border bg-background p-1 text-xs">
          {(["all", "active", "audit-review", "paused"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`rounded px-3 py-1.5 font-medium transition-colors ${status === s ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}
            >
              {s === "all" ? "Alle" : s === "active" ? "Aktiv" : s === "audit-review" ? "Audit" : "Pausiert"}
            </button>
          ))}
        </div>
        <div className="ml-auto text-xs text-muted-foreground">{filtered.length} / {rows.length}</div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Einrichtung</th>
              <th className="px-4 py-3">Stadt</th>
              <th className="px-4 py-3 text-right">Betten</th>
              <th className="px-4 py-3 text-right">Belegung</th>
              <th className="px-4 py-3 text-right">MA</th>
              <th className="px-4 py-3">Letzter Audit</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.facility.id} className="border-t border-border hover:bg-muted/30">
                <td className="px-4 py-3 font-medium">{r.facility.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.facility.city}, {r.facility.region}</td>
                <td className="px-4 py-3 text-right tabular-nums">{r.facility.beds}</td>
                <td className="px-4 py-3 text-right tabular-nums">{r.snapshot.occupancyPct.toFixed(1)}%</td>
                <td className="px-4 py-3 text-right tabular-nums">{r.facility.staff}</td>
                <td className="px-4 py-3 text-muted-foreground">{r.facility.lastAuditAt ?? "—"}</td>
                <td className="px-4 py-3">
                  {r.facility.status === "active" && <Badge variant="success">aktiv</Badge>}
                  {r.facility.status === "audit-review" && <Badge variant="warning">Audit läuft</Badge>}
                  {r.facility.status === "paused" && <Badge variant="outline">pausiert</Badge>}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">Keine Einrichtungen entsprechen dem Filter.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
