import { NextRequest } from "next/server";
import { db } from "@/db/client";
import { careReports, users, residents } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { signReport } from "@/lib/pdf/hash";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return new Response("Unauthorized", { status: 401 });
  const { id } = await params;
  const [report] = await db.select().from(careReports).where(eq(careReports.id, id)).limit(1);
  if (!report) return Response.json({ error: "not found" }, { status: 404 });
  if (report.signatureHash) return Response.json({ error: "already signed" }, { status: 409 });
  const [author] = await db.select().from(users).where(eq(users.id, report.authorId)).limit(1);
  const [resident] = await db.select().from(residents).where(eq(residents.id, report.residentId)).limit(1);

  const signedAt = new Date();
  const hash = signReport({
    content: report.content,
    authorId: report.authorId,
    authorName: author?.fullName ?? "",
    timestamp: signedAt,
  });

  const [updated] = await db.update(careReports).set({ signatureHash: hash, signedAt }).where(eq(careReports.id, id)).returning();

  await logAudit({
    tenantId: resident?.tenantId ?? session.user.tenantId,
    userId: session.user.id,
    entityType: "care_report",
    entityId: id,
    action: "update",
    before: report, after: updated,
  });

  return Response.json({ ok: true, signatureHash: hash, signedAt });
}
