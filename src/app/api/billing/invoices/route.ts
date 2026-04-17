import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateInvoice, listInvoices } from "@/lib/billing/store";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const tenantId = (session.user as { tenantId: string }).tenantId;
  return NextResponse.json({ invoices: listInvoices(tenantId) });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const body = (await req.json()) as { apiKeyId?: string; periodYm?: string };
  if (!body.apiKeyId || !body.periodYm) return NextResponse.json({ error: "apiKeyId & periodYm required" }, { status: 400 });
  const inv = generateInvoice(body.apiKeyId, body.periodYm);
  if (!inv) return NextResponse.json({ error: "not found" }, { status: 404 });
  return NextResponse.json({ invoice: inv }, { status: 201 });
}
