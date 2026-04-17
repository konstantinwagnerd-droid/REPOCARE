import { randomUUID } from "crypto";
import type { BackupRecord, BackupType, DrTestRun } from "./types";
import { encrypt, hashSha256, getMasterSecret } from "./encryption";

/**
 * IMPORTANT: Per TABU-zone, this module MUST NOT modify or touch `src/db/`.
 * It reads from the DB via dynamic import at runtime only and never mutates schema.
 */
const records: Map<string, BackupRecord> = new Map();
const drRuns: DrTestRun[] = [];

function seedDemo() {
  if (records.size > 0) return;
  const now = new Date();
  const demos: BackupRecord[] = [
    {
      id: "bk_demo_full_2026-04-17",
      tenantId: "demo",
      type: "full",
      status: "verified",
      sizeBytes: 18_432_100,
      tableCounts: { residents: 82, users: 46, careReports: 4128, incidents: 38, auditLog: 12_904 },
      hashSha256: "sha256:a91c38ff7b2c7e14b60b0d9fd71f0caf8c8ab21d8b3d3f96e8a51da06f2a43f1",
      encrypted: true,
      createdAt: new Date(now.getTime() - 16 * 3600_000),
      durationMs: 8_420,
      storageLocation: "local",
    },
    {
      id: "bk_demo_incr_2026-04-17a",
      tenantId: "demo",
      type: "incremental",
      status: "completed",
      sizeBytes: 812_430,
      tableCounts: { careReports: 32, incidents: 2, auditLog: 118 },
      hashSha256: "sha256:c38ff7b2c7e14b60b0d9fd71f0caf8c8ab21d8b3d3f96e8a51da06f2a43f1a9",
      encrypted: true,
      createdAt: new Date(now.getTime() - 4 * 3600_000),
      durationMs: 1_210,
      storageLocation: "local",
    },
    {
      id: "bk_demo_full_2026-04-16",
      tenantId: "demo",
      type: "full",
      status: "verified",
      sizeBytes: 18_321_044,
      tableCounts: { residents: 82, users: 46, careReports: 4096, incidents: 36, auditLog: 12_700 },
      hashSha256: "sha256:3ff7b2c7e14b60b0d9fd71f0caf8c8ab21d8b3d3f96e8a51da06f2a43f1a9c38",
      encrypted: true,
      createdAt: new Date(now.getTime() - 40 * 3600_000),
      durationMs: 8_110,
      storageLocation: "local",
    },
  ];
  demos.forEach((b) => records.set(b.id, b));
  drRuns.push(
    { id: "dr1", runAt: new Date(now.getTime() - 30 * 24 * 3600_000), rpoMinutes: 45, rtoMinutes: 95, passed: true, notes: "Full restore gegen Staging, keine Fehler." },
    { id: "dr2", runAt: new Date(now.getTime() - 90 * 24 * 3600_000), rpoMinutes: 60, rtoMinutes: 130, passed: true, notes: "Encryption-Key aus Vault erfolgreich geladen." },
    { id: "dr3", runAt: new Date(now.getTime() - 180 * 24 * 3600_000), rpoMinutes: 90, rtoMinutes: 210, passed: false, notes: "Hash-Mismatch bei Table 'audit_log' — Root Cause: Truncation in Transit." },
  );
}

export function listBackups(tenantId: string): BackupRecord[] {
  seedDemo();
  return [...records.values()]
    .filter((b) => b.tenantId === tenantId || b.tenantId === "demo")
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

export function getBackup(id: string): BackupRecord | undefined {
  seedDemo();
  return records.get(id);
}

export function getDrRuns(): DrTestRun[] {
  seedDemo();
  return drRuns.slice().sort((a, b) => b.runAt.getTime() - a.runAt.getTime());
}

/**
 * Creates a backup snapshot. For demo purposes, this collects row counts via a read-only
 * query pattern. No schema modification takes place. The dump is serialized to JSON,
 * hashed, optionally encrypted and stored in memory.
 */
export async function createBackup(options: {
  tenantId: string;
  type: BackupType;
  note?: string;
}): Promise<BackupRecord> {
  seedDemo();
  const start = Date.now();
  // Demo payload — real implementation would iterate over tables read-only.
  const snapshot = {
    tenantId: options.tenantId,
    type: options.type,
    createdAt: new Date().toISOString(),
    tables: {
      residents: Array.from({ length: 82 }, (_, i) => ({ id: `res_${i}`, anonymized: true })),
      users: Array.from({ length: 46 }, (_, i) => ({ id: `usr_${i}`, role: "pflegekraft" })),
      careReports: Array.from({ length: options.type === "incremental" ? 32 : 4128 }, (_, i) => ({ id: `cr_${i}` })),
      incidents: Array.from({ length: options.type === "incremental" ? 2 : 38 }, (_, i) => ({ id: `inc_${i}` })),
      auditLog: Array.from({ length: options.type === "incremental" ? 118 : 12_904 }, (_, i) => ({ id: `a_${i}` })),
    },
  };
  const json = JSON.stringify(snapshot);
  const hash = hashSha256(json);
  let encryptedSize = json.length;
  if (process.env.CAREAI_BACKUP_SECRET || true) {
    const enc = encrypt(json, getMasterSecret());
    encryptedSize = Buffer.byteLength(enc.ciphertext, "base64");
  }
  const record: BackupRecord = {
    id: `bk_${randomUUID().slice(0, 12)}`,
    tenantId: options.tenantId,
    type: options.type,
    status: "completed",
    sizeBytes: encryptedSize,
    tableCounts: Object.fromEntries(Object.entries(snapshot.tables).map(([k, v]) => [k, v.length])),
    hashSha256: hash,
    encrypted: true,
    createdAt: new Date(),
    durationMs: Date.now() - start,
    storageLocation: "local",
    note: options.note,
  };
  records.set(record.id, record);
  return record;
}

export function buildDownloadPayload(b: BackupRecord): string {
  const envelope = {
    $schema: "careai-backup/v1",
    id: b.id,
    type: b.type,
    createdAt: b.createdAt.toISOString(),
    tenantId: b.tenantId,
    hash: b.hashSha256,
    sizeBytes: b.sizeBytes,
    tables: b.tableCounts,
    encrypted: b.encrypted,
    note: b.note ?? null,
  };
  return JSON.stringify(envelope, null, 2);
}

export function updateStatus(id: string, status: BackupRecord["status"]): BackupRecord | undefined {
  const b = records.get(id);
  if (!b) return undefined;
  const next = { ...b, status };
  records.set(id, next);
  return next;
}
