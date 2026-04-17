import { NextResponse } from "next/server";
import { authenticate } from "@/components/partner/data";
import { setPartnerSession } from "@/components/partner/session";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null) as { email?: string; password?: string } | null;
  if (!body?.email || !body.password) {
    return NextResponse.json({ ok: false, error: "E-Mail und Passwort erforderlich." }, { status: 400 });
  }
  const partner = authenticate(body.email, body.password);
  if (!partner) {
    return NextResponse.json({ ok: false, error: "Unbekannte Kombination aus E-Mail und Passwort." }, { status: 401 });
  }
  await setPartnerSession(partner.id);
  return NextResponse.json({ ok: true, partner: { id: partner.id, email: partner.email, companyName: partner.companyName } });
}
