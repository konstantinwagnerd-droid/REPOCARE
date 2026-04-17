import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { notificationStore } from "@/lib/notifications/store";
import type { NotificationPreferences } from "@/lib/notifications/types";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const userId = session.user.id ?? session.user.email ?? "demo-user";
  const body = (await req.json().catch(() => null)) as Partial<NotificationPreferences> | null;
  const prev = notificationStore.getPrefs(userId);
  const next: NotificationPreferences = {
    userId,
    events: { ...prev.events, ...(body?.events ?? {}) },
    channels: { ...prev.channels, ...(body?.channels ?? {}) },
    quietHours: body?.quietHours ?? prev.quietHours,
  };
  notificationStore.savePrefs(next);
  return NextResponse.json({ ok: true, prefs: next });
}

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const userId = session.user.id ?? session.user.email ?? "demo-user";
  return NextResponse.json({ prefs: notificationStore.getPrefs(userId) });
}
