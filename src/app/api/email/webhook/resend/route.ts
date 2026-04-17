/**
 * Resend webhook — receives bounce/delivered/opened/clicked/complained events.
 * Validates via svix-signature (if secret set). We persist into logs for now;
 * the billing/analytics tables are ready for an upgrade path.
 */
import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { logger } from "@/lib/monitoring/logger";

function verifySignature(raw: string, sig: string | null, secret: string): boolean {
  if (!sig) return false;
  const digest = crypto.createHmac("sha256", secret).update(raw).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(digest));
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const secret = process.env.RESEND_WEBHOOK_SECRET ?? "";
  const raw = await req.text();
  if (secret) {
    const sig = req.headers.get("webhook-signature");
    if (!verifySignature(raw, sig, secret)) {
      return NextResponse.json({ error: "invalid_signature" }, { status: 401 });
    }
  }

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  logger.info("email.webhook.resend", { payload });
  // TODO: persist to email_events table when schema gets bumped.
  return NextResponse.json({ ok: true });
}
