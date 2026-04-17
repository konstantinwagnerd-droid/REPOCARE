"use client";

import { Activity as ActivityIcon, Music, Brain, HeartHandshake, Dumbbell, Palette, BookOpen, Users, type LucideIcon } from "lucide-react";
import { KioskClock } from "@/components/kiosk/KioskClock";
import { Screensaver } from "@/components/kiosk/Screensaver";

const DAYS = ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"] as const;

type WeekActivity = { day: (typeof DAYS)[number]; time: string; title: string; icon: LucideIcon; color: string };

const week: WeekActivity[] = [
  { day: "Mo", time: "09:00", title: "Gymnastik", icon: Dumbbell, color: "bg-primary-700" },
  { day: "Mo", time: "14:00", title: "Singkreis", icon: Music, color: "bg-accent-700" },
  { day: "Di", time: "10:00", title: "Gedaechtnistraining", icon: Brain, color: "bg-indigo-700" },
  { day: "Di", time: "15:00", title: "Malen & Basteln", icon: Palette, color: "bg-pink-700" },
  { day: "Mi", time: "09:30", title: "Spaziergang Park", icon: ActivityIcon, color: "bg-emerald-700" },
  { day: "Mi", time: "14:30", title: "Literaturkreis", icon: BookOpen, color: "bg-amber-700" },
  { day: "Do", time: "10:00", title: "Seelsorge", icon: HeartHandshake, color: "bg-purple-700" },
  { day: "Do", time: "14:00", title: "Kartenspiele", icon: Users, color: "bg-cyan-700" },
  { day: "Fr", time: "09:00", title: "Gymnastik", icon: Dumbbell, color: "bg-primary-700" },
  { day: "Fr", time: "15:00", title: "Kaffee-Runde", icon: Users, color: "bg-accent-700" },
  { day: "Sa", time: "10:00", title: "Familien-Cafe", icon: Users, color: "bg-cyan-700" },
  { day: "So", time: "10:00", title: "Gottesdienst", icon: HeartHandshake, color: "bg-purple-700" },
];

export default function AktivitaetenKioskPage() {
  return (
    <>
      <Screensaver />
      <div className="min-h-screen p-8 md:p-12">
        <header className="mb-10 flex items-start justify-between">
          <div>
            <p className="text-lg uppercase tracking-wider text-primary-300">Unser Angebot</p>
            <h1 className="mt-2 font-serif text-5xl font-semibold">Aktivitaeten diese Woche</h1>
          </div>
          <KioskClock />
        </header>

        <div className="grid grid-cols-7 gap-4">
          {DAYS.map((d) => (
            <div key={d} className="text-center">
              <h2 className="mb-4 font-serif text-2xl font-semibold text-primary-300">{d}</h2>
              <div className="space-y-3">
                {week
                  .filter((a) => a.day === d)
                  .map((a) => {
                    const Icon = a.icon;
                    return (
                      <div key={`${a.day}-${a.time}`} className={`rounded-2xl p-4 text-left ${a.color}`}>
                        <Icon className="mb-2 h-6 w-6 text-white" aria-hidden />
                        <p className="font-mono text-sm font-semibold text-white/90">{a.time}</p>
                        <p className="mt-1 text-lg font-semibold leading-tight text-white">{a.title}</p>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>

        <section className="mt-12 rounded-3xl bg-neutral-900/70 p-8">
          <h2 className="mb-4 font-serif text-3xl font-semibold">Rueckblick: letzte Events</h2>
          <p className="text-lg text-neutral-300">
            Fotos vom letzten Muttertag-Fruehstueck und Maifest finden Sie im Empfangsbereich. Bitte beachten Sie, dass
            nur Fotos von Bewohner:innen mit Fotofreigabe gezeigt werden.
          </p>
          <div className="mt-6 grid grid-cols-4 gap-4">
            {["Muttertag", "Maifest", "Fruehlingskonzert", "Osterbrunch"].map((e) => (
              <div
                key={e}
                className="aspect-video rounded-2xl bg-gradient-to-br from-primary-800 to-accent-800 p-4 text-sm font-semibold"
              >
                {e}
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
