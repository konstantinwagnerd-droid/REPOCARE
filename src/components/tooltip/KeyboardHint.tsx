"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface KeyboardHintProps {
  /** Tasten als einzelne Eintraege, z.B. ["Cmd", "K"] oder ["Strg", "Enter"]. */
  keys: string[];
  className?: string;
  /** Automatisch Cmd auf Mac, Strg auf Win/Linux wenn `keys[0] === "Mod"`. */
  autoMod?: boolean;
}

function detectMod(): string {
  if (typeof navigator === "undefined") return "Strg";
  return /Mac|iPhone|iPad/.test(navigator.platform) ? "Cmd" : "Strg";
}

export function KeyboardHint({ keys, className, autoMod = true }: KeyboardHintProps) {
  const [mod, setMod] = React.useState("Strg");
  React.useEffect(() => {
    setMod(detectMod());
  }, []);

  const rendered = keys.map((k) => (autoMod && k === "Mod" ? mod : k));

  return (
    <span className={cn("inline-flex items-center gap-1 align-middle text-[11px] text-muted-foreground", className)}>
      {rendered.map((k, i) => (
        <React.Fragment key={i}>
          <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[10px] text-foreground">
            {k}
          </kbd>
          {i < rendered.length - 1 && <span className="opacity-60">+</span>}
        </React.Fragment>
      ))}
    </span>
  );
}
