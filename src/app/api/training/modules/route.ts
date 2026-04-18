/**
 * Training Modules CRUD.
 *
 * GET  /api/training/modules        -> Liste (mit Frageanzahl + letztem Attempt des Users)
 * POST /api/training/modules        -> Neues Modul anlegen (admin/pdl)
 */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { trainingModules } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";
import { z } from "zod";

export const runtime = "nodejs";

const CreateModuleSchema = z.object({
  title: z.string().min(1).max(200),
  category: z.enum(["dnqp", "hygiene", "btm", "brandschutz", "dsgvo", "custom"]),
  description: z.string().max(2000).optional(),
  passingScore: z.number().int().min(0).max(100).default(80),
  durationMinutes: z.number().int().min(1).max(480).default(15),
  isMandatory: z.boolean().default(true),
  validityMonths: z.number().int().min(1).max(120).default(12),
});

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const tenantId = (session.user as { tenantId?: string }).tenantId;
  const userId = (session.user as { id?: string }).id;
  if (!tenantId || !userId) return NextResponse.json({ error: "no_tenant" }, { status: 400 });

  const url = new URL(req.url);
  const mandatoryOnly = url.searchParams.get("mandatoryOnly") === "1";

  const rows = await db
    .select({
      id: trainingModules.id,
      title: trainingModules.title,
      category: trainingModules.category,
      description: trainingModules.description,
      passingScore: trainingModules.passingScore,
      durationMinutes: trainingModules.durationMinutes,
      isMandatory: trainingModules.isMandatory,
      validityMonths: trainingModules.validityMonths,
      questionCount: sql<number>`(SELECT count(*)::int FROM training_questions q WHERE q.module_id = ${trainingModules.id})`,
      lastAttemptAt: sql<Date | null>`(SELECT max(a.completed_at) FROM training_attempts a WHERE a.module_id = ${trainingModules.id} AND a.user_id = ${userId}::uuid AND a.passed = true)`,
    })
    .from(trainingModules)
    .where(eq(trainingModules.tenantId, tenantId))
    .orderBy(desc(trainingModules.isMandatory), trainingModules.title);

  const filtered = mandatoryOnly ? rows.filter((r) => r.isMandatory) : rows;
  return NextResponse.json({ modules: filtered });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const role = (session.user as { role?: string }).role;
  if (role !== "admin" && role !== "pdl") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const tenantId = (session.user as { tenantId?: string }).tenantId;
  if (!tenantId) return NextResponse.json({ error: "no_tenant" }, { status: 400 });

  const body = await req.json().catch(() => null);
  const parsed = CreateModuleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input", issues: parsed.error.flatten() }, { status: 400 });
  }

  const [row] = await db
    .insert(trainingModules)
    .values({ ...parsed.data, tenantId })
    .returning();

  return NextResponse.json({ module: row }, { status: 201 });
}

