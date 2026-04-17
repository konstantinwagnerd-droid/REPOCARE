import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { findLog } from "@/lib/webhooks/logger";
import { getWebhook } from "@/lib/webhooks/queue";
import { redispatch } from "@/lib/webhooks/dispatch";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "pdl")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const log = findLog(id);
  if (!log) return NextResponse.json({ error: "Log not found" }, { status: 404 });
  const wh = getWebhook(log.webhookId);
  if (!wh || wh.tenantId !== session.user.tenantId) {
    return NextResponse.json({ error: "Webhook not found" }, { status: 404 });
  }
  const fresh = await redispatch(wh, log);
  return NextResponse.json({ log: fresh });
}
