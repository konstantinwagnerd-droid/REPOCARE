import { cookies } from "next/headers";
import { logAudit } from "@/lib/audit";
import { createSession, endSession, getActiveSessionForAdmin, getSession } from "./store";
import type { ImpersonationSession } from "./types";

const COOKIE = "careai_impersonation";

export async function startImpersonation(input: {
  admin: { id: string; email: string; name: string };
  target: { id: string; email: string; name: string; role: string; tenantId: string };
  reason: string;
  ip?: string;
}): Promise<ImpersonationSession> {
  const existing = getActiveSessionForAdmin(input.admin.id);
  if (existing) endSession(existing.id);
  const s = createSession({
    adminUserId: input.admin.id,
    adminEmail: input.admin.email,
    adminName: input.admin.name,
    targetUserId: input.target.id,
    targetEmail: input.target.email,
    targetName: input.target.name,
    targetRole: input.target.role,
    tenantId: input.target.tenantId,
    reason: input.reason,
  });
  const jar = await cookies();
  jar.set(COOKIE, s.id, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60,
  });
  await logAudit({
    tenantId: input.target.tenantId,
    userId: input.admin.id,
    entityType: "impersonation",
    entityId: s.id,
    action: "create",
    after: { targetUserId: input.target.id, reason: input.reason },
    ip: input.ip,
  });
  return s;
}

export async function stopImpersonation(adminUserId: string, ip?: string): Promise<ImpersonationSession | null> {
  const jar = await cookies();
  const id = jar.get(COOKIE)?.value;
  jar.delete(COOKIE);
  if (!id) return null;
  const s = endSession(id);
  if (!s) return null;
  await logAudit({
    tenantId: s.tenantId,
    userId: adminUserId,
    entityType: "impersonation",
    entityId: s.id,
    action: "delete",
    after: { stoppedAt: Date.now() },
    ip,
  });
  return s;
}

export async function getCurrentImpersonation(): Promise<ImpersonationSession | null> {
  const jar = await cookies();
  const id = jar.get(COOKIE)?.value;
  if (!id) return null;
  const s = getSession(id);
  if (!s || !s.active) return null;
  return s;
}
