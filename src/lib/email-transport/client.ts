/**
 * Unified email client. Chooses provider via EMAIL_PROVIDER env.
 * Default: mock (console). Opt-in: resend | postmark | smtp.
 */
import type { EmailProvider, EmailProviderName, EmailSendParams, EmailSendResult } from "./types";
import { MockEmailProvider } from "./providers/mock";
import { logger } from "@/lib/monitoring/logger";

let cached: EmailProvider | null = null;

export async function getEmailProvider(): Promise<EmailProvider> {
  if (cached) return cached;
  const name = (process.env.EMAIL_PROVIDER ?? "mock") as EmailProviderName;
  switch (name) {
    case "resend": {
      const { ResendProvider } = await import("./providers/resend");
      cached = new ResendProvider();
      break;
    }
    case "postmark": {
      const { PostmarkProvider } = await import("./providers/postmark");
      cached = new PostmarkProvider();
      break;
    }
    case "smtp": {
      const { SMTPProvider } = await import("./providers/smtp");
      cached = new SMTPProvider();
      break;
    }
    default:
      cached = new MockEmailProvider();
  }
  logger.info("email.provider.init", { provider: cached.name });
  return cached;
}

export function _resetEmailCache(): void {
  cached = null;
}

export async function sendEmail(p: EmailSendParams): Promise<EmailSendResult> {
  const provider = await getEmailProvider();
  return provider.send(p);
}
