import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { allAssignments } from "@/lib/badges/store";
import { expiringSoon, withDefs } from "@/lib/badges/expiry";

export async function GET(): Promise<Response> {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const all = allAssignments(session.user.tenantId ?? "*");
  const exp = expiringSoon(all);
  return NextResponse.json({ expiring: withDefs(exp) });
}
