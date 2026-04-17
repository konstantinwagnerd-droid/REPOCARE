import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { stopImpersonation } from "@/lib/impersonation/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const admin = session.user as { id: string };
  const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const s = await stopImpersonation(admin.id, ip);
  return NextResponse.json({ stopped: s });
}
