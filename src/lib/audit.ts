import { db } from "@/db/client";
import { auditLog } from "@/db/schema";

export async function logAudit(params: {
  tenantId: string;
  userId?: string;
  entityType: string;
  entityId: string;
  action: "create" | "update" | "delete" | "read" | "login" | "logout";
  before?: unknown;
  after?: unknown;
  ip?: string;
  userAgent?: string;
}) {
  await db.insert(auditLog).values({
    tenantId: params.tenantId,
    userId: params.userId,
    entityType: params.entityType,
    entityId: params.entityId,
    action: params.action,
    before: (params.before as object) ?? null,
    after: (params.after as object) ?? null,
    ip: params.ip,
    userAgent: params.userAgent,
  });
}
