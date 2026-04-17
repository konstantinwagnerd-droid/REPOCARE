import { NextResponse } from "next/server";
import { abStore } from "@/lib/ab-testing/store";
import { assignVariant } from "@/lib/ab-testing/assignment";
import { trackImpression } from "@/lib/ab-testing/tracker";

function getUserHash(req: Request): string {
  const cookie = req.headers.get("cookie") ?? "";
  const m = cookie.match(/(?:^|;\s*)ab_uid=([^;]+)/);
  if (m) return m[1];
  // Fallback to IP + UA
  const ua = req.headers.get("user-agent") ?? "anon";
  const ip = req.headers.get("x-forwarded-for") ?? "0.0.0.0";
  return `${ip}:${ua}`.slice(0, 128);
}

export async function GET(req: Request, { params }: { params: Promise<{ experiment: string }> }) {
  const { experiment } = await params;
  const url = new URL(req.url);
  const track = url.searchParams.get("track") !== "false";
  const userHash = getUserHash(req);

  const exp = abStore.getByName(experiment);
  if (!exp) return NextResponse.json({ error: "experiment not found" }, { status: 404 });

  const variant = assignVariant(exp, userHash);
  if (!variant) return NextResponse.json({ enrolled: false });

  if (track) trackImpression(experiment, userHash);

  return NextResponse.json({
    enrolled: true,
    experimentId: exp.id,
    experimentName: exp.name,
    variantId: variant.id,
    variantName: variant.name,
    payload: variant.payload ?? {},
  });
}
