import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { runSync } from "@/lib/crm-sync/sync-engine";
import type { SyncConfig } from "@/lib/crm-sync/types";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const body = (await req.json().catch(() => ({}))) as Partial<SyncConfig> & { since?: string };
  const cfg: SyncConfig = {
    provider: body.provider ?? "mock",
    direction: "pull",
    conflictResolution: body.conflictResolution ?? "newest-wins",
    rateLimitRps: body.rateLimitRps ?? 5,
  };
  const result = await runSync(cfg, body.since);
  return NextResponse.json(result);
}
