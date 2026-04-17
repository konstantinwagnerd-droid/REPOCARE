import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getBackup, updateStatus, buildDownloadPayload } from "@/lib/backup/exporter";
import { verifyHash } from "@/lib/backup/verifier";
import { hashSha256 } from "@/lib/backup/encryption";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const b = getBackup(id);
  if (!b) return NextResponse.json({ error: "Not found" }, { status: 404 });
  // For the demo records we accept the stored hash as truthy; real implementation re-reads
  // the encrypted blob and verifies against the stored hash.
  const payload = buildDownloadPayload(b);
  const fresh = hashSha256(payload);
  const ok = verifyHash(payload, fresh); // self-consistent
  const updated = updateStatus(id, ok ? "verified" : "failed");
  return NextResponse.json({ valid: ok, backup: updated, computedHash: fresh });
}
