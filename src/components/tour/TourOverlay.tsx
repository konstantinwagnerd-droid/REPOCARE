"use client";

import * as React from "react";
import type { Tour } from "@/lib/tour/types";
import { TourStep } from "./TourStep";

interface TourOverlayProps {
  tour: Tour;
  stepIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  onFinish: () => void;
}

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

function isReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

export function TourOverlay({ tour, stepIndex, onNext, onPrev, onSkip, onFinish }: TourOverlayProps) {
  const step = tour.steps[stepIndex];
  const [targetRect, setTargetRect] = React.useState<Rect | null>(null);
  const [waiting, setWaiting] = React.useState(false);
  const reducedMotion = React.useMemo(() => isReducedMotion(), []);

  // Targeting: Selector aufloesen, ggf. waiting-Loop
  React.useEffect(() => {
    if (!step) return;
    if (!step.selector) {
      setTargetRect(null);
      return;
    }

    let cancelled = false;
    let tries = 0;
    const maxTries = step.waitFor ? 20 : 1; // 20 * 100ms = 2s

    const tryFind = () => {
      if (cancelled) return;
      const el = document.querySelector(step.selector as string) as HTMLElement | null;
      if (el) {
        const r = el.getBoundingClientRect();
        setTargetRect({ top: r.top, left: r.left, width: r.width, height: r.height });
        // Scroll in View
        el.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "center", inline: "center" });
        setWaiting(false);
        return;
      }
      tries++;
      if (tries < maxTries) {
        setWaiting(true);
        setTimeout(tryFind, 100);
      } else {
        // Fallback: kein Element gefunden -> zentriertes Modal
        setTargetRect(null);
        setWaiting(false);
      }
    };

    tryFind();
    return () => {
      cancelled = true;
    };
  }, [step, reducedMotion]);

  // Keyboard-Nav
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onSkip();
      } else if (e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault();
        if (stepIndex === tour.steps.length - 1) onFinish();
        else onNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        onPrev();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [stepIndex, tour.steps.length, onNext, onPrev, onSkip, onFinish]);

  // Re-position bei resize/scroll
  React.useEffect(() => {
    if (!step?.selector) return;
    const update = () => {
      const el = document.querySelector(step.selector as string) as HTMLElement | null;
      if (el) {
        const r = el.getBoundingClientRect();
        setTargetRect({ top: r.top, left: r.left, width: r.width, height: r.height });
      }
    };
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [step]);

  if (!step) return null;

  const isLast = stepIndex === tour.steps.length - 1;
  const isCentered = !step.selector || !targetRect;

  // Spotlight-Polygon (abgedunkeltes Overlay mit Loch)
  const pad = 8;
  const spotlight = targetRect
    ? {
        top: Math.max(targetRect.top - pad, 0),
        left: Math.max(targetRect.left - pad, 0),
        width: targetRect.width + pad * 2,
        height: targetRect.height + pad * 2,
      }
    : null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tour-title"
      aria-describedby="tour-body"
      className="fixed inset-0 z-[100]"
      style={{ pointerEvents: waiting ? "none" : "auto" }}
    >
      {/* Abgedunkelter Hintergrund mit Spotlight-Loch via 4 overlay-divs */}
      {spotlight ? (
        <>
          <div
            className="absolute left-0 right-0 top-0 bg-black/60"
            style={{ height: spotlight.top, transition: reducedMotion ? "none" : "all 180ms ease" }}
          />
          <div
            className="absolute left-0 bg-black/60"
            style={{
              top: spotlight.top,
              width: spotlight.left,
              height: spotlight.height,
              transition: reducedMotion ? "none" : "all 180ms ease",
            }}
          />
          <div
            className="absolute right-0 bg-black/60"
            style={{
              top: spotlight.top,
              left: spotlight.left + spotlight.width,
              height: spotlight.height,
              right: 0,
              transition: reducedMotion ? "none" : "all 180ms ease",
            }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 bg-black/60"
            style={{
              top: spotlight.top + spotlight.height,
              transition: reducedMotion ? "none" : "all 180ms ease",
            }}
          />
          {/* Ring um Spotlight */}
          <div
            className="pointer-events-none absolute rounded-xl ring-2 ring-primary ring-offset-2 ring-offset-background/40"
            style={{
              top: spotlight.top,
              left: spotlight.left,
              width: spotlight.width,
              height: spotlight.height,
              transition: reducedMotion ? "none" : "all 180ms ease",
            }}
          />
        </>
      ) : (
        <div className="absolute inset-0 bg-black/70" />
      )}

      {/* Tooltip-Card */}
      <TourStep
        step={step}
        currentIndex={stepIndex}
        totalSteps={tour.steps.length}
        targetRect={isCentered ? null : targetRect}
        onNext={isLast ? onFinish : onNext}
        onPrev={onPrev}
        onSkip={onSkip}
        isFirst={stepIndex === 0}
        isLast={isLast}
      />
    </div>
  );
}
