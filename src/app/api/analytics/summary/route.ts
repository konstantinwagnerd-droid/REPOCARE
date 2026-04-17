import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { analyticsStore } from "@/lib/analytics/store";

export async function GET() {
  const session = await auth();
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "pdl")) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  return NextResponse.json(analyticsStore.summary());
}
