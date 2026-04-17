"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe2, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";

type Locale = "de" | "en" | "fr" | "it" | "es";

// Keyed by logical "page" — value is the path per locale
const PAGE_MAP: Record<string, Record<Locale, string>> = {
  home: { de: "/", en: "/en", fr: "/fr", it: "/it", es: "/es" },
  trust: { de: "/trust", en: "/en/trust", fr: "/fr/confiance", it: "/it/fiducia", es: "/es/confianza" },
  roi: { de: "/roi-rechner", en: "/en/roi-calculator", fr: "/fr/calculateur-roi", it: "/it/calcolatore-roi", es: "/es/calculadora-roi" },
  cases: { de: "/case-studies", en: "/en/case-studies", fr: "/fr/etudes-de-cas", it: "/it/casi-studio", es: "/es/casos-de-estudio" },
  blog: { de: "/blog", en: "/en/blog", fr: "/fr/blog", it: "/it/blog", es: "/es/blog" },
  about: { de: "/ueber-uns", en: "/en/about", fr: "/fr/a-propos", it: "/it/chi-siamo", es: "/es/sobre-nosotros" },
  contact: { de: "/kontakt", en: "/en/contact", fr: "/fr/contact", it: "/it/contatti", es: "/es/contacto" },
  integrations: { de: "/integrations", en: "/en/integrations", fr: "/fr", it: "/it", es: "/es" },
  careers: { de: "/karriere", en: "/en/careers", fr: "/fr", it: "/it", es: "/es" },
};

const LABELS: Record<Locale, { code: string; name: string }> = {
  de: { code: "DE", name: "Deutsch" },
  en: { code: "EN", name: "English" },
  fr: { code: "FR", name: "Français" },
  it: { code: "IT", name: "Italiano" },
  es: { code: "ES", name: "Español" },
};

function detectLocale(path: string): Locale {
  if (path === "/en" || path.startsWith("/en/")) return "en";
  if (path === "/fr" || path.startsWith("/fr/")) return "fr";
  if (path === "/it" || path.startsWith("/it/")) return "it";
  if (path === "/es" || path.startsWith("/es/")) return "es";
  return "de";
}

function findPageKey(path: string): string {
  for (const [key, map] of Object.entries(PAGE_MAP)) {
    for (const locPath of Object.values(map)) {
      if (path === locPath) return key;
    }
  }
  return "home";
}

export function LanguageSwitcher() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = detectLocale(pathname);
  const pageKey = findPageKey(pathname);

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
        aria-label="Switch language"
        className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border px-2.5 text-xs font-medium hover:bg-secondary transition-colors"
      >
        <Globe2 className="h-3.5 w-3.5" />
        {LABELS[current].code}
        <ChevronDown className="h-3 w-3" />
      </button>
      {open && (
        <div role="menu" className="absolute right-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-xl border border-border bg-background shadow-lg">
          {(Object.keys(LABELS) as Locale[]).map((loc) => {
            const target = PAGE_MAP[pageKey]?.[loc] ?? PAGE_MAP.home[loc];
            const isActive = loc === current;
            return (
              <Link
                key={loc}
                role="menuitem"
                href={target}
                onClick={() => setOpen(false)}
                className={`flex items-center justify-between px-3 py-2 text-xs hover:bg-secondary ${isActive ? "bg-secondary font-semibold" : ""}`}
              >
                <span>{LABELS[loc].name}</span>
                <span className="text-muted-foreground">{LABELS[loc].code}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
