"use client";

import { CalendarDays, Phone, Mail, QrCode, Utensils } from "lucide-react";
import { KioskClock } from "@/components/kiosk/KioskClock";
import { Screensaver } from "@/components/kiosk/Screensaver";

const publicEvents = [
  { date: "15.06.2026", title: "Sommerfest", desc: "Ab 14 Uhr im Garten — Musik, Kaffee & Kuchen" },
  { date: "22.06.2026", title: "Angehoerigenabend", desc: "19 Uhr im Speisesaal — Vortrag Demenz-Begleitung" },
  { date: "29.06.2026", title: "Gottesdienst mit Seelsorge", desc: "10 Uhr in der Kapelle" },
  { date: "05.07.2026", title: "Ausflug Schoenbrunn", desc: "Anmeldung bis 30.06. am Empfang" },
];

const contacts = [
  { name: "Frau Dr. Sabine Mayer", role: "Pflegedienstleitung", phone: "01 / 8899 100", email: "mayer@pzh.at" },
  { name: "Herr Markus Huber", role: "Sozialer Dienst", phone: "01 / 8899 120", email: "huber@pzh.at" },
  { name: "Frau Anna Koller", role: "Seelsorge", phone: "01 / 8899 130", email: "koller@pzh.at" },
  { name: "Rezeption", role: "Empfang", phone: "01 / 8899 000", email: "info@pzh.at" },
];

export default function AngehoerigeKioskPage() {
  return (
    <>
      <Screensaver />
      <div className="min-h-screen p-8 md:p-12">
        <header className="mb-10 flex items-start justify-between">
          <div>
            <p className="text-lg uppercase tracking-wider text-accent-300">Fuer Besucher</p>
            <h1 className="mt-2 font-serif text-5xl font-semibold">Willkommen, liebe Angehoerige</h1>
            <p className="mt-3 text-2xl text-neutral-300">
              Schoen, dass Sie da sind. Hier finden Sie Termine, Kontakte und Informationen.
            </p>
          </div>
          <KioskClock />
        </header>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* QR Code */}
          <section className="rounded-3xl bg-gradient-to-br from-accent-700 to-accent-900 p-8">
            <h2 className="mb-4 flex items-center gap-3 font-serif text-3xl font-semibold">
              <QrCode className="h-8 w-8" aria-hidden /> Ihr Angehoerigen-Bereich
            </h2>
            <p className="mb-6 text-lg text-white/90">
              QR-Code mit dem Handy scannen, um Fotos, Berichte und Termine Ihres Angehoerigen zu sehen.
            </p>
            <div className="flex justify-center rounded-2xl bg-white p-6">
              {/* SVG-Placeholder statt externer QR-Lib auf Client */}
              <svg viewBox="0 0 200 200" className="h-48 w-48" aria-label="QR-Code zum Angehoerigenportal">
                <rect width="200" height="200" fill="#fff" />
                {Array.from({ length: 20 }).map((_, i) =>
                  Array.from({ length: 20 }).map((_, j) => {
                    const on = (i * 7 + j * 13 + (i ^ j)) % 3 === 0;
                    return on ? (
                      <rect key={`${i}-${j}`} x={i * 10} y={j * 10} width="10" height="10" fill="#0f766e" />
                    ) : null;
                  }),
                )}
                {/* Finder patterns */}
                {[[0, 0], [130, 0], [0, 130]].map(([x, y]) => (
                  <g key={`${x}-${y}`}>
                    <rect x={x} y={y} width="70" height="70" fill="#fff" stroke="#0f766e" strokeWidth="10" />
                    <rect x={x + 20} y={y + 20} width="30" height="30" fill="#0f766e" />
                  </g>
                ))}
              </svg>
            </div>
            <p className="mt-4 text-center text-sm text-white/80">oder: pzh.careai.app/family</p>
          </section>

          {/* Events */}
          <section className="rounded-3xl bg-neutral-900/70 p-8 lg:col-span-2">
            <h2 className="mb-6 flex items-center gap-3 font-serif text-3xl font-semibold">
              <CalendarDays className="h-8 w-8 text-primary-300" aria-hidden /> Gemeinschaftstermine
            </h2>
            <ul className="space-y-5">
              {publicEvents.map((e) => (
                <li key={e.date} className="flex gap-6 border-l-4 border-primary-500 pl-6">
                  <div className="w-32 shrink-0">
                    <div className="font-mono text-xl font-semibold text-primary-300">{e.date}</div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-semibold">{e.title}</h3>
                    <p className="text-lg text-neutral-300">{e.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Speiseplan */}
          <section className="rounded-3xl bg-neutral-900/70 p-8">
            <h2 className="mb-4 flex items-center gap-3 font-serif text-3xl font-semibold">
              <Utensils className="h-8 w-8 text-primary-300" aria-hidden /> Speiseplan
            </h2>
            <p className="text-lg text-neutral-300">Aktueller Wochenspeiseplan liegt am Empfang auf.</p>
            <p className="mt-4 text-xl">Heute Mittag: Wiener Schnitzel mit Kartoffelsalat</p>
          </section>

          {/* Ansprechpartner */}
          <section className="rounded-3xl bg-neutral-900/70 p-8 lg:col-span-2">
            <h2 className="mb-6 font-serif text-3xl font-semibold">Ihre Ansprechpartner</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {contacts.map((c) => (
                <div key={c.email} className="rounded-2xl bg-neutral-800/70 p-5">
                  <h3 className="text-xl font-semibold">{c.name}</h3>
                  <p className="text-sm text-neutral-400">{c.role}</p>
                  <div className="mt-3 space-y-1 text-lg">
                    <a href={`tel:${c.phone}`} className="flex items-center gap-2 text-primary-300 hover:underline">
                      <Phone className="h-5 w-5" aria-hidden /> {c.phone}
                    </a>
                    <a href={`mailto:${c.email}`} className="flex items-center gap-2 text-primary-300 hover:underline">
                      <Mail className="h-5 w-5" aria-hidden /> {c.email}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
