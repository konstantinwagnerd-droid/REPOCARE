"use client";

import { useState } from "react";
import { Phone, Flame, Map, HeartPulse, AlertTriangle, ChevronLeft } from "lucide-react";
import { Screensaver } from "@/components/kiosk/Screensaver";

const numbers = [
  { label: "Rettung", number: "144", color: "bg-red-700" },
  { label: "Feuerwehr", number: "122", color: "bg-orange-700" },
  { label: "Polizei", number: "133", color: "bg-blue-700" },
  { label: "Euro-Notruf", number: "112", color: "bg-red-600" },
  { label: "Giftnotruf", number: "+43 1 406 43 43", color: "bg-purple-700" },
  { label: "Hausaerztin Dr. Weber", number: "01 / 8899 201", color: "bg-primary-700" },
  { label: "Palliativ-Hotline", number: "0800 100 300", color: "bg-indigo-700" },
  { label: "Bereitschaftsarzt", number: "141", color: "bg-accent-700" },
];

type Guide = "cpr" | "fall" | "choke" | "stroke";

const guides: Record<Guide, { title: string; steps: string[] }> = {
  cpr: {
    title: "Reanimation (Herz-Lungen-Wiederbelebung)",
    steps: [
      "1. Bewusstsein pruefen — laut ansprechen, an Schulter ruetteln",
      "2. Hilfe rufen — 144 waehlen und laut um Hilfe schreien",
      "3. Atemwege frei machen — Kopf ueberstrecken, Kinn anheben",
      "4. Atmung pruefen — max. 10 Sekunden sehen, hoeren, fuehlen",
      "5. 30x Herzdruckmassage — Brustmitte, 5-6 cm tief, 100-120/min",
      "6. 2x Beatmung (falls moeglich) — Mund-zu-Mund, ca. 1 Sekunde",
      "7. AED holen lassen, Schema 30:2 fortsetzen bis Rettung da ist",
    ],
  },
  fall: {
    title: "Sturz",
    steps: [
      "1. Ruhe bewahren — Person nicht sofort bewegen",
      "2. Bewusstsein & Atmung pruefen",
      "3. Bei Bewusstlosigkeit: stabile Seitenlage + 144 rufen",
      "4. Sichtbare Verletzungen pruefen — Kopf, Becken, Extremitaeten",
      "5. Kein Aufrichten bei Schmerzen in Huefte, Ruecken oder Kopfverletzung",
      "6. Sturz dokumentieren — Uhrzeit, Ort, Ursache, Befund",
      "7. PDL/Arzt informieren",
    ],
  },
  choke: {
    title: "Ersticken",
    steps: [
      "1. Person zum Husten auffordern",
      "2. Falls Husten nicht moeglich: 5x kraeftig zwischen die Schulterblaetter schlagen",
      "3. Falls weiterhin blockiert: Heimlich-Manoever 5x",
      "4. Wechselnd Rueckenschlaege + Heimlich bis Fremdkoerper raus",
      "5. Bei Bewusstlosigkeit: Reanimation beginnen, 144 rufen",
      "6. Bei Schwangeren/Adipoesen: Brustkorbkompressionen statt Heimlich",
    ],
  },
  stroke: {
    title: "Schlaganfall-Symptome (FAST)",
    steps: [
      "F — Face: Laecheln? Einseitig haengender Mundwinkel?",
      "A — Arms: Beide Arme vorhalten? Einer sinkt ab?",
      "S — Speech: Klar sprechen? Verwaschen, Wortfindungsstoerungen?",
      "T — Time: Sofort 144 — jede Minute zaehlt",
      "Zusaetzlich: ploetzlicher Kopfschmerz, Sehstoerungen, Gleichgewicht",
      "Keine Nahrung/Fluessigkeit geben — Aspirationsgefahr",
      "Vitalwerte dokumentieren, Lagerung leicht erhoeht",
    ],
  },
};

