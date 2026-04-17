export type ShiftType = "frueh" | "spaet" | "nacht";
export type Qualification = "pflegeassistenz" | "pflegefachkraft" | "diplom" | "pdl";

export interface StaffMember {
  id: string;
  name: string;
  qualification: Qualification;
  /** hours per week */
  sollStunden: number;
  /** 0 = Sunday, 1 = Monday, … 6 = Saturday */
  preferredFreeDays?: number[];
  /** ISO date strings where person is on vacation */
  vacationDays?: string[];
  /** preferred shift types, soft constraint */
  preferredShifts?: ShiftType[];
  /** contract-guaranteed maximum weekly hours (hard) */
  maxStundenWoche?: number;
}

export interface ShiftSlot {
  /** ISO date (yyyy-mm-dd) */
  date: string;
  type: ShiftType;
  /** required number of staff */
  required: number;
  /** minimum number of examinierte Pflegefachkraefte or higher */
  minFachkraft: number;
}

export interface Assignment {
  slotIndex: number;
  staffId: string;
}

export interface Solution {
  assignments: Assignment[];
  score: number;
  violations: Violation[];
  unfilled: number;
  hoursByStaff: Record<string, number>;
  iterations: number;
  elapsedMs: number;
}

export interface Violation {
  kind: "missing-fachkraft" | "understaffed" | "overtime" | "short-rest" | "vacation" | "double-booked" | "undesired-shift";
  slotIndex?: number;
  staffId?: string;
  severity: "hard" | "soft";
  message: string;
}

export interface SolverInput {
  staff: StaffMember[];
  slots: ShiftSlot[];
  weights?: Partial<Weights>;
  /** wall-clock budget in ms, default 3000 */
  timeBudgetMs?: number;
}

export interface Weights {
  hardViolation: number;
  overtime: number;
  undesiredShift: number;
  vacationOnDuty: number;
  sollStundenDeviation: number;
}

export const DEFAULT_WEIGHTS: Weights = {
  hardViolation: 10_000,
  overtime: 200,
  undesiredShift: 25,
  vacationOnDuty: 5_000,
  sollStundenDeviation: 10,
};

export const SHIFT_HOURS: Record<ShiftType, number> = {
  frueh: 8,
  spaet: 8,
  nacht: 10,
};

export const SHIFT_LABEL: Record<ShiftType, string> = {
  frueh: "Frueh",
  spaet: "Spaet",
  nacht: "Nacht",
};

export const QUALIFICATION_RANK: Record<Qualification, number> = {
  pflegeassistenz: 1,
  pflegefachkraft: 2,
  diplom: 3,
  pdl: 4,
};
