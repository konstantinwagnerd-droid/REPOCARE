import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { removeSubscription } from "@/lib/notifications/push";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const userId = session.user.id ?? session.user.email ?? "demo-user";
  const body = (await req.json().catch(() => null)) as { endpoint?: string } | null;
  if (!body?.endpoint) return NextResponse.json({ error: "endpoint required" }, { status: 400 });
  const ok = removeSubscription(userId, body.endpoint);
  return NextResponse.json({ ok });
}
