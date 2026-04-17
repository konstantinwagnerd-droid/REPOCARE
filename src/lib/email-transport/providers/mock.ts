import type { EmailProvider, EmailSendParams, EmailSendResult } from "../types";
import { logger } from "@/lib/monitoring/logger";

export class MockEmailProvider implements EmailProvider {
  name = "mock" as const;
  async send(p: EmailSendParams): Promise<EmailSendResult> {
    const id = `local-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    logger.info("email.mock.send", {
      id,
      to: p.to,
      subject: p.subject,
      bytes: p.html.length,
      tags: p.tags,
    });
    return { id, provider: "mock", accepted: true };
  }
}
