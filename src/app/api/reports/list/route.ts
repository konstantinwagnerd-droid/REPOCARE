import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { listDashboards } from "@/lib/reports/storage";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return NextResponse.json({ dashboards: listDashboards(session.user.tenantId) });
}
