"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";

/**
 * KioskShell — wrapper that activates Wake-Lock, Fullscreen hint, auto-reload
 * und Screensaver. Protects gegen versehentliche Navigation via PIN-Prompt.
 */
export function KioskShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const lastActivity = useRef(Date.now());
  const wakeLockRef = useRef<unknown>(null);

  // Wake Lock API — Bildschirm bleibt an
  useEffect(() => {
    let cancelled = false;
    async function request() {
      try {
        const nav = navigator as Navigator & { wakeLock?: { request?: (t: string) => Promise<unknown> } };
        const lock = await nav.wakeLock?.request?.("screen");
        if (!cancelled) wakeLockRef.current = lock;
      } catch {
        /* silent */
      }
    }
    request();
    const onVisible = () => {
      if (document.visibilityState === "visible") request();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisible);
      try {
        (wakeLockRef.current as { release?: () => void } | null)?.release?.();
      } catch {
        /* silent */
      }
    };
  }, []);

  // Auto-Reload alle 15 Minuten (Fallback falls UI haengt)
  useEffect(() => {
    const t = window.setTimeout(() => window.location.reload(), 15 * 60 * 1000);
    return () => window.clearTimeout(t);
  }, [pathname]);

  // Activity tracking
  useEffect(() => {
    const bump = () => {
      lastActivity.current = Date.now();
      document.body.dataset.kioskScreensaver = "0";
    };
    const events = ["pointerdown", "keydown", "touchstart"];
    events.forEach((e) => window.addEventListener(e, bump, { passive: true }));
    const tick = window.setInterval(() => {
      const idle = Date.now() - lastActivity.current;
      if (idle > 5 * 60 * 1000) document.body.dataset.kioskScreensaver = "1";
    }, 10_000);
    return () => {
      events.forEach((e) => window.removeEventListener(e, bump));
      window.clearInterval(tick);
    };
  }, []);

  // Schutz gegen versehentliche Navigation: ESC/Backspace fragt PIN
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || (e.key === "Backspace" && e.target === document.body)) {
        e.preventDefault();
        const pin = window.prompt("PIN eingeben zum Verlassen:");
        if (pin && pin === (process.env.NEXT_PUBLIC_KIOSK_PIN ?? "1234")) {
          router.push("/kiosk");
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router]);

  return <>{children}</>;
}
