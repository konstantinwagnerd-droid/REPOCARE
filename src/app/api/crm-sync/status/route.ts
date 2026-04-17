import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getProvider } from "@/lib/crm-sync/sync-engine";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const url = new URL(req.url);
  const providerName = (url.searchParams.get("provider") ?? "mock") as "salesforce" | "hubspot" | "mock";
  const provider = await getProvider(providerName);
  const ping = await provider.ping();
  return NextResponse.json({ provider: providerName, ...ping, checkedAt: new Date().toISOString() });
}
