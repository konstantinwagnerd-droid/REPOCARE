/**
 * Minimal in-process metrics registry with Prometheus text output.
 * Not cluster-safe; for multi-instance, swap for prom-client or OpenTelemetry.
 */

type Labels = Record<string, string>;

function labelKey(name: string, labels?: Labels): string {
  if (!labels || Object.keys(labels).length === 0) return name;
  const parts = Object.keys(labels)
    .sort()
    .map((k) => `${k}=${labels[k]}`)
    .join(",");
  return `${name}{${parts}}`;
}

interface HistData {
  count: number;
  sum: number;
  buckets: Record<string, number>;
}
const DEFAULT_BUCKETS = [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000];

class Registry {
  counters = new Map<string, number>();
  histograms = new Map<string, HistData>();

  inc(name: string, labels?: Labels, by = 1) {
    const k = labelKey(name, labels);
    this.counters.set(k, (this.counters.get(k) ?? 0) + by);
  }
  observe(name: string, value: number, labels?: Labels) {
    const k = labelKey(name, labels);
    const h = this.histograms.get(k) ?? { count: 0, sum: 0, buckets: {} };
    h.count += 1;
    h.sum += value;
    for (const b of DEFAULT_BUCKETS) {
      if (value <= b) h.buckets[`le=${b}`] = (h.buckets[`le=${b}`] ?? 0) + 1;
    }
    this.histograms.set(k, h);
  }
  snapshot() {
    return {
      counters: Object.fromEntries(this.counters),
      histograms: Object.fromEntries(this.histograms),
    };
  }
  reset() {
    this.counters.clear();
    this.histograms.clear();
  }
  toPrometheus(): string {
    const lines: string[] = [];
    const counterNames = new Set<string>();
    for (const key of this.counters.keys()) counterNames.add(key.split("{")[0]);
    for (const name of counterNames) {
      lines.push(`# TYPE ${name} counter`);
      for (const [k, v] of this.counters) if (k.startsWith(name)) lines.push(`${k} ${v}`);
    }
    const histNames = new Set<string>();
    for (const key of this.histograms.keys()) histNames.add(key.split("{")[0]);
    for (const name of histNames) {
      lines.push(`# TYPE ${name} histogram`);
      for (const [k, h] of this.histograms) {
        if (!k.startsWith(name)) continue;
        for (const [bucket, count] of Object.entries(h.buckets)) lines.push(`${k}_bucket{${bucket}} ${count}`);
        lines.push(`${k}_sum ${h.sum}`);
        lines.push(`${k}_count ${h.count}`);
      }
    }
    return lines.join("\n") + "\n";
  }
}

export const metrics = new Registry();

// Convenience shortcuts for hot paths
export const track = {
  login: (result: "ok" | "fail") => metrics.inc("login_total", { result }),
  export: (kind: string) => metrics.inc("export_total", { kind }),
  voiceTranscribe: (ms: number) => metrics.observe("voice_transcribe_ms", ms),
  apiLatency: (route: string, ms: number) => metrics.observe("api_latency_ms", ms, { route }),
};
