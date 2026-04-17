import { NextResponse } from "next/server";
import { clearPartnerSession } from "@/components/partner/session";

export const runtime = "nodejs";

export async function POST() {
  await clearPartnerSession();
  return NextResponse.json({ ok: true });
}
