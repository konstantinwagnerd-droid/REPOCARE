"use client";

import { DataTable, type DataTableColumn, type DataTableFilter } from "@/components/ui/data-table";
import { ResponsiveTable, type ResponsiveColumn } from "@/components/ui/responsive-table";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";
import { FileClock } from "lucide-react";

export type AuditRow = {
  id: string;
  createdAt: Date;
  userName: string;
  action: string;
  entityType: string;
  entityId: string;
  ip: string | null;
};

export function AuditTable({ rows }: { rows: AuditRow[] }) {
  const actions = Array.from(new Set(rows.map((r) => r.action)));
  const entities = Array.from(new Set(rows.map((r) => r.entityType)));

  const columns: DataTableColumn<AuditRow>[] = [
    {
      key: "time", header: "Zeit", accessor: (r) => r.createdAt.toISOString(), sortable: true,
      render: (r) => <span className="whitespace-nowrap">{formatDateTime(r.createdAt)}</span>,
      headerClassName: "w-44",
    },
    { key: "user", header: "Nutzer:in", accessor: (r) => r.userName, sortable: true },
    {
      key: "action", header: "Aktion", accessor: (r) => r.action, sortable: true,
      render: (r) => <Badge variant={r.action === "delete" ? "danger" : r.action === "create" ? "success" : "secondary"}>{r.action}</Badge>,
    },
    {
      key: "entity", header: "Entität", accessor: (r) => `${r.entityType} ${r.entityId}`,
      render: (r) => <span>{r.entityType} <span className="text-muted-foreground">({r.entityId.slice(0, 8)}…)</span></span>,
    },
    { key: "ip", header: "IP", accessor: (r) => r.ip, sortable: true, render: (r) => <span className="font-mono text-xs">{r.ip}</span> },
  ];

  const filters: DataTableFilter<AuditRow>[] = [
    { key: "action", label: "Aktion", options: actions.map((a) => ({ value: a, label: a })), predicate: (r, v) => r.action === v },
    { key: "entityType", label: "Entität", options: entities.map((e) => ({ value: e, label: e })), predicate: (r, v) => r.entityType === v },
  ];

  const mobileCols: ResponsiveColumn<AuditRow>[] = [
    {
      key: "summary",
      header: "Ereignis",
      primary: true,
      render: (r) => (
        <div>
          <div className="font-semibold">{r.userName}</div>
          <div className="text-xs text-muted-foreground">
            {r.entityType} · {formatDateTime(r.createdAt)}
          </div>
        </div>
      ),
    },
    {
      key: "action",
      header: "Aktion",
      trailing: true,
      render: (r) => (
        <Badge variant={r.action === "delete" ? "danger" : r.action === "create" ? "success" : "secondary"}>
          {r.action}
        </Badge>
      ),
    },
    { key: "ip", header: "IP", render: (r) => <span className="font-mono text-xs">{r.ip}</span> },
    { key: "entityId", header: "Entity-ID", render: (r) => <span className="font-mono text-xs">{r.entityId.slice(0, 12)}…</span> },
  ];

  return (
    <>
      <div className="md:hidden">
        <ResponsiveTable
          data={rows.slice(0, 50)}
          columns={mobileCols}
          rowId={(r) => r.id}
          emptyLabel="Noch keine Ereignisse."
        />
        {rows.length > 50 && (
          <p className="mt-3 text-center text-xs text-muted-foreground">
            Zeige die letzten 50 · für Filter/Export bitte Desktop verwenden.
          </p>
        )}
      </div>
      <div className="hidden md:block">
        <DataTable
          data={rows}
          columns={columns}
          filters={filters}
          rowId={(r) => r.id}
          pageSize={50}
          exportName="audit-log"
          emptyState={{
            icon: FileClock,
            title: "Noch keine Ereignisse",
            description: "Sobald etwas erstellt, geändert oder gelöscht wird, erscheint es hier.",
          }}
        />
      </div>
    </>
  );
}
