/**
 * Anthropic Claude wrapper — uses fetch directly (no SDK dep required).
 * EU-only: set ANTHROPIC_BASE_URL to regional endpoint if/when Anthropic ships one.
 */
import type { LLMProvider, LLMRequest, LLMResponse } from "../types";
import { LLMError } from "../types";
import { estimateCostEur } from "../cost-tracker";

const DEFAULT_MODEL = process.env.ANTHROPIC_MODEL ?? "claude-4-7-sonnet";
const BASE_URL = process.env.ANTHROPIC_BASE_URL ?? "https://api.anthropic.com";

interface AnthropicResponse {
  id: string;
  content: Array<{ type: string; text?: string }>;
  model: string;
  stop_reason: "end_turn" | "max_tokens" | "stop_sequence" | "tool_use";
  usage: { input_tokens: number; output_tokens: number };
}

export class ClaudeProvider implements LLMProvider {
  name = "anthropic" as const;
  constructor(private apiKey: string = process.env.ANTHROPIC_API_KEY ?? "") {
    if (!this.apiKey) throw new LLMError("ANTHROPIC_API_KEY missing", "provider_error");
  }

  async complete(req: LLMRequest): Promise<LLMResponse> {
    const model = req.model ?? DEFAULT_MODEL;
    const body = {
      model,
      max_tokens: req.maxTokens ?? 2048,
      temperature: req.temperature ?? 0.3,
      system: req.system,
      messages: req.messages
        .filter((m) => m.role !== "system")
        .map((m) => ({ role: m.role, content: m.content })),
    };

    let resp: Response;
    try {
      resp = await fetch(`${BASE_URL}/v1/messages`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": this.apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify(body),
      });
    } catch (e) {
      throw new LLMError("Anthropic fetch failed", "provider_error", e);
    }

    if (resp.status === 429) throw new LLMError("Anthropic rate-limited", "rate_limit");
    if (!resp.ok) {
      const txt = await resp.text().catch(() => "");
      throw new LLMError(`Anthropic error ${resp.status}: ${txt.slice(0, 200)}`, "provider_error");
    }

    const data = (await resp.json()) as AnthropicResponse;
    const text = data.content.map((c) => c.text ?? "").join("").trim();
    const finishReason: LLMResponse["finishReason"] =
      data.stop_reason === "end_turn" ? "stop" : data.stop_reason === "max_tokens" ? "length" : "stop";

    return {
      content: text,
      model: data.model,
      provider: "anthropic",
      finishReason,
      usage: {
        inputTokens: data.usage.input_tokens,
        outputTokens: data.usage.output_tokens,
        costEur: estimateCostEur(data.model, data.usage.input_tokens, data.usage.output_tokens),
      },
    };
  }
}
