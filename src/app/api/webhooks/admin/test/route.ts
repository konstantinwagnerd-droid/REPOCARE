import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getWebhook } from "@/lib/webhooks/queue";
import { dispatch } from "@/lib/webhooks/dispatch";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "pdl")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = (await req.json().catch(() => ({}))) as { id?: string };
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const wh = getWebhook(id);
  if (!wh || wh.tenantId !== session.user.tenantId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const log = await dispatch(wh, "audit.flagged", {
    test: true,
    message: "Test-Event von CareAI Webhooks",
    triggeredBy: session.user.name ?? session.user.email,
  });
  return NextResponse.json({ log });
}
