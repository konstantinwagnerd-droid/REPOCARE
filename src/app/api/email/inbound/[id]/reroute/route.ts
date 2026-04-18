/**
 * Re-Klassifikation einer bestehenden eingegangenen E-Mail.
 */
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { emailInbound, emailRoutingRules } from "@/db/schema";
import { eq } from "drizzle-orm";
import { classifyEmail, type RoutingRule } from "@/lib/email-routing/classifier";

export const runtime = "nodejs";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const role = (session.user as { role?: string }).role;
  if (role !== "admin" && role !== "pdl") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const tenantId = (session.user as { tenantId?: string }).tenantId;
  if (!tenantId) return NextResponse.json({ error: "no_tenant" }, { status: 400 });

  const { id } = await params;
  const [row] = await db.select().from(emailInbound).where(eq(emailInbound.id, id)).limit(1);
  if (!row) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const rules = await db
    .select()
    .from(emailRoutingRules)
    .where(eq(emailRoutingRules.tenantId, tenantId));
  const result = classifyEmail(
    {
      fromEmail: row.fromEmail,
      subject: row.subject,
      bodyText: row.bodyText ?? "",
    },
    rules.map((r) => ({
      id: r.id,
      matchType: r.matchType,
      matchValue: r.matchValue,
      classification: r.classification,
      priority: r.priority,
      active: r.active,
    })) as RoutingRule[],
  );

  await db
    .update(emailInbound)
    .set({
      classification: result.classification,
      confidence: result.confidence,
      routedTo: result.routedTo,
      metadataJson: { reason: result.reason, matchedRule: result.matchedRule ?? null, reroute: true },
    })
    .where(eq(emailInbound.id, id));

  return NextResponse.json({ ok: true, result });
}
