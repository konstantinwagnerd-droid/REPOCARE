import { evaluate } from "./constraints";
import { score, sollStundenDeviation } from "./score";
import {
  type Assignment,
  type Solution,
  type SolverInput,
  type StaffMember,
  type ShiftSlot,
  DEFAULT_WEIGHTS,
  QUALIFICATION_RANK,
} from "./types";

/**
 * Dienstplan-Solver — Greedy-Start + Simulated Annealing.
 * Eigenstaendig (kein OR-Tools), deterministisch mit Seed, ~250 Zeilen.
 *
 * Algorithmus:
 *  1. Greedy-Initialisierung: fuelle jede Slot mit zufaelligen verfuegbaren Staff
 *     (bevorzugt Qualifikation entsprechend minFachkraft).
 *  2. Simulated Annealing: zufaellige Moves (swap, reassign, remove, add).
 *     Akzeptiere bessere Loesungen immer, schlechtere mit P=exp(-dE/T).
 *  3. Abbruch: Zeitbudget oder Score=0.
 */
export function solve(input: SolverInput): Solution {
  const started = Date.now();
  const budget = input.timeBudgetMs ?? 3000;
  const weights = { ...DEFAULT_WEIGHTS, ...(input.weights ?? {}) };
  const rnd = mulberry32(42);
  const weeks = Math.max(1, Math.ceil(input.slots.length / 21));

  let current = greedyInit(input.slots, input.staff, rnd);
  let currentEval = evaluate(input.slots, input.staff, current);
  let currentSoll = sollStundenDeviation(currentEval.hoursByStaff, input.staff, weeks);
  let currentScore = score(currentEval.violations, currentEval.unfilled, currentSoll, weights);

  let best = current.slice();
  let bestScore = currentScore;
  let bestEval = currentEval;
  let _bestSoll = currentSoll;

  const T0 = 1000;
  const Tmin = 0.1;
  let T = T0;
  let iter = 0;

  while (Date.now() - started < budget && bestScore > 0) {
    iter++;
    const neighbor = mutate(current, input.slots, input.staff, rnd);
    const neEval = evaluate(input.slots, input.staff, neighbor);
    const neSoll = sollStundenDeviation(neEval.hoursByStaff, input.staff, weeks);
    const neScore = score(neEval.violations, neEval.unfilled, neSoll, weights);
    const dE = neScore - currentScore;
    if (dE < 0 || rnd() < Math.exp(-dE / T)) {
      current = neighbor;
      currentEval = neEval;
      currentSoll = neSoll;
      currentScore = neScore;
      if (neScore < bestScore) {
        best = neighbor.slice();
        bestScore = neScore;
        bestEval = neEval;
        _bestSoll = neSoll;
      }
    }
    T = Math.max(Tmin, T0 * Math.pow(0.995, iter));
  }

  return {
    assignments: best,
    score: bestScore,
    violations: bestEval.violations,
    unfilled: bestEval.unfilled,
    hoursByStaff: bestEval.hoursByStaff,
    iterations: iter,
    elapsedMs: Date.now() - started,
  };
}

/**
 * Greedy initialisation: loop slots, prefer higher-qualified first for minFachkraft requirement.
 */
function greedyInit(slots: ShiftSlot[], staff: StaffMember[], rnd: () => number): Assignment[] {
  const result: Assignment[] = [];
  const staffHours: Record<string, number> = {};
  const onDuty = new Set<string>(); // staffId + date

  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    const available = staff.filter((s) => {
      if (s.vacationDays?.includes(slot.date)) return false;
      if (onDuty.has(`${s.id}|${slot.date}`)) return false;
      if ((staffHours[s.id] ?? 0) >= (s.maxStundenWoche ?? 48) * 4) return false;
      return true;
    });
    const sorted = [...available].sort((a, b) => {
      const qa = QUALIFICATION_RANK[a.qualification];
      const qb = QUALIFICATION_RANK[b.qualification];
      if (qa !== qb) return qb - qa;
      return rnd() - 0.5;
    });
    for (let n = 0; n < slot.required && n < sorted.length; n++) {
      const s = sorted[n];
      result.push({ slotIndex: i, staffId: s.id });
      onDuty.add(`${s.id}|${slot.date}`);
      staffHours[s.id] = (staffHours[s.id] ?? 0) + 8;
    }
  }
  return result;
}

/**
 * Random mutation — 1 of 4 move kinds.
 */
function mutate(
  current: Assignment[],
  slots: ShiftSlot[],
  staff: StaffMember[],
  rnd: () => number,
): Assignment[] {
  const out = current.slice();
  const kind = Math.floor(rnd() * 4);
  switch (kind) {
    case 0: // swap two assignments
      if (out.length < 2) return out;
      {
        const i = Math.floor(rnd() * out.length);
        const j = Math.floor(rnd() * out.length);
        const tmp = out[i].staffId;
        out[i] = { ...out[i], staffId: out[j].staffId };
        out[j] = { ...out[j], staffId: tmp };
      }
      return out;
    case 1: // reassign random slot to random staff
      if (out.length === 0) return out;
      {
        const i = Math.floor(rnd() * out.length);
        const s = staff[Math.floor(rnd() * staff.length)];
        out[i] = { ...out[i], staffId: s.id };
      }
      return out;
    case 2: // remove random assignment
      if (out.length === 0) return out;
      {
        const i = Math.floor(rnd() * out.length);
        out.splice(i, 1);
      }
      return out;
    case 3: // add assignment to random slot
      {
        const slotIdx = Math.floor(rnd() * slots.length);
        const s = staff[Math.floor(rnd() * staff.length)];
        out.push({ slotIndex: slotIdx, staffId: s.id });
      }
      return out;
  }
  return out;
}

/** Deterministic RNG for reproducible plans. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
