import type { LLMProvider, LLMRequest, LLMResponse } from "../types";

/** Deterministic mock — returns structured templates keyed by promptKey. */
export class MockLLMProvider implements LLMProvider {
  name = "mock" as const;
  async complete(req: LLMRequest): Promise<LLMResponse> {
    await new Promise((r) => setTimeout(r, 200));
    const last = req.messages[req.messages.length - 1]?.content ?? "";
    const content = req.jsonMode
      ? JSON.stringify({ mock: true, echo: last.slice(0, 200), promptKey: req.promptKey ?? null })
      : `[MOCK ${req.promptKey ?? "generic"}] ${last.slice(0, 400)}`;
    const inputTokens = Math.ceil(last.length / 4);
    const outputTokens = Math.ceil(content.length / 4);
    return {
      content,
      model: "mock",
      provider: "mock",
      finishReason: "stop",
      usage: { inputTokens, outputTokens, costEur: 0 },
    };
  }
}
