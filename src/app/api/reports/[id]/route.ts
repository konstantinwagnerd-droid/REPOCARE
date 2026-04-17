import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDashboard } from "@/lib/reports/storage";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const d = getDashboard(id);
  if (!d) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ dashboard: d });
}
