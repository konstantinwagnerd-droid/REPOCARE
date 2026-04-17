import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { addSignOff } from "@/lib/incident-pm/store";

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
): Promise<Response> {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const body = (await req.json()) as { role: string; notes?: string };
  if (!body.role) return NextResponse.json({ error: "role erforderlich" }, { status: 400 });
  const pm = addSignOff(id, {
    role: body.role,
    userName: session.user.name ?? undefined,
    signedAt: new Date().toISOString(),
    notes: body.notes,
  });
  if (!pm) return NextResponse.json({ error: "PostMortem nicht gefunden" }, { status: 404 });
  return NextResponse.json({ postmortem: pm });
}
