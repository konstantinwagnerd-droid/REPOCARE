import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createWebhook } from "@/lib/webhooks/queue";
import { WEBHOOK_EVENTS, type WebhookEvent } from "@/lib/webhooks/types";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2).max(120),
  url: z.string().url().startsWith("https://", "Nur HTTPS erlaubt"),
  events: z.array(z.enum(WEBHOOK_EVENTS)).min(1),
  headers: z.record(z.string()).optional(),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "pdl")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid", issues: parsed.error.issues }, { status: 400 });
  }
  const wh = createWebhook({
    tenantId: session.user.tenantId,
    name: parsed.data.name,
    url: parsed.data.url,
    events: parsed.data.events as WebhookEvent[],
    headers: parsed.data.headers,
  });
  return NextResponse.json({ webhook: wh });
}
