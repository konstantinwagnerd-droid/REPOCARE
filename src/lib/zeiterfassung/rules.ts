// Arbeitszeitregeln (vereinfacht nach AZG Österreich / ArbZG Deutschland)
export const RULES = {
  maxDailyMinutes: 10 * 60, // 10h Max-Arbeitszeit
  pauseRequiredAfterMinutes: 6 * 60, // 6h -> mind. 30 Min Pause
  minPauseMinutes: 30,
  maxWeeklyMinutes: 48 * 60,
  defaultSollMinutesPerDay: 8 * 60,
  defaultVacationDaysPerYear: 25,
};

export function validateDay(workedMinutes: number, pauseMinutes: number): string[] {
  const violations: string[] = [];
  if (workedMinutes > RULES.maxDailyMinutes) {
    violations.push(`Überschreitung Tagesarbeitszeit (${Math.round(workedMinutes / 60)}h > 10h)`);
  }
  if (workedMinutes >= RULES.pauseRequiredAfterMinutes && pauseMinutes < RULES.minPauseMinutes) {
    violations.push(`Pausenpflicht verletzt (<30 Min Pause bei ≥6h Arbeit)`);
  }
  return violations;
}
