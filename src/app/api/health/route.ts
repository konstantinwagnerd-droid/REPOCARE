import { NextResponse } from "next/server";
import { liveness } from "@/lib/monitoring/health";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const r = await liveness();
  return NextResponse.json(r, { status: 200, headers: { "cache-control": "no-store" } });
}
