import { db } from "@/db/client";
import { auth } from "@/lib/auth";
import { auditLog, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { ExportButton } from "@/components/app/export-button";
import { Shield, FileText, AlertTriangle, Activity } from "lucide-react";
import { PageContainer, PageHeader, PageSection, PageGrid, StatCard } from "@/components/admin/page-shell";
import { AuditTable, type AuditRow } from "./audit-table";

export default async function AuditPage() {
  const session = await auth();
  const rows = await db
    .select({ a: auditLog, u: users })
    .from(auditLog)
    .leftJoin(users, eq(users.id, auditLog.userId))
    .where(eq(auditLog.tenantId, session!.user.tenantId))
    .orderBy(desc(auditLog.createdAt))
    .limit(500);

  const flat: AuditRow[] = rows.map(({ a, u }) => ({
    id: a.id,
    createdAt: a.createdAt,
    userName: u?.fullName ?? "—",
    action: a.action,
    entityType: a.entityType,
    entityId: a.entityId,
    ip: a.ip,
  }));

  const creates = flat.filter((r) => r.action === "create").length;
  const updates = flat.filter((r) => r.action === "update").length;
  const deletes = flat.filter((r) => r.action === "delete").length;
  const logins = flat.filter((r) => r.action === "login").length;

  return (
    <PageContainer>
      <PageHeader
        title="Audit-Log"
        subtitle="Revisionsfeste Protokollierung aller Änderungen — gesetzlich vorgeschrieben."
        icon={Shield}
        breadcrumbs={[{ label: "Administration", href: "/admin" }, { label: "Audit-Log" }]}
        actions={
          <>
            <ExportButton endpoint="/api/exports/audit-log" body={{ format: "pdf" }} label="PDF Export" />
            <ExportButton endpoint="/api/exports/audit-log" body={{ format: "csv" }} label="CSV Export" />
          </>
        }
      />

      <PageSection heading="Zusammenfassung" description="Letzte 500 Ereignisse.">
        <PageGrid columns={4}>
          <StatCard label="Erstellungen" value={creates} icon={FileText} tone="success" />
          <StatCard label="Änderungen" value={updates} icon={Activity} tone="primary" />
          <StatCard label="Löschungen" value={deletes} icon={AlertTriangle} tone={deletes > 0 ? "danger" : "default"} />
          <StatCard label="Logins" value={logins} icon={Shield} tone="default" />
        </PageGrid>
      </PageSection>

      <PageSection heading="Ereignisse" description="Sortierbar, filterbar nach Aktion und User, CSV-Export.">
        <AuditTable rows={flat} />
      </PageSection>
    </PageContainer>
  );
}
