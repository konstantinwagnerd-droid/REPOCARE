import { NextRequest } from "next/server";
import { db } from "@/db/client";
import { auditLog, users, exportRecords, tenants } from "@/db/schema";
import { eq, and, gte, lte, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { renderPdf, pdfResponse } from "@/lib/pdf/render";
import { AuditExportDoc, type AuditEntry } from "@/lib/pdf/audit-export";
import { sha256 } from "@/lib/pdf/hash";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return new Response("Unauthorized", { status: 401 });
  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  const format = (body.format as "pdf" | "csv") ?? "pdf";
  const from = body.from ? new Date(body.from as string) : undefined;
  const to = body.to ? new Date(body.to as string) : undefined;
  const tenantId = session.user.tenantId;
  const [tenant] = await db.select().from(tenants).where(eq(tenants.id, tenantId)).limit(1);

  const whereConds = [eq(auditLog.tenantId, tenantId)];
  if (from) whereConds.push(gte(auditLog.createdAt, from));
  if (to) whereConds.push(lte(auditLog.createdAt, to));

  const rows = await db
    .select({ a: auditLog, u: users })
    .from(auditLog)
    .leftJoin(users, eq(users.id, auditLog.userId))
    .where(and(...whereConds))
    .orderBy(desc(auditLog.createdAt))
    .limit(2000);

  const entries: AuditEntry[] = rows.map(({ a, u }) => ({
    createdAt: a.createdAt,
    userName: u?.fullName ?? null,
    action: a.action,
    entityType: a.entityType,
    entityId: a.entityId,
    ip: a.ip,
  }));

  if (format === "csv") {
    const header = "Zeit;Nutzer;Aktion;Entitaet;EntitaetID;IP\n";
    const rowsCsv = entries.map((e) => [
      new Date(e.createdAt).toISOString(),
      (e.userName ?? "").replaceAll(";", ","),
      e.action,
      e.entityType,
      e.entityId,
      e.ip ?? "",
    ].join(";")).join("\n");
    const csv = header + rowsCsv;
    const hash = sha256(csv);
    const filename = `audit-log_${new Date().toISOString().slice(0, 10)}_${hash.slice(0, 8)}.csv`;
    await db.insert(exportRecords).values({ tenantId, userId: session.user.id, kind: "audit_csv", hash, filename });
    await logAudit({ tenantId, userId: session.user.id, entityType: "audit_log", entityId: tenantId, action: "read", after: { export: "csv", hash } });
    return new Response(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "X-CareAI-Hash": hash,
      },
    });
  }

  const { buffer, hash, filename } = await renderPdf(AuditExportDoc, { entries, filter: { from, to } }, {
    facilityName: tenant?.name ?? "CareAI Demo Einrichtung",
    title: "Audit-Log-Export",
    subtitle: `${entries.length} Einträge · ${from?.toLocaleDateString("de-DE") ?? "Anfang"} – ${to?.toLocaleDateString("de-DE") ?? "heute"}`,
    confidential: true,
  });
  await db.insert(exportRecords).values({ tenantId, userId: session.user.id, kind: "audit_pdf", hash, filename });
  await logAudit({ tenantId, userId: session.user.id, entityType: "audit_log", entityId: tenantId, action: "read", after: { export: "pdf", hash } });
  return pdfResponse(buffer, filename, hash);
}
