import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { registerSubscription } from "@/lib/notifications/push";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const userId = session.user.id ?? session.user.email ?? "demo-user";
  const body = (await req.json().catch(() => null)) as {
    endpoint?: string;
    keys?: { p256dh: string; auth: string };
  } | null;
  if (!body?.endpoint || !body.keys) return NextResponse.json({ error: "invalid subscription" }, { status: 400 });
  registerSubscription({ userId, endpoint: body.endpoint, keys: body.keys, createdAt: Date.now() });
  return NextResponse.json({ ok: true });
}
