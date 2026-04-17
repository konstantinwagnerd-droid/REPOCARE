import { NextResponse } from "next/server";
import { db } from "@/lib/lms/store";
import type { Assignment } from "@/lib/lms/types";

export async function POST(req: Request) {
  const body = (await req.json()) as {
    userIds: string[];
    courseId: string;
    dueDate: string;
    mandatory?: boolean;
  };
  if (!body.userIds?.length || !body.courseId || !body.dueDate) {
    return NextResponse.json({ error: "bad_request" }, { status: 400 });
  }
  const d = db();
  const created: Assignment[] = [];
  for (const uid of body.userIds) {
    const a: Assignment = {
      id: `as_${uid}_${body.courseId}_${Date.now()}`,
      userId: uid,
      courseId: body.courseId,
      dueDate: body.dueDate,
      mandatory: body.mandatory ?? true,
      assignedAt: new Date().toISOString(),
      assignedBy: "admin",
    };
    d.assignments.push(a);
    created.push(a);
  }
  return NextResponse.json({ ok: true, created });
}
