import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { resetBrand } from "@/lib/whitelabel/store";

export async function POST() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  if (session.user.role !== "admin") return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  const brand = resetBrand();
  return NextResponse.json({ ok: true, brand });
}
