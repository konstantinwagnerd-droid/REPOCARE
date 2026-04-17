export type ExperimentStatus = "draft" | "running" | "completed" | "archived";

export type MetricType = "binary" | "continuous";

export interface Metric {
  id: string;
  name: string;
  type: MetricType;
  /** Events that count as conversion for binary metrics */
  conversionEvent?: string;
  /** Goal direction */
  direction?: "higher-is-better" | "lower-is-better";
}

export interface Variant {
  id: string;
  name: string;
  /** 0..1 weight; all weights in an experiment should sum to 1.0 */
  weight: number;
  /** Free-form payload used by client components to render the variant */
  payload?: Record<string, unknown>;
}

export interface Experiment {
  id: string;
  /** Stable name used in code and URL lookups, e.g. "hero-headline" */
  name: string;
  description?: string;
  status: ExperimentStatus;
  variants: Variant[];
  metrics: Metric[];
  /** Traffic allocation (0..1). 1.0 = all users. */
  trafficAllocation: number;
  /** Minimum sample size per variant before results are considered reliable */
  minSampleSize: number;
  /** Max duration in days; null = run until completed manually */
  maxDurationDays: number | null;
  /** ID of declared winner variant, null if not decided */
  winnerVariantId: string | null;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
}

export interface Assignment {
  experimentId: string;
  experimentName: string;
  variantId: string;
  userHash: string;
  assignedAt: string;
}

export interface ConversionEvent {
  experimentId: string;
  variantId: string;
  userHash: string;
  metricId: string;
  /** For continuous metrics */
  value?: number;
  occurredAt: string;
}

export interface VariantStats {
  variantId: string;
  variantName: string;
  impressions: number;
  conversions: number;
  conversionRate: number;
  /** 95% Wilson score interval */
  ciLower: number;
  ciUpper: number;
}

export interface ExperimentResult {
  experimentId: string;
  experimentName: string;
  status: ExperimentStatus;
  metricId: string;
  variants: VariantStats[];
  pValue: number | null;
  significant: boolean;
  /** Index of winning variant (only if significant), else null */
  leadingVariantId: string | null;
  sampleSizeReached: boolean;
  generatedAt: string;
}
