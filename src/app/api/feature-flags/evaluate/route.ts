import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { evaluate, evaluateAll } from "@/lib/feature-flags/evaluate";
import type { Role } from "@/lib/feature-flags/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await auth();
  const u = session?.user as { id?: string; tenantId?: string; role?: Role; email?: string } | undefined;
  const ctx = {
    userId: u?.id,
    tenantId: u?.tenantId,
    role: u?.role,
    email: u?.email,
  };
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  if (key) return NextResponse.json({ result: evaluate(key, ctx) });
  return NextResponse.json({ flags: evaluateAll(ctx) });
}

export async function POST(req: Request) {
  // Evaluate mit explizitem Kontext (z. B. für Preview im Admin-UI)
  const body = (await req.json()) as { key?: string; context?: { userId?: string; tenantId?: string; role?: Role; email?: string } };
  if (!body.key) return NextResponse.json({ error: "key required" }, { status: 400 });
  return NextResponse.json({ result: evaluate(body.key, body.context ?? {}) });
}
