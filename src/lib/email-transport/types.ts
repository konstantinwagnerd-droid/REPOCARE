export type EmailProviderName = "mock" | "resend" | "postmark" | "smtp";

export interface EmailAddress {
  email: string;
  name?: string;
}

export interface EmailSendParams {
  to: string | string[];
  from?: string;
  replyTo?: string;
  subject: string;
  html: string;
  text?: string;
  tags?: Record<string, string>;
  /** Idempotency — same key = same send (provider-dependent). */
  idempotencyKey?: string;
  /** Required for DSGVO-compliant unsubscribe (link-in-footer). */
  unsubscribeUrl?: string;
}

export interface EmailSendResult {
  id: string;
  provider: EmailProviderName;
  accepted: boolean;
  /** Retry-after ms, if provider hints one. */
  retryAfterMs?: number;
}

export interface EmailProvider {
  name: EmailProviderName;
  send(p: EmailSendParams): Promise<EmailSendResult>;
}

export class EmailError extends Error {
  constructor(
    message: string,
    public code: "rate_limit" | "invalid_input" | "provider_error" | "bounce",
    public retryable = true,
  ) {
    super(message);
    this.name = "EmailError";
  }
}
