/**
 * Consent-Modell.
 * Keine Cookies notwendig (kein PII erfasst) → kein Cookie-Banner nötig.
 * Dennoch: einmaliger Hinweis + Opt-Out jederzeit möglich.
 * Opt-Out wird clientseitig in localStorage gespiegelt + per DNT-Header honoriert.
 */

export const OPT_OUT_KEY = "careai:analytics:opt-out";

export function isOptedOut(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (navigator.doNotTrack === "1" || (window as unknown as { doNotTrack?: string }).doNotTrack === "1") return true;
    return localStorage.getItem(OPT_OUT_KEY) === "1";
  } catch {
    return false;
  }
}

export function setOptOut(enabled: boolean): void {
  if (typeof window === "undefined") return;
  try {
    if (enabled) localStorage.setItem(OPT_OUT_KEY, "1");
    else localStorage.removeItem(OPT_OUT_KEY);
  } catch {
    /* ignore */
  }
}
