import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDashboard } from "@/lib/reports/storage";
import { renderDashboardHtml } from "@/lib/reports/exporter";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const { id } = await params;
  const d = getDashboard(id);
  if (!d) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const html = renderDashboardHtml(d);
  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `inline; filename="${d.name.replace(/[^\w-]+/g, "_")}.html"`,
    },
  });
}

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  return GET(_req, ctx);
}
