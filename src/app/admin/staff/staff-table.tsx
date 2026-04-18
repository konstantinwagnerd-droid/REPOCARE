"use client";

import { DataTable, type DataTableColumn, type DataTableFilter } from "@/components/ui/data-table";
import { ResponsiveTable, type ResponsiveColumn } from "@/components/ui/responsive-table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { initials } from "@/lib/utils";
import { roleLabel } from "@/lib/rbac";
import type { Role } from "@/db/schema";
import { Pencil, Users } from "lucide-react";

type Staff = {
  id: string;
  fullName: string;
  email: string;
  role: Role;
};

export function StaffTable({ staff }: { staff: Staff[] }) {
  const roles = Array.from(new Set(staff.map((s) => s.role)));

  const columns: DataTableColumn<Staff>[] = [
    {
      key: "name", header: "Name", accessor: (s) => s.fullName, sortable: true,
      render: (s) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8"><AvatarFallback>{initials(s.fullName)}</AvatarFallback></Avatar>
          <span className="font-semibold">{s.fullName}</span>
        </div>
      ),
    },
    { key: "email", header: "E-Mail", accessor: (s) => s.email, sortable: true, render: (s) => <span className="text-muted-foreground">{s.email}</span> },
    {
      key: "role", header: "Rolle", accessor: (s) => roleLabel(s.role), sortable: true,
      render: (s) => <Badge variant={s.role === "admin" ? "accent" : s.role === "pdl" ? "info" : "secondary"}>{roleLabel(s.role)}</Badge>,
    },
    {
      key: "actions", header: "", hideInExport: true, headerClassName: "w-32",
      render: () => <Button variant="ghost" size="sm"><Pencil className="h-4 w-4" /> Bearbeiten</Button>,
    },
  ];

  const filters: DataTableFilter<Staff>[] = [
    {
      key: "role", label: "Rolle",
      options: roles.map((r) => ({ value: r, label: roleLabel(r) })),
      predicate: (s, v) => s.role === v,
    },
  ];

  // Mobile: kompakte Card-Ansicht ohne Filter/Export
  const mobileCols: ResponsiveColumn<Staff>[] = [
    {
      key: "name",
      header: "Name",
      primary: true,
      render: (s) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10"><AvatarFallback>{initials(s.fullName)}</AvatarFallback></Avatar>
          <div className="min-w-0">
            <div className="truncate font-semibold">{s.fullName}</div>
            <div className="truncate text-xs text-muted-foreground">{s.email}</div>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Rolle",
      trailing: true,
      render: (s) => (
        <Badge variant={s.role === "admin" ? "accent" : s.role === "pdl" ? "info" : "secondary"}>
          {roleLabel(s.role)}
        </Badge>
      ),
    },
  ];

  return (
    <>
      {/* Mobile: schneller Card-View ohne Filter-Overhead */}
      <div className="md:hidden">
        <ResponsiveTable
          data={staff}
          columns={mobileCols}
          rowId={(s) => s.id}
          emptyLabel="Noch keine Mitarbeitenden — lege den ersten Zugang im Desktop-Admin an."
        />
      </div>

      {/* Desktop: volle DataTable mit Filter + Export */}
      <div className="hidden md:block">
        <DataTable
          data={staff}
          columns={columns}
          filters={filters}
          rowId={(s) => s.id}
          exportName="mitarbeitende"
          emptyState={{
            icon: Users,
            title: "Noch keine Mitarbeitenden",
            description: "Leg den ersten Zugang an — danach kannst du Rollen, Schichten und Qualifikationen zuweisen.",
          }}
        />
      </div>
    </>
  );
}
