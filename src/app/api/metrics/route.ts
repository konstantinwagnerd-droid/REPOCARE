import { NextResponse } from "next/server";
import { metrics } from "@/lib/monitoring/metrics";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  // Simple bearer-token guard. Configure METRICS_TOKEN in deployment.
  const token = process.env.METRICS_TOKEN;
  if (token) {
    const auth = req.headers.get("authorization");
    if (auth !== `Bearer ${token}`) {
      return new NextResponse("unauthorized", { status: 401 });
    }
  }
  return new NextResponse(metrics.toPrometheus(), {
    status: 200,
    headers: { "content-type": "text/plain; version=0.0.4", "cache-control": "no-store" },
  });
}
