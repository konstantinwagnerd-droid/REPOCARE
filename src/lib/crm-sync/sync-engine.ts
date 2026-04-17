import type { CareAILead, CRMContact, CRMProvider, SyncConfig, SyncResult } from "./types";
import { contactToLead } from "./mapper";
import { mockProvider } from "./providers/mock";

/** Provider registry — selected at runtime */
export function getProvider(name: SyncConfig["provider"]): Promise<CRMProvider> {
  switch (name) {
    case "salesforce":
      return import("./providers/salesforce").then((m) => m.salesforceProvider);
    case "hubspot":
      return import("./providers/hubspot").then((m) => m.hubspotProvider);
    case "mock":
    default:
      return Promise.resolve(mockProvider);
  }
}

/** Simple in-memory lead store so sync has something to work with */
class LeadStore {
  private leads = new Map<string, CareAILead>();
  get(email: string): CareAILead | undefined {
    return Array.from(this.leads.values()).find((l) => l.email === email);
  }
  upsert(l: CareAILead): void { this.leads.set(l.id, l); }
  list(): CareAILead[] { return Array.from(this.leads.values()); }
}
const g = globalThis as unknown as { __crmLeadStore?: LeadStore };
export const leadStore = g.__crmLeadStore ?? new LeadStore();
if (!g.__crmLeadStore) g.__crmLeadStore = leadStore;

function chooseWinner(careai: CareAILead, crm: CRMContact, cfg: SyncConfig): "careai" | "crm" {
  switch (cfg.conflictResolution) {
    case "careai-wins": return "careai";
    case "crm-wins": return "crm";
    case "newest-wins":
      return new Date(careai.updatedAt).getTime() >= new Date(crm.updatedAt).getTime() ? "careai" : "crm";
  }
}

export async function runSync(cfg: SyncConfig, since?: string): Promise<SyncResult> {
  const startedAt = new Date().toISOString();
  const provider = await getProvider(cfg.provider);
  const result: SyncResult = {
    direction: cfg.direction,
    provider: cfg.provider,
    pushed: 0,
    pulled: 0,
    conflicts: [],
    errors: [],
    startedAt,
    completedAt: startedAt,
  };

  try {
    if (cfg.direction === "push" || cfg.direction === "bidirectional") {
      for (const lead of leadStore.list()) {
        try {
          await provider.pushContact(lead);
          result.pushed++;
        } catch (err) {
          result.errors.push({ email: lead.email, message: (err as Error).message });
        }
      }
    }

    if (cfg.direction === "pull" || cfg.direction === "bidirectional") {
      const contacts = await provider.pullContacts(since);
      for (const c of contacts) {
        const local = leadStore.get(c.email);
        if (local) {
          const winner = chooseWinner(local, c, cfg);
          result.conflicts.push({ email: c.email, resolution: cfg.conflictResolution, chosen: winner });
          if (winner === "crm") leadStore.upsert(contactToLead(c, local.id));
        } else {
          leadStore.upsert(contactToLead(c));
        }
        result.pulled++;
      }
    }
  } catch (err) {
    result.errors.push({ message: (err as Error).message });
  }

  result.completedAt = new Date().toISOString();
  return result;
}
