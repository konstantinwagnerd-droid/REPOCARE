"use client";

import { AlertTriangle, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ValidationError } from "@/lib/migration/types";

export function ValidationTable({
  errors,
  warnings,
}: {
  errors: ValidationError[];
  warnings: ValidationError[];
}) {
  const all = [...errors, ...warnings].slice(0, 100);
  if (all.length === 0) {
    return (
      <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm">
        Keine Warnungen — Daten sehen sauber aus.
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-border">
      <table className="w-full text-sm">
        <thead className="bg-muted text-xs uppercase text-muted-foreground">
          <tr>
            <th className="px-3 py-2 text-left">Typ</th>
            <th className="px-3 py-2 text-left">Zeile</th>
            <th className="px-3 py-2 text-left">Feld</th>
            <th className="px-3 py-2 text-left">Code</th>
            <th className="px-3 py-2 text-left">Meldung</th>
          </tr>
        </thead>
        <tbody>
          {all.map((e, i) => {
            const Icon = e.severity === "error" ? AlertCircle : e.severity === "warning" ? AlertTriangle : Info;
            return (
              <tr key={i} className="border-t border-border">
                <td className={cn(
                  "px-3 py-2 align-top",
                  e.severity === "error" && "text-destructive",
                  e.severity === "warning" && "text-accent-foreground",
                )}>
                  <span className="inline-flex items-center gap-1.5">
                    <Icon className="size-4" aria-hidden="true" />
                    <span className="capitalize">{e.severity}</span>
                  </span>
                </td>
                <td className="px-3 py-2 align-top tabular-nums">{e.row}</td>
                <td className="px-3 py-2 align-top">{e.field ?? "—"}</td>
                <td className="px-3 py-2 align-top font-mono text-xs">{e.code}</td>
                <td className="px-3 py-2 align-top">{e.message}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {errors.length + warnings.length > 100 && (
        <div className="border-t border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
          Nur die ersten 100 Einträge werden angezeigt ({errors.length + warnings.length} insgesamt).
        </div>
      )}
    </div>
  );
}
