import { NextResponse } from "next/server";
import { db, DEMO_CURRENT_USER, setModuleCompleted } from "@/lib/lms/store";

export async function POST(req: Request) {
  const body = (await req.json()) as { enrollmentId?: string; moduleId?: string; text?: string };
  if (!body.enrollmentId || !body.moduleId) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const key = `${body.moduleId}_${DEMO_CURRENT_USER.id}`;
  db().reflections[key] = body.text ?? "";
  setModuleCompleted(body.enrollmentId, body.moduleId);
  return NextResponse.json({ ok: true });
}
