"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface WizardStep {
  id: number;
  label: string;
  description: string;
}

export function WizardStepper({
  steps,
  current,
  onStepClick,
}: {
  steps: WizardStep[];
  current: number;
  onStepClick?: (id: number) => void;
}) {
  return (
    <nav aria-label="Migration-Schritte">
      <ol className="flex flex-wrap items-center gap-2">
        {steps.map((step, idx) => {
          const done = step.id < current;
          const active = step.id === current;
          return (
            <li key={step.id} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onStepClick?.(step.id)}
                disabled={!onStepClick}
                aria-current={active ? "step" : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-xl border px-4 py-2 text-left transition-colors",
                  done && "border-primary/40 bg-primary/5 text-primary",
                  active && "border-primary bg-primary text-primary-foreground shadow-sm",
                  !done && !active && "border-border bg-background text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                    done && "bg-primary text-primary-foreground",
                    active && "bg-primary-foreground text-primary",
                    !done && !active && "bg-muted text-foreground",
                  )}
                  aria-hidden="true"
                >
                  {done ? <Check className="size-4" /> : step.id}
                </span>
                <span>
                  <span className="block text-sm font-medium leading-tight">{step.label}</span>
                  <span className={cn(
                    "block text-xs",
                    active ? "text-primary-foreground/80" : "text-muted-foreground",
                  )}>
                    {step.description}
                  </span>
                </span>
              </button>
              {idx < steps.length - 1 && (
                <div className="hidden h-px w-6 bg-border md:block" aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
