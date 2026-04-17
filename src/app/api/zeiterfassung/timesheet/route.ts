import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getTimeSheetMonth, listAllUserIds, getUserMeta, setApproval, exportMonthCsv } from "@/lib/zeiterfassung/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const user = session.user as { id: string; name?: string; tenantId: string; role: string };
  const { searchParams } = new URL(req.url);
  const ym = searchParams.get("ym") ?? new Date().toISOString().slice(0, 7);
  const scope = searchParams.get("scope") ?? "me";
  const format = searchParams.get("format");

  if (scope === "all") {
    if (user.role !== "admin" && user.role !== "pdl") return NextResponse.json({ error: "forbidden" }, { status: 403 });
    if (format === "csv") {
      const csv = exportMonthCsv(user.tenantId, ym);
      return new NextResponse(csv, { status: 200, headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": `attachment; filename="zeiterfassung-${ym}.csv"` } });
    }
    const ids = listAllUserIds(user.tenantId);
    const sheets = ids.map((uid) => getTimeSheetMonth(user.tenantId, uid, getUserMeta(user.tenantId, uid).name, ym));
    return NextResponse.json({ sheets });
  }
  const sheet = getTimeSheetMonth(user.tenantId, user.id, user.name ?? user.id, ym);
  return NextResponse.json({ sheet });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const user = session.user as { id: string; tenantId: string; role: string };
  if (user.role !== "admin" && user.role !== "pdl") return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const body = (await req.json()) as { userId?: string; ym?: string; action?: "approve" | "reject" };
  if (!body.userId || !body.ym || !body.action) return NextResponse.json({ error: "userId, ym, action required" }, { status: 400 });
  setApproval(body.userId, body.ym, body.action === "approve" ? "approved" : "rejected", user.id);
  return NextResponse.json({ ok: true });
}
