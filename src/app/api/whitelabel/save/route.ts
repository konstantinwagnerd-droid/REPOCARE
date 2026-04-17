import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { saveBrand } from "@/lib/whitelabel/store";
import { validateColors } from "@/lib/whitelabel/validator";
import type { BrandConfig } from "@/lib/whitelabel/types";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  if (session.user.role !== "admin") return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });

  const body = (await req.json()) as BrandConfig;
  if (!body?.identity?.productName) return NextResponse.json({ error: "productName fehlt" }, { status: 400 });

  const val = validateColors(body.colors);
  if (!val.ok) return NextResponse.json({ error: "Farbvalidierung fehlgeschlagen", details: val.errors }, { status: 400 });

  const saved = saveBrand(body);
  return NextResponse.json({ ok: true, brand: saved });
}
