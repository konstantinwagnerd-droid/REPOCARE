"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles, Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LanguageSwitcher } from "@/components/marketing/language-switcher";

const navLinks = [
  { href: "/#features", label: "Funktionen" },
  { href: "/#preise", label: "Preise" },
  { href: "/roi-rechner", label: "ROI" },
  { href: "/case-studies", label: "Fallstudien" },
  { href: "/trust", label: "Trust" },
  { href: "/help", label: "Hilfe" },
];

export function MarketingNav() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-serif text-xl font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </span>
          CareAI
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <button
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            aria-label="Design wechseln"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border hover:bg-secondary transition-colors"
          >
            {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link href="/login">Anmelden</Link>
          </Button>
          <Button asChild variant="accent" size="sm">
            <Link href="/signup">Demo anfragen</Link>
          </Button>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-border hover:bg-secondary transition-colors md:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border/60 md:hidden"
          >
            <nav className="container flex flex-col gap-1 py-4">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                  {l.label}
                </Link>
              ))}
              <Link href="/login" className="rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors">
                Anmelden
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

