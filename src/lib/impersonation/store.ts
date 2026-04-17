import type { ImpersonationSession } from "./types";

type Store = { sessions: Map<string, ImpersonationSession> };
const globalAny = globalThis as unknown as { __careai_imp_store?: Store };

function getStore(): Store {
  if (!globalAny.__careai_imp_store) {
    globalAny.__careai_imp_store = { sessions: new Map() };
  }
  return globalAny.__careai_imp_store;
}

export function createSession(s: Omit<ImpersonationSession, "id" | "startedAt" | "endedAt" | "active">): ImpersonationSession {
  const session: ImpersonationSession = {
    ...s,
    id: `imp_${Math.random().toString(36).slice(2, 12)}`,
    startedAt: Date.now(),
    endedAt: null,
    active: true,
  };
  getStore().sessions.set(session.id, session);
  return session;
}

export function endSession(id: string): ImpersonationSession | undefined {
  const s = getStore().sessions.get(id);
  if (!s) return undefined;
  s.active = false;
  s.endedAt = Date.now();
  getStore().sessions.set(id, s);
  return s;
}

export function getSession(id: string): ImpersonationSession | undefined {
  return getStore().sessions.get(id);
}

export function getActiveSessionForAdmin(adminUserId: string): ImpersonationSession | undefined {
  for (const s of getStore().sessions.values()) {
    if (s.adminUserId === adminUserId && s.active) return s;
  }
  return undefined;
}

export function listSessions(tenantId: string, limit = 100): ImpersonationSession[] {
  return Array.from(getStore().sessions.values())
    .filter((s) => s.tenantId === tenantId)
    .sort((a, b) => b.startedAt - a.startedAt)
    .slice(0, limit);
}
