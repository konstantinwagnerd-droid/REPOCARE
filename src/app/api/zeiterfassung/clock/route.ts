import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { addClockEvent, getStatus } from "@/lib/zeiterfassung/store";
import type { ClockEventType } from "@/lib/zeiterfassung/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VALID: ClockEventType[] = ["in", "out", "pause-start", "pause-end"];

const ALLOWED_TRANSITIONS: Record<"in" | "out" | "pause", ClockEventType[]> = {
  out: ["in"],
  in: ["out", "pause-start"],
  pause: ["pause-end"],
};

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const user = session.user as { id: string; name?: string; tenantId: string };
  const body = (await req.json()) as { type?: ClockEventType; note?: string };
  if (!body.type || !VALID.includes(body.type)) {
    return NextResponse.json({ error: "invalid type" }, { status: 400 });
  }
  const status = getStatus(user.tenantId, user.id);
  if (!ALLOWED_TRANSITIONS[status.state].includes(body.type)) {
    return NextResponse.json(
      { error: `Transition ${status.state} -> ${body.type} nicht erlaubt` },
      { status: 409 },
    );
  }
  const evt = addClockEvent({
    tenantId: user.tenantId,
    userId: user.id,
    userName: user.name ?? user.id,
    type: body.type,
    timestamp: Date.now(),
    note: body.note,
  });
  return NextResponse.json({ event: evt, status: getStatus(user.tenantId, user.id) });
}

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const user = session.user as { id: string; tenantId: string };
  return NextResponse.json({ status: getStatus(user.tenantId, user.id) });
}
