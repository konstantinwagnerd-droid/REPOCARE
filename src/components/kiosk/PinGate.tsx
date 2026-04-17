"use client";

import { useState } from "react";
import { Lock } from "lucide-react";

/**
 * PIN-Gate — 4-stelliger PIN. Default "1234", ueberschreibbar via NEXT_PUBLIC_KIOSK_PIN.
 * In Produktion: pro Tenant in Settings konfigurierbar.
 */
export function PinGate({
  title,
  onUnlock,
  expectedPin,
}: {
  title: string;
  onUnlock: () => void;
  expectedPin?: string;
}) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const target = expectedPin ?? process.env.NEXT_PUBLIC_KIOSK_PIN ?? "1234";

  const press = (digit: string) => {
    setError(false);
    const next = (pin + digit).slice(0, 4);
    setPin(next);
    if (next.length === 4) {
      if (next === target) {
        onUnlock();
      } else {
        setError(true);
        setTimeout(() => setPin(""), 400);
      }
    }
  };

  const clear = () => {
    setPin("");
    setError(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="w-full max-w-md rounded-3xl bg-neutral-900/80 p-10 shadow-2xl backdrop-blur">
        <div className="mb-8 text-center">
          <Lock className="mx-auto mb-4 h-12 w-12 text-primary-400" aria-hidden />
          <h1 className="font-serif text-3xl font-semibold">{title}</h1>
          <p className="mt-2 text-lg text-neutral-300">Bitte PIN eingeben</p>
        </div>
        <div
          className={`mb-8 flex justify-center gap-4 ${error ? "animate-pulse" : ""}`}
          role="status"
          aria-live="polite"
        >
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-5 w-5 rounded-full border-2 ${
                pin.length > i
                  ? error
                    ? "border-red-500 bg-red-500"
                    : "border-primary-400 bg-primary-400"
                  : "border-neutral-600"
              }`}
            />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
            <button
              key={d}
              onClick={() => press(d)}
              className="h-20 rounded-2xl bg-neutral-800 text-3xl font-semibold transition hover:bg-primary-700 active:scale-95"
              aria-label={`Ziffer ${d}`}
            >
              {d}
            </button>
          ))}
          <button
            onClick={clear}
            className="h-20 rounded-2xl bg-neutral-800 text-lg transition hover:bg-neutral-700"
            aria-label="Loeschen"
          >
            Loeschen
          </button>
          <button
            onClick={() => press("0")}
            className="h-20 rounded-2xl bg-neutral-800 text-3xl font-semibold transition hover:bg-primary-700 active:scale-95"
            aria-label="Ziffer 0"
          >
            0
          </button>
          <div />
        </div>
        {error && (
          <p className="mt-4 text-center text-red-400" role="alert">
            Falscher PIN — bitte erneut versuchen
          </p>
        )}
      </div>
    </div>
  );
}
