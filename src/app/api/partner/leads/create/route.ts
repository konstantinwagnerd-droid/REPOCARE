import { NextResponse } from "next/server";
import { getPartnerSession } from "@/components/partner/session";
import { createLead } from "@/components/partner/data";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = await getPartnerSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Nicht authentifiziert." }, { status: 401 });
  }
  const body = await req.json().catch(() => null) as Record<string, unknown> | null;
  if (!body?.facilityName || !body.contactName || !body.email || !body.places) {
    return NextResponse.json({ ok: false, error: "Pflichtfelder fehlen." }, { status: 400 });
  }
  const lead = createLead({
    partnerId: session.id,
    facilityName: String(body.facilityName),
    contactName: String(body.contactName),
    email: String(body.email),
    phone: body.phone ? String(body.phone) : undefined,
    places: Number(body.places),
    estimatedMonthlyValue: Number(body.estimatedMonthlyValue ?? estimateValue(Number(body.places))),
    notes: body.notes ? String(body.notes) : undefined,
  });
  return NextResponse.json({ ok: true, lead });
}

function estimateValue(places: number): number {
  if (places <= 25) return 299;
  if (places <= 80) return 599;
  return 999;
}
