import type { ClockEvent, ClockEventType, TimeSheetDay, TimeSheetMonth, TimeStatus } from "./types";
import { RULES, validateDay } from "./rules";
import { seedEvents } from "./seed";

type Store = {
  events: ClockEvent[];
  approvals: Map<string, { status: "pending" | "approved" | "rejected"; by?: string; at?: number }>; // userId|ym
};

const globalAny = globalThis as unknown as { __careai_ze_store?: Store };

function getStore(): Store {
  if (!globalAny.__careai_ze_store) {
    globalAny.__careai_ze_store = { events: [], approvals: new Map() };
    globalAny.__careai_ze_store.events.push(...seedEvents());
  }
  return globalAny.__careai_ze_store;
}

function dayKey(ts: number): string {
  return new Date(ts).toISOString().slice(0, 10);
}

export function addClockEvent(e: Omit<ClockEvent, "id">): ClockEvent {
  const evt: ClockEvent = { ...e, id: `ce_${Math.random().toString(36).slice(2, 12)}` };
  getStore().events.push(evt);
  return evt;
}

export function getUserEvents(tenantId: string, userId: string): ClockEvent[] {
  return getStore().events
    .filter((e) => e.tenantId === tenantId && e.userId === userId)
    .sort((a, b) => a.timestamp - b.timestamp);
}

export function getTenantEventsForDate(tenantId: string, date: string): ClockEvent[] {
  return getStore().events
    .filter((e) => e.tenantId === tenantId && dayKey(e.timestamp) === date)
    .sort((a, b) => a.timestamp - b.timestamp);
}

export function getStatus(tenantId: string, userId: string): TimeStatus {
  const evts = getUserEvents(tenantId, userId);
  const today = dayKey(Date.now());
  const todayEvts = evts.filter((e) => dayKey(e.timestamp) === today);
  const day = aggregateDay(todayEvts, userId, today);
  let state: "in" | "out" | "pause" = "out";
  let since: number | null = null;
  const last = evts[evts.length - 1];
  if (last) {
    if (last.type === "in" || last.type === "pause-end") { state = "in"; since = last.timestamp; }
    else if (last.type === "pause-start") { state = "pause"; since = last.timestamp; }
    else { state = "out"; since = last.timestamp; }
  }
  return {
    userId,
    state,
    since,
    todayWorkedMinutes: day.workedMinutes,
    todayPauseMinutes: day.pauseMinutes,
    lastEvent: last ?? null,
  };
}

function aggregateDay(events: ClockEvent[], userId: string, date: string): TimeSheetDay {
  let workedMs = 0;
  let pauseMs = 0;
  let inStart: number | null = null;
  let pauseStart: number | null = null;
  for (const e of events) {
    if (e.type === "in") { inStart = e.timestamp; }
    else if (e.type === "out" && inStart !== null) {
      workedMs += e.timestamp - inStart; inStart = null;
    }
    else if (e.type === "pause-start" && inStart !== null) {
      workedMs += e.timestamp - inStart; inStart = null; pauseStart = e.timestamp;
    }
    else if (e.type === "pause-end" && pauseStart !== null) {
      pauseMs += e.timestamp - pauseStart; pauseStart = null; inStart = e.timestamp;
    }
  }
  // Falls User noch eingestempelt (Live)
  if (inStart !== null) {
    const now = Date.now();
    const sameDay = dayKey(now) === date;
    workedMs += (sameDay ? now : new Date(`${date}T23:59:59Z`).getTime()) - inStart;
  }
  const workedMinutes = Math.round(workedMs / 60_000);
  const pauseMinutes = Math.round(pauseMs / 60_000);
  const soll = RULES.defaultSollMinutesPerDay;
  return {
    date,
    userId,
    workedMinutes,
    pauseMinutes,
    sollMinutes: soll,
    overtimeMinutes: workedMinutes - soll,
    violations: validateDay(workedMinutes, pauseMinutes),
    events,
  };
}

export function getTimeSheetMonth(tenantId: string, userId: string, userName: string, ym: string): TimeSheetMonth {
  const evts = getUserEvents(tenantId, userId).filter((e) => dayKey(e.timestamp).startsWith(ym));
  const dayMap = new Map<string, ClockEvent[]>();
  for (const e of evts) {
    const d = dayKey(e.timestamp);
    if (!dayMap.has(d)) dayMap.set(d, []);
    dayMap.get(d)!.push(e);
  }
  const days: TimeSheetDay[] = [];
  for (const [d, list] of Array.from(dayMap.entries()).sort()) {
    days.push(aggregateDay(list, userId, d));
  }
  const totalWorked = days.reduce((a, d) => a + d.workedMinutes, 0);
  const totalPause = days.reduce((a, d) => a + d.pauseMinutes, 0);
  const totalSoll = days.length * RULES.defaultSollMinutesPerDay;
  const approval = getStore().approvals.get(`${userId}|${ym}`) ?? { status: "pending" as const };
  // Urlaub Mock
  const vacationTaken = Math.min(RULES.defaultVacationDaysPerYear, Math.floor(Math.random() * 12) + 6);
  return {
    userId,
    userName,
    ym,
    totalWorkedMinutes: totalWorked,
    totalSollMinutes: totalSoll,
    totalOvertimeMinutes: totalWorked - totalSoll,
    totalPauseMinutes: totalPause,
    vacationDaysTaken: vacationTaken,
    vacationDaysRemaining: RULES.defaultVacationDaysPerYear - vacationTaken,
    days,
    approvalStatus: approval.status,
    approvedBy: approval.by,
    approvedAt: approval.at,
  };
}

export function setApproval(userId: string, ym: string, status: "approved" | "rejected", by: string): void {
  getStore().approvals.set(`${userId}|${ym}`, { status, by, at: Date.now() });
}

export function listAllUserIds(tenantId: string): string[] {
  const set = new Set<string>();
  for (const e of getStore().events) if (e.tenantId === tenantId) set.add(e.userId);
  return Array.from(set);
}

export function getUserMeta(tenantId: string, userId: string): { name: string } {
  const e = getStore().events.find((x) => x.tenantId === tenantId && x.userId === userId);
  return { name: e?.userName ?? userId };
}

export function exportMonthCsv(tenantId: string, ym: string): string {
  const users = listAllUserIds(tenantId);
  const rows: string[] = ["User;Monat;Ist-Stunden;Soll-Stunden;Überstunden;Pausen(Min);Urlaub genommen;Status"];
  for (const uid of users) {
    const meta = getUserMeta(tenantId, uid);
    const ts = getTimeSheetMonth(tenantId, uid, meta.name, ym);
    rows.push(
      [
        ts.userName,
        ym,
        (ts.totalWorkedMinutes / 60).toFixed(2),
        (ts.totalSollMinutes / 60).toFixed(2),
        (ts.totalOvertimeMinutes / 60).toFixed(2),
        ts.totalPauseMinutes,
        ts.vacationDaysTaken,
        ts.approvalStatus,
      ].join(";"),
    );
  }
  return rows.join("\n");
}

export type { ClockEventType };
