import type { Notification } from "../types";

/**
 * E-Mail-Channel (Stub).
 * Keine echte E-Mail – die /emails Infrastruktur ist TABU. Hier logt es nur.
 */
export async function deliverEmail(n: Notification): Promise<boolean> {
  // eslint-disable-next-line no-console
  console.info("[notifications.email] ->", n.userId, n.title);
  return true;
}
