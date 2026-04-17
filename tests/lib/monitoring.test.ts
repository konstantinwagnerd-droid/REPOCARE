import { describe, it, expect, beforeEach } from "vitest";
import { metrics } from "@/lib/monitoring/metrics";

beforeEach(() => metrics.reset());

describe("monitoring.metrics", () => {
  it("increments counters", () => {
    metrics.inc("login_total", { result: "ok" });
    metrics.inc("login_total", { result: "ok" });
    metrics.inc("login_total", { result: "fail" });
    const dump = metrics.snapshot();
    expect(dump.counters["login_total{result=ok}"]).toBe(2);
    expect(dump.counters["login_total{result=fail}"]).toBe(1);
  });
  it("observes histogram values", () => {
    metrics.observe("voice_transcribe_ms", 100);
    metrics.observe("voice_transcribe_ms", 200);
    const dump = metrics.snapshot();
    expect(dump.histograms["voice_transcribe_ms"].count).toBe(2);
    expect(dump.histograms["voice_transcribe_ms"].sum).toBe(300);
  });
  it("emits prometheus text format", () => {
    metrics.inc("export_total");
    const text = metrics.toPrometheus();
    expect(text).toContain("# TYPE export_total counter");
    expect(text).toContain("export_total 1");
  });
});
