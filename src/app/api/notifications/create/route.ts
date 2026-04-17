import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { dispatch } from "@/lib/notifications/router";
import type { NotificationEvent } from "@/lib/notifications/types";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "pdl")) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const body = (await req.json().catch(() => null)) as {
    event?: NotificationEvent;
    audience?: { scope: "user" | "role" | "tenant" | "all"; value?: string };
    vars?: Record<string, string | number>;
    href?: string;
  } | null;
  if (!body?.event || !body.audience) {
    return NextResponse.json({ error: "missing event or audience" }, { status: 400 });
  }
  const tenantId = (session.user as unknown as { tenantId?: string }).tenantId ?? "demo-tenant";
  const result = await dispatch({
    event: body.event,
    audience: body.audience,
    tenantId,
    vars: body.vars,
    href: body.href,
  });
  return NextResponse.json({ created: result.length, ids: result.map((r) => r.id) });
}
