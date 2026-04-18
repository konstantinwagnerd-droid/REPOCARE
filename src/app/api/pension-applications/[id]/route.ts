/**
 * Pflegegeld-Antrag Einzel-API
 *
 * GET    — einzelner Antrag
 * PATCH  — Teil-Update (formData / status / assignedGrade / notes)
 * DELETE — löscht Draft-Anträge; bereits eingereichte Anträge werden archiviert statt gelöscht
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { pensionApplications } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return new Response("Unauthorized", { status: 401 });
  const tenantId = session.user.tenantId as string | undefined;
  if (!tenantId) return new Response("No tenant", { status: 400 });

  const { id } = await params;
  const [row] = await db
    .select()
    .from(pensionApplications)
    .where(and(eq(pensionApplications.id, id), eq(pensionApplications.tenantId, tenantId)))
    .limit(1);
  if (!row) return new Response("Not found", { status: 404 });
  return NextResponse.json(row);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return new Response("Unauthorized", { status: 401 });
  const tenantId = session.user.tenantId as string | undefined;
  if (!tenantId) return new Response("No tenant", { status: 400 });

  const { id } = await params;
  const body = (await req.json()) as Partial<{
    formData: Record<string, unknown>;
    status: "draft" | "submitted" | "approved" | "rejected";
    assignedGrade: number;
    notes: string;
  }>;

  const updates: Record<string, unknown> = {};
  if (body.formData !== undefined) updates.formData = body.formData;
  if (body.status !== undefined) {
    updates.status = body.status;
    updates.statusUpdatedAt = new Date();
    if (body.status === "submitted") updates.submittedAt = new Date();
  }
  if (body.assignedGrade !== undefined) updates.assignedGrade = body.assignedGrade;
  if (body.notes !== undefined) updates.notes = body.notes;

  const [updated] = await db
    .update(pensionApplications)
    .set(updates)
    .where(and(eq(pensionApplications.id, id), eq(pensionApplications.tenantId, tenantId)))
    .returning();

  if (!updated) return new Response("Not found", { status: 404 });

  await logAudit({
    tenantId,
    userId: session.user.id as string,
    entityType: "pension_application",
    entityId: id,
    action: "update",
    after: updates,
  });

  return NextResponse.json(updated);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return new Response("Unauthorized", { status: 401 });
  const tenantId = session.user.tenantId as string | undefined;
  if (!tenantId) return new Response("No tenant", { status: 400 });

  const { id } = await params;
  const [existing] = await db
    .select()
    .from(pensionApplications)
    .where(and(eq(pensionApplications.id, id), eq(pensionApplications.tenantId, tenantId)))
    .limit(1);

  if (!existing) return new Response("Not found", { status: 404 });
  if (existing.status !== "draft") {
    return new Response("Only draft applications can be deleted", { status: 409 });
  }

  await db.delete(pensionApplications).where(eq(pensionApplications.id, id));

  await logAudit({
    tenantId,
    userId: session.user.id as string,
    entityType: "pension_application",
    entityId: id,
    action: "delete",
  });

  return new Response(null, { status: 204 });
}
