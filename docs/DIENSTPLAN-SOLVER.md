# Dienstplan-Solver

Automatischer Solver fuer Wochen-/Monats-Dienstplaene in der Pflege. Kein OR-Tools, eigene Implementierung mit
Simulated Annealing, laeuft client-seitig in &le; 3 Sekunden.

## Routen

- `/admin/dienstplan-solver` — Admin-UI (PDL-Rolle)

## Architektur

```
lib/scheduling/
  types.ts        Typen: StaffMember, ShiftSlot, Assignment, Solution, Violation, Weights
  constraints.ts  evaluate() — alle Hard + Soft Constraints
  score.ts        Penalty-basiertes Scoring (niedriger = besser)
  solver.ts       Greedy-Init + Simulated Annealing (~230 Zeilen)
  validator.ts    Externe Plan-Pruefung (ok/hard/soft-violations)
  demo.ts         Demo-Daten (10 Mitarbeiter, 1 Woche)
components/scheduling/
  SolverResult.tsx   Ergebnis-Ansicht (Wochen-Tabelle, Score, Stunden, Verletzungen)
```

## Constraints

### Harte Regeln (Hard)

| Regel | Quelle |
|---|---|
| Mindestbesetzung pro Schicht | Einrichtungs-Policy |
| Min. 1 Pflegefachkraft pro Schicht | Qualitaetsstandard |
| Max. 48 h / Woche | §9 AZG (AT) / §3 ArbZG (DE) |
| Min. 11 h Ruhezeit zwischen Schichten | §12 AZG / §5 ArbZG |
| Keine Doppelbesetzung (Person 2x an 1 Tag) | Logik |
| Urlaubstag nicht verplant | HR-Daten |

### Weiche Regeln (Soft)

| Regel | Penalty-Gewicht |
|---|---|
| Unerwuenschter Schicht-Typ | 25 |
| Abweichung von Soll-Stunden | 10 pro Stunde |
| (Overtime > 48h) | 200 |

Gewichte sind in `DEFAULT_WEIGHTS` definiert und pro Solver-Aufruf ueberschreibbar.

## Algorithmus

1. **Greedy-Initialisierung** — Fuelle jeden Slot mit verfuegbaren Mitarbeitern, bevorzugt nach Qualifikations-Rang.
2. **Simulated Annealing** — 4 Move-Arten:
   - `swap` — zwei Assignments tauschen den Mitarbeiter
   - `reassign` — Assignment bekommt zufaellig anderen Mitarbeiter
   - `remove` — Assignment loeschen
   - `add` — neues Assignment einfuegen
   Akzeptanz: bessere Loesung immer, schlechtere mit `P = exp(-dE / T)`, T faellt von 1000 auf 0.1.
3. **Abbruch** bei Score=0 oder Zeitbudget (3s default).
4. **Deterministische RNG** (mulberry32, seed=42) fuer reproduzierbare Plaene.

## Scoring

```
penalty = sum(hardViolations) * 10_000
       + sum(vacations) * 5_000
       + sum(overtime) * 200
       + sum(undesiredShifts) * 25
       + unfilled * 10_000
       + sollStundenDeviation * 10
```

Score 0 = perfekter Plan. Score < 1000 = kleine Soft-Abweichungen. Score &ge; 10000 = mind. 1 Hard-Violation.

## Exporte

- **CSV** — `datum,schicht,mitarbeiter` (fuer bestehende HR-Systeme)
- **ICS** — ein Event pro Schicht & Mitarbeiter (Kalender-Import)
- **Print** — Browser-Druckdialog (A3 quer empfohlen)

## Persistenz

Mock-Demo — Ergebnis wird **nicht** in der Datenbank persistiert. In Produktion:
- Button &ldquo;In Dienstplan uebernehmen&rdquo; aktualisiert `shifts`-Tabelle via Server-Action.
- Vorschlag wird in neuer Tabelle `schedule_drafts` (TODO) gespeichert.

## Edge-Cases

| Fall | Verhalten |
|---|---|
| Weniger Mitarbeiter als Slots | Solver laesst unfilled-Slots offen, Score hoch |
| Alle Mitarbeiter im Urlaub | Keine Assignments, Score = 10000 * slotsRequired |
| Unerreichbare Mindestbesetzung PFK | Hard-Violation `missing-fachkraft`, PDL muss ggf. manuell extern eintragen |
| Seed-Bestimmtheit | Gleiche Input-Daten -> gleicher Plan (mulberry32 fix) |

## Testbarkeit

Solver ist pure function, kein DOM, kein Netzwerk — perfekt unit-testbar:

```ts
import { solve } from "@/lib/scheduling/solver";
import { demoStaff, demoSlots } from "@/lib/scheduling/demo";

const result = solve({ staff: demoStaff(), slots: demoSlots(new Date("2026-06-01")), timeBudgetMs: 1000 });
expect(result.score).toBeLessThan(5000);
```

## Roadmap

- Web-Worker-Auslagerung fuer > 3s Budgets (grosse Plaene 4+ Wochen)
- UI-Constraint-Editor (Mitarbeiter-Wuensche per Drag & Drop)
- Integration mit bestehenden Urlaubs-/Wunschsystemen (CSV-Import)
- Persistente Plan-Drafts mit Version History
- Multi-Standort-Solver (Zuordnung Mitarbeiter zu Einrichtung)
