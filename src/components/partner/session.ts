/**
 * Leichte Partner-Session auf Cookie-Basis.
 * Bewusst KEINE next-auth-Integration und KEINE Rollen-Änderung im User-Schema
 * (TABU: src/db/). Stattdessen: separates, signatur-loses Demo-Cookie.
 * Produktion: durch ordentliche Session (z. B. eigene next-auth-Provider-Erweiterung) ersetzen.
 */

import { cookies } from "next/headers";
import { getPartner, type PartnerAccount } from "./data";

const COOKIE_NAME = "careai_partner";

export async function setPartnerSession(partnerId: string) {
  const store = await cookies();
  store.set(COOKIE_NAME, partnerId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 Stunden
  });
}

export async function clearPartnerSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function getPartnerSession(): Promise<PartnerAccount | null> {
  const store = await cookies();
  const id = store.get(COOKIE_NAME)?.value;
  if (!id) return null;
  return getPartner(id) ?? null;
}
