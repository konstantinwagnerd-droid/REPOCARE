import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { abStore } from "@/lib/ab-testing/store";
import { generateReport } from "@/lib/ab-testing/reporter";

export async function GET(_req: Request, { params }: { params: Promise<{ experiment: string }> }) {
  const session = await auth();
  if (!session?.user || (session.user.role !== "admin" && session.user.role !== "pdl")) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const { experiment } = await params;
  const exp = abStore.getByName(experiment) ?? abStore.getById(experiment);
  if (!exp) return NextResponse.json({ error: "experiment not found" }, { status: 404 });
  const report = generateReport(exp.id);
  return NextResponse.json(report);
}
