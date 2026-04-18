import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { certifications, certificationRequirements } from "@/db/schema";
import { CERTIFICATION_TEMPLATES, computeCertStatus } from "@/lib/certifications/templates";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const role = session.user.role;
  if (role !== "admin" && role !== "pdl") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = (await req.json()) as {
    certificationType: string;
    awardedDate: string;
    auditor?: string | null;
    certificateNumber?: string | null;
    useTemplate?: boolean;
  };

  const tmpl = CERTIFICATION_TEMPLATES[body.certificationType];
  const awarded = new Date(body.awardedDate);
  const expires = tmpl ? new Date(awarded.getTime() + tmpl.validityMonths * 30 * 86400_000) : null;

  const [cert] = await db
    .insert(certifications)
    .values({
      tenantId: session.user.tenantId,
      certificationType: body.certificationType,
      status: computeCertStatus(expires),
      awardedDate: awarded,
      expiresDate: expires,
      auditor: body.auditor ?? null,
      certificateNumber: body.certificateNumber ?? null,
      scope: tmpl?.label ?? null,
    })
    .returning();

  if (body.useTemplate && tmpl) {
    await db.insert(certificationRequirements).values(
      tmpl.requirements.map((r) => ({
        certificationId: cert.id,
        title: r.title,
        description: r.description,
        category: r.category,
      })),
    );
  }

  return NextResponse.json({ ok: true, id: cert.id });
}
