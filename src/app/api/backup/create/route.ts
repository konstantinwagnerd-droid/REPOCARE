import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createBackup } from "@/lib/backup/exporter";
import type { BackupType } from "@/lib/backup/types";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { type = "full", note } = (await req.json().catch(() => ({}))) as { type?: BackupType; note?: string };
  const record = await createBackup({ tenantId: session.user.tenantId, type, note });
  return NextResponse.json({ backup: record });
}
