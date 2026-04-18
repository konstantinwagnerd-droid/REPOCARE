import { NextResponse } from "next/server";
import { liveness } from "@/lib/monitoring/health";

// Node runtime: health.ts lazy-imports @/db/client but webpack still bundles
// postgres-js which needs Node built-ins (stream, tls, perf_hooks). Edge would
// save a few ms but break the build — not worth it for a health endpoint.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const r = await liveness();
  return NextResponse.json(r, { status: 200, headers: { "cache-control": "no-store" } });
}
