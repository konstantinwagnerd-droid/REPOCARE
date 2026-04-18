/**
 * DSGVO-konformer Unsubscribe-Endpoint. Nimmt GET (Ein-Klick) und POST (List-Unsubscribe).
 * Token-basierte Authentifizierung — token = HMAC(email, UNSUBSCRIBE_SECRET).
 */
import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/monitoring/logger";
import { signUnsubscribe } from "@/lib/email-transport/unsubscribe-url";

function sign(email: string): string {
  return signUnsubscribe(email);
}

async function handle(email: string | null, token: string | null) {
  if (!email || !token) {
    return NextResponse.json({ error: "missing_params" }, { status: 400 });
  }
  if (sign(email) !== token) {
    return NextResponse.json({ error: "invalid_token" }, { status: 401 });
  }
  logger.info("email.unsubscribe", { email });
  // TODO: persist in users.emailOptOut when schema bumps.
  return NextResponse.json({ ok: true, email });
}

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  return handle(url.searchParams.get("e"), url.searchParams.get("t"));
}

export async function POST(req: NextRequest) {
  const form = await req.formData().catch(() => null);
  const url = new URL(req.url);
  const email = (form?.get("e") as string | null) ?? url.searchParams.get("e");
  const token = (form?.get("t") as string | null) ?? url.searchParams.get("t");
  return handle(email, token);
}
