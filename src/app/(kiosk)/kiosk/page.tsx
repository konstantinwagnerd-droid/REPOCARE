"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarDays, Users, Activity, Pill, AlertTriangle, ArrowRight } from "lucide-react";
import { PinGate } from "@/components/kiosk/PinGate";
import { KioskClock } from "@/components/kiosk/KioskClock";
import { Screensaver } from "@/components/kiosk/Screensaver";

const modes = [
  {
    href: "/kiosk/tagesuebersicht",
    title: "Tagesuebersicht",
    desc: "Termine, Speiseplan, Geburtstage — fuer Flure & Pausenraum",
    icon: CalendarDays,
    color: "from-primary-600 to-primary-800",
  },
  {
    href: "/kiosk/angehoerige",
    title: "Angehoerigen-Info",
    desc: "Termine, Kontakte, QR-Code zum Angehoerigen-Bereich",
    icon: Users,
    color: "from-accent-500 to-accent-700",
  },
  {
    href: "/kiosk/aktivitaeten",
    title: "Aktivitaeten",
    desc: "Wochenplan, Events, Fotos — fuer Gemeinschaftsraeume",
    icon: Activity,
    color: "from-emerald-600 to-emerald-800",
  },
  {
    href: "/kiosk/medikamenten-runde",
    title: "Medikamenten-Runde",
    desc: "Anstehende MAR-Eintraege — fuer Pflegekraft-Tablet",
    icon: Pill,
    color: "from-indigo-600 to-indigo-800",
  },
  {
    href: "/kiosk/notfall",
    title: "Notfall-Anleitungen",
    desc: "Nummern, Erste-Hilfe, Evakuierung — immer verfuegbar",
    icon: AlertTriangle,
    color: "from-red-600 to-red-800",
  },
];

export default function KioskLandingPage() {
  const [unlocked, setUnlocked] = useState(false);
  if (!unlocked) return <PinGate title="Kiosk-Modus" onUnlock={() => setUnlocked(true)} />;

  return (
    <>
      <Screensaver />
      <div className="mx-auto max-w-7xl p-8 md:p-12">
        <header className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="text-sm uppercase tracking-wider text-primary-300">Pflegezentrum Hietzing</p>
            <h1 className="mt-2 font-serif text-5xl font-semibold md:text-6xl">Kiosk-Modus</h1>
            <p className="mt-3 text-xl text-neutral-300">Modus waehlen zum Anzeigen</p>
          </div>
          <KioskClock />
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modes.map((m) => {
            const Icon = m.icon;
            return (
              <Link
                key={m.href}
                href={m.href}
                className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${m.color} p-8 transition hover:scale-[1.02] hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-primary-400`}
              >
                <Icon className="mb-6 h-16 w-16 text-white/90" aria-hidden />
                <h2 className="font-serif text-3xl font-semibold text-white">{m.title}</h2>
                <p className="mt-2 text-lg text-white/80">{m.desc}</p>
                <ArrowRight className="absolute bottom-6 right-6 h-8 w-8 text-white/70 transition group-hover:translate-x-1" aria-hidden />
              </Link>
            );
          })}
        </div>

        <footer className="mt-16 text-center text-sm text-neutral-500">
          CareAI Kiosk · Back/ESC = PIN fuer Verlassen · Auto-Reload alle 15 min
        </footer>
      </div>
    </>
  );
}
