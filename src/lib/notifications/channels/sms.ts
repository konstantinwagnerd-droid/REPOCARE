import type { Notification } from "../types";

/**
 * SMS-Channel (Twilio-kompatible Schnittstelle, Mock).
 * Kein echter Versand – dokumentiert nur die Signatur für Prod.
 */
export interface TwilioLike {
  messages: { create(args: { to: string; from: string; body: string }): Promise<{ sid: string }> };
}

export async function deliverSms(n: Notification, client?: TwilioLike): Promise<boolean> {
  if (!client) {
    // eslint-disable-next-line no-console
    console.info("[notifications.sms-stub] ->", n.userId, n.title);
    return true;
  }
  try {
    await client.messages.create({ to: n.userId, from: "CareAI", body: `${n.title} – ${n.body}` });
    return true;
  } catch {
    return false;
  }
}
