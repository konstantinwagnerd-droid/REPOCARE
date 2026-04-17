import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getCurrentImpersonation } from "@/lib/impersonation/service";
import { listSessions } from "@/lib/impersonation/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const user = session.user as { tenantId: string; role: string };
  const current = await getCurrentImpersonation();
  const history = user.role === "admin" ? listSessions(user.tenantId, 50) : [];
  return NextResponse.json({ current, history });
}
