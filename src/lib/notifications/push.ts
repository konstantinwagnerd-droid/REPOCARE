import type { PushSubscription } from "./types";
import { notificationStore } from "./store";

/**
 * Web-Push-Subscription-Lifecycle.
 *
 * Prod-Setup:
 * 1. VAPID-Keys generieren: `npx web-push generate-vapid-keys`
 * 2. Public Key als ENV `NEXT_PUBLIC_VAPID_PUBLIC_KEY` ablegen.
 * 3. Private Key als ENV `VAPID_PRIVATE_KEY` (Server-only).
 * 4. ServiceWorker `/sw.js` registrieren (Client).
 * 5. `web-push`-Paket serverseitig zum Senden nutzen.
 *
 * Demo: wir speichern Subscriptions im Memory-Store.
 */

export function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = typeof atob === "function" ? atob(b64) : Buffer.from(b64, "base64").toString("binary");
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  return bytes;
}

export function registerSubscription(sub: PushSubscription): void {
  notificationStore.subscribe(sub);
}

export function removeSubscription(userId: string, endpoint: string): boolean {
  return notificationStore.unsubscribe(userId, endpoint);
}

export const VAPID_PUBLIC_KEY_PLACEHOLDER =
  "BPLACEHOLDER_for_local_demo_replace_in_production_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
