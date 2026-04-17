/**
 * Deterministic 80/10/10 train/val/test splitter.
 * Seeded to ensure reproducibility — same input always produces same split.
 */

import type { DatasetEntry, TrainingSplit } from "./types";

export interface SplitRatios {
  train: number;
  val: number;
  test: number;
}

export const DEFAULT_RATIOS: SplitRatios = { train: 0.8, val: 0.1, test: 0.1 };

function hashId(id: string): number {
  let h = 2166136261;
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}

export function split(entries: DatasetEntry[], ratios: SplitRatios = DEFAULT_RATIOS): TrainingSplit {
  const sum = ratios.train + ratios.val + ratios.test;
  if (Math.abs(sum - 1) > 1e-6) {
    throw new Error(`Split ratios must sum to 1.0, got ${sum}`);
  }
  const train: DatasetEntry[] = [];
  const val: DatasetEntry[] = [];
  const test: DatasetEntry[] = [];

  for (const entry of entries) {
    const h = hashId(entry.id);
    if (h < ratios.train) train.push(entry);
    else if (h < ratios.train + ratios.val) val.push(entry);
    else test.push(entry);
  }
  return { train, val, test };
}
