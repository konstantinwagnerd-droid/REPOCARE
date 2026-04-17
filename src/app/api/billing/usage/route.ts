import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getTenantUsage, getUsageForApiKey } from "@/lib/billing/store";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const tenantId = (session.user as { tenantId: string }).tenantId;
  const { searchParams } = new URL(req.url);
  const apiKeyId = searchParams.get("apiKeyId");
  const days = Number(searchParams.get("days") ?? "30");
  if (apiKeyId) return NextResponse.json({ buckets: getUsageForApiKey(apiKeyId, days) });
  return NextResponse.json({ buckets: getTenantUsage(tenantId, days) });
}
