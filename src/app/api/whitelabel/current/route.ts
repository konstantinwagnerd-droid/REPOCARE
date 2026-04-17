import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getBrand } from "@/lib/whitelabel/store";
import { generateBrandCss } from "@/lib/whitelabel/css-generator";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const brand = getBrand();
  return NextResponse.json({ brand, css: generateBrandCss(brand) });
}
