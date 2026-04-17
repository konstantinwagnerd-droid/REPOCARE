/**
 * Cost-Tracker — estimates EUR per LLM call. Persists aggregates into billing
 * if the `billing_llm_usage` table exists, else falls back to logger-only.
 */
import { logger } from "@/lib/monitoring/logger";
import type { LLMResponse, LLMProviderName } from "./types";

/** Prices per 1M tokens (EUR, April 2026, EU region). */
const PRICING: Record<string, { input: number; output: number }> = {
  // Anthropic Claude (Sonnet/Opus EU) — rough EUR conversion
  "claude-4-7-opus": { input: 14.0, output: 70.0 },
  "claude-4-7-sonnet": { input: 2.8, output: 14.0 },
  "claude-4-5-haiku": { input: 0.7, output: 3.5 },
  // OpenAI (EU region)
  "gpt-5": { input: 10.0, output: 30.0 },
  "gpt-4o": { input: 2.3, output: 9.0 },
  "gpt-4o-mini": { input: 0.14, output: 0.56 },
  "whisper-1": { input: 0.0, output: 0.0 }, // per-minute, handled separately
  mock: { input: 0, output: 0 },
};

export function estimateCostEur(model: string, inputTokens: number, outputTokens: number): number {
  const key = Object.keys(PRICING).find((k) => model.toLowerCase().includes(k)) ?? "mock";
  const p = PRICING[key];
  return +(((inputTokens * p.input) + (outputTokens * p.output)) / 1_000_000).toFixed(6);
}

export async function trackUsage(
  provider: LLMProviderName,
  resp: LLMResponse,
  meta: { tenantId?: string; userId?: string; promptKey?: string },
): Promise<void> {
  const log = {
    provider,
    model: resp.model,
    input_tokens: resp.usage.inputTokens,
    output_tokens: resp.usage.outputTokens,
    cost_eur: resp.usage.costEur,
    tenant_id: meta.tenantId,
    user_id: meta.userId,
    prompt_key: meta.promptKey,
    at: new Date().toISOString(),
  };
  logger.info("llm.usage", log);

  // Best-effort persist. Schema addition is tracked separately in drizzle.
  try {
    const { db } = await import("@/db/client");
    const anyDb = db as unknown as { execute?: (sql: string) => Promise<unknown> };
    if (anyDb.execute) {
      await anyDb.execute(
        `INSERT INTO billing_llm_usage
          (provider, model, input_tokens, output_tokens, cost_eur, tenant_id, user_id, prompt_key, at)
         VALUES
          ('${provider}', '${resp.model}', ${log.input_tokens}, ${log.output_tokens}, ${log.cost_eur},
           ${meta.tenantId ? `'${meta.tenantId}'` : "NULL"},
           ${meta.userId ? `'${meta.userId}'` : "NULL"},
           ${meta.promptKey ? `'${meta.promptKey}'` : "NULL"},
           '${log.at}')`,
      );
    }
  } catch {
    // Table may not exist yet — that's OK, structured log is the source of truth.
  }
}

/** Monthly budget guard. Returns true if within budget. */
export function withinMonthlyBudget(spentEur: number): boolean {
  const budget = parseFloat(process.env.LLM_COST_BUDGET_EUR_PER_MONTH ?? "50");
  return spentEur < budget;
}
