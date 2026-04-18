import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { certifications, certificationRequirements } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export const runtime = "nodejs";

async function authorize(certId: string) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized", status: 401 as const };
  const role = session.user.role;
  if (role !== "admin" && role !== "pdl") return { error: "Forbidden", status: 403 as const };
  const [cert] = await db
    .select({ id: certifications.id })
    .from(certifications)
    .where(and(eq(certifications.id, certId), eq(certifications.tenantId, session.user.tenantId)))
    .limit(1);
  if (!cert) return { error: "Not found", status: 404 as const };
  return { session, cert };
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await authorize(id);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const body = (await req.json()) as { title: string; description?: string; category?: string };
  const [row] = await db
    .insert(certificationRequirements)
    .values({
      certificationId: id,
      title: body.title,
      description: body.description || null,
      category: body.category || null,
    })
    .returning();
  return NextResponse.json({ requirement: row });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const auth = await authorize(id);
  if ("error" in auth) return NextResponse.json({ error: auth.error }, { status: auth.status });
  const body = (await req.json()) as { id: string; status?: string; title?: string; description?: string };
  const updates: Record<string, unknown> = {};
  if (body.status) updates.status = body.status;
  if (body.title) updates.title = body.title;
  if (body.description !== undefined) updates.description = body.description;
  if (Object.keys(updates).length === 0) return NextResponse.json({ ok: true });
  await db
    .update(certificationRequirements)
    .set(updates)
    .where(and(eq(certificationRequirements.id, body.id), eq(certificationRequirements.certificationId, id)));
  return NextResponse.json({ ok: true });
}
