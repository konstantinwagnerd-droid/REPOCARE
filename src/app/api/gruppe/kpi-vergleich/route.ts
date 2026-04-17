import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { resolveActiveGroup, currentMonth } from "@/app/gruppe/_lib/context";
import { buildCompareMatrix, bestPracticeFacility } from "@/lib/multi-tenant/comparator";
import type { NumericKpiKey } from "@/lib/multi-tenant/rollup";

const DEFAULT_METRICS: NumericKpiKey[] = [
  "occupancyPct", "avgPflegegrad", "staffTurnoverPct", "documentationRatePct",
  "incidentRate", "complianceQuotePct", "complaints", "revenueEur", "ebitdaEur",
];

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  if (session.user.role !== "admin" && session.user.role !== "pdl")
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });

  const url = new URL(req.url);
  const group = resolveActiveGroup(url.searchParams.get("gruppe") ?? undefined);
  const month = currentMonth();
  const matrix = buildCompareMatrix(group, month, DEFAULT_METRICS);
  const best = bestPracticeFacility(group, month);
  return NextResponse.json({ month, metrics: DEFAULT_METRICS, matrix, bestPractice: best });
}
