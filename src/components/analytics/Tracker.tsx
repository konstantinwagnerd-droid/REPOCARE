"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { isOptedOut } from "@/lib/analytics/consent";

/**
 * Minimaler Client-Tracker. Keine externen Calls, nur eigener Endpoint.
 * Respects navigator.doNotTrack und Opt-Out.
 */
export function AnalyticsTracker({ role, facility }: { role?: string; facility?: string }) {
  const pathname = usePathname();
  const lastPath = useRef<string | null>(null);

  useEffect(() => {
    if (isOptedOut()) return;
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    void fetch("/api/analytics/event", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name: "page.view", page: pathname, role, facility }),
      keepalive: true,
    }).catch(() => {});
  }, [pathname, role, facility]);

  useEffect(() => {
    if (isOptedOut()) return;
    // Web Vitals: LCP via PerformanceObserver
    try {
      const po = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const e = entry as PerformanceEntry & { startTime: number };
          void fetch("/api/analytics/event", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              name: "perf.web-vital",
              page: window.location.pathname,
              vitalName: entry.entryType,
              value: Math.round(e.startTime),
              role,
              facility,
            }),
            keepalive: true,
          }).catch(() => {});
        }
      });
      po.observe({ type: "largest-contentful-paint", buffered: true });
      return () => po.disconnect();
    } catch {
      /* unsupported */
    }
  }, [role, facility]);

  return null;
}

export function trackFeature(feature: string, role?: string, facility?: string) {
  if (typeof window === "undefined" || isOptedOut()) return;
  void fetch("/api/analytics/event", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: `feature.${feature}`, feature, role, facility }),
    keepalive: true,
  }).catch(() => {});
}

export function trackError(errorType: string, role?: string) {
  if (typeof window === "undefined" || isOptedOut()) return;
  void fetch("/api/analytics/event", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name: "error", errorType, role }),
    keepalive: true,
  }).catch(() => {});
}
