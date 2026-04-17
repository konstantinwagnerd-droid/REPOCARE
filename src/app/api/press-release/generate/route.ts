import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generatePressRelease } from "@/lib/press-release/generator";
import type { TemplateId } from "@/lib/press-release/types";

const VALID_IDS: TemplateId[] = [
  "milestone",
  "funding",
  "partner",
  "product",
  "event",
];

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "pdl")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => null);
  if (
    !body ||
    typeof body.templateId !== "string" ||
    !VALID_IDS.includes(body.templateId as TemplateId) ||
    typeof body.values !== "object" ||
    body.values === null
  ) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  try {
    const result = generatePressRelease({
      templateId: body.templateId as TemplateId,
      values: body.values as Record<string, string>,
    });
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Render failed" },
      { status: 500 },
    );
  }
}
