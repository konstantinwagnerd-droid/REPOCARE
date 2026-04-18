/**
 * Schulungs-Attempt API.
 *
 * POST  /api/training/attempt      -> Attempt starten { moduleId } -> { attemptId }
 * PATCH /api/training/attempt      -> Attempt abschliessen { attemptId, answers } -> { result, certificateId? }
 */
import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import {
  trainingAttempts,
  trainingModules,
  trainingQuestions,
  trainingCertificates,
} from "@/db/schema";
import { and, eq, asc } from "drizzle-orm";
import { z } from "zod";
import { gradeAttempt } from "@/lib/training/grade";

export const runtime = "nodejs";

const StartSchema = z.object({ moduleId: z.string().uuid() });
const SubmitSchema = z.object({
  attemptId: z.string().uuid(),
  answers: z.record(z.string(), z.array(z.number().int().min(0).max(20))),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const tenantId = (session.user as { tenantId?: string }).tenantId;
  const userId = (session.user as { id?: string }).id;
  if (!tenantId || !userId) return NextResponse.json({ error: "no_tenant" }, { status: 400 });

  const body = await req.json().catch(() => null);
  const parsed = StartSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  // Modul verifizieren
  const [mod] = await db
    .select()
    .from(trainingModules)
    .where(and(eq(trainingModules.id, parsed.data.moduleId), eq(trainingModules.tenantId, tenantId)))
    .limit(1);
  if (!mod) return NextResponse.json({ error: "module_not_found" }, { status: 404 });

  const [attempt] = await db
    .insert(trainingAttempts)
    .values({ tenantId, userId, moduleId: mod.id })
    .returning();

  return NextResponse.json({ attemptId: attempt.id });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const tenantId = (session.user as { tenantId?: string }).tenantId;
  const userId = (session.user as { id?: string }).id;
  if (!tenantId || !userId) return NextResponse.json({ error: "no_tenant" }, { status: 400 });

  const body = await req.json().catch(() => null);
  const parsed = SubmitSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "invalid_input" }, { status: 400 });

  const [attempt] = await db
    .select()
    .from(trainingAttempts)
    .where(and(eq(trainingAttempts.id, parsed.data.attemptId), eq(trainingAttempts.userId, userId)))
    .limit(1);
  if (!attempt) return NextResponse.json({ error: "attempt_not_found" }, { status: 404 });
  if (attempt.completedAt) {
    return NextResponse.json({ error: "already_completed" }, { status: 409 });
  }

  const [mod] = await db
    .select()
    .from(trainingModules)
    .where(eq(trainingModules.id, attempt.moduleId))
    .limit(1);
  if (!mod) return NextResponse.json({ error: "module_missing" }, { status: 404 });

  const questions = await db
    .select()
    .from(trainingQuestions)
    .where(eq(trainingQuestions.moduleId, mod.id))
    .orderBy(asc(trainingQuestions.orderIndex));

  const result = gradeAttempt(
    questions.map((q) => ({
      id: q.id,
      type: q.type,
      correctIndicesJson: (q.correctIndicesJson as number[]) ?? [],
      explanation: q.explanation,
    })),
    parsed.data.answers,
    mod.passingScore,
  );

  await db
    .update(trainingAttempts)
    .set({
      completedAt: new Date(),
      score: result.score,
      passed: result.passed,
      answersJson: parsed.data.answers,
    })
    .where(eq(trainingAttempts.id, attempt.id));

  let certificateId: string | null = null;
  if (result.passed) {
    const hash = crypto
      .createHash("sha256")
      .update(`${attempt.id}:${userId}:${mod.id}:${Date.now()}`)
      .digest("hex")
      .slice(0, 32);
    const issuedAt = new Date();
    const expiresAt = new Date(issuedAt.getTime());
    expiresAt.setMonth(expiresAt.getMonth() + mod.validityMonths);

    const [cert] = await db
      .insert(trainingCertificates)
      .values({
        tenantId,
        userId,
        moduleId: mod.id,
        attemptId: attempt.id,
        issuedAt,
        expiresAt,
        certificateHash: hash,
      })
      .returning();
    certificateId = cert.id;
  }

  return NextResponse.json({
    result,
    passingScore: mod.passingScore,
    certificateId,
  });
}
