/**
 * Claude-Provider — Wrapper um den neuen AnthropicClient (mit Prompt-Caching +
 * Streaming + Budget-Check). Alter Fetch-Code wurde in ../anthropic-client.ts gehoben.
 */
import type { LLMProvider, LLMRequest, LLMResponse, StreamChunk } from "../types";
import { AnthropicClient } from "../anthropic-client";

export class ClaudeProvider implements LLMProvider {
  name = "anthropic" as const;
  private client = new AnthropicClient();

  complete(req: LLMRequest): Promise<LLMResponse> {
    return this.client.complete(req);
  }

  stream(req: LLMRequest): AsyncIterable<StreamChunk> {
    return this.client.stream(req);
  }
}
