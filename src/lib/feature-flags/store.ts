import type { FeatureFlag } from "./types";
import { seedFlags } from "./seed";

type Store = { flags: Map<string, FeatureFlag> };
const globalAny = globalThis as unknown as { __careai_ff_store?: Store };

function getStore(): Store {
  if (!globalAny.__careai_ff_store) {
    globalAny.__careai_ff_store = { flags: new Map() };
    for (const f of seedFlags()) globalAny.__careai_ff_store.flags.set(f.key, f);
  }
  return globalAny.__careai_ff_store;
}

export function listFlags(): FeatureFlag[] {
  return Array.from(getStore().flags.values()).sort((a, b) => a.key.localeCompare(b.key));
}

export function getFlag(key: string): FeatureFlag | undefined {
  return getStore().flags.get(key);
}

export function upsertFlag(flag: FeatureFlag): FeatureFlag {
  flag.updatedAt = Date.now();
  getStore().flags.set(flag.key, flag);
  return flag;
}

export function deleteFlag(key: string): boolean {
  return getStore().flags.delete(key);
}

export function toggleFlag(key: string, enabled: boolean): FeatureFlag | undefined {
  const f = getFlag(key);
  if (!f) return undefined;
  f.enabled = enabled;
  f.updatedAt = Date.now();
  getStore().flags.set(key, f);
  return f;
}
