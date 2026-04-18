/**
 * Anthropic Claude 4.7 Client — direkt via fetch (kein SDK-Dep).
 *
 * Features:
 * - Prompt-Caching (cache_control: ephemeral) für System-Prompts mit >=1024 Token.
 * - Streaming (SSE) via streamComplete().
 * - Budget-Check gegen LLM_COST_BUDGET_EUR_PER_MONTH (billing_llm_usage Aggregat).
 * - Cost-Tracking in billing_llm_usage (Cent-Integer, ms-Dauer, status).
 *
 * Modell: Claude 4.7 Sonnet (ANTHROPIC_MODEL env, default claude-4-7-sonnet-20250929).
 */
import type { LLMProvider, LLMRequest, LLMResponse, StreamChunk } from "./types";
import { LLMError } from "./types";
import { estimateCostEur } from "./cost-tracker";
import { logger } from "@/lib/monitoring/logger";

const DEFAULT_MODEL = process.env.ANTHROPIC_MODEL ?? "claude-4-7-sonnet-20250929";
const BASE_URL = process.env.ANTHROPIC_BASE_URL ?? "https://api.anthropic.com";

interface AnthropicContent {
  type: "text";
  text?: string;
  cache_control?: { type: "ephemeral" };
}

interface AnthropicSystemBlock {
  type: "text";
  text: string;
  cache_control?: { type: "ephemeral" };
}

interface AnthropicResponse {
  id: string;
  content: Array<{ type: string; text?: string }>;
  model: string;
  stop_reason: "end_turn" | "max_tokens" | "stop_sequence" | "tool_use";
  usage: {
    input_tokens: number;
    output_tokens: number;
    cache_creation_input_tokens?: number;
    cache_read_input_tokens?: number;
  };
}

export class AnthropicClient implements LLMProvider {
  name = "anthropic" as const;

  constructor(private apiKey: string = process.env.ANTHROPIC_API_KEY ?? "") {
    if (!this.apiKey) throw new LLMError("ANTHROPIC_API_KEY missing", "provider_error");
  }

  /** Non-streaming completion with optional prompt-caching. */
  async complete(req: LLMRequest): Promise<LLMResponse> {
    const started = Date.now();
    const model = req.model ?? DEFAULT_MODEL;

    // Budget-Check vor Request
    if (req.tenantId) {
      const within = await checkBudget(req.tenantId);
      if (!within) {
        await recordUsage({
          tenantId: req.tenantId,
          userId: req.userId,
          requestType: req.promptKey ?? "unknown",
          model,
          promptTokens: 0,
          completionTokens: 0,
          costEurCents: 0,
          durationMs: Date.now() - started,
          status: "budget-exceeded",
          errorMessage: "Monthly LLM budget exceeded",
        });
        throw new LLMError("Monthly LLM budget exceeded", "budget_exceeded");
      }
    }

    const body = buildRequestBody(req, model, false);

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
      await recordUsage({
        tenantId: req.tenantId,
        userId: req.userId,
        requestType: req.promptKey ?? "unknown",
        model,
        promptTokens: 0,
        completionTokens: 0,
        costEurCents: 0,
        durationMs: Date.now() - started,
        status: "error",
        errorMessage: String(e),
      });
      throw new LLMError("Anthropic fetch failed", "provider_error", e);
    }

    if (resp.status === 429) {
      await recordUsage({
        tenantId: req.tenantId,
        userId: req.userId,
        requestType: req.promptKey ?? "unknown",
        model,
        promptTokens: 0,
        completionTokens: 0,
        costEurCents: 0,
        durationMs: Date.now() - started,
        status: "error",
        errorMessage: "rate_limit",
      });
      throw new LLMError("Anthropic rate-limited", "rate_limit");
    }

    if (!resp.ok) {
      const txt = await resp.text().catch(() => "");
      await recordUsage({
        tenantId: req.tenantId,
        userId: req.userId,
        requestType: req.promptKey ?? "unknown",
        model,
        promptTokens: 0,
        completionTokens: 0,
        costEurCents: 0,
        durationMs: Date.now() - started,
        status: "error",
        errorMessage: `${resp.status}: ${txt.slice(0, 200)}`,
      });
      throw new LLMError(`Anthropic error ${resp.status}: ${txt.slice(0, 200)}`, "provider_error");
    }

    const data = (await resp.json()) as AnthropicResponse;
    const text = data.content.map((c) => c.text ?? "").join("").trim();
    const finish: LLMResponse["finishReason"] =
      data.stop_reason === "end_turn" ? "stop" : data.stop_reason === "max_tokens" ? "length" : "stop";

    const costEur = estimateCostEur(data.model, data.usage.input_tokens, data.usage.output_tokens);
    const cacheHit = (data.usage.cache_read_input_tokens ?? 0) > 0;

    await recordUsage({
      tenantId: req.tenantId,
      userId: req.userId,
      requestType: req.promptKey ?? "unknown",
      model: data.model,
      promptTokens: data.usage.input_tokens,
      completionTokens: data.usage.output_tokens,
      costEurCents: Math.round(costEur * 100),
      durationMs: Date.now() - started,
      status: cacheHit ? "cached" : "success",
    });

    if (cacheHit) {
      logger.debug("anthropic.cache_hit", {
        promptKey: req.promptKey,
        cache_read: data.usage.cache_read_input_tokens,
        cache_create: data.usage.cache_creation_input_tokens,
      });
    }

