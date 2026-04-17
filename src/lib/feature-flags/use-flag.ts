"use client";

import { useEffect, useState } from "react";

type FlagValue = boolean | string;

const cache = new Map<string, FlagValue>();
let allLoaded = false;
let loadPromise: Promise<Record<string, FlagValue>> | null = null;

async function loadAll(): Promise<Record<string, FlagValue>> {
  if (loadPromise) return loadPromise;
  loadPromise = fetch("/api/feature-flags/evaluate", { cache: "no-store" })
    .then((r) => r.json())
    .then((j: { flags: Record<string, FlagValue> }) => {
      for (const [k, v] of Object.entries(j.flags ?? {})) cache.set(k, v);
      allLoaded = true;
      return j.flags ?? {};
    })
    .catch(() => ({}));
  return loadPromise;
}

export function useFlag<T extends FlagValue = boolean>(key: string, fallback?: T): T {
  const initial = (cache.get(key) as T | undefined) ?? (fallback as T) ?? (false as T);
  const [value, setValue] = useState<T>(initial);

  useEffect(() => {
    let cancelled = false;
    if (allLoaded && cache.has(key)) {
      setValue(cache.get(key) as T);
      return;
    }
    loadAll().then((flags) => {
      if (cancelled) return;
      const v = (flags[key] as T | undefined) ?? (fallback as T) ?? (false as T);
      setValue(v);
    });
    return () => { cancelled = true; };
  }, [key, fallback]);

  return value;
}
