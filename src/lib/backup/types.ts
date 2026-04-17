export type BackupType = "full" | "incremental" | "schema-only" | "tenant-export";
export type BackupStatus = "pending" | "running" | "completed" | "failed" | "verified";

export interface BackupRecord {
  id: string;
  tenantId: string;
  type: BackupType;
  status: BackupStatus;
  sizeBytes: number;
  tableCounts: Record<string, number>;
  hashSha256: string;
  encrypted: boolean;
  createdAt: Date;
  durationMs: number;
  storageLocation: "local" | "s3";
  note?: string;
}

export type ConflictStrategy = "skip" | "overwrite" | "merge";

export interface RestoreReport {
  startedAt: Date;
  finishedAt: Date | null;
  strategy: ConflictStrategy;
  tables: Record<string, { inserted: number; skipped: number; overwritten: number; errors: number }>;
  success: boolean;
  message: string;
}

export interface BackupSchedule {
  id: string;
  tenantId: string;
  cron: string;
  type: BackupType;
  enabled: boolean;
  retentionDaily: number;
  retentionWeekly: number;
  retentionMonthly: number;
  nextRunAt: Date;
  lastRunAt: Date | null;
}

export interface DrTestRun {
  id: string;
  runAt: Date;
  rpoMinutes: number;
  rtoMinutes: number;
  passed: boolean;
  notes: string;
}
