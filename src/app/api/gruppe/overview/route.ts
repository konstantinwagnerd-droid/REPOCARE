import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { resolveActiveGroup, currentMonth } from "@/app/gruppe/_lib/context";
import { rollupGroup, rollupTrend } from "@/lib/multi-tenant/rollup";
import { last12Months } from "@/lib/multi-tenant/seed";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  if (session.user.role !== "admin" && session.user.role !== "pdl")
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });

  const url = new URL(req.url);
  const group = resolveActiveGroup(url.searchParams.get("gruppe") ?? undefined);
  const month = currentMonth();
  const rollup = rollupGroup(group, month);
  const months = last12Months();
  const trend = rollupTrend(group, months);
  return NextResponse.json({ group: { id: group.id, name: group.name, slug: group.slug }, month, rollup, trend });
}
