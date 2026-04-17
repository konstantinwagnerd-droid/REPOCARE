import { NextResponse } from "next/server";
import { db } from "@/lib/lms/store";
import type { Course } from "@/lib/lms/types";

export async function POST(req: Request) {
  const body = (await req.json()) as { course: Course };
  if (!body.course?.id) return NextResponse.json({ error: "bad_request" }, { status: 400 });
  const d = db();
  const idx = d.courses.findIndex((c) => c.id === body.course.id);
  if (idx >= 0) d.courses[idx] = body.course;
  else d.courses.push(body.course);
  return NextResponse.json({ ok: true, course: body.course });
}
