import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { scan, detectorStore } from "@/lib/anomaly/detector";
import { generateMockEvents } from "@/lib/anomaly/mock-events";
import { handleFinding } from "@/lib/anomaly/actions";

export async function POST() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "pdl")) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const tenantId = (session.user as unknown as { tenantId?: string }).tenantId ?? "demo-tenant";
  const events = generateMockEvents();
  const findings = scan(events);
  for (const f of findings) {
    await handleFinding(f, tenantId);
  }
  return NextResponse.json({ scanned: events.length, found: findings.length, total: detectorStore.list().length });
}
