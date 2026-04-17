import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { BADGE_CATALOG, recommendedForRole } from "@/lib/badges/catalog";

export async function GET(): Promise<Response> {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const recommended = session.user.role ? recommendedForRole(session.user.role) : [];
  return NextResponse.json({ catalog: BADGE_CATALOG, recommended });
}
