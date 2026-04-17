import type { Experiment, ConversionEvent, Assignment } from "./types";

/**
 * In-memory store. Designed to be replaceable with a DB-backed implementation
 * without changing call sites. All state mutates through these functions.
 */
class ExperimentStore {
  private experiments = new Map<string, Experiment>();
  private impressions = new Map<string, number>(); // key: `${expId}:${variantId}`
  private conversions: ConversionEvent[] = [];
  private assignments = new Map<string, Assignment>(); // key: `${expName}:${userHash}`

  constructor() {
    this.seed();
  }

  listExperiments(): Experiment[] {
    return Array.from(this.experiments.values());
  }

  getByName(name: string): Experiment | undefined {
    return Array.from(this.experiments.values()).find((e) => e.name === name);
  }

  getById(id: string): Experiment | undefined {
    return this.experiments.get(id);
  }

  upsert(exp: Experiment): Experiment {
    this.experiments.set(exp.id, exp);
    return exp;
  }

  updateStatus(id: string, status: Experiment["status"]): Experiment | undefined {
    const exp = this.experiments.get(id);
    if (!exp) return undefined;
    exp.status = status;
    if (status === "running" && !exp.startedAt) exp.startedAt = new Date().toISOString();
    if (status === "completed" && !exp.completedAt) exp.completedAt = new Date().toISOString();
    return exp;
  }

  declareWinner(id: string, variantId: string): Experiment | undefined {
    const exp = this.experiments.get(id);
    if (!exp) return undefined;
    exp.winnerVariantId = variantId;
    exp.status = "completed";
    exp.completedAt = new Date().toISOString();
    return exp;
  }

  recordImpression(expId: string, variantId: string): void {
    const k = `${expId}:${variantId}`;
    this.impressions.set(k, (this.impressions.get(k) ?? 0) + 1);
  }

  getImpressions(expId: string, variantId: string): number {
    return this.impressions.get(`${expId}:${variantId}`) ?? 0;
  }

  recordConversion(ev: ConversionEvent): void {
    this.conversions.push(ev);
  }

  getConversions(expId: string, variantId?: string, metricId?: string): ConversionEvent[] {
    return this.conversions.filter(
      (e) =>
        e.experimentId === expId &&
        (variantId ? e.variantId === variantId : true) &&
        (metricId ? e.metricId === metricId : true)
    );
  }

  recordAssignment(a: Assignment): void {
    this.assignments.set(`${a.experimentName}:${a.userHash}`, a);
  }

  getAssignment(expName: string, userHash: string): Assignment | undefined {
    return this.assignments.get(`${expName}:${userHash}`);
  }

  /** Pre-seed three example experiments */
  private seed(): void {
    const now = new Date().toISOString();

    this.upsert({
      id: "exp_hero_headline",
      name: "hero-headline",
      description: "Test three emotional/functional hero headlines on the German homepage.",
      status: "running",
      variants: [
        { id: "v_a", name: "Mehr Zeit für Menschen", weight: 1 / 3, payload: { headline: "Mehr Zeit für Menschen" } },
        { id: "v_b", name: "Pflegedokumentation in 3 Sekunden", weight: 1 / 3, payload: { headline: "Pflegedokumentation in 3 Sekunden" } },
        { id: "v_c", name: "KI-gestützte SIS-Klassifikation", weight: 1 / 3, payload: { headline: "KI-gestützte SIS-Klassifikation" } },
      ],
      metrics: [
        { id: "m_signup", name: "Signup conversions", type: "binary", conversionEvent: "signup", direction: "higher-is-better" },
      ],
      trafficAllocation: 1,
      minSampleSize: 500,
      maxDurationDays: 28,
      winnerVariantId: null,
      createdAt: now,
      startedAt: now,
    });

    this.upsert({
      id: "exp_pricing_presentation",
      name: "pricing-presentation",
      description: "Tier-cards vs. seat-based slider on the pricing section.",
      status: "running",
      variants: [
        { id: "v_cards", name: "Tier cards", weight: 0.5, payload: { mode: "cards" } },
        { id: "v_slider", name: "Slider", weight: 0.5, payload: { mode: "slider" } },
      ],
      metrics: [
        { id: "m_demo", name: "Demo requests", type: "binary", conversionEvent: "demo-request", direction: "higher-is-better" },
      ],
      trafficAllocation: 1,
      minSampleSize: 400,
      maxDurationDays: 21,
      winnerVariantId: null,
      createdAt: now,
      startedAt: now,
    });

    this.upsert({
      id: "exp_cta_copy",
      name: "cta-copy",
      description: "Which CTA copy drives more demo requests?",
      status: "running",
      variants: [
        { id: "v_demo", name: "Demo anfragen", weight: 1 / 3, payload: { cta: "Demo anfragen" } },
        { id: "v_trial", name: "30 Tage gratis testen", weight: 1 / 3, payload: { cta: "30 Tage gratis testen" } },
        { id: "v_heim", name: "Mit deinem Heim starten", weight: 1 / 3, payload: { cta: "Mit deinem Heim starten" } },
      ],
      metrics: [
        { id: "m_cta_click", name: "CTA clicks", type: "binary", conversionEvent: "cta-click", direction: "higher-is-better" },
      ],
      trafficAllocation: 1,
      minSampleSize: 600,
      maxDurationDays: 14,
      winnerVariantId: null,
      createdAt: now,
      startedAt: now,
    });
  }
}

// Module-scoped singleton
const globalForStore = globalThis as unknown as { __abStore?: ExperimentStore };
export const abStore: ExperimentStore = globalForStore.__abStore ?? new ExperimentStore();
if (!globalForStore.__abStore) globalForStore.__abStore = abStore;
