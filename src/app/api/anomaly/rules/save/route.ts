import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { detectorStore } from "@/lib/anomaly/detector";
import type { AnomalyRule } from "@/lib/anomaly/types";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const body = (await req.json().catch(() => null)) as { rules?: AnomalyRule[] } | null;
  if (!body?.rules || !Array.isArray(body.rules)) return NextResponse.json({ error: "invalid" }, { status: 400 });
  detectorStore.saveRules(body.rules);
  return NextResponse.json({ ok: true, count: body.rules.length });
}
