"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [p, setP] = useState(0);

  useEffect(() => {
    function onScroll() {
      const doc = document.documentElement;
      const scroll = doc.scrollTop || document.body.scrollTop;
      const height = (doc.scrollHeight || document.body.scrollHeight) - doc.clientHeight;
      setP(height > 0 ? (scroll / height) * 100 : 0);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(p)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label="Lesefortschritt"
      className="fixed inset-x-0 top-0 z-50 h-1 bg-transparent"
    >
      <div
        className="h-full bg-primary transition-[width] duration-100"
        style={{ width: `${p}%` }}
      />
    </div>
  );
}
