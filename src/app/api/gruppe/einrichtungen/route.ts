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
  const map = new Map(snaps.map((s) => [s.facilityId, s]));

  return NextResponse.json({
    month,
    facilities: group.facilities.map((f) => ({
      ...f,
      snapshot: map.get(f.id),
    })),
  });
}
