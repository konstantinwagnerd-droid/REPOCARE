"use client";

/**
 * Leichtgewichtiger i18n fuer die Pflegekraft-UI.
 * Admin/Owner/Rechtliche Routen bleiben Deutsch — i18n wird dort nicht geladen.
 *
 * Persistiert Sprache in localStorage (careai_locale). RTL fuer ar.
 */
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import deJson from "@/locales/de.json";
import enJson from "@/locales/en.json";
import trJson from "@/locales/tr.json";
import arJson from "@/locales/ar.json";

export type AppLocale = "de" | "en" | "tr" | "ar";
export const APP_LOCALES: AppLocale[] = ["de", "en", "tr", "ar"];
export const RTL_LOCALES: AppLocale[] = ["ar"];

type Dict = typeof deJson;

const dicts: Record<AppLocale, Dict> = {
  de: deJson,
  en: enJson,
  tr: trJson as Dict,
  ar: arJson as Dict,
};

interface I18nContextValue {
  locale: AppLocale;
  setLocale: (l: AppLocale) => void;
  t: (key: string, fallback?: string) => string;
  dir: "ltr" | "rtl";
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "careai_locale";

function getPath(dict: Dict, path: string): string | undefined {
  const parts = path.split(".");
  let cur: unknown = dict;
  for (const p of parts) {
    if (cur && typeof cur === "object" && p in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[p];
    } else {
      return undefined;
    }
  }
  return typeof cur === "string" ? cur : undefined;
}

export function I18nProvider({ children, initialLocale = "de" }: { children: React.ReactNode; initialLocale?: AppLocale }) {
  const [locale, setLocaleState] = useState<AppLocale>(initialLocale);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY) as AppLocale | null;
    if (stored && APP_LOCALES.includes(stored)) setLocaleState(stored);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = locale;
    document.documentElement.dir = RTL_LOCALES.includes(locale) ? "rtl" : "ltr";
  }, [locale]);

  const setLocale = useCallback((l: AppLocale) => {
    setLocaleState(l);
    if (typeof window !== "undefined") window.localStorage.setItem(STORAGE_KEY, l);
  }, []);

  const t = useCallback(
    (key: string, fallback?: string) => {
      return getPath(dicts[locale], key) ?? getPath(dicts.de, key) ?? fallback ?? key;
    },
    [locale],
  );

  const value: I18nContextValue = {
    locale,
    setLocale,
    t,
    dir: RTL_LOCALES.includes(locale) ? "rtl" : "ltr",
  };
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useT() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    // Fallback fuer Routen ohne Provider (z.B. Admin): liefert DE-String
    return {
      locale: "de" as AppLocale,
      setLocale: () => {},
      t: (key: string, fallback?: string) => getPath(dicts.de, key) ?? fallback ?? key,
      dir: "ltr" as const,
    };
  }
  return ctx;
}

export function useOptionalT() {
  return useContext(I18nContext);
}
