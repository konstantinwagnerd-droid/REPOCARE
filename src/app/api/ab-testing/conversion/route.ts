import { NextResponse } from "next/server";
import { trackConversion } from "@/lib/ab-testing/tracker";

function getUserHash(req: Request): string {
  const cookie = req.headers.get("cookie") ?? "";
  const m = cookie.match(/(?:^|;\s*)ab_uid=([^;]+)/);
  if (m) return m[1];
  const ua = req.headers.get("user-agent") ?? "anon";
  const ip = req.headers.get("x-forwarded-for") ?? "0.0.0.0";
  return `${ip}:${ua}`.slice(0, 128);
}

export async function POST(req: Request) {
  let body: { experiment?: string; metricId?: string; value?: number };
  try { body = await req.json(); } catch { return NextResponse.json({ error: "invalid JSON" }, { status: 400 }); }

  const { experiment, metricId, value } = body;
  if (!experiment || !metricId) return NextResponse.json({ error: "experiment and metricId required" }, { status: 400 });

  const userHash = getUserHash(req);
  const ev = trackConversion(experiment, userHash, metricId, value);
  if (!ev) return NextResponse.json({ error: "not enrolled or experiment missing" }, { status: 404 });
  return NextResponse.json({ ok: true, event: ev });
}
