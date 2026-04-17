import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { listBackups } from "@/lib/backup/exporter";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return NextResponse.json({ backups: listBackups(session.user.tenantId) });
}
