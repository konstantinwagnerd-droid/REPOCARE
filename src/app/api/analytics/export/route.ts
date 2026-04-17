import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { analyticsStore } from "@/lib/analytics/store";
import { toCSV, toJSON } from "@/lib/analytics/export";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "pdl")) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const format = new URL(req.url).searchParams.get("format") ?? "csv";
  const data = analyticsStore.all();
  if (format === "json") {
    return new NextResponse(toJSON(data), {
      headers: {
        "content-type": "application/json; charset=utf-8",
        "content-disposition": "attachment; filename=analytics.json",
      },
    });
  }
  return new NextResponse(toCSV(data), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": "attachment; filename=analytics.csv",
    },
  });
}
