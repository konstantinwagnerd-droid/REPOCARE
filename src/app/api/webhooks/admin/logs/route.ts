import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { listLogs, logStats } from "@/lib/webhooks/logger";
import { listWebhooks } from "@/lib/webhooks/queue";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "pdl")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { searchParams } = new URL(req.url);
  const webhookId = searchParams.get("webhookId") ?? undefined;
  const limit = Math.min(Number(searchParams.get("limit") ?? 100), 500);
  const tenantWebhookIds = new Set(listWebhooks(session.user.tenantId).map((w) => w.id));
  const logs = listLogs(webhookId, limit).filter((l) => tenantWebhookIds.has(l.webhookId));
  return NextResponse.json({ logs, stats: logStats() });
}
