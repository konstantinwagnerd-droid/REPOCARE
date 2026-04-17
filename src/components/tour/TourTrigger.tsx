"use client";

import * as React from "react";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTour } from "./TourProvider";
import { getTourForRole, TOURS } from "@/lib/tour/registry";
import { cn } from "@/lib/utils";

interface TourTriggerProps {
  /** Rolle zum Auswaehlen der Default-Tour. */
  role?: string;
  /** Explizite tourId (ueberschreibt role). */
  tourId?: string;
  label?: string;
  variant?: "icon" | "button" | "link";
  className?: string;
}

export function TourTrigger({ role, tourId, label = "Tour starten", variant = "icon", className }: TourTriggerProps) {
  const { startTour } = useTour();

  const targetId = React.useMemo(() => {
    if (tourId && TOURS[tourId]) return tourId;
    if (role) return getTourForRole(role)?.id ?? null;
    return null;
  }, [tourId, role]);

  if (!targetId) return null;

  const handleClick = () => startTour(targetId);

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={label}
        title={label}
        className={cn(
          "inline-flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground",
          className
        )}
      >
        <HelpCircle className="h-4 w-4" />
      </button>
    );
  }

  if (variant === "link") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={cn("text-sm text-primary hover:underline", className)}
      >
        {label}
      </button>
    );
  }

  return (
    <Button type="button" variant="outline" size="sm" onClick={handleClick} className={className}>
      <HelpCircle className="mr-2 h-4 w-4" /> {label}
    </Button>
  );
}
