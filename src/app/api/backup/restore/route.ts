import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { restoreFromPayload } from "@/lib/backup/importer";
import type { ConflictStrategy } from "@/lib/backup/types";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json().catch(() => null) as { payload?: string; strategy?: ConflictStrategy } | null;
  if (!body?.payload) return NextResponse.json({ error: "Missing payload" }, { status: 400 });
  const strategy = body.strategy ?? "skip";
  const report = await restoreFromPayload(body.payload, strategy);
  return NextResponse.json({ report });
}
