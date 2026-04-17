import { NextResponse } from "next/server";
import { db } from "@/lib/lms/store";
import { certificateHtml } from "@/lib/lms/certificate";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cert = db().certificates.find((c) => c.id === id);
  if (!cert) return NextResponse.json({ error: "not_found" }, { status: 404 });
  const html = certificateHtml(cert);
  return new NextResponse(html, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "private, no-store",
    },
  });
}
