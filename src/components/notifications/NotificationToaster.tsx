"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import type { Notification } from "@/lib/notifications/types";

/**
 * Poll inbox every 10s; when new CRITICAL notifications appear, surface as Sonner toast.
 */
export function NotificationToaster() {
  const seenRef = useRef<Set<string>>(new Set());
  const primedRef = useRef(false);

  useEffect(() => {
    let stopped = false;
    async function tick() {
      if (stopped) return;
      try {
        const res = await fetch("/api/notifications/inbox?filter=critical", { cache: "no-store" });
        if (res.ok) {
          const data = (await res.json()) as { items: Notification[] };
          if (!primedRef.current) {
            // Erste Ladung: nur registrieren, keine Toasts.
            for (const n of data.items) seenRef.current.add(n.id);
            primedRef.current = true;
          } else {
            for (const n of data.items) {
              if (!seenRef.current.has(n.id)) {
                seenRef.current.add(n.id);
                toast.error(n.title, { description: n.body, duration: 8000 });
              }
            }
          }
        }
      } catch {
        /* ignore */
      }
    }
    tick();
    const t = setInterval(tick, 10_000);
    return () => {
      stopped = true;
      clearInterval(t);
    };
  }, []);
  return null;
}
