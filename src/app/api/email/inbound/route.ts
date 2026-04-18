/**
 * Webhook fuer eingehende E-Mails.
 *
 * Akzeptiert Resend/Postmark-kompatibles JSON:
 *  { from: { email, name? } | string, subject, text, html?, attachments?: [{filename, ...}] }
 *
 * Klassifiziert via src/lib/email-routing/classifier.ts und persistiert in email_inbound.
 *
 * Auth: HMAC-Signatur via EMAIL_WEBHOOK_SECRET, oder Bearer-Token (optional).
 */
import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { db } from "@/db/client";
import { emailInbound, emailRoutingRules } from "@/db/schema";
import { eq } from "drizzle-orm";
import { classifyEmail, type RoutingRule } from "@/lib/email-routing/classifier";
import { z } from "zod";

export const runtime = "nodejs";

const InboundSchema = z.object({
  from: z.union([
    z.string().email(),
    z.object({ email: z.string().email(), name: z.string().optional() }),
  ]),
  subject: z.string().default(""),
  text: z.string().optional().default(""),
  html: z.string().optional(),
  attachments: z
    .array(z.object({ filename: z.string().optional().nullable() }).passthrough())
    .optional(),
  tenantId: z.string().uuid().optional(),
});

function verifySignature(req: NextRequest, rawBody: string): boolean {
  const secret = process.env.EMAIL_WEBHOOK_SECRET;
  if (!secret) return true; // in dev: ungeprueft
  const sig = req.headers.get("x-signature") ?? req.headers.get("x-webhook-signature") ?? "";
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  return sig === expected || sig === `sha256=${expected}`;
}

export async function POST(req: NextRequest) {
  const raw = await req.text();
  if (!verifySignature(req, raw)) {
    return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
  }

  let json: unknown;
  try {
    json = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const parsed = InboundSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input", issues: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const fromEmail = typeof data.from === "string" ? data.from : data.from.email;
  const fromName = typeof data.from === "string" ? null : data.from.name ?? null;

  // Rules laden (tenant-spezifisch oder global)
  let rules: RoutingRule[] = [];
  if (data.tenantId) {
    const rows = await db
      .select()
      .from(emailRoutingRules)
      .where(eq(emailRoutingRules.tenantId, data.tenantId));
    rules = rows.map((r) => ({
      id: r.id,
      matchType: r.matchType,
      matchValue: r.matchValue,
      classification: r.classification,
      priority: r.priority,
      active: r.active,
    }));
  }

  const result = classifyEmail(
    { fromEmail, subject: data.subject, bodyText: data.text, attachments: data.attachments ?? [] },
    rules,
  );

  const [row] = await db
    .insert(emailInbound)
    .values({
      tenantId: data.tenantId ?? null,
      fromEmail,
      fromName,
      subject: data.subject,
      bodyText: data.text,
      bodyHtml: data.html,
      classification: result.classification,
      confidence: result.confidence,
      routedTo: result.routedTo,
      metadataJson: { reason: result.reason, matchedRule: result.matchedRule ?? null },
    })
    .returning();

  return NextResponse.json({ ok: true, id: row.id, classification: result.classification, routedTo: result.routedTo, confidence: result.confidence });
}
