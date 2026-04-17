import { NextResponse } from "next/server";
import { setModuleCompleted } from "@/lib/lms/store";

export async function POST(req: Request) {
  const body = (await req.json()) as { enrollmentId?: string; moduleId?: string };
  if (!body.enrollmentId || !body.moduleId) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  setModuleCompleted(body.enrollmentId, body.moduleId);
  return NextResponse.json({ ok: true });
}
