import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { whatsappContacts, whatsappMessages } from "@/db/schema";
import { and, eq, inArray } from "drizzle-orm";
import { sendText, isConfigured, isQuietNow } from "@/lib/whatsapp/evolution-client";
import { renderTemplate, templates, type TemplateName } from "@/lib/whatsapp/templates";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "pdl")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  if (!isConfigured()) {
    return NextResponse.json({ error: "Evolution API not configured", hint: "EVOLUTION_API_URL + EVOLUTION_API_KEY setzen" }, { status: 503 });
  }
  const body = await req.json() as {
    contactIds: string[];
    templateName: TemplateName;
    vars: Record<string, string>;
    ignoreQuietHours?: boolean;
  };
  if (!body.contactIds?.length) return NextResponse.json({ error: "contactIds required" }, { status: 400 });
  const tpl = templates[body.templateName];
  if (!tpl) return NextResponse.json({ error: "unknown template" }, { status: 400 });

  const contacts = await db.select().from(whatsappContacts).where(and(eq(whatsappContacts.tenantId, session.user.tenantId), inArray(whatsappContacts.id, body.contactIds)));

  let sent = 0, skipped = 0, failed = 0;
  const details: Array<{ contactId: string; status: string; error?: string }> = [];
  for (const c of contacts) {
    if (!c.consentGivenAt) {
      skipped++;
      details.push({ contactId: c.id, status: "no-consent" });
      continue;
    }
    if (!body.ignoreQuietHours && tpl.scope !== "critical" && isQuietNow(c.quietHoursStart ?? "22:00", c.quietHoursEnd ?? "07:00")) {
      skipped++;
      details.push({ contactId: c.id, status: "quiet-hours" });
      continue;
    }
    let text: string;
    try {
      text = renderTemplate(body.templateName, body.vars);
    } catch (err) {
      failed++;
      details.push({ contactId: c.id, status: "render-error", error: err instanceof Error ? err.message : String(err) });
      continue;
    }
    const res = await sendText(c.phone, text);
    await db.insert(whatsappMessages).values({
      tenantId: session.user.tenantId,
      contactId: c.id,
      direction: "outbound",
      eventType: body.templateName,
      body: text,
      sentAt: res.ok ? new Date() : null,
    });
    if (res.ok) { sent++; details.push({ contactId: c.id, status: "sent" }); }
    else { failed++; details.push({ contactId: c.id, status: "failed", error: res.error }); }
  }
  return NextResponse.json({ sent, skipped, failed, details });
}
