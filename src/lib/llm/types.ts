/**
 * LLM Provider — unified interface for Claude, OpenAI, Mock.
 * EU-only providers preferred (DSGVO / patient data).
 */

export type LLMProviderName = "mock" | "anthropic" | "openai";

export interface LLMMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LLMRequest {
  model?: string;
  system?: string;
  messages: LLMMessage[];
  temperature?: number;
  maxTokens?: number;
  /** Free-form caller id for rate-limiting / cost-tracking. */
  tenantId?: string;
  userId?: string;
  /** Prompt version tag for cost-tracker + audit trail. */
  promptKey?: string;
  /** If true, response must be valid JSON. */
  jsonMode?: boolean;
  /** Enable prompt-caching for the system prompt (Anthropic: cache_control ephemeral). */
  enableCache?: boolean;
}

export interface LLMUsage {
  inputTokens: number;
  outputTokens: number;
  /** EUR, 6-decimal precision. */
  costEur: number;
}

export interface LLMResponse {
  content: string;
  usage: LLMUsage;
  model: string;
  provider: LLMProviderName;
  finishReason: "stop" | "length" | "error" | "filter";
}

export interface StreamChunk {
  delta: string;
  done: boolean;
  usage?: LLMUsage;
}

export interface LLMProvider {
  name: LLMProviderName;
  complete(req: LLMRequest): Promise<LLMResponse>;
  stream?(req: LLMRequest): AsyncIterable<StreamChunk>;
}

export class LLMError extends Error {
  constructor(
    message: string,
    public code: "rate_limit" | "budget_exceeded" | "invalid_input" | "provider_error" | "unsafe_output",
    public cause?: unknown,
  ) {
    super(message);
    this.name = "LLMError";
  }
}
