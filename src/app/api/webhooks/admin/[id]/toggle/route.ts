import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getWebhook, updateWebhook } from "@/lib/webhooks/queue";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "pdl")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const { id } = await params;
  const wh = getWebhook(id);
  if (!wh || wh.tenantId !== session.user.tenantId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const next = updateWebhook(id, { status: wh.status === "active" ? "disabled" : "active" });
  return NextResponse.json({ webhook: next });
}
