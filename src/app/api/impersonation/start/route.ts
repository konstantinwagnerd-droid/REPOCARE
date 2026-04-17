import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { users } from "@/db/schema";
import { startImpersonation } from "@/lib/impersonation/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const admin = session.user as { id: string; email: string; name?: string; role: string; tenantId: string };
  if (admin.role !== "admin") return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const body = (await req.json()) as { targetUserId?: string; reason?: string };
  if (!body.targetUserId || !body.reason || body.reason.length < 5) {
    return NextResponse.json({ error: "targetUserId & reason (min 5 chars) required" }, { status: 400 });
  }
  const [target] = await db.select().from(users).where(eq(users.id, body.targetUserId)).limit(1);
  if (!target) return NextResponse.json({ error: "user not found" }, { status: 404 });
  if (target.tenantId !== admin.tenantId) return NextResponse.json({ error: "cross-tenant forbidden" }, { status: 403 });
  if (target.id === admin.id) return NextResponse.json({ error: "cannot impersonate self" }, { status: 400 });

  const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
  const s = await startImpersonation({
    admin: { id: admin.id, email: admin.email, name: admin.name ?? admin.email },
    target: {
      id: target.id,
      email: target.email,
      name: target.fullName,
      role: target.role,
      tenantId: target.tenantId,
    },
    reason: body.reason,
    ip,
  });
  return NextResponse.json({ session: s });
}
