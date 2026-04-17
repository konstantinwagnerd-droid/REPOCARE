import type { Notification } from "../types";
import { notificationStore } from "../store";

/**
 * In-App-Channel: legt Notification in den User-Inbox-Store.
 * Toasts werden clientseitig via SWR-Poll + <NotificationToaster /> gezeigt.
 */
export async function deliverInApp(n: Notification): Promise<boolean> {
  notificationStore.push(n.userId, n);
  return true;
}
