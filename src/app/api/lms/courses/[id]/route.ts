import { NextResponse } from "next/server";
import { findCourse } from "@/lib/lms/courses";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const course = findCourse(id);
  if (!course) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ course });
}
