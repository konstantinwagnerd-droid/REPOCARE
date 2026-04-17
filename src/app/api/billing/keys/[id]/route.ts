import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getApiKey, revokeApiKey, updateApiKeyPlan } from "@/lib/billing/store";

export const runtime = "nodejs";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const body = (await req.json()) as { planId?: "free" | "starter" | "pro" | "enterprise" };
  if (!body.planId) return NextResponse.json({ error: "planId required" }, { status: 400 });
  const existing = getApiKey(id);
  if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 });
  const user = session.user as { tenantId: string };
  if (existing.tenantId !== user.tenantId) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const k = updateApiKeyPlan(id, body.planId);
  return NextResponse.json({ key: k });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await params;
  const existing = getApiKey(id);
  if (!existing) return NextResponse.json({ error: "not found" }, { status: 404 });
  const user = session.user as { tenantId: string };
  if (existing.tenantId !== user.tenantId) return NextResponse.json({ error: "forbidden" }, { status: 403 });
  revokeApiKey(id);
  return NextResponse.json({ ok: true });
}
