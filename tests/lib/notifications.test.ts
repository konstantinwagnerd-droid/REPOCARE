import { describe, it, expect, beforeEach } from "vitest";
import { notificationStore, inQuietHours } from "@/lib/notifications/store";
import { dispatch } from "@/lib/notifications/router";
import { getTemplate, render, templates } from "@/lib/notifications/templates";

beforeEach(() => {
  notificationStore._reset();
});

describe("notifications/templates", () => {
  it("has 15 templates, one per event", () => {
    expect(templates.length).toBe(15);
    const events = new Set(templates.map((t) => t.event));
    expect(events.size).toBe(15);
  });

  it("renders variables and leaves unknowns intact", () => {
    expect(render("Hallo {name}!", { name: "Lea" })).toBe("Hallo Lea!");
    expect(render("{a}/{b}", { a: 1 })).toBe("1/{b}");
  });

  it("finds a template by event", () => {
    expect(getTemplate("incident.reported")?.kind).toBe("critical");
  });
});

describe("notifications/store", () => {
  it("caps inbox at 500 and tracks unread count", () => {
    for (let i = 0; i < 520; i++) {
      notificationStore.push("u1", {
        id: `n${i}`,
        userId: "u1",
        tenantId: "t",
        event: "incident.reported",
        kind: "info",
        title: "x",
        body: "y",
        channels: ["in-app"],
        createdAt: Date.now() + i,
      });
    }
    expect(notificationStore.inbox("u1").length).toBe(500);
    expect(notificationStore.unreadCount("u1")).toBe(500);
    const n = notificationStore.markAllRead("u1");
    expect(n).toBe(500);
    expect(notificationStore.unreadCount("u1")).toBe(0);
  });

  it("respects quiet hours over midnight", () => {
    const prefs = notificationStore.getPrefs("u2");
    expect(inQuietHours(prefs, new Date("2026-04-17T23:00:00"))).toBe(true);
    expect(inQuietHours(prefs, new Date("2026-04-17T04:00:00"))).toBe(true);
    expect(inQuietHours(prefs, new Date("2026-04-17T10:00:00"))).toBe(false);
  });
});

describe("notifications/router dispatch", () => {
  it("creates an in-app notification for a user audience", async () => {
    const result = await dispatch({
      event: "export.ready",
      tenantId: "t1",
      audience: { scope: "user", value: "u-demo" },
      vars: { label: "Export-1", size: "2 MB" },
    });
    expect(result.length).toBe(1);
    const inbox = notificationStore.inbox("u-demo");
    expect(inbox[0]?.title).toContain("Export bereit");
    expect(inbox[0]?.body).toContain("Export-1");
  });

  it("skips events disabled by user prefs", async () => {
    notificationStore.savePrefs({
      userId: "u-off",
      events: { "training.due": false },
      channels: {},
      quietHours: { enabled: false, from: "22:00", to: "06:00" },
    });
    const result = await dispatch({
      event: "training.due",
      tenantId: "t",
      audience: { scope: "user", value: "u-off" },
      vars: { topic: "BRK-Auffrischung", deadline: "30.04." },
    });
    expect(result.length).toBe(0);
    expect(notificationStore.inbox("u-off").length).toBe(0);
  });
});
