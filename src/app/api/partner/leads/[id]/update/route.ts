import { NextResponse } from "next/server";
import { getPartnerSession } from "@/components/partner/session";
import { updateLead, listLeadsByPartner, type LeadStatus } from "@/components/partner/data";

export const runtime = "nodejs";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getPartnerSession();
  if (!session) {
    return NextResponse.json({ ok: false, error: "Nicht authentifiziert." }, { status: 401 });
  }
  const { id } = await params;
  const ownsLead = listLeadsByPartner(session.id).some((l) => l.id === id);
  if (!ownsLead) {
    return NextResponse.json({ ok: false, error: "Lead nicht gefunden." }, { status: 404 });
  }
  const body = await req.json().catch(() => null) as { status?: LeadStatus; notes?: string } | null;
  if (!body) {
    return NextResponse.json({ ok: false, error: "Ungültige Daten." }, { status: 400 });
  }
  const updated = updateLead(id, {
    status: body.status,
    notes: body.notes,
  });
  return NextResponse.json({ ok: true, lead: updated });
}
