import { NextResponse } from "next/server";
import { ingestEvent } from "@/lib/analytics/tracker";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body.name !== "string") {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  const ua = req.headers.get("user-agent") ?? undefined;
  const dnt = req.headers.get("dnt") === "1";
  const res = await ingestEvent({
    name: body.name,
    page: typeof body.page === "string" ? body.page : undefined,
    feature: typeof body.feature === "string" ? body.feature : undefined,
    role: typeof body.role === "string" ? body.role : undefined,
    facility: typeof body.facility === "string" ? body.facility : undefined,
    metric: typeof body.metric === "string" ? body.metric : undefined,
    errorType: typeof body.errorType === "string" ? body.errorType : undefined,
    vitalName: typeof body.vitalName === "string" ? body.vitalName : undefined,
    value: typeof body.value === "number" ? body.value : undefined,
    userAgent: ua,
    doNotTrack: dnt,
  });
  return NextResponse.json(res, { status: res.accepted ? 204 : 200 });
}
