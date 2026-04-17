import { describe, it, expect, beforeEach } from "vitest";
import { detectorStore, scan } from "@/lib/anomaly/detector";
import { buildBaselines, zScore } from "@/lib/anomaly/scorer";
import { generateMockEvents } from "@/lib/anomaly/mock-events";
import { defaultRules } from "@/lib/anomaly/rules";
import type { AnomalyEvent } from "@/lib/anomaly/types";

beforeEach(() => detectorStore._reset());

describe("anomaly/rules", () => {
  it("has 10 default rules, all enabled by default", () => {
    expect(defaultRules.length).toBe(10);
    expect(defaultRules.every((r) => r.enabled)).toBe(true);
  });
});

describe("anomaly/scorer", () => {
  it("builds baselines and computes Z-scores", () => {
    const now = Date.now();
    const events: AnomalyEvent[] = [];
    for (let d = 0; d < 10; d++) {
      for (let i = 0; i < 10; i++) {
        events.push({
          id: `e${d}-${i}`,
          userId: "u",
          action: "read",
          entityType: "resident",
          ts: now - d * 86_400_000 + i * 1000,
        });
      }
    }
    const baselines = buildBaselines(events, now);
    const b = baselines.get("u")!;
    expect(b.meanDaily).toBeCloseTo(10, 1);
    expect(zScore(10, b)).toBeLessThanOrEqual(0.1);
    expect(zScore(100, b)).toBeGreaterThanOrEqual(3);
  });
});

describe("anomaly/detector.scan", () => {
  it("detects bulk-delete and credential-stuffing in mock data", () => {
    const events = generateMockEvents();
    const findings = scan(events);
    const kinds = new Set(findings.map((f) => f.kind));
    expect(kinds.has("bulk-delete")).toBe(true);
    expect(kinds.has("credential-stuffing")).toBe(true);
    expect(kinds.has("off-hours-export")).toBe(true);
    expect(kinds.has("role-escalation")).toBe(true);
  });

  it("acknowledge flips the finding to handled", () => {
    const events = generateMockEvents();
    scan(events);
    const first = detectorStore.list()[0];
    expect(first.acknowledged).toBe(false);
    detectorStore.acknowledge(first.id, "tester");
    expect(detectorStore.list().find((f) => f.id === first.id)?.acknowledged).toBe(true);
  });

  it("saveRules replaces rule list and disabled rules skip detection", () => {
    detectorStore.saveRules(defaultRules.map((r) => ({ ...r, enabled: false })));
    const findings = scan(generateMockEvents());
    expect(findings.length).toBe(0);
  });
});
