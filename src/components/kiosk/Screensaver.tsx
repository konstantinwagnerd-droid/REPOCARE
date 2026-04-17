"use client";

import { useEffect, useState } from "react";
import { KioskClock } from "./KioskClock";

/**
 * Screensaver — eingeblendet wenn body[data-kiosk-screensaver="1"].
 * Sanfte Uhr-Animation + Einrichtungs-Logo.
 */
export function Screensaver() {
  const [active, setActive] = useState(false);
  useEffect(() => {
    const obs = new MutationObserver(() => {
      setActive(document.body.dataset.kioskScreensaver === "1");
    });
    obs.observe(document.body, { attributes: true, attributeFilter: ["data-kiosk-screensaver"] });
    return () => obs.disconnect();
  }, []);
  if (!active) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl">
      <div className="animate-[fadein_2s_ease-in-out_infinite_alternate]">
        <KioskClock big />
        <p className="mt-8 text-center text-xl tracking-wide text-neutral-500">
          Bildschirm beruehren, um fortzufahren
        </p>
      </div>
      <style jsx>{`
        @keyframes fadein {
          from { opacity: 0.5; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1.02); }
        }
      `}</style>
    </div>
  );
}
