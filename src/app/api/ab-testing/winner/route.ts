import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { abStore } from "@/lib/ab-testing/store";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "pdl")) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const body = (await req.json().catch(() => ({}))) as { experimentId?: string; variantId?: string };
  if (!body.experimentId || !body.variantId) return NextResponse.json({ error: "experimentId and variantId required" }, { status: 400 });
  const exp = abStore.declareWinner(body.experimentId, body.variantId);
  if (!exp) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ ok: true, experiment: exp });
}
