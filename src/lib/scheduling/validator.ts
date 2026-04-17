import { evaluate } from "./constraints";
import type { Assignment, ShiftSlot, StaffMember, Violation } from "./types";

/**
 * Arbeitszeitgesetz-Validator — separater Entry-Point fuer externe
 * Plan-Pruefung (z.B. Import aus bestehenden Systemen).
 */
export function validate(
  slots: ShiftSlot[],
  staff: StaffMember[],
  assignments: Assignment[],
): { ok: boolean; hardViolations: Violation[]; softViolations: Violation[] } {
  const { violations } = evaluate(slots, staff, assignments);
  const hard = violations.filter((v) => v.severity === "hard");
  const soft = violations.filter((v) => v.severity === "soft");
  return { ok: hard.length === 0, hardViolations: hard, softViolations: soft };
}
