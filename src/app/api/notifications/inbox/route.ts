import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { notificationStore } from "@/lib/notifications/store";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const userId = session.user.id ?? session.user.email ?? "demo-user";
  const url = new URL(req.url);
  const filter = (url.searchParams.get("filter") as "all" | "unread" | "critical") ?? "all";
  const items = notificationStore.inbox(userId, filter);
  return NextResponse.json({
    items,
    unreadCount: notificationStore.unreadCount(userId),
  });
}
