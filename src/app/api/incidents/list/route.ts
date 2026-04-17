import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { listIncidents } from "@/lib/incident-pm/store";

export async function GET(): Promise<Response> {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const list = listIncidents(session.user.tenantId ?? "*");
  return NextResponse.json({ incidents: list });
}
