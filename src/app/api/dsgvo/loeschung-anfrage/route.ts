import { NextRequest } from "next/server";
import { db } from "@/db/client";
import { dsgvoRequests, residents } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return new Response("Unauthorized", { status: 401 });
  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  const residentId = body.residentId as string;
  const type = (body.type as "loeschung" | "einschraenkung" | "auskunft" | "uebertragung") ?? "loeschung";
  const reason = typeof body.reason === "string" ? body.reason : null;
  const requestedBy = typeof body.requestedBy === "string" ? body.requestedBy : session.user.name ?? session.user.email;
  if (!residentId) return Response.json({ error: "residentId required" }, { status: 400 });

  const [r] = await db.select().from(residents).where(eq(residents.id, residentId)).limit(1);
  if (!r) return Response.json({ error: "resident not found" }, { status: 404 });

  const [row] = await db.insert(dsgvoRequests).values({
    tenantId: r.tenantId,
    residentId,
    type,
    status: "offen",
    requestedBy,
    reason,
  }).returning();

  await logAudit({
    tenantId: r.tenantId,
    userId: session.user.id,
    entityType: "dsgvo_request",
    entityId: row.id,
    action: "create",
    after: { type, requestedBy, reason },
  });

  return Response.json({
    ok: true,
    request: row,
    note: type === "loeschung"
      ? "Anfrage erfasst. Prüfung gegen Aufbewahrungspflicht (GuKG § 5 / SGB XI: 10 Jahre) erforderlich — erst nach Ablauf tatsächliche Löschung."
      : "Anfrage erfasst.",
  });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") return new Response("Forbidden", { status: 403 });
  const body = await req.json();
  const { requestId, status, decisionNote } = body as { requestId: string; status: "in_pruefung" | "abgelehnt_aufbewahrungspflicht" | "erledigt"; decisionNote?: string };

  const [old] = await db.select().from(dsgvoRequests).where(eq(dsgvoRequests.id, requestId)).limit(1);
  if (!old) return Response.json({ error: "not found" }, { status: 404 });

  const resolved = status === "erledigt" || status === "abgelehnt_aufbewahrungspflicht";
  const [row] = await db.update(dsgvoRequests).set({
    status, decisionNote: decisionNote ?? null, resolvedAt: resolved ? new Date() : null,
  }).where(eq(dsgvoRequests.id, requestId)).returning();

  // Bei Löschung + erledigt → Soft-Delete
  if (row.type === "loeschung" && status === "erledigt") {
    await db.update(residents).set({
      deletedAt: new Date(),
      deletionReason: decisionNote ?? "DSGVO Art. 17 Löschung nach Aufbewahrungsfrist",
    }).where(eq(residents.id, row.residentId));
  }

  await logAudit({
    tenantId: row.tenantId,
    userId: session.user.id,
    entityType: "dsgvo_request",
    entityId: row.id,
    action: "update",
    before: old, after: row,
  });
  return Response.json({ ok: true, request: row });
}
