export type ClockEventType = "in" | "out" | "pause-start" | "pause-end";

export type ClockEvent = {
  id: string;
  tenantId: string;
  userId: string;
  userName: string;
  type: ClockEventType;
  timestamp: number;
  note?: string;
};

export type TimeSheetDay = {
  date: string; // YYYY-MM-DD
  userId: string;
  workedMinutes: number;
  pauseMinutes: number;
  sollMinutes: number; // Soll-Arbeitszeit laut Dienstplan (Mock 480 = 8h)
  overtimeMinutes: number; // worked - soll
  violations: string[]; // Regelverstöße
  events: ClockEvent[];
};

export type TimeSheetMonth = {
  userId: string;
  userName: string;
  ym: string; // YYYY-MM
  totalWorkedMinutes: number;
  totalSollMinutes: number;
  totalOvertimeMinutes: number;
  totalPauseMinutes: number;
  vacationDaysTaken: number;
  vacationDaysRemaining: number;
  days: TimeSheetDay[];
  approvalStatus: "pending" | "approved" | "rejected";
  approvedBy?: string;
  approvedAt?: number;
};

export type TimeStatus = {
  userId: string;
  state: "out" | "in" | "pause";
  since: number | null;
  todayWorkedMinutes: number;
  todayPauseMinutes: number;
  lastEvent: ClockEvent | null;
};
