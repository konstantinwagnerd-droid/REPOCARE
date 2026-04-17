import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { notificationStore } from "@/lib/notifications/store";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const userId = session.user.id ?? session.user.email ?? "demo-user";
  const body = (await req.json().catch(() => null)) as { ids?: string[]; all?: boolean } | null;
  if (body?.all) {
    const n = notificationStore.markAllRead(userId);
    return NextResponse.json({ updated: n });
  }
  const n = notificationStore.markRead(userId, body?.ids ?? []);
  return NextResponse.json({ updated: n });
}
