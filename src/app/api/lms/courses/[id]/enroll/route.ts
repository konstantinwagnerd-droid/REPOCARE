import { NextResponse } from "next/server";
import { findCourse } from "@/lib/lms/courses";
import { DEMO_CURRENT_USER, getOrCreateEnrollment } from "@/lib/lms/store";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = findCourse(id);
  if (!course) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const enrollment = getOrCreateEnrollment(DEMO_CURRENT_USER.id, course.id);
  return NextResponse.json({ enrollment });
}
