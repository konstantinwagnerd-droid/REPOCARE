import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { saveSchedule } from "@/lib/backup/scheduler";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json().catch(() => null);
  if (!body || typeof body.cron !== "string") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const schedule = saveSchedule({
    id: body.id,
    tenantId: session.user.tenantId,
    cron: body.cron,
    type: body.type ?? "full",
    enabled: body.enabled ?? true,
    retentionDaily: body.retentionDaily ?? 7,
    retentionWeekly: body.retentionWeekly ?? 4,
    retentionMonthly: body.retentionMonthly ?? 12,
  });
  return NextResponse.json({ schedule });
}
