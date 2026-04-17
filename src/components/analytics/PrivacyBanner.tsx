"use client";

import { useEffect, useState } from "react";
import { Shield, X } from "lucide-react";
import { isOptedOut, setOptOut } from "@/lib/analytics/consent";

const DISMISS_KEY = "careai:analytics:banner-seen";

export function PrivacyBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      if (localStorage.getItem(DISMISS_KEY) === "1") return;
    } catch {
      return;
    }
    setVisible(true);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Datenschutz-Hinweis"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-2xl rounded-xl border border-border bg-background p-4 shadow-lg"
    >
      <div className="flex items-start gap-3">
        <Shield className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
        <div className="min-w-0 flex-1 text-sm">
          <div className="font-serif font-semibold">Privatsphäre-freundliche Nutzungsdaten</div>
          <p className="mt-1 text-muted-foreground">
            CareAI misst Nutzung datenschutzfreundlich: ohne Cookies, ohne Fingerprint, ohne personenbezogene Daten. IP wird nicht gespeichert,
            User-Agent wird tageweise gehasht (kein Cross-Day-Matching). Du kannst jederzeit widersprechen.
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                try {
                  localStorage.setItem(DISMISS_KEY, "1");
                } catch {}
                setVisible(false);
              }}
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            >
              Verstanden
            </button>
            <button
              type="button"
              onClick={() => {
                setOptOut(!isOptedOut());
                try {
                  localStorage.setItem(DISMISS_KEY, "1");
                } catch {}
                setVisible(false);
              }}
              className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium hover:bg-secondary"
            >
              {isOptedOut() ? "Messung erlauben" : "Ganz widersprechen"}
            </button>
          </div>
        </div>
        <button
          type="button"
          aria-label="Hinweis schließen"
          onClick={() => {
            try {
              localStorage.setItem(DISMISS_KEY, "1");
            } catch {}
            setVisible(false);
          }}
          className="shrink-0 rounded-md p-1 text-muted-foreground hover:bg-secondary"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
