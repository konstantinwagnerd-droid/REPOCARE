import { db } from "@/db/client";
import { auth } from "@/lib/auth";
import { auditLog, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExportButton } from "@/components/app/export-button";
import { formatDateTime } from "@/lib/utils";
import { HelpTip } from "@/components/tooltip/HelpTip";

export default async function AuditPage() {
  const session = await auth();
  const entries = await db
    .select({ a: auditLog, u: users })
    .from(auditLog)
    .leftJoin(users, eq(users.id, auditLog.userId))
    .where(eq(auditLog.tenantId, session!.user.tenantId))
    .orderBy(desc(auditLog.createdAt))
    .limit(100);

  return (
    <div className="space-y-8 p-6 lg:p-10">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-serif text-4xl font-semibold tracking-tight">Audit-Log</h1>
          <p className="mt-1 text-muted-foreground">Revisionsfeste Protokollierung aller Änderungen — gesetzlich vorgeschrieben.</p>
        </div>
        <div className="flex gap-2">
          <ExportButton endpoint="/api/exports/audit-log" body={{ format: "pdf" }} label="PDF Export" />
          <ExportButton endpoint="/api/exports/audit-log" body={{ format: "csv" }} label="CSV Export" />
        </div>
      </div>
      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="p-3">Zeit <HelpTip label="Zeitstempel">Exakter UTC-Zeitstempel der Aktion, anzeigt in lokaler Zeit. Unveraenderbar.</HelpTip></th>
                <th>Nutzer:in <HelpTip label="Nutzer">Wer hat die Aktion ausgeloest? Bei impersonierten Sessions wird der urspruengliche Admin protokolliert.</HelpTip></th>
                <th>Aktion <HelpTip label="Aktion">Typ: create, update, delete, login, export. Bestimmt MDK-Relevanz.</HelpTip></th>
                <th>Entität <HelpTip label="Entitaet">Betroffener Datensatz (Bewohner, Medikation, Bericht ...) mit eindeutiger ID.</HelpTip></th>
                <th>IP <HelpTip label="IP-Adresse">IP und User-Agent helfen bei forensischer Analyse von Auffaelligkeiten.</HelpTip></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {entries.map(({ a, u }) => (
                <tr key={a.id}>
                  <td className="p-3 whitespace-nowrap">{formatDateTime(a.createdAt)}</td>
                  <td>{u?.fullName ?? "—"}</td>
                  <td><Badge variant={a.action === "delete" ? "danger" : a.action === "create" ? "success" : "secondary"}>{a.action}</Badge></td>
                  <td>{a.entityType} <span className="text-muted-foreground">({a.entityId.slice(0, 8)}…)</span></td>
                  <td className="font-mono text-xs">{a.ip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
