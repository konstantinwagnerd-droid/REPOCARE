// Offline-Sync — Outbox-Endpoint.
// Nimmt eine Batch aus dem Client-Outbox entgegen, wendet Mutations an
// (Mock — echter DB-Write erfolgt in einer spaeteren Wave) und schreibt
// einen Audit-Log-Eintrag pro verarbeiteter Mutation.
//
// Contract:
//   Request:  { ops: SyncOperation[] }
//   Response: { applied: [{id, status}], conflicts: [{id, reason}] }

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Kind = "create" | "update" | "delete";
type IncomingOp = {
  id: string;
  resource: string;
  kind: Kind;
  payload?: Record<string, unknown>;
  baseVersion?: string;
  createdAt?: string;
};

const ALLOWED_RESOURCES = new Set([
  "berichte",
  "vitalwerte",
  "medikation",
  "sis",
  "handover",
  "incidents",
]);

const MAX_BATCH = 100;

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tenantId = (session.user as any).tenantId as string | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session.user as any).id as string | undefined;
  if (!tenantId) {
    return NextResponse.json({ error: "no-tenant" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid-json" }, { status: 400 });
  }

  const ops = Array.isArray((body as { ops?: unknown })?.ops)
    ? ((body as { ops: IncomingOp[] }).ops)
    : null;
  if (!ops) {
    return NextResponse.json({ error: "missing-ops" }, { status: 400 });
  }
  if (ops.length > MAX_BATCH) {
    return NextResponse.json({ error: "batch-too-large", max: MAX_BATCH }, { status: 413 });
  }

  const applied: Array<{ id: string; status: "applied" | "skipped" }> = [];
  const conflicts: Array<{ id: string; reason: string }> = [];

  for (const op of ops) {
    if (!op || typeof op.id !== "string" || typeof op.resource !== "string") {
      conflicts.push({ id: op?.id ?? "unknown", reason: "invalid-shape" });
      continue;
    }
    if (!ALLOWED_RESOURCES.has(op.resource)) {
      conflicts.push({ id: op.id, reason: `resource-not-allowed:${op.resource}` });
      continue;
    }
    if (!["create", "update", "delete"].includes(op.kind)) {
      conflicts.push({ id: op.id, reason: `kind-invalid:${op.kind}` });
      continue;
    }

    // MOCK: In einer echten Implementierung wuerde hier eine Transaktion
    // mit Versionscheck (baseVersion vs. current server version) laufen.
    // Fuer Konflikt-Simulation: wenn payload.__simulateConflict === true.
    if (op.payload && (op.payload as Record<string, unknown>).__simulateConflict === true) {
      conflicts.push({ id: op.id, reason: "version-mismatch" });
      continue;
    }

    try {
      await logAudit({
        tenantId,
        userId,
        entityType: op.resource,
        entityId: op.id,
        action: op.kind === "delete" ? "delete" : op.kind === "create" ? "create" : "update",
        after: op.payload ?? null,
        userAgent: req.headers.get("user-agent") ?? undefined,
      });
      applied.push({ id: op.id, status: "applied" });
    } catch (err) {
      conflicts.push({
        id: op.id,
        reason: `audit-failed:${err instanceof Error ? err.message : "unknown"}`,
      });
    }
  }

  return NextResponse.json(
    { applied, conflicts, serverTime: new Date().toISOString() },
    { status: 200, headers: { "cache-control": "no-store" } },
  );
}

export async function GET() {
  return NextResponse.json(
    { endpoint: "sync", method: "POST", maxBatch: MAX_BATCH, resources: Array.from(ALLOWED_RESOURCES) },
    { status: 200 },
  );
}
