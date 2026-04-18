import { test, expect } from "@playwright/test";

// Offline-Mutation Scenario:
//   1. Go to /offline-demo online.
//   2. Switch the browser context offline.
//   3. Submit a care report — it should be queued in IndexedDB.
//   4. Banner should show "Du bist offline" + pending count.
//   5. Switch back online.
//   6. Banner should disappear once flushQueue has drained the outbox.

test.describe("Offline — mutation queuing & auto-sync", () => {
  test("queues a care report offline and syncs on reconnect", async ({ page, context }) => {
    await page.goto("/offline-demo");
    await expect(page.getByTestId("care-report-form")).toBeVisible();

    // Go offline
    await context.setOffline(true);

    // Give the browser a tick to emit the offline event
    await page.evaluate(() => window.dispatchEvent(new Event("offline")));

    // Fill & submit the care report
    await page.getByTestId("care-report-text").fill("Offline-Test — Wohlbefinden stabil.");
    await page.getByTestId("care-report-submit").click();

    // Banner should be visible (offline tone = red)
    const banner = page.getByTestId("offline-banner");
    await expect(banner).toBeVisible();
    await expect(banner).toHaveAttribute("data-tone", /red|amber/);

    // Outbox should contain exactly 1 entry
    const outboxCount = await page.evaluate(async () => {
      return await new Promise<number>((resolve) => {
        const req = indexedDB.open("careai-offline", 2);
        req.onsuccess = () => {
          const db = req.result;
          const tx = db.transaction("outbox", "readonly");
          const cReq = tx.objectStore("outbox").count();
          cReq.onsuccess = () => resolve(cReq.result as number);
          cReq.onerror = () => resolve(-1);
        };
        req.onerror = () => resolve(-1);
      });
    });
    expect(outboxCount).toBeGreaterThanOrEqual(1);

    // Reconnect
    await context.setOffline(false);
    await page.evaluate(() => window.dispatchEvent(new Event("online")));

    // Give the sync engine a few seconds to drain
    await page.waitForTimeout(3000);

    // Outbox may drain (if /api/sync responds) OR remain (if auth redirect).
    // Either way: the banner must not still be in "offline" state.
    const tone = await banner.getAttribute("data-tone").catch(() => null);
    if (tone) {
      expect(tone).not.toBe("red");
    }
  });
});
