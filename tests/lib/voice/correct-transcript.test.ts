import { describe, it, expect } from "vitest";
import { applyCorrections, countCorrections, groupByCategory } from "@/lib/voice/correct-transcript";
import { PFLEGE_CORRECTIONS, vocabularyStats } from "@/lib/voice/pflege-vocabulary";
import { learnedToRules } from "@/lib/voice/vocab-learner";

describe("pflege-vocabulary dictionary", () => {
  it("has at least 80 entries across categories", () => {
    expect(PFLEGE_CORRECTIONS.length).toBeGreaterThanOrEqual(80);
  });

  it("covers all expected categories", () => {
    const s = vocabularyStats();
    expect(s.medikament).toBeGreaterThan(0);
    expect(s.diagnose).toBeGreaterThan(0);
    expect(s.assessment).toBeGreaterThan(0);
    expect(s.anatomie).toBeGreaterThan(0);
    expect(s.fem).toBeGreaterThan(0);
    expect(s.gesetz).toBeGreaterThan(0);
    expect(s.standard).toBeGreaterThan(0);
  });

  it("all patterns have reasonable confidence", () => {
    for (const c of PFLEGE_CORRECTIONS) {
      expect(c.confidence).toBeGreaterThanOrEqual(0.7);
      expect(c.confidence).toBeLessThanOrEqual(1);
    }
  });
});

describe("applyCorrections — happy paths from spec", () => {
  it("corrects 'Deka Bitus' → 'Dekubitus'", () => {
    const r = applyCorrections("Patient hat einen Deka Bitus am Sakrum");
    expect(r.corrected).toBe("Patient hat einen Dekubitus am Sakrum");
    expect(r.corrections.length).toBeGreaterThanOrEqual(1);
    expect(r.corrections.some((c) => c.correctedText === "Dekubitus")).toBe(true);
  });

  it("corrects 'Braten-Skala' → 'Braden-Skala'", () => {
    const r = applyCorrections("Braten-Skala 14 Punkte");
    expect(r.corrected).toBe("Braden-Skala 14 Punkte");
  });

  it("corrects 'Wehrdenfälls her' → 'Werdenfelser'", () => {
    const r = applyCorrections("Wehrdenfällsher Weg wurde eingehalten");
    expect(r.corrected.toLowerCase()).toContain("werdenfelser");
  });

  it("corrects 'Panto-Prasol' → 'Pantoprazol'", () => {
    const r = applyCorrections("Bewohner erhält Panto-Prasol 20 mg");
    expect(r.corrected).toContain("Pantoprazol");
  });

  it("corrects 'digitalisch' → 'Digitalis'", () => {
    const r = applyCorrections("Herzmedikament digitalisch verordnet");
    expect(r.corrected).toContain("Digitalis");
  });
});

describe("applyCorrections — no false positives", () => {
  it("does not touch normal sentences", () => {
    const text = "Der Bewohner hat heute gut gefrühstückt und ist entspannt.";
    const r = applyCorrections(text);
    expect(r.corrected).toBe(text);
    expect(r.corrections).toHaveLength(0);
  });

  it("leaves already-correct terms alone", () => {
    const text = "Dekubitus Grad 2 am Sakrum — Braden-Skala: 14.";
    const r = applyCorrections(text);
    // Keine Ersetzung nötig
    expect(r.corrected).toBe(text);
  });

  it("returns empty result for empty input", () => {
    const r = applyCorrections("");
    expect(r.corrected).toBe("");
    expect(r.corrections).toEqual([]);
  });
});

describe("applyCorrections — case & multi-match", () => {
  it("is case-insensitive and preserves leading case", () => {
    const r = applyCorrections("Deka Bitus am Morgen");
    // Match beginnt mit Großbuchstabe → korrigierte Form ebenfalls groß
    expect(r.corrected.startsWith("Dekubitus")).toBe(true);
  });

  it("handles multiple corrections in same sentence", () => {
    const r = applyCorrections(
      "Deka Bitus am Sak Rum, Braten-Skala 12, gibt Panto-Prasol und Mar Cumar.",
    );
    const replacements = r.corrections.map((c) => c.correctedText);
    expect(replacements).toContain("Dekubitus");
    expect(replacements).toContain("Sakrum");
    expect(replacements).toContain("Braden-Skala");
    expect(replacements).toContain("Pantoprazol");
    expect(replacements).toContain("Marcumar");
  });

  it("offsets point to correct positions in corrected text", () => {
    const r = applyCorrections("X Deka Bitus Y");
    const c = r.corrections.find((x) => x.correctedText === "Dekubitus");
    expect(c).toBeDefined();
    if (!c) return;
    // offset in corrected text
    expect(r.corrected.slice(c.offset, c.offset + c.length)).toBe(c.correctedText);
  });

  it("offsets remain consistent after multiple replacements", () => {
    const r = applyCorrections("Deka Bitus und Braten-Skala");
    for (const c of r.corrections) {
      expect(r.corrected.slice(c.offset, c.offset + c.length)).toBe(c.correctedText);
    }
  });
});

describe("helpers", () => {
  it("countCorrections matches length", () => {
    const r = applyCorrections("Deka Bitus");
    expect(countCorrections(r)).toBe(r.corrections.length);
  });

  it("groupByCategory groups entries", () => {
    const r = applyCorrections("Deka Bitus am Sak Rum mit Panto-Prasol");
    const g = groupByCategory(r.corrections);
    expect(Object.keys(g).length).toBeGreaterThan(0);
    const total = Object.values(g).reduce((s, arr) => s + arr.length, 0);
    expect(total).toBe(r.corrections.length);
  });
});

describe("extraRules (tenant-learned)", () => {
  it("applies user-provided extra rules", () => {
    const r = applyCorrections("Herr Mustermann war heute bei Physio", [
      {
        pattern: /\bPhysio\b/gi,
        correct: "Physiotherapie",
        category: "standard",
        confidence: 0.85,
      },
    ]);
    expect(r.corrected).toContain("Physiotherapie");
  });

  it("learnedToRules filters below threshold", () => {
    const rules = learnedToRules(
      [
        { pattern: "physio", correct: "Physiotherapie", tenantId: "t1", count: 2, lastUsed: "x" },
        { pattern: "ergo", correct: "Ergotherapie", tenantId: "t1", count: 5, lastUsed: "x" },
      ],
      3,
    );
    expect(rules.length).toBe(1);
    expect(rules[0].correct).toBe("Ergotherapie");
  });
});
