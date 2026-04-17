// Basis Service-Worker-Registrierung. Idempotent.
// Erwartet eine SW-Datei unter /sw.js — falls nicht vorhanden, no-op.

export async function registerOfflineSW(swPath = "/sw.js"): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined") return null;
  if (!("serviceWorker" in navigator)) return null;
  try {
    // Prüfen, ob die SW-Datei vorhanden ist (vermeidet 404-Fehler-Spam in dev)
    const probe = await fetch(swPath, { method: "HEAD" }).catch(() => null);
    if (!probe || !probe.ok) return null;
    const reg = await navigator.serviceWorker.register(swPath, { scope: "/" });
    return reg;
  } catch {
    return null;
  }
}

export async function unregisterOfflineSW(): Promise<boolean> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return false;
  const regs = await navigator.serviceWorker.getRegistrations();
  let any = false;
  for (const r of regs) any = (await r.unregister()) || any;
  return any;
}
