/**
 * Generic SMTP adapter for self-hosted mail (Mailcow, Postfix, etc.).
 * Deliberately does not depend on nodemailer — picks it up lazily when used.
 */
import type { EmailProvider, EmailSendParams, EmailSendResult } from "../types";
import { EmailError } from "../types";

export class SMTPProvider implements EmailProvider {
  name = "smtp" as const;

  private host = process.env.SMTP_HOST ?? "";
  private port = Number(process.env.SMTP_PORT ?? 587);
  private user = process.env.SMTP_USER ?? "";
  private pass = process.env.SMTP_PASS ?? "";

  async send(p: EmailSendParams): Promise<EmailSendResult> {
    if (!this.host) throw new EmailError("SMTP_HOST missing", "provider_error", false);

    // Lazy-load nodemailer — only required when SMTP is actually used.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let nodemailer: any = null;
    try {
      // @ts-expect-error — optional dep, not in package.json by default.
      nodemailer = await import("nodemailer");
    } catch {
      throw new EmailError(
        "nodemailer not installed — run `npm install nodemailer` to enable SMTP",
        "provider_error",
        false,
      );
    }

    const transporter = nodemailer.createTransport({
      host: this.host,
      port: this.port,
      secure: this.port === 465,
      auth: this.user ? { user: this.user, pass: this.pass } : undefined,
    });

    const headers: Record<string, string> = {};
    if (p.unsubscribeUrl) {
      headers["List-Unsubscribe"] = `<${p.unsubscribeUrl}>`;
      headers["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
    }

    const info = await transporter.sendMail({
      from: p.from ?? process.env.EMAIL_FROM ?? "CareAI <noreply@careai.health>",
      to: Array.isArray(p.to) ? p.to.join(", ") : p.to,
      replyTo: p.replyTo,
      subject: p.subject,
      html: p.html,
      text: p.text,
      headers,
    });
    return { id: info.messageId ?? `smtp-${Date.now()}`, provider: "smtp", accepted: true };
  }
}
