"use client";

import * as React from "react";
import { HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface HelpTipProps {
  /** Kurzer Hilfe-Text, der beim Hover/Focus erscheint. */
  children: React.ReactNode;
  /** Optional: eigene Trigger-Icon-Groesse. */
  size?: "sm" | "md";
  className?: string;
  /** a11y-Label — wird als aria-label auf dem Trigger verwendet. */
  label?: string;
}

/**
 * Kleines (?)-Icon neben Formularfeldern/Spalten/Buttons.
 * Hover, Focus und Tap (Mobile) zeigen den Tooltip.
 * A11y: aria-describedby verknuepft Trigger mit Inhalt.
 */
export function HelpTip({ children, size = "sm", className, label = "Hilfe" }: HelpTipProps) {
  const [open, setOpen] = React.useState(false);
  const id = React.useId();
  const sizeClass = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <span className={cn("relative inline-flex items-center", className)}>
      <button
        type="button"
        aria-label={label}
        aria-describedby={open ? id : undefined}
        aria-expanded={open}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={(e) => {
          e.preventDefault();
          setOpen((v) => !v);
        }}
        className="inline-flex items-center justify-center rounded-full text-muted-foreground/70 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <HelpCircle className={sizeClass} strokeWidth={2} />
      </button>
      {open && (
        <span
          id={id}
          role="tooltip"
          className="absolute left-5 top-1/2 z-50 w-64 -translate-y-1/2 rounded-lg border border-border bg-popover p-3 text-xs leading-relaxed text-popover-foreground shadow-lg"
        >
          {children}
        </span>
      )}
    </span>
  );
}
