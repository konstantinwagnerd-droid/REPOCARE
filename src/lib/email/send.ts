/**
 * Email sender interface. Default driver: console logger (dev).
 * Swap `defaultDriver` for Resend / Postmark / SES in production.
 */
import { logger } from "@/lib/monitoring/logger";

export interface SendParams {
  to: string | string[];
  from?: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  tags?: Record<string, string>;
}

export interface EmailDriver {
  send(p: SendParams): Promise<{ id: string; accepted: boolean }>;
}

class ConsoleDriver implements EmailDriver {
  async send(p: SendParams) {
    const id = `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    logger.info("email.send", { id, to: p.to, subject: p.subject, bytes: p.html.length });
    return { id, accepted: true };
  }
}

export const defaultDriver: EmailDriver = new ConsoleDriver();

export async function sendEmail(params: SendParams, driver: EmailDriver = defaultDriver) {
  return driver.send({ from: process.env.EMAIL_FROM ?? "CareAI <noreply@careai.at>", ...params });
}
