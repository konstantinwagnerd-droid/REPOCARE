"use client";

import { useEffect, useState } from "react";
import { Pill, Check, Clock, DoorOpen } from "lucide-react";
import { PinGate } from "@/components/kiosk/PinGate";
import { KioskClock } from "@/components/kiosk/KioskClock";
import { Screensaver } from "@/components/kiosk/Screensaver";

type MarEntry = {
  id: string;
  room: string;
  resident: string;
  med: string;
  dose: string;
  dueAt: string; // ISO
};

const mockEntries: MarEntry[] = [
  { id: "1", room: "Zi 101", resident: "Frau M. Huber", med: "Ramipril", dose: "5 mg", dueAt: addMin(0) },
  { id: "2", room: "Zi 101", resident: "Frau M. Huber", med: "ASS", dose: "100 mg", dueAt: addMin(0) },
  { id: "3", room: "Zi 103", resident: "Herr J. Gruber", med: "Metformin", dose: "850 mg", dueAt: addMin(15) },
  { id: "4", room: "Zi 105", resident: "Frau A. Steiner", med: "Levothyroxin", dose: "50 mcg", dueAt: addMin(30) },
  { id: "5", room: "Zi 107", resident: "Herr K. Wagner", med: "Bisoprolol", dose: "2,5 mg", dueAt: addMin(45) },
  { id: "6", room: "Zi 107", resident: "Herr K. Wagner", med: "Simvastatin", dose: "20 mg", dueAt: addMin(60) },
];

function addMin(m: number) {
  const d = new Date();
  d.setMinutes(d.getMinutes() + m);
  return d.toISOString();
}

function timeUntil(iso: string) {
  const diff = new Date(iso).getTime() - Date.now();
  const m = Math.round(diff / 60_000);
  if (m <= 0) return "Jetzt faellig";
  if (m < 60) return `in ${m} min`;
  return `in ${Math.floor(m / 60)} h ${m % 60} min`;
}

export default function MedikamentenRundeKioskPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [done, setDone] = useState<Set<string>>(new Set());
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = window.setInterval(() => setTick((n) => n + 1), 30_000);
    return () => window.clearInterval(t);
  }, []);

  if (!unlocked) return <PinGate title="Medikamenten-Runde" onUnlock={() => setUnlocked(true)} />;

  const toggle = (id: string) => {
    const pin = window.prompt("PIN zur Bestaetigung:");
    if (pin !== (process.env.NEXT_PUBLIC_KIOSK_PIN ?? "1234")) return;
    setDone((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const byRoom = mockEntries.reduce<Record<string, MarEntry[]>>((acc, e) => {
    (acc[e.room] ||= []).push(e);
    return acc;
  }, {});

  const next = [...mockEntries]
    .filter((e) => !done.has(e.id))
    .sort((a, b) => new Date(a.dueAt).getTime() - new Date(b.dueAt).getTime())[0];

  return (
    <>
      <Screensaver />
      <div className="min-h-screen p-8 md:p-12" data-tick={tick}>
        <header className="mb-8 flex items-start justify-between">
          <div>
            <p className="text-lg uppercase tracking-wider text-indigo-300">Schicht-Uebersicht</p>
            <h1 className="mt-2 font-serif text-5xl font-semibold">Medikamenten-Runde</h1>
            <p className="mt-2 text-xl text-neutral-300">Read-only. Abhaken erfordert PIN.</p>
          </div>
          <KioskClock />
        </header>

        {next && (
          <section className="mb-8 rounded-3xl bg-gradient-to-br from-indigo-700 to-indigo-900 p-8">
            <p className="text-sm uppercase tracking-wider text-white/80">Naechste Gabe</p>
            <div className="mt-2 flex items-baseline gap-6">
              <span className="font-serif text-5xl font-semibold">{next.resident}</span>
              <span className="text-2xl text-white/80">{next.room}</span>
            </div>
            <p className="mt-2 text-3xl">
              {next.med} · {next.dose}
            </p>
            <p className="mt-4 flex items-center gap-3 text-2xl text-white/90">
              <Clock className="h-7 w-7" aria-hidden /> {timeUntil(next.dueAt)}
            </p>
          </section>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(byRoom).map(([room, entries]) => (
            <section key={room} className="rounded-3xl bg-neutral-900/70 p-6">
              <h2 className="mb-4 flex items-center gap-2 font-serif text-2xl font-semibold">
                <DoorOpen className="h-6 w-6 text-primary-300" aria-hidden /> {room}
              </h2>
              <ul className="space-y-3">
                {entries.map((e) => {
                  const checked = done.has(e.id);
                  return (
                    <li
                      key={e.id}
                      className={`flex items-center gap-3 rounded-2xl p-4 transition ${
                        checked ? "bg-emerald-900/50 opacity-60 line-through" : "bg-neutral-800/80"
                      }`}
                    >
                      <button
                        onClick={() => toggle(e.id)}
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 ${
                          checked ? "border-emerald-500 bg-emerald-500" : "border-neutral-500"
                        }`}
                        aria-label={`${e.med} fuer ${e.resident} ${checked ? "zurueckgenommen" : "abhaken"}`}
                      >
                        {checked && <Check className="h-6 w-6" aria-hidden />}
                      </button>
                      <Pill className="h-5 w-5 text-indigo-300" aria-hidden />
                      <div className="flex-1">
                        <p className="font-semibold">{e.resident}</p>
                        <p className="text-sm text-neutral-400">
                          {e.med} · {e.dose}
                        </p>
                      </div>
                      <div className="text-sm text-neutral-400">{timeUntil(e.dueAt)}</div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>

        <p className="mt-10 text-center text-neutral-500">
          {done.size} von {mockEntries.length} Gaben dokumentiert · Synchronisation mit MAR erfolgt nach Schichtende
        </p>
      </div>
    </>
  );
}