    return {
      content: text,
      model: data.model,
      provider: "anthropic",
      finishReason: finish,
      usage: {
        inputTokens: data.usage.input_tokens,
        outputTokens: data.usage.output_tokens,
        costEur,
      },
    };
  }

  /** Streaming (SSE) completion — für UI mit Live-Ausgabe. */
  async *stream(req: LLMRequest): AsyncIterable<StreamChunk> {
    const model = req.model ?? DEFAULT_MODEL;
    const body = buildRequestBody(req, model, true);

    const resp = await fetch(`${BASE_URL}/v1/messages`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
    });

    if (!resp.ok || !resp.body) {
      const txt = await resp.text().catch(() => "");
      throw new LLMError(`Anthropic stream error ${resp.status}: ${txt.slice(0, 200)}`, "provider_error");
    }

    const reader = resp.body.getReader();
    const dec = new TextDecoder();
    let buf = "";
    let inputTokens = 0;
    let outputTokens = 0;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });

      const lines = buf.split("\n");
      buf = lines.pop() ?? "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const payload = line.slice(6).trim();
        if (!payload) continue;
        try {
          const evt = JSON.parse(payload);
          if (evt.type === "content_block_delta" && evt.delta?.type === "text_delta") {
            yield { delta: evt.delta.text as string, done: false };
          } else if (evt.type === "message_start" && evt.message?.usage) {
            inputTokens = evt.message.usage.input_tokens ?? 0;
          } else if (evt.type === "message_delta" && evt.usage) {
            outputTokens = evt.usage.output_tokens ?? 0;
          }
        } catch {
          // ignore malformed chunks
        }
      }
    }

    yield {
      delta: "",
      done: true,
      usage: {
        inputTokens,
        outputTokens,
        costEur: estimateCostEur(model, inputTokens, outputTokens),
      },
    };
  }
}

function buildRequestBody(req: LLMRequest, model: string, stream: boolean): Record<string, unknown> {
  const systemBlocks: AnthropicSystemBlock[] | string | undefined = req.system
    ? req.enableCache !== false && req.system.length > 500
      ? [{ type: "text", text: req.system, cache_control: { type: "ephemeral" } }]
      : req.system
    : undefined;

  const messages = req.messages
    .filter((m) => m.role !== "system")
    .map((m) => ({ role: m.role, content: [{ type: "text", text: m.content }] as AnthropicContent[] }));

  return {
    model,
    max_tokens: req.maxTokens ?? 2048,
    temperature: req.temperature ?? 0.3,
    system: systemBlocks,
    messages,
    stream: stream || undefined,
  };
}

// ─────────────────────────────────────────────────────────────
// Budget & Usage-Tracking
// ─────────────────────────────────────────────────────────────

interface UsageRecord {
  tenantId?: string;
  userId?: string;
  requestType: string;
  model: string;
  promptTokens: number;
  completionTokens: number;
  costEurCents: number;
  durationMs: number;
  status: "success" | "error" | "cached" | "budget-exceeded";
  errorMessage?: string;
}

async function recordUsage(rec: UsageRecord): Promise<void> {
  try {
    const { db } = await import("@/db/client");
    const anyDb = db as unknown as { execute?: (sql: string) => Promise<unknown> };
    if (!anyDb.execute) return;

    // Einfaches SQL-String-Escaping (Postgres-dollarquote wäre sauberer, aber client-execute akzeptiert nur string).
    const esc = (s: string) => s.replace(/'/g, "''");
    const tenant = rec.tenantId ? `'${esc(rec.tenantId)}'` : "NULL";
    const user = rec.userId ? `'${esc(rec.userId)}'` : "NULL";
    const err = rec.errorMessage ? `'${esc(rec.errorMessage.slice(0, 500))}'` : "NULL";

    await anyDb.execute(
      `INSERT INTO billing_llm_usage
        (tenant_id, user_id, request_type, model, prompt_tokens, completion_tokens, cost_eur_cents, duration_ms, status, error_message)
       VALUES
        (${tenant}, ${user}, '${esc(rec.requestType)}', '${esc(rec.model)}',
         ${rec.promptTokens}, ${rec.completionTokens}, ${rec.costEurCents}, ${rec.durationMs},
         '${rec.status}', ${err})`,
    );
  } catch {
    // Tabelle fehlt → nur Log. Wir wollen den Request nicht brechen.
  }
}

async function checkBudget(tenantId: string): Promise<boolean> {
  const budget = parseFloat(process.env.LLM_COST_BUDGET_EUR_PER_MONTH ?? "500");
  if (budget <= 0) return true;

  try {
    const { db } = await import("@/db/client");
    const anyDb = db as unknown as {
      execute?: (sql: string) => Promise<unknown[] | { rows?: unknown[] }>;
    };
    if (!anyDb.execute) return true;

    const esc = tenantId.replace(/'/g, "''");
    const sql = `SELECT COALESCE(SUM(cost_eur_cents), 0) AS spent
       FROM billing_llm_usage
       WHERE tenant_id = '${esc}'
         AND created_at >= date_trunc('month', now())
         AND status IN ('success','cached')`;
    const res = await anyDb.execute(sql);
    const rows = Array.isArray(res) ? res : (res as { rows?: Array<{ spent?: number | string }> }).rows ?? [];
    const spentCents = Number((rows[0] as { spent?: number | string } | undefined)?.spent ?? 0);
    const spentEur = spentCents / 100;
    return spentEur < budget;
  } catch {
    return true; // bei DB-Fehler nicht blockieren
  }
}
