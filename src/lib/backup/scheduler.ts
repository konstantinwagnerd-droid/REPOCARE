import { randomUUID } from "crypto";
import type { BackupSchedule, BackupType } from "./types";

const schedules: Map<string, BackupSchedule> = new Map();

function nextCron(cron: string): Date {
  // Minimal approximation — supports "H M * * *" and "H M * * D". Falls back to +24h.
  const parts = cron.split(/\s+/);
  const now = new Date();
  if (parts.length >= 5) {
    const [mStr, hStr, , , dStr] = parts;
    const min = Number(mStr);
    const hour = Number(hStr);
    if (!isNaN(min) && !isNaN(hour)) {
      const next = new Date(now);
      next.setSeconds(0, 0);
      next.setHours(hour, min, 0, 0);
      if (dStr && dStr !== "*") {
        const target = Number(dStr);
        while (next.getDay() !== target || next <= now) next.setDate(next.getDate() + 1);
      } else if (next <= now) {
        next.setDate(next.getDate() + 1);
      }
      return next;
    }
  }
  return new Date(now.getTime() + 24 * 3600_000);
}

function seed() {
  if (schedules.size > 0) return;
  const s1: BackupSchedule = {
    id: "sch_daily",
    tenantId: "demo",
    cron: "0 3 * * *",
    type: "full",
    enabled: true,
    retentionDaily: 7,
    retentionWeekly: 4,
    retentionMonthly: 12,
    nextRunAt: nextCron("0 3 * * *"),
    lastRunAt: new Date(Date.now() - 16 * 3600_000),
  };
  const s2: BackupSchedule = {
    id: "sch_weekly",
    tenantId: "demo",
    cron: "0 2 * * 0",
    type: "full",
    enabled: true,
    retentionDaily: 7,
    retentionWeekly: 4,
    retentionMonthly: 12,
    nextRunAt: nextCron("0 2 * * 0"),
    lastRunAt: new Date(Date.now() - 3 * 24 * 3600_000),
  };
  schedules.set(s1.id, s1);
  schedules.set(s2.id, s2);
}

export function listSchedules(tenantId: string): BackupSchedule[] {
  seed();
  return [...schedules.values()].filter((s) => s.tenantId === tenantId || s.tenantId === "demo");
}

export function saveSchedule(input: {
  id?: string;
  tenantId: string;
  cron: string;
  type: BackupType;
  enabled: boolean;
  retentionDaily: number;
  retentionWeekly: number;
  retentionMonthly: number;
}): BackupSchedule {
  seed();
  const id = input.id ?? `sch_${randomUUID().slice(0, 8)}`;
  const record: BackupSchedule = {
    id,
    tenantId: input.tenantId,
    cron: input.cron,
    type: input.type,
    enabled: input.enabled,
    retentionDaily: input.retentionDaily,
    retentionWeekly: input.retentionWeekly,
    retentionMonthly: input.retentionMonthly,
    nextRunAt: nextCron(input.cron),
    lastRunAt: schedules.get(id)?.lastRunAt ?? null,
  };
  schedules.set(id, record);
  return record;
}
