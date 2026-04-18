"use client";

import { Globe2, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { APP_LOCALES, useT, type AppLocale } from "@/lib/i18n";

const CODES: Record<AppLocale, string> = { de: "DE", en: "EN", tr: "TR", ar: "AR" };

export function AppLanguageSwitcher() {
  const { locale, setLocale, t } = useT();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={t("topbar.language")}
        className="inline-flex h-11 items-center gap-1.5 rounded-xl border border-border px-2.5 text-xs font-medium hover:bg-secondary transition-colors"
      >
        <Globe2 className="h-3.5 w-3.5" />
        {CODES[locale]}
        <ChevronDown className="h-3 w-3" />
      </button>
      {open && (
        <div role="menu" className="absolute end-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-xl border border-border bg-background shadow-lg">
          {APP_LOCALES.map((loc) => {
            const isActive = loc === locale;
            return (
              <button
                key={loc}
                type="button"
                role="menuitem"
                onClick={() => { setLocale(loc); setOpen(false); }}
                className={`flex w-full items-center justify-between px-3 py-2 text-xs hover:bg-secondary ${isActive ? "bg-secondary font-semibold" : ""}`}
              >
                <span>{t(`language.${loc}`)}</span>
                <span className="text-muted-foreground">{CODES[loc]}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
