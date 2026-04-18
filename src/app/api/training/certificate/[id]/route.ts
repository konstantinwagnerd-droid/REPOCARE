/**
 * Zertifikats-Daten fuer PDF-Druck.
 * GET /api/training/certificate/[id] -> JSON
 */
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { trainingCertificates, trainingModules, users } from "@/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const userId = (session.user as { id?: string }).id;
  const role = (session.user as { role?: string }).role;
  if (!userId) return NextResponse.json({ error: "no_user" }, { status: 400 });

  const { id } = await params;
  const [row] = await db
    .select({
      id: trainingCertificates.id,
      issuedAt: trainingCertificates.issuedAt,
      expiresAt: trainingCertificates.expiresAt,
      hash: trainingCertificates.certificateHash,
      userId: trainingCertificates.userId,
      userName: users.fullName,
      moduleTitle: trainingModules.title,
      moduleCategory: trainingModules.category,
    })
    .from(trainingCertificates)
    .innerJoin(users, eq(users.id, trainingCertificates.userId))
    .innerJoin(trainingModules, eq(trainingModules.id, trainingCertificates.moduleId))
    .where(eq(trainingCertificates.id, id))
    .limit(1);

  if (!row) return NextResponse.json({ error: "not_found" }, { status: 404 });

  // Pflegekraft darf nur eigene Zertifikate sehen
  if (role !== "admin" && role !== "pdl" && row.userId !== userId) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  return NextResponse.json({ certificate: row });
}
