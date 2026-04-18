"use client";

/**
 * DataTable — vereinheitlichte Tabellen-Komponente.
 *
 * Features:
 *  - Sortierbar pro Spalte (Client-Side)
 *  - Filter-Bar: Freitext + beliebige Select-Filter
 *  - Pagination (Default 25) oder "zeige alles"
 *  - CSV-Export
 *  - Row-Selection mit Bulk-Actions (optional)
 *  - Leerzustand (EmptyState) wenn keine Daten
 *
 * Bewusst klein gehalten — kein TanStack-Table, keine virtuelle Liste. Fuer
 * Millionen-Zeilen-Tabellen muss man spaeter auf Server-Pagination wechseln
 * (dann die `getData`-Prop nutzen). Fuer CareAI-Listen (Residents, Staff,
 * Audit, Leads, ...) reicht Client-Side fuer n < 10k.
 */
import * as React from "react";
import { ArrowUpDown, ArrowUp, ArrowDown, Download, Search, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { EmptyState, type EmptyStateAction } from "./empty-state";
import { Inbox, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DataTableColumn<T> {
  key: string;
  header: React.ReactNode;
  /** Accessor fuer Sort + Export. Falls nicht gesetzt: `render` wird nur fuer Anzeige genutzt. */
  accessor?: (row: T) => string | number | null | undefined;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  className?: string;
  headerClassName?: string;
  /** Wenn true, nicht im CSV-Export enthalten. */
  hideInExport?: boolean;
}

export interface DataTableFilter<T> {
  key: string;
  label: string;
  options: { value: string; label: string }[];
  /** Gibt an ob die Row fuer den Wert passt. */
  predicate: (row: T, value: string) => boolean;
}

export interface BulkAction<T> {
  label: string;
  icon?: LucideIcon;
  onClick: (rows: T[]) => void;
  variant?: "default" | "accent" | "destructive" | "outline";
}

export interface DataTableProps<T> {
  data: T[];
  columns: DataTableColumn<T>[];
  /** Eindeutiger Key pro Row (fuer Selection + React keys). */
  rowId: (row: T) => string;
  /** Freitext-Suchfunktion — default: durchsucht alle Accessor-Werte. */
  searchPredicate?: (row: T, query: string) => boolean;
  filters?: DataTableFilter<T>[];
  pageSize?: number;
  /** Gesamten Datensatz anzeigen (kein Paging). */
  showAll?: boolean;
  /** Export-Dateiname (ohne .csv). */
  exportName?: string;
  /** Wenn false, kein Export-Button. */
  exportable?: boolean;
  bulkActions?: BulkAction<T>[];
  emptyState?: {
    icon?: LucideIcon;
    title: string;
    description?: string;
    action?: EmptyStateAction;
  };
  onRowClick?: (row: T) => void;
  className?: string;
  /** Alternativer Leerstatus-Titel wenn Filter aktiv. */
  noResultsTitle?: string;
}

type SortState = { key: string; dir: "asc" | "desc" } | null;

function defaultSearch<T>(row: T, query: string, columns: DataTableColumn<T>[]): boolean {
  const q = query.toLowerCase();
  return columns.some((c) => {
    const v = c.accessor?.(row);
    return v !== undefined && v !== null && String(v).toLowerCase().includes(q);
  });
}

function toCSV<T>(rows: T[], cols: DataTableColumn<T>[]): string {
  const headers = cols.filter((c) => !c.hideInExport && c.accessor);
  const escape = (v: unknown) => {
    if (v === null || v === undefined) return "";
    const s = String(v).replace(/"/g, '""');
    return /[",\n;]/.test(s) ? `"${s}"` : s;
  };
  const headerLine = headers.map((h) => escape(typeof h.header === "string" ? h.header : h.key)).join(";");
  const lines = rows.map((r) => headers.map((h) => escape(h.accessor!(r))).join(";"));
  return [headerLine, ...lines].join("\n");
}

function downloadCSV(name: string, csv: string) {
  const bom = "\ufeff"; // Excel-freundlich
  const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${name}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function DataTable<T>({
  data,
  columns,
  rowId,
  searchPredicate,
  filters,
  pageSize = 25,
  showAll,
  exportName = "export",
  exportable = true,
  bulkActions,
  emptyState,
  onRowClick,
  className,
  noResultsTitle = "Keine Treffer",
}: DataTableProps<T>) {
  const [query, setQuery] = React.useState("");
  const [sort, setSort] = React.useState<SortState>(null);
  const [filterValues, setFilterValues] = React.useState<Record<string, string>>({});
  const [page, setPage] = React.useState(1);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  const hasFilters = !!filters?.length;

  const filtered = React.useMemo(() => {
    let out = data;
    // Filter
    if (hasFilters) {
      for (const f of filters!) {
        const v = filterValues[f.key];
        if (v && v !== "__all__") {
          out = out.filter((r) => f.predicate(r, v));
        }
      }
    }
    // Search
    if (query.trim()) {
      out = out.filter((r) => (searchPredicate ? searchPredicate(r, query) : defaultSearch(r, query, columns)));
    }
    // Sort
    if (sort) {
      const col = columns.find((c) => c.key === sort.key);
      if (col?.accessor) {
        out = [...out].sort((a, b) => {
          const av = col.accessor!(a);
          const bv = col.accessor!(b);
          if (av === bv) return 0;
          if (av === null || av === undefined) return 1;
          if (bv === null || bv === undefined) return -1;
          const cmp = av < bv ? -1 : 1;
          return sort.dir === "asc" ? cmp : -cmp;
        });
      }
    }
    return out;
  }, [data, columns, query, sort, filterValues, filters, hasFilters, searchPredicate]);

  const totalPages = showAll ? 1 : Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = showAll ? filtered : filtered.slice((page - 1) * pageSize, page * pageSize);

  React.useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [page, totalPages]);

  const toggleSort = (key: string) => {
    setSort((s) => {
      if (!s || s.key !== key) return { key, dir: "asc" };
      if (s.dir === "asc") return { key, dir: "desc" };
      return null;
    });
  };

  const allVisibleSelected = paged.length > 0 && paged.every((r) => selected.has(rowId(r)));
  const toggleAllVisible = () => {
    const next = new Set(selected);
    if (allVisibleSelected) {
      paged.forEach((r) => next.delete(rowId(r)));
    } else {
      paged.forEach((r) => next.add(rowId(r)));
    }
    setSelected(next);
  };
  const toggleOne = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };
  const clearSelection = () => setSelected(new Set());

  const selectedRows = React.useMemo(
    () => data.filter((r) => selected.has(rowId(r))),
    [data, selected, rowId],
  );

  const hasActiveFilter = Object.values(filterValues).some((v) => v && v !== "__all__") || query.trim().length > 0;
  const isEmpty = filtered.length === 0;

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Filter-Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Suchen..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            className="pl-9"
          />
        </div>
        {filters?.map((f) => (
          <select
            key={f.key}
            value={filterValues[f.key] ?? "__all__"}
            onChange={(e) => { setFilterValues({ ...filterValues, [f.key]: e.target.value }); setPage(1); }}
            className="h-11 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            aria-label={f.label}
          >
            <option value="__all__">{f.label}: Alle</option>
            {f.options.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        ))}
        {hasActiveFilter && (
          <Button variant="ghost" size="sm" onClick={() => { setQuery(""); setFilterValues({}); setPage(1); }}>
            <X className="h-4 w-4" /> Zuruecksetzen
          </Button>
        )}
        <div className="ml-auto flex items-center gap-2">
          {exportable && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => downloadCSV(exportName, toCSV(filtered, columns))}
              disabled={filtered.length === 0}
            >
              <Download className="h-4 w-4" /> CSV
            </Button>
          )}
        </div>
      </div>

      {/* Bulk-Actions */}
      {bulkActions?.length && selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-3 py-2 text-sm">
          <span className="font-medium">{selected.size} ausgewählt</span>
          <div className="ml-auto flex flex-wrap gap-2">
            {bulkActions.map((a) => (
              <Button
                key={a.label}
                variant={a.variant ?? "outline"}
                size="sm"
                onClick={() => { a.onClick(selectedRows); clearSelection(); }}
              >
                {a.icon && <a.icon className="h-4 w-4" />} {a.label}
              </Button>
            ))}
            <Button variant="ghost" size="sm" onClick={clearSelection}>Auswahl aufheben</Button>
          </div>
        </div>
      )}

      {/* Tabelle */}
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        {isEmpty ? (
          <div className="p-8">
            <EmptyState
              icon={emptyState?.icon ?? Inbox}
              title={hasActiveFilter ? noResultsTitle : emptyState?.title ?? "Noch keine Daten"}
              description={hasActiveFilter ? "Passe Filter an oder setze sie zurueck." : emptyState?.description}
              action={hasActiveFilter ? { label: "Filter zuruecksetzen", onClick: () => { setQuery(""); setFilterValues({}); } } : emptyState?.action}
            />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
              <tr>
                {bulkActions?.length && (
                  <th className="w-10 p-3">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleAllVisible}
                      aria-label="Alle auswaehlen"
                      className="h-4 w-4 rounded border-border"
                    />
                  </th>
                )}
                {columns.map((c) => {
                  const isSortedKey = sort?.key === c.key;
                  return (
                    <th key={c.key} className={cn("p-3", c.headerClassName)}>
                      {c.sortable && c.accessor ? (
                        <button
                          type="button"
                          onClick={() => toggleSort(c.key)}
                          className="inline-flex items-center gap-1 text-xs uppercase text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {c.header}
                          {isSortedKey ? (
                            sort!.dir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                          ) : (
                            <ArrowUpDown className="h-3 w-3 opacity-50" />
                          )}
                        </button>
                      ) : (
                        <span>{c.header}</span>
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paged.map((r) => {
                const id = rowId(r);
                const isSel = selected.has(id);
                return (
                  <tr
                    key={id}
                    className={cn("transition-colors", onRowClick && "cursor-pointer hover:bg-muted/30", isSel && "bg-primary/5")}
                    onClick={(e) => {
                      if (!onRowClick) return;
                      // Click nicht triggern wenn auf Checkbox oder Button geklickt wurde.
                      const target = e.target as HTMLElement;
                      if (target.closest('input,button,a,[role="button"]')) return;
                      onRowClick(r);
                    }}
                  >
                    {bulkActions?.length && (
                      <td className="p-3">
                        <input
                          type="checkbox"
                          checked={isSel}
                          onChange={() => toggleOne(id)}
                          aria-label="Zeile auswaehlen"
                          className="h-4 w-4 rounded border-border"
                        />
                      </td>
                    )}
                    {columns.map((c) => (
                      <td key={c.key} className={cn("p-3", c.className)}>
                        {c.render ? c.render(r) : (c.accessor ? c.accessor(r) : null)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {!showAll && filtered.length > pageSize && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, filtered.length)} von {filtered.length}
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1}>
              <ChevronLeft className="h-4 w-4" /> Zurueck
            </Button>
            <span className="tabular-nums">Seite {page} / {totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages}>
              Weiter <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
