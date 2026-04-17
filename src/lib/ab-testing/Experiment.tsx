"use client";

import { useEffect, useState } from "react";

interface AssignmentResponse {
  enrolled: boolean;
  variantId?: string;
  variantName?: string;
  payload?: Record<string, unknown>;
}

interface ExperimentProps {
  name: string;
  /** Map of variantId → render node */
  variants: Record<string, React.ReactNode>;
  /** Shown until the assignment is resolved — or if the user is not enrolled */
  fallback?: React.ReactNode;
}

/**
 * Client-side A/B experiment renderer. Fetches assignment from
 * /api/ab-testing/assignment and tracks impression automatically.
 */
export function Experiment({ name, variants, fallback = null }: ExperimentProps) {
  const [assignment, setAssignment] = useState<AssignmentResponse | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/ab-testing/assignment/${encodeURIComponent(name)}`)
      .then((r) => r.json())
      .then((data: AssignmentResponse) => { if (!cancelled) setAssignment(data); })
      .catch(() => { if (!cancelled) setAssignment({ enrolled: false }); });
    return () => { cancelled = true; };
  }, [name]);

  if (!assignment) return <>{fallback}</>;
  if (!assignment.enrolled || !assignment.variantId) return <>{fallback}</>;
  const node = variants[assignment.variantId];
  return <>{node ?? fallback}</>;
}

/** Imperative API for tracking conversions from anywhere client-side */
export function trackExperimentConversion(experiment: string, metricId: string, value?: number): Promise<Response> {
  return fetch("/api/ab-testing/conversion", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ experiment, metricId, value }),
    keepalive: true,
  });
}
