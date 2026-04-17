import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { dispatch } from "@/lib/notifications/router";
import { notificationStore } from "@/lib/notifications/store";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "pdl")) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const userId = session.user.id ?? session.user.email ?? "demo-user";
  const body = (await req.json().catch(() => null)) as { event?: string } | null;
  const event = (body?.event as "incident.reported") ?? "incident.reported";
  const tenantId = (session.user as unknown as { tenantId?: string }).tenantId ?? "demo-tenant";
  await dispatch({
    event,
    tenantId,
    audience: { scope: "user", value: userId },
    vars: { resident: "Max Mustermann", type: "Sturz", time: "14:32", reporter: "Demo-Test" },
    href: "/app/notifications",
  });
  return NextResponse.json({ ok: true, unread: notificationStore.unreadCount(userId) });
}

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "pdl")) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  return NextResponse.json({ stats: notificationStore.stats(7) });
}
