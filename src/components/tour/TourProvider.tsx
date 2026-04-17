"use client";

import * as React from "react";
import { TOURS, getTourForRole } from "@/lib/tour/registry";
import { hasSeenTour, markTourSeen, saveProgress, getProgress } from "@/lib/tour/store";
import type { Tour } from "@/lib/tour/types";
import { TourOverlay } from "./TourOverlay";

interface TourContextValue {
  activeTour: Tour | null;
  stepIndex: number;
  isActive: boolean;
  startTour: (tourId: string) => void;
  startTourForRole: (role: string) => void;
  next: () => void;
  prev: () => void;
  skip: () => void;
  finish: () => void;
}

const TourContext = React.createContext<TourContextValue | null>(null);

export function useTour(): TourContextValue {
  const ctx = React.useContext(TourContext);
  if (!ctx) throw new Error("useTour must be used inside <TourProvider>");
  return ctx;
}

/** Like useTour, aber liefert null wenn kein Provider vorhanden ist. */
export function useOptionalTour(): TourContextValue | null {
  return React.useContext(TourContext);
}

interface TourProviderProps {
  children: React.ReactNode;
  /** Rolle des aktuell eingeloggten Users (fuer Auto-Start der passenden Tour). */
  role?: string;
  /** Auto-Start der Tour beim ersten Login unterdruecken (fuer Demo-Mode o.ae.). */
  disableAutoStart?: boolean;
}

export function TourProvider({ children, role, disableAutoStart }: TourProviderProps) {
  const [activeTour, setActiveTour] = React.useState<Tour | null>(null);
  const [stepIndex, setStepIndex] = React.useState(0);

  const startTour = React.useCallback((tourId: string) => {
    const tour = TOURS[tourId];
    if (!tour) return;
    setActiveTour(tour);
    const progress = getProgress(tourId);
    const resumeAt = progress && !progress.completed ? progress.stepIndex : 0;
    setStepIndex(resumeAt);
    saveProgress(tourId, resumeAt, false);
  }, []);

  const startTourForRole = React.useCallback(
    (r: string) => {
      const tour = getTourForRole(r);
      if (tour) startTour(tour.id);
    },
    [startTour]
  );

  const next = React.useCallback(() => {
    setStepIndex((i) => {
      if (!activeTour) return i;
      const n = Math.min(i + 1, activeTour.steps.length - 1);
      saveProgress(activeTour.id, n, false);
      return n;
    });
  }, [activeTour]);

  const prev = React.useCallback(() => {
    setStepIndex((i) => {
      const n = Math.max(i - 1, 0);
      if (activeTour) saveProgress(activeTour.id, n, false);
      return n;
    });
  }, [activeTour]);

  const finish = React.useCallback(() => {
    if (activeTour) {
      saveProgress(activeTour.id, activeTour.steps.length - 1, true);
      markTourSeen(activeTour.id);
    }
    setActiveTour(null);
    setStepIndex(0);
  }, [activeTour]);

  const skip = React.useCallback(() => {
    if (activeTour) markTourSeen(activeTour.id);
    setActiveTour(null);
    setStepIndex(0);
  }, [activeTour]);

  // Auto-Start bei Erstlogin fuer die Rolle
  React.useEffect(() => {
    if (disableAutoStart || !role) return;
    const tour = getTourForRole(role);
    if (!tour) return;
    if (!hasSeenTour(tour.id)) {
      // kleiner Delay, damit UI gerendert ist
      const t = setTimeout(() => startTour(tour.id), 800);
      return () => clearTimeout(t);
    }
  }, [role, disableAutoStart, startTour]);

  const value: TourContextValue = {
    activeTour,
    stepIndex,
    isActive: activeTour !== null,
    startTour,
    startTourForRole,
    next,
    prev,
    skip,
    finish,
  };

  return (
    <TourContext.Provider value={value}>
      {children}
      {activeTour && (
        <TourOverlay
          tour={activeTour}
          stepIndex={stepIndex}
          onNext={next}
          onPrev={prev}
          onSkip={skip}
          onFinish={finish}
        />
      )}
    </TourContext.Provider>
  );
}
