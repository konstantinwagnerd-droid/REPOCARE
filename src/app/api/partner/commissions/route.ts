import { NextResponse } from "next/server";
import { getPartnerSession } from "@/components/partner/session";
import { listCommissionsByPartner } from "@/components/partner/data";

export const runtime = "nodejs";

export async function GET() {
  const session = await getPartnerSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Nicht authentifiziert." }, { status: 401 });
  }
  return NextResponse.json({ ok: true, commissions: listCommissionsByPartner(session.id) });
}