export default function NotfallKioskPage() {
  const [activeGuide, setActiveGuide] = useState<Guide | null>(null);
  const [showMap, setShowMap] = useState(false);

  if (activeGuide) {
    const g = guides[activeGuide];
    return (
      <>
        <Screensaver />
        <div className="min-h-screen p-8 md:p-12">
          <button
            onClick={() => setActiveGuide(null)}
            className="mb-6 flex items-center gap-2 rounded-2xl bg-neutral-800 px-5 py-3 text-lg hover:bg-neutral-700"
          >
            <ChevronLeft className="h-6 w-6" aria-hidden /> Zurueck
          </button>
          <h1 className="mb-8 font-serif text-5xl font-semibold">{g.title}</h1>
          <ol className="space-y-4 text-3xl leading-snug">
            {g.steps.map((s, i) => (
              <li key={i} className="rounded-2xl bg-neutral-900/70 p-6">
                {s}
              </li>
            ))}
          </ol>
        </div>
      </>
    );
  }

  if (showMap) {
    return (
      <>
        <Screensaver />
        <div className="min-h-screen p-8 md:p-12">
          <button
            onClick={() => setShowMap(false)}
            className="mb-6 flex items-center gap-2 rounded-2xl bg-neutral-800 px-5 py-3 text-lg hover:bg-neutral-700"
          >
            <ChevronLeft className="h-6 w-6" aria-hidden /> Zurueck
          </button>
          <h1 className="mb-6 font-serif text-5xl font-semibold">Evakuierungsplan</h1>
          <div className="rounded-3xl bg-neutral-900/70 p-8">
            <svg viewBox="0 0 800 500" className="h-auto w-full" aria-label="Evakuierungsplan Erdgeschoss">
              <rect x="20" y="20" width="760" height="460" fill="#1c1917" stroke="#5eead4" strokeWidth="3" />
              {/* Rooms */}
              <g fill="#292524" stroke="#78716c" strokeWidth="2">
                <rect x="40" y="40" width="150" height="120" />
                <rect x="200" y="40" width="150" height="120" />
                <rect x="360" y="40" width="150" height="120" />
                <rect x="520" y="40" width="240" height="120" />
                <rect x="40" y="340" width="720" height="120" />
              </g>
              <g fill="#e7e5e4" fontSize="18" fontFamily="sans-serif">
                <text x="115" y="105" textAnchor="middle">Zi 101</text>
                <text x="275" y="105" textAnchor="middle">Zi 102</text>
                <text x="435" y="105" textAnchor="middle">Zi 103</text>
                <text x="640" y="105" textAnchor="middle">Aufenthalt</text>
                <text x="400" y="405" textAnchor="middle">Gang / Fluchtweg</text>
              </g>
              {/* Exit arrows */}
              <g stroke="#16a34a" strokeWidth="5" fill="none">
                <path d="M 400 260 L 400 340" markerEnd="url(#arrow)" />
                <path d="M 400 420 L 750 420" markerEnd="url(#arrow)" />
              </g>
              <defs>
                <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto">
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#16a34a" />
                </marker>
              </defs>
              <rect x="720" y="400" width="40" height="40" fill="#16a34a" />
              <text x="740" y="425" textAnchor="middle" fill="#fff" fontSize="16">EXIT</text>
            </svg>
            <p className="mt-6 text-xl text-neutral-300">
              Sammelpunkt: Parkplatz vor dem Haus · Letzte Person schliesst Brandabschnittstueren
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Screensaver />
      <div className="min-h-screen p-8 md:p-12">
        <header className="mb-8">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-12 w-12 text-red-400" aria-hidden />
            <h1 className="font-serif text-5xl font-semibold">Notfall</h1>
          </div>
          <p className="mt-3 text-2xl text-neutral-300">Im Ernstfall: Ruhe bewahren und anrufen</p>
        </header>

        <section className="mb-8">
          <h2 className="mb-4 font-serif text-3xl font-semibold">Notfall-Nummern</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {numbers.map((n) => (
              <a
                key={n.number}
                href={`tel:${n.number.replace(/[^+\d]/g, "")}`}
                className={`rounded-3xl p-6 text-white transition hover:scale-[1.02] ${n.color}`}
              >
                <Phone className="mb-3 h-8 w-8" aria-hidden />
                <p className="text-lg opacity-90">{n.label}</p>
                <p className="mt-1 font-mono text-3xl font-semibold">{n.number}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-4 font-serif text-3xl font-semibold">Erste-Hilfe-Anleitungen</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {(Object.entries(guides) as [Guide, typeof guides[Guide]][]).map(([k, g]) => (
              <button
                key={k}
                onClick={() => setActiveGuide(k)}
                className="flex items-center gap-4 rounded-3xl bg-neutral-900/70 p-6 text-left transition hover:bg-neutral-800"
              >
                <HeartPulse className="h-10 w-10 text-red-400" aria-hidden />
                <div>
                  <p className="text-2xl font-semibold">{g.title}</p>
                  <p className="text-neutral-400">{g.steps.length} Schritte</p>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 font-serif text-3xl font-semibold">Gebaeude</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <button
              onClick={() => setShowMap(true)}
              className="flex items-center gap-4 rounded-3xl bg-neutral-900/70 p-6 text-left transition hover:bg-neutral-800"
            >
              <Map className="h-10 w-10 text-primary-300" aria-hidden />
              <div>
                <p className="text-2xl font-semibold">Evakuierungsplan</p>
                <p className="text-neutral-400">Fluchtwege, Sammelpunkt</p>
              </div>
            </button>
            <a
              href="tel:122"
              className="flex items-center gap-4 rounded-3xl bg-orange-700 p-6 text-left transition hover:bg-orange-800"
            >
              <Flame className="h-10 w-10 text-white" aria-hidden />
              <div>
                <p className="text-2xl font-semibold text-white">Feueralarm</p>
                <p className="text-white/80">122 direkt waehlen</p>
              </div>
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
