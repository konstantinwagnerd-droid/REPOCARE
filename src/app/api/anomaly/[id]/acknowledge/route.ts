import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { detectorStore } from "@/lib/anomaly/detector";

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "pdl")) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const { id } = await ctx.params;
  const by = session.user.email ?? session.user.name ?? "admin";
  const ok = detectorStore.acknowledge(id, by);
  return NextResponse.json({ ok });
}
