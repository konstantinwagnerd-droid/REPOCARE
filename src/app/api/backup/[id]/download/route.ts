import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getBackup, buildDownloadPayload } from "@/lib/backup/exporter";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const b = getBackup(id);
  if (!b) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const payload = buildDownloadPayload(b);
  return new NextResponse(payload, {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${b.id}.careai-backup.json"`,
      "X-CareAI-Hash": b.hashSha256,
    },
  });
}
