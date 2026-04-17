import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createApiKey, listApiKeys } from "@/lib/billing/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const tenantId = (session.user as { tenantId: string }).tenantId;
  return NextResponse.json({ keys: listApiKeys(tenantId) });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const user = session.user as { tenantId: string; id: string; role: string };
  if (user.role !== "admin") return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const body = (await req.json()) as { label?: string; planId?: "free" | "starter" | "pro" | "enterprise" };
  if (!body.label || !body.planId) return NextResponse.json({ error: "label & planId required" }, { status: 400 });
  const k = createApiKey({ tenantId: user.tenantId, label: body.label, planId: body.planId, createdBy: user.id });
  return NextResponse.json({ key: k }, { status: 201 });
}
