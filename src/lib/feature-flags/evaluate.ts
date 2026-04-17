import type { EvaluationContext, EvaluationResult, TargetingRule } from "./types";
import { getFlag, listFlags } from "./store";

// Deterministischer 0–99 Hash (FNV-1a-artig) aus (flagKey + identifier)
function hashBucket(flagKey: string, identifier: string): number {
  let h = 2166136261;
  const s = `${flagKey}:${identifier}`;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h) % 100;
}

function ruleMatches(rule: TargetingRule, ctx: EvaluationContext): boolean {
  if (!rule.enabled) return false;
  if (rule.tenantIds?.length && (!ctx.tenantId || !rule.tenantIds.includes(ctx.tenantId))) return false;
  if (rule.userIds?.length && (!ctx.userId || !rule.userIds.includes(ctx.userId))) return false;
  if (rule.roles?.length && (!ctx.role || !rule.roles.includes(ctx.role))) return false;
  if (rule.emailContains && (!ctx.email || !ctx.email.toLowerCase().includes(rule.emailContains.toLowerCase()))) return false;
  return true;
}

export function evaluate(flagKey: string, ctx: EvaluationContext): EvaluationResult {
  const f = getFlag(flagKey);
  if (!f) {
    return { key: flagKey, value: false, matchedRuleId: null, reason: "default" };
  }
  if (!f.enabled) {
    return { key: flagKey, value: f.kind === "multivariate" ? (f.defaultValue as string) : false, matchedRuleId: null, reason: "disabled" };
  }
  const ident = ctx.userId ?? ctx.tenantId ?? "anonymous";
  for (const rule of f.rules) {
    if (!ruleMatches(rule, ctx)) continue;
    // Percentage-Rollout prüfen
    if (typeof rule.rolloutPercent === "number" && rule.rolloutPercent < 100) {
      const bucket = hashBucket(flagKey, ident);
      if (bucket >= rule.rolloutPercent) {
        return { key: flagKey, value: f.defaultValue, matchedRuleId: rule.id, reason: "percentage-out" };
      }
    }
    if (f.kind === "multivariate") {
      return { key: flagKey, value: rule.variant ?? (f.defaultValue as string), matchedRuleId: rule.id, reason: "rule-match" };
    }
    return { key: flagKey, value: true, matchedRuleId: rule.id, reason: "rule-match" };
  }
  return { key: flagKey, value: f.defaultValue, matchedRuleId: null, reason: "default" };
}

export function evaluateAll(ctx: EvaluationContext): Record<string, boolean | string> {
  const out: Record<string, boolean | string> = {};
  for (const f of listFlags()) {
    out[f.key] = evaluate(f.key, ctx).value;
  }
  return out;
}

export function isEnabled(flagKey: string, ctx: EvaluationContext): boolean {
  const r = evaluate(flagKey, ctx);
  return r.value === true;
}

export function getHashBucket(flagKey: string, identifier: string): number {
  return hashBucket(flagKey, identifier);
}
