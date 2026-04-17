import { NextResponse } from "next/server";
import { readiness } from "@/lib/monitoring/health";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const r = await readiness();
  const status = r.status === "ok" ? 200 : r.status === "degraded" ? 200 : 503;
  return NextResponse.json(r, { status, headers: { "cache-control": "no-store" } });
}
