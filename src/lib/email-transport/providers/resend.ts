/**
 * Resend adapter — uses EU region endpoint when configured.
 * Resend automatically handles SPF/DKIM/DMARC.
 */
import type { EmailProvider, EmailSendParams, EmailSendResult } from "../types";
import { EmailError } from "../types";

const BASE = process.env.RESEND_BASE_URL ?? "https://api.resend.com";

export class ResendProvider implements EmailProvider {
  name = "resend" as const;
  constructor(private apiKey: string = process.env.RESEND_API_KEY ?? "") {
    if (!this.apiKey) throw new EmailError("RESEND_API_KEY missing", "provider_error", false);
  }

  async send(p: EmailSendParams): Promise<EmailSendResult> {
    const body = {
      from: p.from ?? process.env.EMAIL_FROM ?? "CareAI <noreply@careai.health>",
      to: Array.isArray(p.to) ? p.to : [p.to],
      subject: p.subject,
      html: p.html,
      text: p.text,
      reply_to: p.replyTo,
      tags: p.tags
        ? Object.entries(p.tags).map(([name, value]) => ({ name, value }))
        : undefined,
      headers: p.unsubscribeUrl
        ? {
            "List-Unsubscribe": `<${p.unsubscribeUrl}>`,
            "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
          }
        : undefined,
    };
    const resp = await fetch(`${BASE}/emails`, {
      method: "POST",
      headers: {
        authorization: `Bearer ${this.apiKey}`,
        "content-type": "application/json",
        ...(p.idempotencyKey ? { "Idempotency-Key": p.idempotencyKey } : {}),
      },
      body: JSON.stringify(body),
    });

    if (resp.status === 429) {
      throw new EmailError("Resend rate-limited", "rate_limit", true);
    }
    if (!resp.ok) {
      const txt = await resp.text().catch(() => "");
      throw new EmailError(`Resend ${resp.status}: ${txt.slice(0, 200)}`, "provider_error");
    }
    const data = (await resp.json()) as { id: string };
    return { id: data.id, provider: "resend", accepted: true };
  }
}
