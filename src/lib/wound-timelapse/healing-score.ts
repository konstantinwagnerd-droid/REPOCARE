// Heuristische Heilungs-Bewertung (0..100).
// Berücksichtigt Flächen-Reduktion, Grad-Verbesserung und Geschwindigkeit.

import type { HealingProgress, WoundCase } from "./types";

export function computeHealing(c: WoundCase): HealingProgress {
  const sorted = [...c.snapshots].sort((a, b) => a.date.localeCompare(b.date));
  const start = sorted[0];
  const current = sorted[sorted.length - 1];
  const startFlaeche = start.flaecheMm2 || 1;
  const reduktion = (start.flaecheMm2 - current.flaecheMm2) / startFlaeche;
  const reduktionPct = Math.round(reduktion * 1000) / 10;
  const dauer = Math.max(1, Math.round((new Date(current.date).getTime() - new Date(start.date).getTime()) / 86_400_000));

  // Score: Flaechenreduktion 60%, Grad 30%, Tempo 10%
  const flaecheScore = Math.max(0, Math.min(60, reduktion * 60));
  const gradScore = Math.max(0, (start.grade - current.grade) * 10);
  const tempoScore = reduktion > 0 ? Math.max(0, Math.min(10, (reduktion / dauer) * 200)) : 0;
  const score = Math.round(Math.max(0, Math.min(100, flaecheScore + gradScore + tempoScore)));

  let prognose = "Stabiler Verlauf, Therapie fortsetzen.";
  if (score >= 75) prognose = "Sehr gute Heilungstendenz — voraussichtlich Abschluss in 2-4 Wochen.";
  else if (score >= 50) prognose = "Heilungsverlauf positiv, weiterhin engmaschig dokumentieren.";
  else if (score < 20 && reduktion < 0) prognose = "Verschlechterung erkannt — Therapieumstellung prüfen, ggf. Wundmanagement-Konsil.";
  else if (score < 30) prognose = "Heilung verzoegert — Druckentlastung und Ernaehrung evaluieren.";

  return {
    woundId: c.id,
    startGrade: start.grade, currentGrade: current.grade,
    startFlaeche: start.flaecheMm2, currentFlaeche: current.flaecheMm2,
    flaechenReduktionPct: reduktionPct,
    durationDays: dauer,
    score,
    prognose,
  };
}
