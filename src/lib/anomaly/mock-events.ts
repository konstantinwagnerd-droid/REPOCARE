import type { AnomalyEvent } from "./types";

/**
 * Demo-Events-Generator. Produktion: diese Funktion durch eine Query
 * auf das Audit-Log (src/lib/audit.ts / src/db/schema.ts) ersetzen –
 * erfordert Schema-Anpassung (ip, country), hier bewusst vermieden (tabu).
 */
export function generateMockEvents(seed = 42): AnomalyEvent[] {
  const now = Date.now();
  const events: AnomalyEvent[] = [];
  let id = 0;
  const mkId = () => `evt_${(++id).toString(36)}_${seed}`;

  // Baseline-User: 30 Tage normale Aktivität
  const users = ["user-alice", "user-bob", "user-carol", "user-dan"];
  for (const u of users) {
    for (let d = 30; d >= 1; d--) {
      const perDay = 20 + Math.floor(Math.random() * 20);
      for (let k = 0; k < perDay; k++) {
        const hour = 8 + Math.floor(Math.random() * 10);
        const ts = now - d * 86_400_000 + hour * 3600_000 + Math.floor(Math.random() * 3600_000);
        events.push({
          id: mkId(),
          userId: u,
          action: Math.random() > 0.7 ? "update" : "read",
          entityType: Math.random() > 0.5 ? "resident" : "care-plan",
          ts,
          ip: "10.0.0.12",
          country: "AT",
          userAgent: "Mozilla/5.0",
        });
      }
    }
  }

  // Anomalie 1: Bulk-Delete (Alice, heute, 60 Deletes in 3 Min)
  const bulkStart = now - 3 * 3600_000;
  for (let i = 0; i < 60; i++) {
    events.push({
      id: mkId(),
      userId: "user-alice",
      action: "delete",
      entityType: "resident",
      ts: bulkStart + i * 2500,
      ip: "10.0.0.12",
      country: "AT",
    });
  }

  // Anomalie 2: Off-hours export (Bob, 02:30)
  const night = new Date(now);
  night.setHours(2, 30, 0, 0);
  events.push({
    id: mkId(),
    userId: "user-bob",
    action: "export",
    entityType: "export",
    ts: night.getTime(),
    ip: "10.0.0.13",
    country: "AT",
  });

  // Anomalie 3: Geo-unusual (Carol, login aus RU)
  events.push({
    id: mkId(),
    userId: "user-carol",
    action: "login",
    entityType: "session",
    ts: now - 30 * 60_000,
    ip: "91.200.1.5",
    country: "RU",
  });

  // Anomalie 4: Credential stuffing (unknown IP, 15 failures)
  for (let i = 0; i < 15; i++) {
    events.push({
      id: mkId(),
      action: "login-failed",
      entityType: "session",
      ts: now - 10 * 60_000 + i * 5000,
      ip: "203.0.113.7",
    });
  }

  // Anomalie 5: Role escalation (Dan → admin)
  events.push({
    id: mkId(),
    userId: "user-dan",
    action: "update",
    entityType: "user-role",
    ts: now - 2 * 3600_000,
    ip: "10.0.0.14",
    country: "AT",
  });

  return events.sort((a, b) => a.ts - b.ts);
}
