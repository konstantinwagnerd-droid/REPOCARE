"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe2 } from "lucide-react";

const DE_TO_EN: Record<string, string> = {
  "/": "/en",
  "/trust": "/en/trust",
  "/integrations": "/en/integrations",
  "/roi-rechner": "/en/roi-calculator",
  "/case-studies": "/en/case-studies",
  "/blog": "/en/blog",
  "/ueber-uns": "/en/about",
  "/karriere": "/en/careers",
  "/kontakt": "/en/contact",
};

const EN_TO_DE: Record<string, string> = Object.fromEntries(
  Object.entries(DE_TO_EN).map(([de, en]) => [en, de])
);

export function LanguageSwitcher() {
  const pathname = usePathname() ?? "/";
  const isEn = pathname === "/en" || pathname.startsWith("/en/");
  let target: string;
  if (isEn) target = EN_TO_DE[pathname] ?? "/";
  else target = DE_TO_EN[pathname] ?? "/en";
  const label = isEn ? "DE" : "EN";
  const title = isEn ? "Deutsch" : "English";
  return (
    <Link
      href={target}
      aria-label={`Switch language to ${title}`}
      title={title}
      className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border px-2.5 text-xs font-medium hover:bg-secondary transition-colors"
    >
      <Globe2 className="h-3.5 w-3.5" />
      {label}
    </Link>
  );
}
