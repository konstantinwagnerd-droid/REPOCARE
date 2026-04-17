import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadAsset } from "@/lib/whitelabel/store";
import { validateDataUrl } from "@/lib/whitelabel/asset-uploader";
import type { BrandConfig } from "@/lib/whitelabel/types";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  if (session.user.role !== "admin") return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });

  const { slot, dataUrl } = (await req.json()) as { slot: keyof BrandConfig["assets"]; dataUrl: string };
  const val = validateDataUrl(dataUrl);
  if (!val.ok) return NextResponse.json({ error: val.error }, { status: 400 });

  const brand = uploadAsset("demo-tenant", slot, dataUrl);
  return NextResponse.json({ ok: true, brand, bytes: val.bytes, mime: val.mime });
}
