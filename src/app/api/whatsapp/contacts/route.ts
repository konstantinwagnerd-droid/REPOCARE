import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { whatsappContacts } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { validateNumber } from "@/lib/whatsapp/evolution-client";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "pdl")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const rows = await db.select().from(whatsappContacts).where(eq(whatsappContacts.tenantId, session.user.tenantId));
  return NextResponse.json({ contacts: rows });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "pdl")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json() as {
    phone: string;
    residentId?: string;
    familyUserId?: string;
    consentScope?: "all" | "critical" | "daily";
    quietHoursStart?: string;
    quietHoursEnd?: string;
    consentGiven?: boolean;
  };
  if (!body.phone) return NextResponse.json({ error: "phone required" }, { status: 400 });
  const validation = await validateNumber(body.phone);
  const [inserted] = await db.insert(whatsappContacts).values({
    tenantId: session.user.tenantId,
    residentId: body.residentId ?? null,
    familyUserId: body.familyUserId ?? null,
    phone: body.phone,
    verified: validation.exists === true,
    consentGivenAt: body.consentGiven ? new Date() : null,
    consentScope: body.consentScope ?? "critical",
    quietHoursStart: body.quietHoursStart ?? "22:00",
    quietHoursEnd: body.quietHoursEnd ?? "07:00",
  }).returning();
  return NextResponse.json({ contact: inserted, validation });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "pdl")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json() as { id: string; consentScope?: string; consentGiven?: boolean; quietHoursStart?: string; quietHoursEnd?: string };
  if (!body.id) return NextResponse.json({ error: "id required" }, { status: 400 });
  const patch: Record<string, unknown> = {};
  if (body.consentScope) patch.consentScope = body.consentScope;
  if (typeof body.consentGiven === "boolean") patch.consentGivenAt = body.consentGiven ? new Date() : null;
  if (body.quietHoursStart) patch.quietHoursStart = body.quietHoursStart;
  if (body.quietHoursEnd) patch.quietHoursEnd = body.quietHoursEnd;
  await db.update(whatsappContacts).set(patch).where(and(eq(whatsappContacts.id, body.id), eq(whatsappContacts.tenantId, session.user.tenantId)));
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "pdl")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await db.delete(whatsappContacts).where(and(eq(whatsappContacts.id, id), eq(whatsappContacts.tenantId, session.user.tenantId)));
  return NextResponse.json({ ok: true });
}
