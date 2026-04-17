import { describe, it, expect, vi, beforeEach } from "vitest";

const insertValues = vi.fn().mockResolvedValue(undefined);
const insertMock = vi.fn(() => ({ values: insertValues }));

vi.mock("@/db/client", () => ({ db: { insert: insertMock } }));
vi.mock("@/db/schema", () => ({ auditLog: { __table: "audit_log" } }));

beforeEach(() => {
  insertValues.mockClear();
  insertMock.mockClear();
});

describe("logAudit", () => {
  it("inserts into audit_log with required fields", async () => {
    const { logAudit } = await import("@/lib/audit");
    await logAudit({
      tenantId: "tenant-1",
      userId: "user-1",
      entityType: "resident",
      entityId: "r-42",
      action: "update",
      before: { name: "A" },
      after: { name: "B" },
      ip: "127.0.0.1",
      userAgent: "vitest",
    });
    expect(insertMock).toHaveBeenCalledOnce();
    const payload = insertValues.mock.calls[0][0];
    expect(payload.tenantId).toBe("tenant-1");
    expect(payload.entityType).toBe("resident");
    expect(payload.action).toBe("update");
    expect(payload.before).toEqual({ name: "A" });
  });

  it("defaults before/after to null", async () => {
    const { logAudit } = await import("@/lib/audit");
    await logAudit({
      tenantId: "t",
      entityType: "login",
      entityId: "u",
      action: "login",
    });
    const payload = insertValues.mock.calls[0][0];
    expect(payload.before).toBeNull();
    expect(payload.after).toBeNull();
  });

  it("accepts all enumerated actions", async () => {
    const { logAudit } = await import("@/lib/audit");
    const actions = ["create", "update", "delete", "read", "login", "logout"] as const;
    for (const action of actions) {
      await logAudit({ tenantId: "t", entityType: "x", entityId: "y", action });
    }
    expect(insertValues).toHaveBeenCalledTimes(actions.length);
  });
});
