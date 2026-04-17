import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { saveSub, saveScope } from "@/lib/subcontractor/store";
import { grantConsent } from "@/lib/subcontractor/consent";
import type { Subcontractor, DataCategory, SubProfession } from "@/lib/subcontractor/types";

export async function POST(req: NextRequest): Promise<Response> {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (session.user.role !== "admin" && session.user.role !== "pdl") {
    return NextResponse.json({ error: "nur PDL/Admin" }, { status: 403 });
  }
  const body = (await req.json()) as {
    name: string;
    email: string;
    profession: SubProfession;
    company?: string;
    professionalId?: string;
    consents?: Array<{ residentId: string; residentName?: string; categories: DataCategory[]; grantedByName: string; grantedByRelation?: string; validUntil?: string }>;
  };
  if (!body.name || !body.email || !body.profession) {
    return NextResponse.json({ error: "name, email, profession noetig" }, { status: 400 });
  }
  const tenantId = session.user.tenantId ?? "demo-tenant";
  const sub: Subcontractor = {
    id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    tenantId,
    name: body.name,
    email: body.email,
    company: body.company,
    profession: body.profession,
    professionalId: body.professionalId,
    active: true,
    invitedAt: new Date().toISOString(),
    magicToken: `mt-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`,
    magicTokenExpires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
  };
  saveSub(sub);
  for (const c of body.consents ?? []) {
    saveScope(
      grantConsent({
        tenantId,
        subcontractorId: sub.id,
        residentId: c.residentId,
        residentName: c.residentName,
        categories: c.categories,
        grantedByName: c.grantedByName,
        grantedByRelation: c.grantedByRelation,
        validUntil: c.validUntil,
      }),
    );
  }
  return NextResponse.json({
    ok: true,
    subcontractor: sub,
    magicLink: `/subunternehmer?email=${encodeURIComponent(sub.email)}&token=${sub.magicToken}`,
  });
}
