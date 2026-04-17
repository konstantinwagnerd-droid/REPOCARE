import { describe, it, expect, beforeEach } from "vitest";
import { analyticsStore } from "@/lib/analytics/store";
import { ingestEvent } from "@/lib/analytics/tracker";
import { normalizePage, sanitizeRole, sanitizeFeature } from "@/lib/analytics/dimensions";
import { toCSV, toJSON } from "@/lib/analytics/export";

beforeEach(() => analyticsStore._reset());

describe("analytics/dimensions", () => {
  it("strips IDs and query strings from page paths", () => {
    expect(normalizePage("/app/residents/abc1234567/details?tab=x")).toBe("/app/residents/:id/details");
    expect(normalizePage("/admin/staff/12345")).toBe("/admin/staff/:id");
    expect(normalizePage("/")).toBe("/");
  });

  it("allowlists roles and rejects freetext features", () => {
    expect(sanitizeRole("pflege")).toBe("pflege");
    expect(sanitizeRole("evil")).toBeUndefined();
    expect(sanitizeFeature("voice.transcribe")).toBe("voice.transcribe");
    expect(sanitizeFeature("sql';drop")).toBeUndefined();
  });
});

describe("analytics/tracker", () => {
  it("rejects events when DNT is set", async () => {
    const res = await ingestEvent({ name: "page.view", page: "/app", doNotTrack: true });
    expect(res.accepted).toBe(false);
    expect(res.reason).toBe("dnt");
  });

  it("accepts and records a page-view event", async () => {
    const res = await ingestEvent({
      name: "page.view",
      page: "/app/residents/123",
      role: "pflege",
      facility: "hietzing",
      userAgent: "test-ua",
    });
    expect(res.accepted).toBe(true);
    const summary = analyticsStore.summary();
    expect(summary.today.pageViews).toBe(1);
    expect(summary.topPages[0]?.page).toBe("/app/residents/:id");
  });

  it("rejects unknown events", async () => {
    const res = await ingestEvent({ name: "secret.evil" });
    expect(res.accepted).toBe(false);
    expect(res.reason).toBe("unknown-event");
  });
});

describe("analytics/export", () => {
  it("serializes rollups to CSV and JSON without user IDs", async () => {
    await ingestEvent({ name: "feature.voice.transcribe", feature: "voice.transcribe", userAgent: "ua-1" });
    const csv = toCSV(analyticsStore.all());
    expect(csv.split("\n")[0]).toContain("day,name,page,feature");
    const json = JSON.parse(toJSON(analyticsStore.all())) as Array<Record<string, unknown>>;
    expect(json[0]).toHaveProperty("uniqueUsers");
    expect(json[0]).not.toHaveProperty("userId");
  });
});
