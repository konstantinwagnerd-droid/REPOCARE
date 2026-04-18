"use client";

/**
 * ResponsiveTable — Tabelle auf Desktop, Cards auf Mobile.
 *
 * Motivation: Pflegekräfte arbeiten auf 8"/10"-Tablets (Samsung Galaxy Tab A,
 * alte iPads). Tabellen mit 4+ Spalten haben dort zwangsläufig H-Scroll oder
 * Mini-Text. Für Read-Use-Cases (Staff-Liste, Audit-Log, Bewohner:innen-Liste)
 * ist ein Cards-View unter md-Breakpoint deutlich freundlicher.
 *
 * Usage:
 *
 *   <ResponsiveTable
 *     data={items}
 *     rowId={(r) => r.id}
 *     columns={[
 *       { key: "name", header: "Name", render: r => r.fullName, primary: true },
 *       { key: "role", header: "Rolle", render: r => r.role },
 *     ]}
 *   />
 *
 * Die Spalten mit `primary: true` werden auf Mobile als Card-Titel genutzt,
 * der Rest als Key-Value-Paare darunter.
 */
import * as React from "react";
import { cn } from "@/lib/utils";

export interface ResponsiveColumn<T> {
  key: string;
  header: React.ReactNode;
  render: (row: T) => React.ReactNode;
  /** Auf Mobile als Card-Titel (meist Name/ID). Nur 1 Spalte sollte primary sein. */
  primary?: boolean;
  /** Auf Mobile rechts in der Card-Zeile (Actions, Badges). */
  trailing?: boolean;
  /** Auf Mobile ausblenden (z.B. Technik-IDs). */
  hiddenOnMobile?: boolean;
  className?: string;
}

export interface ResponsiveTableProps<T> {
  data: T[];
  columns: ResponsiveColumn<T>[];
  rowId: (row: T) => string;
  onRowClick?: (row: T) => void;
  emptyLabel?: string;
  className?: string;
  /** Optional: klickbarer Link pro Card/Row (überschreibt onRowClick). */
  rowHref?: (row: T) => string;
}

export function ResponsiveTable<T>({
  data,
  columns,
  rowId,
  onRowClick,
  emptyLabel = "Keine Einträge",
  className,
  rowHref,
}: ResponsiveTableProps<T>) {
  if (!data.length) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
        {emptyLabel}
      </div>
    );
  }

  const primary = columns.find((c) => c.primary) ?? columns[0];
  const trailing = columns.filter((c) => c.trailing);
  const body = columns.filter((c) => c !== primary && !c.trailing && !c.hiddenOnMobile);

  return (
    <div className={className}>
      {/* Desktop: echte Tabelle */}
      <div className="hidden overflow-x-auto rounded-2xl border border-border bg-card md:block">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-muted/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              {columns.map((c) => (
                <th key={c.key} scope="col" className={cn("px-4 py-3 font-medium", c.className)}>
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((row) => {
              const id = rowId(row);
              const clickable = !!(onRowClick || rowHref);
              return (
                <tr
                  key={id}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    clickable && "cursor-pointer transition-colors hover:bg-muted/30 focus-within:bg-muted/40",
                  )}
                >
                  {columns.map((c) => (
                    <td key={c.key} className={cn("px-4 py-3", c.className)}>
                      {c.render(row)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile: Card-List */}
      <ul className="space-y-3 md:hidden" role="list">
        {data.map((row) => {
          const id = rowId(row);
          const href = rowHref?.(row);
          const Inner: React.ElementType = href ? "a" : onRowClick ? "button" : "div";
          const props = href
            ? { href }
            : onRowClick
            ? { onClick: () => onRowClick(row), type: "button" as const }
            : {};
          const clickable = !!(href || onRowClick);
          return (
            <li key={id}>
              <Inner
                {...props}
                className={cn(
                  "block w-full min-h-[56px] rounded-2xl border border-border bg-card p-4 text-left",
                  clickable &&
                    "transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-foreground">{primary.render(row)}</div>
                    {body.length > 0 && (
                      <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
                        {body.map((c) => (
                          <React.Fragment key={c.key}>
                            <dt className="text-muted-foreground">{c.header}</dt>
                            <dd className="min-w-0 text-foreground">{c.render(row)}</dd>
                          </React.Fragment>
                        ))}
                      </dl>
                    )}
                  </div>
                  {trailing.length > 0 && (
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      {trailing.map((c) => (
                        <div key={c.key}>{c.render(row)}</div>
                      ))}
                    </div>
                  )}
                </div>
              </Inner>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
