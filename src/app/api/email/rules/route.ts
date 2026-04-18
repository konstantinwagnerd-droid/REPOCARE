/**
 * Routing-Rules CRUD.
 *
 * GET    /api/email/rules          -> Liste (admin/pdl)
 * POST   /api/email/rules          -> Neu anlegen
 * DELETE /api/email/rules?id=...   -> Loeschen
 */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { emailRoutingRules } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { classifyEmail, type RoutingRule } from "@/lib/email-routing/classifier";

export const runtime = "nodejs";

const RuleSchema = z.object({
  name: z.string().min(1).max(120),
  matchType: z.enum(["subject_contains", "body_contains", "from_domain"]),
  matchValue: z.string().min(1).max(200),
  classification: z.enum(["lead", "application", "complaint", "support", "other"]),
  priority: z.number().int().min(0).max(10000).default(100),
  active: z.boolean().default(true),
});

const TestSchema = z.object({
  from: z.string().email(),
  subject: z.string(),
  text: z.string(),
});

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) return { error: NextResponse.json({ error: "unauthorized" }, { status: 401 }) };
  const role = (session.user as { role?: string }).role;
  if (role !== "admin" && role !== "pdl") {
    return { error: NextResponse.json({ error: "forbidden" }, { status: 403 }) };
  }
  const tenantId = (session.user as { tenantId?: string }).tenantId;
  if (!tenantId) return { error: NextResponse.json({ error: "no_tenant" }, { status: 400 }) };
  return { tenantId };
}

export async function GET() {
  const r = await requireAdmin();
  if ("error" in r) return r.error;
  const rows = await db
    .select()
    .from(emailRoutingRules)
    .where(eq(emailRoutingRules.tenantId, r.tenantId))
    .orderBy(desc(emailRoutingRules.priority));
  return NextResponse.json({ rules: rows });
}

export async function POST(req: NextRequest) {
  const r = await requireAdmin();
  if ("error" in r) return r.error;

  const body = await req.json().catch(() => null);

  // Test-Endpoint: { test: {...} } -> klassifiziere ohne zu speichern
  if (body && typeof body === "object" && "test" in body) {
    const testParsed = TestSchema.safeParse((body as { test: unknown }).test);
    if (!testParsed.success) {
      return NextResponse.json({ error: "invalid_test_input" }, { status: 400 });
    }
    const rules = await db.select().from(emailRoutingRules).where(eq(emailRoutingRules.tenantId, r.tenantId));
    const result = classifyEmail(
      { fromEmail: testParsed.data.from, subject: testParsed.data.subject, bodyText: testParsed.data.text },
      rules.map((rr) => ({
        id: rr.id,
        matchType: rr.matchType,
        matchValue: rr.matchValue,
        classification: rr.classification,
        priority: rr.priority,
        active: rr.active,
      })) as RoutingRule[],
    );
    return NextResponse.json({ test: true, result });
  }

  const parsed = RuleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input", issues: parsed.error.flatten() }, { status: 400 });
  }

  const [row] = await db
    .insert(emailRoutingRules)
    .values({ ...parsed.data, tenantId: r.tenantId })
    .returning();
  return NextResponse.json({ rule: row }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const r = await requireAdmin();
  if ("error" in r) return r.error;
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "missing_id" }, { status: 400 });
  await db
    .delete(emailRoutingRules)
    .where(and(eq(emailRoutingRules.id, id), eq(emailRoutingRules.tenantId, r.tenantId)));
  return NextResponse.json({ ok: true });
}
