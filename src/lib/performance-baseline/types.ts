export type MetricName = "LCP" | "FCP" | "CLS" | "TBT" | "TTI" | "INP" | "TTFB";
export type RouteType = "marketing" | "admin" | "app" | "auth";

export interface MetricValue {
  name: MetricName;
  value: number;   // ms for time metrics, unitless for CLS
  unit: "ms" | "score";
}

export interface Benchmark {
  url: string;
  route: string;
  routeType: RouteType;
  metrics: MetricValue[];
  timestamp: string;
  /** Optional: lighthouse performance score 0..1 */
  performanceScore?: number;
}

export interface Threshold {
  metric: MetricName;
  good: number;
  needsImprovement: number;
}

export interface Budget {
  routeType: RouteType;
  thresholds: Threshold[];
}

export interface BaselineRun {
  id: string;           // e.g. "baseline-2026-04-17"
  timestamp: string;
  benchmarks: Benchmark[];
  mode: "real" | "mock" | "lighthouse";
  notes?: string;
}

export interface BudgetCompliance {
  url: string;
  metric: MetricName;
  value: number;
  status: "good" | "needs-improvement" | "poor";
  budget: number;
}
