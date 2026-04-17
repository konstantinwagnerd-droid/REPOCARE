import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { updateActionItems } from "@/lib/incident-pm/store";
import type { ActionItem } from "@/lib/incident-pm/types";

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
): Promise<Response> {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const body = (await req.json()) as { items: ActionItem[] };
  const pm = updateActionItems(id, body.items);
  if (!pm) return NextResponse.json({ error: "PostMortem nicht gefunden" }, { status: 404 });
  return NextResponse.json({ postmortem: pm });
}
