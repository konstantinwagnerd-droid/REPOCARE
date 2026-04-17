/**
 * Framer-Motion Presets — alle respektieren prefers-reduced-motion.
 * Nutzung: <motion.div {...fadeInUp}>
 */
import type { Variants, Transition } from "framer-motion";
import { durations } from "./tokens";

// Framer-Motion erwartet Easing-Keywords ODER Cubic-Bezier via `cubicBezier()`.
// Wir verwenden Keywords — ausreichend fuer Marketing-Polish und kompatibel.
const baseTransition: Transition = {
  duration: durations.base / 1000,
  ease: "easeOut",
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: baseTransition,
};

export const fadeInUp = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: baseTransition,
};

export const fadeInDown = {
  initial: { opacity: 0, y: -16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
  transition: baseTransition,
};

export const slideInLeft = {
  initial: { opacity: 0, x: -24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 24 },
  transition: baseTransition,
};

export const slideInRight = {
  initial: { opacity: 0, x: 24 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
  transition: baseTransition,
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.96 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
  transition: {
    duration: durations.base / 1000,
    ease: "easeInOut",
  },
};

export const bounce = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 0.98, 1],
    transition: { duration: 0.5, times: [0, 0.3, 0.6, 1] },
  },
};

export const pulse = {
  animate: {
    scale: [1, 1.02, 1],
    opacity: [0.7, 1, 0.7],
    transition: { duration: 2, repeat: Infinity, ease: "easeInOut" as const },
  },
};

export const staggerChildren: Variants = {
  initial: {},
  animate: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: baseTransition,
  },
};

export const drawPath = {
  initial: { pathLength: 0, opacity: 0 },
  animate: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 1.2, ease: "easeOut" },
  },
};

export const spring = {
  type: "spring" as const,
  stiffness: 260,
  damping: 24,
};

/** Wrapper, der auf prefers-reduced-motion reagiert (Client-Side) */
export function withReducedMotion<T>(normal: T, reduced: Partial<T>): T {
  if (typeof window === "undefined") return normal;
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  return query.matches ? { ...normal, ...reduced } : normal;
}
