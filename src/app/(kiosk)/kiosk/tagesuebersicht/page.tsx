"use client";

import { useEffect, useState } from "react";
import { Cake, Sun, Cloud, Utensils, MapPin, Megaphone } from "lucide-react";
import { KioskClock } from "@/components/kiosk/KioskClock";
import { Screensaver } from "@/components/kiosk/Screensaver";

type Panel = "activities" | "menu" | "birthdays" | "news";
const ORDER: Panel[] = ["activities", "menu", "birthdays", "news"];

const mockActivities = [
  { time: "09:00", title: "Gymnastik mit Frau Berger", room: "Gruppenraum 1" },
  { time: "10:30", title: "Gedaechtnistraining", room: "Aufenthaltsraum" },
  { time: "14:00", title: "Singkreis mit Herrn Huber", room: "Gruppenraum 2" },
  { time: "15:30", title: "Kaffee & Kuchen", room: "Speisesaal" },
  { time: "16:30", title: "Seelsorge — Pfarrer Mayer", room: "Kapelle" },
];

const mockMenu = {
  soup: "Rindsuppe mit Fritatten",
  main: "Wiener Schnitzel mit Kartoffel-Gurken-Salat",
  vegetarian: "Kaesespaetzle mit Roestzwiebeln",
  dessert: "Apfelstrudel mit Vanillesauce",
};

const mockBirthdays = [
  { name: "Frau Maria Huber", age: 84, when: "heute" },
  { name: "Herr Josef Gruber", age: 79, when: "morgen" },
  { name: "Frau Anna Steiner", age: 91, when: "in 2 Tagen" },
  { name: "Herr Karl Wagner", age: 76, when: "in 3 Tagen" },
];

const mockNews = [
  "Sommerfest am 15. Juni ab 14 Uhr — alle Angehoerigen herzlich willkommen",
  "Neue Besuchszeiten ab 1. Mai: 10-12 Uhr und 14-19 Uhr",
  "Gottesdienst jeden Sonntag um 10 Uhr in der Kapelle",
];

export default function TagesUebersichtPage() {
  const [panel, setPanel] = useState<Panel>("activities");
  const [newsIdx, setNewsIdx] = useState(0);

  useEffect(() => {
    const t = window.setInterval(() => {
      setPanel((p) => ORDER[(ORDER.indexOf(p) + 1) % ORDER.length]);
    }, 30_000);
    return () => window.clearInterval(t);
  }, []);

  useEffect(() => {
    const t = window.setInterval(() => setNewsIdx((i) => (i + 1) % mockNews.length), 8000);
    return () => window.clearInterval(t);
  }, []);

  return (
    <>
      <Screensaver />
      <div className="min-h-screen p-8 md:p-12">
        {/* Header */}
        <header className="mb-8 flex items-start justify-between">
          <div>
            <p className="text-lg uppercase tracking-wider text-primary-300">Heute</p>
            <h1 className="mt-2 font-serif text-6xl font-semibold">Tagesuebersicht</h1>
            <div className="mt-4 flex items-center gap-3 text-2xl text-neutral-300">
              <Sun className="h-8 w-8 text-accent-400" aria-hidden />
              <span>18 Grad, sonnig</span>
              <Cloud className="ml-4 h-8 w-8 text-neutral-400" aria-hidden />
              <span>leichter Wind</span>
            </div>
          </div>
          <KioskClock />
        </header>

        {/* News ticker */}
        <div className="mb-8 flex items-center gap-4 rounded-2xl bg-accent-900/50 p-4 text-2xl">
          <Megaphone className="h-8 w-8 shrink-0 text-accent-300" aria-hidden />
          <p className="transition-opacity duration-500" key={newsIdx}>
            {mockNews[newsIdx]}
          </p>
        </div>

        {/* Rotating panel */}
        <section className="rounded-3xl bg-neutral-900/70 p-10" aria-live="polite">
          {panel === "activities" && (
            <>
              <h2 className="mb-6 font-serif text-4xl font-semibold">Heute im Haus</h2>
              <ul className="space-y-4">
                {mockActivities.map((a) => (
                  <li key={a.time} className="flex items-center gap-6 text-3xl">
                    <span className="w-28 font-mono font-semibold text-primary-300">{a.time}</span>
                    <span className="flex-1">{a.title}</span>
                    <span className="flex items-center gap-2 text-xl text-neutral-400">
                      <MapPin className="h-6 w-6" aria-hidden /> {a.room}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
          {panel === "menu" && (
            <>
              <h2 className="mb-6 flex items-center gap-3 font-serif text-4xl font-semibold">
                <Utensils className="h-10 w-10 text-primary-300" aria-hidden /> Speiseplan heute
              </h2>
              <dl className="space-y-6 text-3xl">
                <div>
                  <dt className="text-xl uppercase tracking-wider text-neutral-400">Suppe</dt>
                  <dd className="mt-1">{mockMenu.soup}</dd>
                </div>
                <div>
                  <dt className="text-xl uppercase tracking-wider text-neutral-400">Hauptgericht</dt>
                  <dd className="mt-1">{mockMenu.main}</dd>
                </div>
                <div>
                  <dt className="text-xl uppercase tracking-wider text-neutral-400">Vegetarisch</dt>
                  <dd className="mt-1">{mockMenu.vegetarian}</dd>
                </div>
                <div>
                  <dt className="text-xl uppercase tracking-wider text-neutral-400">Dessert</dt>
                  <dd className="mt-1">{mockMenu.dessert}</dd>
                </div>
              </dl>
            </>
          )}
          {panel === "birthdays" && (
            <>
              <h2 className="mb-6 flex items-center gap-3 font-serif text-4xl font-semibold">
                <Cake className="h-10 w-10 text-accent-400" aria-hidden /> Geburtstage
              </h2>
              <ul className="space-y-4 text-3xl">
                {mockBirthdays.map((b) => (
                  <li key={b.name} className="flex items-baseline justify-between">
                    <span>{b.name}</span>
                    <span className="text-xl text-neutral-400">
                      {b.age} Jahre · {b.when}
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
          {panel === "news" && (
            <>
              <h2 className="mb-6 font-serif text-4xl font-semibold">Aus unserem Haus</h2>
              <ul className="space-y-6 text-3xl leading-snug">
                {mockNews.map((n, i) => (
                  <li key={i} className="border-l-4 border-primary-500 pl-6">
                    {n}
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        {/* Panel indicators */}
        <div className="mt-8 flex justify-center gap-3" aria-label="Panel-Fortschritt">
          {ORDER.map((p) => (
            <div
              key={p}
              className={`h-2 w-16 rounded-full transition ${
                p === panel ? "bg-primary-400" : "bg-neutral-700"
              }`}
            />
          ))}
        </div>
      </div>
    </>
  );
}
