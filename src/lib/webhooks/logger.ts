import type { DeliveryLog } from "./types";

const logs: DeliveryLog[] = [];
const MAX_LOGS = 500;

export function appendLog(log: DeliveryLog): void {
  logs.unshift(log);
  if (logs.length > MAX_LOGS) logs.length = MAX_LOGS;
}

export function listLogs(webhookId?: string, limit = 100): DeliveryLog[] {
  const filtered = webhookId ? logs.filter((l) => l.webhookId === webhookId) : logs;
  return filtered.slice(0, limit);
}

export function findLog(id: string): DeliveryLog | undefined {
  return logs.find((l) => l.id === id);
}

export function updateLog(id: string, patch: Partial<DeliveryLog>): void {
  const idx = logs.findIndex((l) => l.id === id);
  if (idx >= 0) logs[idx] = { ...logs[idx], ...patch };
}

export function logStats(): { total: number; success: number; failed: number; avgDurationMs: number } {
  const total = logs.length;
  const success = logs.filter((l) => l.status === "success").length;
  const failed = logs.filter((l) => l.status === "failed").length;
  const avgDurationMs = total === 0 ? 0 : Math.round(logs.reduce((s, l) => s + l.durationMs, 0) / total);
  return { total, success, failed, avgDurationMs };
}
