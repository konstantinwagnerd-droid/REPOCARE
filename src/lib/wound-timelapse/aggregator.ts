// Aggregiert Wund-Snapshots chronologisch und stellt Mock-Daten bereit.
// In Produktion werden Snapshots aus der DB geladen — hier deterministisch.

import type { WoundCase, WoundSnapshot } from "./types";

function isoOffset(daysAgo: number): string {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

// Visuelle SVG-Platzhalter (generiert dataURL fuer "Foto")
function makePhotoPlaceholder(grade: number, area: number, idx: number): string {
  const hue = grade === 1 ? 140 : grade === 2 ? 50 : grade === 3 ? 25 : 0;
  const radius = Math.max(20, Math.min(90, Math.sqrt(area) * 4));
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 240 240'>
    <defs>
      <radialGradient id='g${idx}' cx='50%' cy='50%' r='60%'>
        <stop offset='0%' stop-color='hsl(${hue} 70% 35%)' stop-opacity='0.95'/>
        <stop offset='70%' stop-color='hsl(${hue} 60% 50%)' stop-opacity='0.55'/>
        <stop offset='100%' stop-color='hsl(${hue} 50% 70%)' stop-opacity='0.05'/>
      </radialGradient>
    </defs>
    <rect width='240' height='240' fill='hsl(30 30% 88%)'/>
    <ellipse cx='120' cy='120' rx='${radius}' ry='${radius * 0.85}' fill='url(#g${idx})'/>
    <text x='10' y='228' font-family='monospace' font-size='10' fill='hsl(0 0% 30%)'>Snapshot #${idx + 1} · Grad ${grade}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const AUTHORS = ["S. Huber, DGKP", "M. Mayer, PFA", "Dr. C. Reiter (Wundmanagement)", "T. Bauer, DGKP"];

const NOTIZEN_HEILEND = [
  "Granulation deutlich, Wundrand sauber.",
  "Epithelisierung beginnt am Rand.",
  "Wunde ruhig, kein Geruch, kein Belag.",
  "Verband 48h — gut tolerierbar.",
  "Volumen weiter rueckgaengig, Hautschutz aufgetragen.",
];

export function buildMockCase(opts: {
  id: string; bewohnerId: string; bewohnerName: string; lokalisation: string;
  startGrade?: 1 | 2 | 3 | 4; tageVerlauf?: number; intervall?: number;
}): WoundCase {
  const tage = opts.tageVerlauf ?? 70;
  const interval = opts.intervall ?? 7;
  const snapshots: WoundSnapshot[] = [];
  let grade = opts.startGrade ?? 3;
  let laenge = 42, breite = 28, tiefe = 8;
  let i = 0;
  for (let d = tage; d >= 0; d -= interval) {
    laenge = Math.max(3, laenge - 2);
    breite = Math.max(2, breite - 1);
    tiefe = Math.max(0, tiefe - (i % 2 ? 1 : 0));
    if (i > 4 && grade > 1) grade = (grade - 1) as 1 | 2 | 3 | 4;
    const flaeche = laenge * breite;
    snapshots.push({
      id: `${opts.id}-s${i}`,
      date: isoOffset(d),
      grade,
      laengeMm: laenge, breiteMm: breite, tiefeMm: tiefe,
      flaecheMm2: flaeche,
      exudate: i < 2 ? "stark" : i < 4 ? "mittel" : "gering",
      notes: NOTIZEN_HEILEND[i % NOTIZEN_HEILEND.length],
      photoUrl: makePhotoPlaceholder(grade, flaeche, i),
      author: AUTHORS[i % AUTHORS.length],
    });
    i++;
  }
  return {
    id: opts.id,
    bewohnerId: opts.bewohnerId,
    bewohnerName: opts.bewohnerName,
    lokalisation: opts.lokalisation,
    ersterkennung: snapshots[0].date,
    snapshots,
  };
}

export function chronological(snaps: WoundSnapshot[]): WoundSnapshot[] {
  return [...snaps].sort((a, b) => a.date.localeCompare(b.date));
}
