"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import type { TourStep as TourStepT } from "@/lib/tour/types";
import { cn } from "@/lib/utils";

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface TourStepProps {
  step: TourStepT;
  currentIndex: number;
  totalSteps: number;
  targetRect: Rect | null;
  onNext: () => void;
  onPrev: () => void;
  onSkip: () => void;
  isFirst: boolean;
  isLast: boolean;
}

/**
 * Positioniert die Tooltip-Card relativ zum Target.
 * Bei targetRect=null -> zentriertes Modal.
 */
function computeCardPosition(targetRect: Rect | null, placement: string | undefined): React.CSSProperties {
  if (!targetRect) {
    return {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    };
  }
  const cardW = 360;
  const cardH = 200;
  const gap = 16;
  const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
  const vh = typeof window !== "undefined" ? window.innerHeight : 800;

  let top = 0;
  let left = 0;

  switch (placement) {
    case "top":
      top = targetRect.top - cardH - gap;
      left = targetRect.left + targetRect.width / 2 - cardW / 2;
      break;
    case "left":
      top = targetRect.top + targetRect.height / 2 - cardH / 2;
      left = targetRect.left - cardW - gap;
      break;
    case "right":
      top = targetRect.top + targetRect.height / 2 - cardH / 2;
      left = targetRect.left + targetRect.width + gap;
      break;
    case "bottom":
    default:
      top = targetRect.top + targetRect.height + gap;
      left = targetRect.left + targetRect.width / 2 - cardW / 2;
      break;
  }

  // Clamp in Viewport
  left = Math.max(16, Math.min(left, vw - cardW - 16));
  top = Math.max(16, Math.min(top, vh - cardH - 16));

  return { top, left, width: cardW };
}

export function TourStep({
  step,
  currentIndex,
  totalSteps,
  targetRect,
  onNext,
  onPrev,
  onSkip,
  isFirst,
  isLast,
}: TourStepProps) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const style = computeCardPosition(targetRect, step.placement);

  // Focus-Trap: initial Fokus auf „Weiter"-Button
  React.useEffect(() => {
    const t = setTimeout(() => {
      const btn = cardRef.current?.querySelector<HTMLButtonElement>("[data-tour-primary]");
      btn?.focus();
    }, 50);
    return () => clearTimeout(t);
  }, [currentIndex]);

  return (
    <div
      ref={cardRef}
      role="document"
      className={cn(
        "absolute z-[101] rounded-2xl border border-border bg-background p-5 shadow-2xl",
        "focus:outline-none"
      )}
      style={style}
      tabIndex={-1}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs font-medium text-muted-foreground">
          Schritt {currentIndex + 1} von {totalSteps}
        </div>
        <button
          type="button"
          onClick={onSkip}
          className="text-xs text-muted-foreground hover:text-foreground"
          aria-label="Tour ueberspringen"
        >
          Ueberspringen
        </button>
      </div>

      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${((currentIndex + 1) / totalSteps) * 100}%` }}
          aria-hidden="true"
        />
      </div>

      <h3 id="tour-title" className="mt-3 font-serif text-lg font-semibold">
        {step.title}
      </h3>
      <p id="tour-body" className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        {step.body}
      </p>

      <div className="mt-4 flex items-center justify-between gap-2">
        <Button type="button" variant="outline" size="sm" onClick={onPrev} disabled={isFirst}>
          Zurueck
        </Button>
        <div className="text-[11px] text-muted-foreground">
          <kbd className="rounded border px-1">Esc</kbd> schliessen
        </div>
        <Button type="button" variant="accent" size="sm" onClick={onNext} data-tour-primary>
          {isLast ? "Fertig" : "Weiter"}
        </Button>
      </div>
    </div>
  );
}
