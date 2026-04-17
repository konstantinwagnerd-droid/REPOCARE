import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { detectorStore } from "@/lib/anomaly/detector";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "pdl")) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const header = "id,kind,severity,userId,title,summary,detectedAt,acknowledged\n";
  const rows = detectorStore
    .list()
    .map((f) =>
      [f.id, f.kind, f.severity, f.userId ?? "", f.title, f.summary.replace(/"/g, '""'), new Date(f.detectedAt).toISOString(), f.acknowledged]
        .map((c) => (typeof c === "string" && c.includes(",") ? `"${c}"` : String(c)))
        .join(","),
    )
    .join("\n");
  return new NextResponse(header + rows, {
    headers: { "content-type": "text/csv; charset=utf-8", "content-disposition": "attachment; filename=anomalies.csv" },
  });
}
