import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { addAssignment } from "@/lib/badges/store";
import { requestBadge } from "@/lib/badges/verifier";

export async function POST(req: NextRequest): Promise<Response> {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = (await req.json()) as {
    userId: string;
    userName?: string;
    badgeKey: string;
    proofUrl?: string;
    note?: string;
  };
  const res = requestBadge({
    tenantId: session.user.tenantId ?? "demo-tenant",
    userId: body.userId,
    userName: body.userName,
    badgeKey: body.badgeKey,
    proofUrl: body.proofUrl,
    note: body.note,
  });
  if (!res.ok || !res.assignment) return NextResponse.json({ error: res.error }, { status: 400 });
  addAssignment(res.assignment);
  return NextResponse.json({ assignment: res.assignment });
}
