"use client";

import type { TourProgress } from "./types";

/**
 * Fortschritts-Speicher fuer Touren.
 * Implementiert als localStorage — Server-Sync kann spaeter ergaenzt werden
 * indem `syncToServer()` einen POST /api/tours/progress ausloest.
 */

const STORAGE_PREFIX = "careai.tour.progress.";
const STORAGE_SEEN = "careai.tour.seen";

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

export function getProgress(tourId: string): TourProgress | null {
  if (!isBrowser()) return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_PREFIX + tourId);
    if (!raw) return null;
    return JSON.parse(raw) as TourProgress;
  } catch {
    return null;
  }
}

export function saveProgress(tourId: string, stepIndex: number, completed = false): TourProgress {
  const now = new Date().toISOString();
  const existing = getProgress(tourId);
  const progress: TourProgress = {
    tourId,
    stepIndex,
    completed,
    startedAt: existing?.startedAt ?? now,
    updatedAt: now,
  };
  if (isBrowser()) {
    try {
      window.localStorage.setItem(STORAGE_PREFIX + tourId, JSON.stringify(progress));
    } catch {
      // ignore quota errors
    }
  }
  return progress;
}

export function markTourSeen(tourId: string): void {
  if (!isBrowser()) return;
  try {
    const raw = window.localStorage.getItem(STORAGE_SEEN);
    const seen: string[] = raw ? JSON.parse(raw) : [];
    if (!seen.includes(tourId)) {
      seen.push(tourId);
      window.localStorage.setItem(STORAGE_SEEN, JSON.stringify(seen));
    }
  } catch {
    // ignore
  }
}

export function hasSeenTour(tourId: string): boolean {
  if (!isBrowser()) return false;
  try {
    const raw = window.localStorage.getItem(STORAGE_SEEN);
    const seen: string[] = raw ? JSON.parse(raw) : [];
    return seen.includes(tourId);
  } catch {
    return false;
  }
}

export function resetTour(tourId: string): void {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(STORAGE_PREFIX + tourId);
    const raw = window.localStorage.getItem(STORAGE_SEEN);
    const seen: string[] = raw ? JSON.parse(raw) : [];
    const next = seen.filter((id) => id !== tourId);
    window.localStorage.setItem(STORAGE_SEEN, JSON.stringify(next));
  } catch {
    // ignore
  }
}

export function resetAllTours(): void {
  if (!isBrowser()) return;
  try {
    const keys: string[] = [];
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (k && (k.startsWith(STORAGE_PREFIX) || k === STORAGE_SEEN)) keys.push(k);
    }
    keys.forEach((k) => window.localStorage.removeItem(k));
  } catch {
    // ignore
  }
}
