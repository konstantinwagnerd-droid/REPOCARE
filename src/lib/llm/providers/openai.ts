/**
 * OpenAI wrapper — EU region check enforced.
 * Set OPENAI_BASE_URL=https://eu.api.openai.com/v1 once available.
 */
import type { LLMProvider, LLMRequest, LLMResponse } from "../types";
import { LLMError } from "../types";
import { estimateCostEur } from "../cost-tracker";

const DEFAULT_MODEL = process.env.OPENAI_MODEL ?? "gpt-4o";
const BASE_URL = process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1";

interface OpenAIResponse {
  id: string;
  choices: Array<{
    message: { role: string; content: string };
    finish_reason: "stop" | "length" | "content_filter" | "tool_calls";
  }>;
  model: string;
  usage: { prompt_tokens: number; completion_tokens: number };
}

export class OpenAIProvider implements LLMProvider {
  name = "openai" as const;
  constructor(private apiKey: string = process.env.OPENAI_API_KEY ?? "") {
    if (!this.apiKey) throw new LLMError("OPENAI_API_KEY missing", "provider_error");
    if (!/eu|europe/i.test(BASE_URL) && process.env.ALLOW_US_OPENAI !== "true") {
      // Warn — don't throw — so devs can opt-in with ALLOW_US_OPENAI=true.
      // Prod deployments should set an EU BASE_URL.
      console.warn("[openai] non-EU base URL; patient data must be PII-scrubbed.");
    }
  }

  async complete(req: LLMRequest): Promise<LLMResponse> {
    const model = req.model ?? DEFAULT_MODEL;
    const messages = [
      ...(req.system ? [{ role: "system" as const, content: req.system }] : []),
      ...req.messages.map((m) => ({ role: m.role, content: m.content })),
    ];
    const body: Record<string, unknown> = {
      model,
      messages,
      temperature: req.temperature ?? 0.3,
      max_tokens: req.maxTokens ?? 2048,
    };
    if (req.jsonMode) body.response_format = { type: "json_object" };

    let resp: Response;
    try {
      resp = await fetch(`${BASE_URL}/chat/completions`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(body),
      });
    } catch (e) {
      throw new LLMError("OpenAI fetch failed", "provider_error", e);
    }

    if (resp.status === 429) throw new LLMError("OpenAI rate-limited", "rate_limit");
    if (!resp.ok) {
      const txt = await resp.text().catch(() => "");
      throw new LLMError(`OpenAI error ${resp.status}: ${txt.slice(0, 200)}`, "provider_error");
    }
    const data = (await resp.json()) as OpenAIResponse;
    const choice = data.choices[0];
    const content = choice.message.content ?? "";
    const fr = choice.finish_reason;
    const finishReason: LLMResponse["finishReason"] =
      fr === "stop" ? "stop" : fr === "length" ? "length" : fr === "content_filter" ? "filter" : "stop";

    return {
      content,
      model: data.model,
      provider: "openai",
      finishReason,
      usage: {
        inputTokens: data.usage.prompt_tokens,
        outputTokens: data.usage.completion_tokens,
        costEur: estimateCostEur(data.model, data.usage.prompt_tokens, data.usage.completion_tokens),
      },
    };
  }

  /** Whisper transcription. Separate from chat completion. */
  async transcribeAudio(audio: Blob, language = "de"): Promise<{ text: string }> {
    const form = new FormData();
    form.append("file", audio, "audio.webm");
    form.append("model", process.env.WHISPER_MODEL ?? "whisper-1");
    form.append("language", language);
    const resp = await fetch(`${BASE_URL}/audio/transcriptions`, {
      method: "POST",
      headers: { authorization: `Bearer ${this.apiKey}` },
      body: form,
    });
    if (!resp.ok) {
      const txt = await resp.text().catch(() => "");
      throw new LLMError(`Whisper error ${resp.status}: ${txt.slice(0, 200)}`, "provider_error");
    }
    return (await resp.json()) as { text: string };
  }
}
