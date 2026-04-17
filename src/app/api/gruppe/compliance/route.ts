import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { resolveActiveGroup, currentMonth } from "@/app/gruppe/_lib/context";
import { snapshotsForGroup } from "@/lib/multi-tenant/seed";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  if (session.user.role !== "admin" && session.user.role !== "pdl")
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });

  const url = new URL(req.url);
  const group = resolveActiveGroup(url.searchParams.get("gruppe") ?? undefined);
  const month = currentMonth();
  const snaps = snapshotsForGroup(group, month);

  const rows = group.facilities.map((f) => {
    const s = snaps.find((x) => x.facilityId === f.id)!;
    return {
      facilityId: f.id, name: f.name, lastAuditAt: f.lastAuditAt,
      complianceQuotePct: s.complianceQuotePct,
      mdCheckOpenFindings: s.mdCheckOpenFindings,
      dsgvoRequestsOpen: s.dsgvoRequestsOpen,
    };
  });

  const totals = {
    mdCheckOpenFindings: rows.reduce((s, r) => s + r.mdCheckOpenFindings, 0),
    dsgvoRequestsOpen: rows.reduce((s, r) => s + r.dsgvoRequestsOpen, 0),
    complianceQuoteAvg: rows.reduce((s, r) => s + r.complianceQuotePct, 0) / rows.length,
  };

  return NextResponse.json({ month, rows, totals });
}
