/**
 * Modul-Details + Fragen.
 * GET /api/training/modules/[id]
 *
 * Fuer Pflegekraefte: Fragen ohne correct_indices (werden erst beim submit ausgeliefert).
 * Fuer Admin/PDL: mit correct_indices zur Verwaltung.
 */
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { trainingModules, trainingQuestions } from "@/db/schema";
import { and, eq, asc } from "drizzle-orm";

export const runtime = "nodejs";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const tenantId = (session.user as { tenantId?: string }).tenantId;
  const role = (session.user as { role?: string }).role;
  if (!tenantId) return NextResponse.json({ error: "no_tenant" }, { status: 400 });

  const { id } = await params;

  const [mod] = await db
    .select()
    .from(trainingModules)
    .where(and(eq(trainingModules.id, id), eq(trainingModules.tenantId, tenantId)))
    .limit(1);
  if (!mod) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const questions = await db
    .select()
    .from(trainingQuestions)
    .where(eq(trainingQuestions.moduleId, id))
    .orderBy(asc(trainingQuestions.orderIndex));

  const isAdminView = role === "admin" || role === "pdl";
  const sanitized = isAdminView
    ? questions
    : questions.map((q) => ({
        id: q.id,
        question: q.question,
        type: q.type,
        optionsJson: q.optionsJson,
        orderIndex: q.orderIndex,
      }));

  return NextResponse.json({ module: mod, questions: sanitized });
}
