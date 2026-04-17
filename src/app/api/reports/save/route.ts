import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { saveDashboard } from "@/lib/reports/storage";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "pdl")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const body = await req.json().catch(() => null);
  if (!body || typeof body.name !== "string" || !Array.isArray(body.widgets)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  const dash = saveDashboard({
    id: body.id,
    tenantId: session.user.tenantId,
    name: body.name,
    description: body.description,
    widgets: body.widgets,
    createdBy: session.user.id as string,
  });
  return NextResponse.json({ dashboard: dash });
}
