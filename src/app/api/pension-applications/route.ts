/**
 * Pflegegeld-Antrags-API
 *
 * GET   — listet Anträge des Tenants (optional nach resident_id gefiltert)
 * POST  — legt einen neuen Antrag mit Autofill an
 */
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db/client";
import { pensionApplications, residents, tenants, biographies } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { buildAutofillFormData } from "@/lib/pension/autofill";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return new Response("Unauthorized", { status: 401 });

  const tenantId = session.user.tenantId as string | undefined;
  if (!tenantId) return new Response("No tenant", { status: 400 });

  const residentId = req.nextUrl.searchParams.get("resident_id");

  const rows = await db
    .select()
    .from(pensionApplications)
    .where(
      residentId
        ? and(eq(pensionApplications.tenantId, tenantId), eq(pensionApplications.residentId, residentId))
        : eq(pensionApplications.tenantId, tenantId),
    )
    .orderBy(desc(pensionApplications.createdAt));

  return NextResponse.json({ items: rows });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return new Response("Unauthorized", { status: 401 });

  const tenantId = session.user.tenantId as string | undefined;
  if (!tenantId) return new Response("No tenant", { status: 400 });

  const body = (await req.json()) as {
    residentId: string;
    applicationType: "de-sgb-xi" | "at-bpgg";
  };
  if (!body.residentId || !body.applicationType) {
    return new Response("Invalid body", { status: 400 });
  }

  const [resident] = await db
    .select()
    .from(residents)
    .where(and(eq(residents.id, body.residentId), eq(residents.tenantId, tenantId)))
    .limit(1);
  if (!resident) return new Response("Resident not found", { status: 404 });

  const [tenant] = await db.select().from(tenants).where(eq(tenants.id, tenantId)).limit(1);
  const [biography] = await db
    .select()
    .from(biographies)
    .where(eq(biographies.residentId, resident.id))
    .limit(1);

  const formData = buildAutofillFormData({
    jurisdiction: body.applicationType,
    resident,
    biography: biography ?? null,
    tenant: tenant ? { name: tenant.name, address: tenant.address } : null,
  });

  const [created] = await db
    .insert(pensionApplications)
    .values({
      residentId: resident.id,
      tenantId,
      applicationType: body.applicationType,
      status: "draft",
      formData: formData as unknown as Record<string, unknown>,
      createdBy: session.user.id as string,
    })
    .returning();

  await logAudit({
    tenantId,
    userId: session.user.id as string,
    entityType: "pension_application",
    entityId: created.id,
    action: "create",
    after: { type: body.applicationType, residentId: resident.id },
  });

  return NextResponse.json(created, { status: 201 });
}
