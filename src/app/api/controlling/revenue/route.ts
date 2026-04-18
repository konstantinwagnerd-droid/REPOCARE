import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { pflegegradRevenue } from "@/db/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = session.user.role;
  if (role !== "admin" && role !== "pdl") return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const tenantId = session.user.tenantId;
  const body = (await req.json()) as { rows: Array<{ pflegegrad: number; monthlyRevenueCents: number; country: string; validFrom: string }> };
  if (!Array.isArray(body.rows)) return NextResponse.json({ error: "rows required" }, { status: 400 });

  await db.delete(pflegegradRevenue).where(eq(pflegegradRevenue.tenantId, tenantId));
  if (body.rows.length > 0) {
    await db.insert(pflegegradRevenue).values(
      body.rows.map((r) => ({
        tenantId,
        pflegegrad: Number(r.pflegegrad),
        monthlyRevenueCents: Number(r.monthlyRevenueCents) || 0,
        country: r.country || "DE",
        validFrom: new Date(r.validFrom),
      })),
    );
  }
  return NextResponse.json({ ok: true, count: body.rows.length });
}
