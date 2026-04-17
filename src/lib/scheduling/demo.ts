import type { ShiftSlot, StaffMember } from "./types";

/** Demo-Daten fuer den Solver — 10 Mitarbeiter, 1 Woche, 3 Schichten/Tag. */
export function demoStaff(): StaffMember[] {
  return [
    { id: "s1", name: "Petra Huber", qualification: "diplom", sollStunden: 40, preferredShifts: ["frueh", "spaet"] },
    { id: "s2", name: "Markus Gruber", qualification: "pflegefachkraft", sollStunden: 40, preferredShifts: ["frueh"] },
    { id: "s3", name: "Anna Mayer", qualification: "pflegefachkraft", sollStunden: 30, preferredShifts: ["spaet"] },
    { id: "s4", name: "Karl Schneider", qualification: "pflegeassistenz", sollStunden: 40 },
    { id: "s5", name: "Sabine Koller", qualification: "pflegefachkraft", sollStunden: 40, preferredShifts: ["nacht"] },
    { id: "s6", name: "Tobias Winter", qualification: "pflegeassistenz", sollStunden: 30 },
    { id: "s7", name: "Julia Sommer", qualification: "diplom", sollStunden: 40, preferredShifts: ["frueh", "spaet"] },
    { id: "s8", name: "Rene Berger", qualification: "pflegefachkraft", sollStunden: 40 },
    { id: "s9", name: "Eva Pichler", qualification: "pflegeassistenz", sollStunden: 30, preferredShifts: ["frueh"] },
    { id: "s10", name: "Michael Walter", qualification: "pflegefachkraft", sollStunden: 40, preferredShifts: ["nacht"] },
  ];
}

export function demoSlots(startDate: Date, days = 7): ShiftSlot[] {
  const out: ShiftSlot[] = [];
  for (let d = 0; d < days; d++) {
    const date = new Date(startDate.getTime() + d * 86_400_000);
    const iso = date.toISOString().slice(0, 10);
    out.push({ date: iso, type: "frueh", required: 3, minFachkraft: 1 });
    out.push({ date: iso, type: "spaet", required: 3, minFachkraft: 1 });
    out.push({ date: iso, type: "nacht", required: 2, minFachkraft: 1 });
  }
  return out;
}
