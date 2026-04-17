import type { ClockEvent } from "./types";

const TENANT = "tenant-demo";

const USERS = [
  { id: "u_anna", name: "Anna Weber" },
  { id: "u_marco", name: "Marco Schuster" },
  { id: "u_fatima", name: "Fatima El-Hadi" },
  { id: "u_tobias", name: "Tobias Kranz" },
  { id: "u_sophie", name: "Sophie Reiter" },
];

function at(date: Date, h: number, m: number): number {
  const d = new Date(date);
  d.setHours(h, m, 0, 0);
  return d.getTime();
}

export function seedEvents(): ClockEvent[] {
  const events: ClockEvent[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  for (let d = 30; d >= 1; d--) {
    const day = new Date(today.getTime() - d * 86_400_000);
    // Wochenende meist keine Events
    const dow = day.getDay();
    if (dow === 0) continue;
    for (const u of USERS) {
      if (Math.random() < 0.15) continue; // freier Tag
      const startH = 6 + Math.floor(Math.random() * 3); // 06–08
      const startM = Math.floor(Math.random() * 30);
      const worked = 7.5 + Math.random() * 1.8; // 7.5–9.3 h
      const pauseStartH = startH + 4;
      const pauseDuration = 30 + Math.floor(Math.random() * 15);
      events.push({
        id: `ce_s_${u.id}_${d}_in`,
        tenantId: TENANT,
        userId: u.id,
        userName: u.name,
        type: "in",
        timestamp: at(day, startH, startM),
      });
      events.push({
        id: `ce_s_${u.id}_${d}_ps`,
        tenantId: TENANT,
        userId: u.id,
        userName: u.name,
        type: "pause-start",
        timestamp: at(day, pauseStartH, 0),
      });
      events.push({
        id: `ce_s_${u.id}_${d}_pe`,
        tenantId: TENANT,
        userId: u.id,
        userName: u.name,
        type: "pause-end",
        timestamp: at(day, pauseStartH, pauseDuration),
      });
      const endMs = at(day, startH, startM) + worked * 3_600_000 + pauseDuration * 60_000;
      events.push({
        id: `ce_s_${u.id}_${d}_out`,
        tenantId: TENANT,
        userId: u.id,
        userName: u.name,
        type: "out",
        timestamp: endMs,
      });
    }
  }
  return events;
}

export const SEED_USERS = USERS;
