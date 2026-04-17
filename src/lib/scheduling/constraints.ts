import {
  type Assignment,
  type ShiftSlot,
  type StaffMember,
  type Violation,
  QUALIFICATION_RANK,
  SHIFT_HOURS,
} from "./types";

/**
 * Evaluate all hard + soft constraints. Returns list of violations.
 *
 * HARD:
 *  - Max 48 h / Woche (Arbeitszeitgesetz AT/DE)
 *  - Min 11 h Ruhezeit zwischen zwei Schichten
 *  - Keine Doppelbesetzung (selbe Person auf 2 Shifts am selben Tag)
 *  - Urlaubstag nicht verplant
 *  - Min. Qualifikation pro Schicht (PFK)
 *
 * SOFT:
 *  - Unerwuenschte Schicht-Typen
 *  - Abweichung Sollstunden
 */
export function evaluate(
  slots: ShiftSlot[],
  staff: StaffMember[],
  assignments: Assignment[],
): { violations: Violation[]; unfilled: number; hoursByStaff: Record<string, number> } {
  const violations: Violation[] = [];
  const byStaff = new Map<string, Assignment[]>();
  const bySlot = new Map<number, Assignment[]>();
  const hoursByStaff: Record<string, number> = {};
  const staffMap = new Map(staff.map((s) => [s.id, s]));

  for (const a of assignments) {
    if (!byStaff.has(a.staffId)) byStaff.set(a.staffId, []);
    byStaff.get(a.staffId)!.push(a);
    if (!bySlot.has(a.slotIndex)) bySlot.set(a.slotIndex, []);
    bySlot.get(a.slotIndex)!.push(a);
    const slot = slots[a.slotIndex];
    if (slot) hoursByStaff[a.staffId] = (hoursByStaff[a.staffId] ?? 0) + SHIFT_HOURS[slot.type];
  }

  // Per-slot checks
  let unfilled = 0;
  for (let i = 0; i < slots.length; i++) {
    const slot = slots[i];
    const assigned = bySlot.get(i) ?? [];
    if (assigned.length < slot.required) {
      unfilled += slot.required - assigned.length;
      violations.push({
        kind: "understaffed",
        slotIndex: i,
        severity: "hard",
        message: `Slot ${slot.date}/${slot.type}: ${assigned.length}/${slot.required} besetzt`,
      });
    }
    const fachkraefte = assigned.filter((a) => {
      const s = staffMap.get(a.staffId);
      return s && QUALIFICATION_RANK[s.qualification] >= QUALIFICATION_RANK.pflegefachkraft;
    }).length;
    if (fachkraefte < slot.minFachkraft) {
      violations.push({
        kind: "missing-fachkraft",
        slotIndex: i,
        severity: "hard",
        message: `Slot ${slot.date}/${slot.type}: ${fachkraefte}/${slot.minFachkraft} Fachkraefte`,
      });
    }
    // Double-booked check (same staff appears 2x in slot)
    const staffIds = new Set<string>();
    for (const a of assigned) {
      if (staffIds.has(a.staffId)) {
        violations.push({
          kind: "double-booked",
          slotIndex: i,
          staffId: a.staffId,
          severity: "hard",
          message: `Doppelbesetzung in Slot ${slot.date}/${slot.type}`,
        });
      }
      staffIds.add(a.staffId);
    }
  }

  // Per-staff checks
  byStaff.forEach((list, staffId) => {
    const s = staffMap.get(staffId);
    if (!s) return;

    // Group by week
    const weekHours = new Map<string, number>();
    const sortedList = [...list].sort(
      (a, b) => shiftStart(slots[a.slotIndex]).getTime() - shiftStart(slots[b.slotIndex]).getTime(),
    );

    for (const a of sortedList) {
      const slot = slots[a.slotIndex];
      if (!slot) continue;

      // Vacation
      if (s.vacationDays?.includes(slot.date)) {
        violations.push({
          kind: "vacation",
          staffId,
          slotIndex: a.slotIndex,
          severity: "hard",
          message: `${s.name} am Urlaubstag ${slot.date} verplant`,
        });
      }

      // Undesired shift
      if (s.preferredShifts && s.preferredShifts.length > 0 && !s.preferredShifts.includes(slot.type)) {
        violations.push({
          kind: "undesired-shift",
          staffId,
          slotIndex: a.slotIndex,
          severity: "soft",
          message: `${s.name} in unerwuenschter Schicht ${slot.type}`,
        });
      }

      const weekKey = isoWeek(new Date(slot.date));
      weekHours.set(weekKey, (weekHours.get(weekKey) ?? 0) + SHIFT_HOURS[slot.type]);
    }

    // Overtime per week
    const max = s.maxStundenWoche ?? 48;
    weekHours.forEach((h, wk) => {
      if (h > max) {
        violations.push({
          kind: "overtime",
          staffId,
          severity: "hard",
          message: `${s.name} in ${wk}: ${h}h (max ${max}h)`,
        });
      }
    });

    // 11h rest between shifts
    for (let i = 1; i < sortedList.length; i++) {
      const prev = slots[sortedList[i - 1].slotIndex];
      const curr = slots[sortedList[i].slotIndex];
      if (!prev || !curr) continue;
      const gap = (shiftStart(curr).getTime() - shiftEnd(prev).getTime()) / 3_600_000;
      if (gap < 11) {
        violations.push({
          kind: "short-rest",
          staffId,
          slotIndex: sortedList[i].slotIndex,
          severity: "hard",
          message: `${s.name}: nur ${gap.toFixed(1)}h Ruhezeit zwischen Schichten`,
        });
      }
    }
  });

  return { violations, unfilled, hoursByStaff };
}

const SHIFT_START_H: Record<ShiftSlot["type"], number> = { frueh: 6, spaet: 14, nacht: 22 };

export function shiftStart(slot: ShiftSlot | undefined): Date {
  if (!slot) return new Date(0);
  const d = new Date(`${slot.date}T00:00:00`);
  d.setHours(SHIFT_START_H[slot.type], 0, 0, 0);
  return d;
}

export function shiftEnd(slot: ShiftSlot | undefined): Date {
  if (!slot) return new Date(0);
  const start = shiftStart(slot);
  return new Date(start.getTime() + SHIFT_HOURS[slot.type] * 3_600_000);
}

function isoWeek(d: Date): string {
  const date = new Date(d.getTime());
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + 4 - (date.getDay() || 7));
  const yearStart = new Date(date.getFullYear(), 0, 1);
  const week = Math.ceil(((date.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7);
  return `${date.getFullYear()}-W${String(week).padStart(2, "0")}`;
}
