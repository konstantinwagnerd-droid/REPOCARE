import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { resolveActiveGroup, currentMonth } from "@/app/gruppe/_lib/context";
import { snapshotsForGroup, last12Months } from "@/lib/multi-tenant/seed";
import { rollupTrend } from "@/lib/multi-tenant/rollup";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  if (session.user.role !== "admin" && session.user.role !== "pdl")
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });

  const url = new URL(req.url);
  const group = resolveActiveGroup(url.searchParams.get("gruppe") ?? undefined);
  const month = currentMonth();
  const snaps = snapshotsForGroup(group, month);
  const trend = rollupTrend(group, last12Months());

  const perFacility = group.facilities.map((f) => {
    const s = snaps.find((x) => x.facilityId === f.id)!;
    return { facilityId: f.id, name: f.name, city: f.city, revenue: s.revenueEur, cost: s.costEur, ebitda: s.ebitdaEur };
  });

  const totals = {
    revenueEur: snaps.reduce((s, x) => s + x.revenueEur, 0),
    costEur: snaps.reduce((s, x) => s + x.costEur, 0),
    ebitdaEur: snaps.reduce((s, x) => s + x.ebitdaEur, 0),
  };

  return NextResponse.json({ month, perFacility, totals, trend });
}
