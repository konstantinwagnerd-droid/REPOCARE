import { NextResponse } from "next/server";
import { registerApplicant, type PartnerTier } from "@/components/partner/data";

export const runtime = "nodejs";

const VALID_TIERS: PartnerTier[] = ["reseller", "implementation", "integration", "consulting"];

export async function POST(req: Request) {
  const body = await req.json().catch(() => null) as Record<string, unknown> | null;
  if (!body?.companyName || !body.contactName || !body.email || !body.tier) {
    return NextResponse.json({ ok: false, error: "Pflichtfelder fehlen." }, { status: 400 });
  }
  const tier = String(body.tier) as PartnerTier;
  if (!VALID_TIERS.includes(tier)) {
    return NextResponse.json({ ok: false, error: "Unbekannte Partner-Kategorie." }, { status: 400 });
  }
  const result = registerApplicant({
    companyName: String(body.companyName),
    contactName: String(body.contactName),
    email: String(body.email),
    tier,
    message: body.message ? String(body.message) : undefined,
  });
  return NextResponse.json(result);
}
