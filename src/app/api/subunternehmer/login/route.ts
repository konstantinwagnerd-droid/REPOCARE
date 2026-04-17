import { NextRequest, NextResponse } from "next/server";
import { getSubByEmail, saveSub, logAudit } from "@/lib/subcontractor/store";

/**
 * Einfacher Magic-Link-Flow: User gibt Email ein, erhaelt Token.
 * In Produktion: Token per Email senden; hier direkt zurueckgeben (Dev-Mode).
 */
export async function POST(req: NextRequest): Promise<Response> {
  const body = (await req.json()) as { email?: string; token?: string };
  if (!body.email) return NextResponse.json({ error: "email required" }, { status: 400 });

  const sub = getSubByEmail(body.email);
  if (!sub || !sub.active) return NextResponse.json({ error: "unknown or inactive" }, { status: 401 });

  if (body.token) {
    if (sub.magicToken !== body.token) {
      logAudit({
        id: `sa-${Date.now()}`,
        tenantId: sub.tenantId,
        subcontractorId: sub.id,
        at: new Date().toISOString(),
        action: "login_failed",
        success: false,
      });
      return NextResponse.json({ error: "invalid token" }, { status: 401 });
    }
    if (sub.magicTokenExpires && new Date(sub.magicTokenExpires) < new Date()) {
      return NextResponse.json({ error: "token expired" }, { status: 401 });
    }
    sub.magicToken = undefined;
    sub.magicTokenExpires = undefined;
    sub.acceptedAt = sub.acceptedAt ?? new Date().toISOString();
    saveSub(sub);
    logAudit({
      id: `sa-${Date.now()}`,
      tenantId: sub.tenantId,
      subcontractorId: sub.id,
      at: new Date().toISOString(),
      action: "login_ok",
      success: true,
    });
    // Ein simples Session-Cookie (Demo).
    const res = NextResponse.json({ ok: true, subcontractor: { id: sub.id, name: sub.name, profession: sub.profession } });
    res.cookies.set("sub_session", sub.id, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 8 });
    return res;
  }

  // Token generieren (in Prod: per Email; hier zurueckgeben).
  const token = `mt-${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;
  sub.magicToken = token;
  sub.magicTokenExpires = new Date(Date.now() + 15 * 60 * 1000).toISOString();
  saveSub(sub);
  return NextResponse.json({ ok: true, devToken: token });
}

export async function DELETE(): Promise<Response> {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete("sub_session");
  return res;
}
