import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { byUser } from "@/lib/badges/store";
import { withDefs } from "@/lib/badges/expiry";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> },
): Promise<Response> {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const list = byUser(id);
  return NextResponse.json({ assignments: withDefs(list) });
}
