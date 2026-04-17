import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getPostMortemByIncident } from "@/lib/incident-pm/store";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
): Promise<Response> {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const pm = getPostMortemByIncident(id);
  return NextResponse.json({ postmortem: pm ?? null });
}
