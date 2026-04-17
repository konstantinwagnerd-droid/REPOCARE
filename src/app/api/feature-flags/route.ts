import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { deleteFlag, listFlags, upsertFlag } from "@/lib/feature-flags/store";
import type { FeatureFlag } from "@/lib/feature-flags/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return NextResponse.json({ flags: listFlags() });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if ((session.user as { role: string }).role !== "admin") return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const body = (await req.json()) as Partial<FeatureFlag> & { key: string };
  const now = Date.now();
  const flag: FeatureFlag = {
    key: body.key,
    name: body.name ?? body.key,
    description: body.description ?? "",
    kind: body.kind ?? "boolean",
    enabled: body.enabled ?? true,
    defaultValue: body.defaultValue ?? false,
    variants: body.variants,
    rules: body.rules ?? [],
    owner: body.owner ?? "Unknown",
    tags: body.tags ?? [],
    createdAt: body.createdAt ?? now,
    updatedAt: now,
  };
  return NextResponse.json({ flag: upsertFlag(flag) }, { status: 201 });
}

export async function DELETE(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if ((session.user as { role: string }).role !== "admin") return NextResponse.json({ error: "forbidden" }, { status: 403 });
  const { searchParams } = new URL(req.url);
  const key = searchParams.get("key");
  if (!key) return NextResponse.json({ error: "key required" }, { status: 400 });
  return NextResponse.json({ ok: deleteFlag(key) });
}
