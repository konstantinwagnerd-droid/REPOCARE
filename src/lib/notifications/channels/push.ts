import type { Notification } from "../types";
import { notificationStore } from "../store";

/**
 * Web-Push-Channel (Stub/Mock).
 * In Produktion würde hier `web-push` mit VAPID-Keys aufgerufen.
 * Demo: loggen und Subscription-Liste honorieren.
 */
export async function deliverPush(n: Notification): Promise<boolean> {
  const subs = notificationStore.subscriptions(n.userId);
  if (subs.length === 0) return false;
  // eslint-disable-next-line no-console
  console.info(`[notifications.push] -> ${subs.length} subs:`, n.title);
  return true;
}
