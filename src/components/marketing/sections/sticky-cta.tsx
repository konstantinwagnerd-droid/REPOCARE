"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, X } from "lucide-react";

/**
 * Sticky Demo-CTA FAB — erscheint nach 40% Scroll.
 */
export function StickyCta() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setVisible(window.scrollY / h > 0.25);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
          className="fixed bottom-6 right-6 z-40 print:hidden"
          role="complementary"
          aria-label="Demo anfragen"
        >
          <div className="flex items-center gap-2 rounded-2xl border border-border/60 bg-background/95 p-2 shadow-[0_16px_32px_rgba(15,118,110,0.12)] backdrop-blur">
            <Link
              href="/demo-anfrage"
              className="flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground hover:bg-accent/90"
            >
              <Calendar className="h-4 w-4" /> 30-Min-Demo
            </Link>
            <button
              onClick={() => setDismissed(true)}
              aria-label="CTA schliessen"
              className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-secondary"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
