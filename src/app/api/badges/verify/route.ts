import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAssignment, updateAssignment } from "@/lib/badges/store";
import { verifyBadge } from "@/lib/badges/verifier";

export async function POST(req: NextRequest): Promise<Response> {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (session.user.role !== "admin" && session.user.role !== "pdl") {
    return NextResponse.json({ error: "nur PDL/Admin" }, { status: 403 });
  }
  const { assignmentId } = (await req.json()) as { assignmentId: string };
  const a = getAssignment(assignmentId);
  if (!a) return NextResponse.json({ error: "nicht gefunden" }, { status: 404 });
  const verified = verifyBadge(a, session.user.name ?? "PDL");
  updateAssignment(verified);
  return NextResponse.json({ assignment: verified });
}
