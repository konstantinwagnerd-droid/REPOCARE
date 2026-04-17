import type { EmailProvider, EmailSendParams, EmailSendResult } from "../types";
import { EmailError } from "../types";

const BASE = process.env.POSTMARK_BASE_URL ?? "https://api.postmarkapp.com";

export class PostmarkProvider implements EmailProvider {
  name = "postmark" as const;
  constructor(private token: string = process.env.POSTMARK_TOKEN ?? "") {
    if (!this.token) throw new EmailError("POSTMARK_TOKEN missing", "provider_error", false);
  }

  async send(p: EmailSendParams): Promise<EmailSendResult> {
    const to = Array.isArray(p.to) ? p.to.join(",") : p.to;
    const body = {
      From: p.from ?? process.env.EMAIL_FROM ?? "CareAI <noreply@careai.health>",
      To: to,
      Subject: p.subject,
      HtmlBody: p.html,
      TextBody: p.text,
      ReplyTo: p.replyTo,
      MessageStream: process.env.POSTMARK_STREAM ?? "outbound",
      Metadata: p.tags,
      Headers: p.unsubscribeUrl
        ? [
            { Name: "List-Unsubscribe", Value: `<${p.unsubscribeUrl}>` },
            { Name: "List-Unsubscribe-Post", Value: "List-Unsubscribe=One-Click" },
          ]
        : undefined,
    };
    const resp = await fetch(`${BASE}/email`, {
      method: "POST",
      headers: {
        "X-Postmark-Server-Token": this.token,
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (resp.status === 429) throw new EmailError("Postmark rate-limited", "rate_limit", true);
    if (!resp.ok) {
      const txt = await resp.text().catch(() => "");
      throw new EmailError(`Postmark ${resp.status}: ${txt.slice(0, 200)}`, "provider_error");
    }
    const data = (await resp.json()) as { MessageID: string };
    return { id: data.MessageID, provider: "postmark", accepted: true };
  }
}
