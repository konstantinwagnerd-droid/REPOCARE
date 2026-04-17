import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createPostMortem, getPostMortemByIncident, savePostMortem } from "@/lib/incident-pm/store";
import { detectNameMentions } from "@/lib/incident-pm/analyzer";
import type { PostMortem } from "@/lib/incident-pm/types";

export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> },
): Promise<Response> {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const body = (await req.json()) as Partial<PostMortem> & { templateKey?: string; title?: string };

  let pm = getPostMortemByIncident(id);
  if (!pm) {
    if (!body.templateKey || !body.title) {
      return NextResponse.json({ error: "templateKey + title noetig" }, { status: 400 });
    }
    pm = createPostMortem(
      id,
      session.user.tenantId ?? "demo-tenant",
      body.templateKey,
      body.title,
      session.user.name ?? "Unbekannt",
    );
  }

  // Patch
  if (body.timeline) pm.timeline = body.timeline;
  if (body.contributingFactors) pm.contributingFactors = body.contributingFactors;
  if (body.whatWentWell) pm.whatWentWell = body.whatWentWell;
  if (body.whatWentWrong) pm.whatWentWrong = body.whatWentWrong;
  if (body.actionItems) pm.actionItems = body.actionItems;
  if (body.status) pm.status = body.status;

  const warnings = detectNameMentions([...(pm.whatWentWrong ?? [])]);

  const saved = savePostMortem(pm);
  return NextResponse.json({ postmortem: saved, warnings });
}
