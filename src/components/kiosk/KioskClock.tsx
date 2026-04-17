"use client";

import { useEffect, useState } from "react";

export function KioskClock({ big = false }: { big?: boolean }) {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const t = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(t);
  }, []);
  if (!now) return null;
  const time = now.toLocaleTimeString("de-AT", { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString("de-AT", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  return (
    <div className={big ? "text-center" : "text-right"}>
      <div
        className={`font-serif font-semibold tabular-nums ${big ? "text-[12rem] leading-none" : "text-5xl"}`}
        aria-label={`Uhrzeit ${time}`}
      >
        {time}
      </div>
      <div className={`mt-2 ${big ? "text-3xl" : "text-xl"} text-neutral-300`}>{date}</div>
    </div>
  );
}
