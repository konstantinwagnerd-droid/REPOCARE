/**
 * Unified LLM Client — provider switching via LLM_PROVIDER env.
 * Default: "mock" (demo-safe). Anthropic/OpenAI only when explicitly enabled.
 */
import type { LLMProvider, LLMProviderName, LLMRequest, LLMResponse } from "./types";
import { LLMError } from "./types";
import { MockLLMProvider } from "./providers/mock";
import { rateLimitLLM } from "./rate-limiting";
import { trackUsage } from "./cost-tracker";
import { sanitize, detectPromptInjection, scrubPII, restorePII } from "./safety";
import { logger } from "@/lib/monitoring/logger";

let cachedProvider: LLMProvider | null = null;

export async function getProvider(): Promise<LLMProvider> {
  if (cachedProvider) return cachedProvider;
  const name = (process.env.LLM_PROVIDER ?? "mock") as LLMProviderName;
  const enabled = process.env.ENABLE_REAL_LLM === "true";

  if (name === "anthropic" && enabled) {
    const { ClaudeProvider } = await import("./providers/claude");
    cachedProvider = new ClaudeProvider();
  } else if (name === "openai" && enabled) {
    const { OpenAIProvider } = await import("./providers/openai");
    cachedProvider = new OpenAIProvider();
  } else {
    cachedProvider = new MockLLMProvider();
  }
  logger.info("llm.provider.init", { provider: cachedProvider.name });
  return cachedProvider;
}

/** Reset cache — test-only. */
export function _resetProviderCache(): void {
  cachedProvider = null;
}

export async function llmComplete(req: LLMRequest): Promise<LLMResponse> {
  rateLimitLLM(req.tenantId, req.userId);

  // Sanitize every message (length + nulls) and scrub PII for non-mock providers.
  const provider = await getProvider();
  const useScrub = provider.name !== "mock" && process.env.LLM_SCRUB_PII !== "false";

  const scrubbed: Record<string, string> = {};
  const messages = req.messages.map((m) => {
    const inj = detectPromptInjection(m.content);
    if (!inj.safe) throw new LLMError(`Prompt injection detected: ${inj.reason}`, "invalid_input");
    let text = sanitize(m.content);
    if (useScrub) {
      const s = scrubPII(text);
      text = s.text;
      Object.assign(scrubbed, s.replacements);
    }
    return { role: m.role, content: text };
  });

  const started = Date.now();
  const resp = await provider.complete({ ...req, messages });
  resp.content = useScrub ? restorePII(resp.content, scrubbed) : resp.content;

  await trackUsage(provider.name, resp, {
    tenantId: req.tenantId,
    userId: req.userId,
    promptKey: req.promptKey,
  });
  logger.debug("llm.complete.done", {
    provider: provider.name,
    model: resp.model,
    ms: Date.now() - started,
    tokens: resp.usage.inputTokens + resp.usage.outputTokens,
    cost: resp.usage.costEur,
    promptKey: req.promptKey,
  });

  return resp;
}
