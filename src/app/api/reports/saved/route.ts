import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { savedReports } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import type { QuerySpec } from "@/lib/reports/query-builder";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const rows = await db
    .select()
    .from(savedReports)
    .where(eq(savedReports.tenantId, session.user.tenantId));
  return NextResponse.json({ reports: rows });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = session.user.role;
  if (role !== "admin" && role !== "pdl") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = (await req.json()) as { name: string; description?: string; spec: QuerySpec };
  if (!body.name?.trim() || !body.spec?.entity) {
    return NextResponse.json({ error: "name + spec required" }, { status: 400 });
  }

  const [row] = await db
    .insert(savedReports)
    .values({
      tenantId: session.user.tenantId,
      name: body.name,
      description: body.description ?? null,
      entity: body.spec.entity,
      filtersJson: body.spec.filters,
      columnsJson: body.spec.columns,
      sortJson: body.spec.sort ?? null,
      limitRows: body.spec.limit ?? 100,
      createdBy: session.user.id as string,
    })
    .returning();
  return NextResponse.json({ report: row });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = new URL(req.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
  await db
    .delete(savedReports)
    .where(and(eq(savedReports.id, id), eq(savedReports.tenantId, session.user.tenantId)));
  return NextResponse.json({ ok: true });
}
