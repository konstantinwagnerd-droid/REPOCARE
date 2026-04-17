import { NextResponse } from "next/server";
import { checkRateLimit, getApiKeyByKey, recordMeterEvent } from "@/lib/billing/store";
import { PLANS } from "@/lib/billing/plans";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// RFC-8594 Meter-Format Endpoint — simuliert Request von Drittsystem
export async function POST(req: Request) {
  const authz = req.headers.get("authorization") ?? "";
  const key = authz.startsWith("Bearer ") ? authz.slice(7) : "";
  const apiKey = getApiKeyByKey(key);
  if (!apiKey || apiKey.revoked) {
    return NextResponse.json({ error: "invalid_api_key" }, { status: 401 });
  }
  const plan = PLANS[apiKey.planId];
  const rl = checkRateLimit(apiKey.id, plan.rateLimitRpm);
  if (!rl.ok) {
    return NextResponse.json({ error: "rate_limited", retryAfter: 60 }, {
      status: 429,
      headers: { "retry-after": "60", "x-ratelimit-remaining": "0" },
    });
  }
  const body = (await req.json().catch(() => ({}))) as { endpoint?: string; method?: string };
  const start = Date.now();
  const latency = 30 + Math.round(Math.random() * 120);
  const status = Math.random() > 0.98 ? 500 : 200;
  const event = recordMeterEvent({
    apiKeyId: apiKey.id,
    tenantId: apiKey.tenantId,
    endpoint: body.endpoint ?? "/api/public/ping",
    method: body.method ?? "GET",
    statusCode: status,
    latencyMs: latency,
    timestamp: start,
  });
  return NextResponse.json(
    {
      // RFC-8594 Meter-Format
      meter: {
        name: event.meter,
        value: event.value,
        unit: event.unit,
        timestamp: new Date(event.timestamp).toISOString(),
      },
      rateLimit: { limit: plan.rateLimitRpm, remaining: rl.remaining, window: "60s" },
      request: { id: event.id, latencyMs: latency, status },
    },
    {
      status,
      headers: {
        "x-ratelimit-limit": String(plan.rateLimitRpm),
        "x-ratelimit-remaining": String(rl.remaining),
      },
    },
  );
}
