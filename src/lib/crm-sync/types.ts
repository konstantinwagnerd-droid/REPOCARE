export type SyncDirection = "push" | "pull" | "bidirectional";
export type ConflictResolution = "crm-wins" | "careai-wins" | "newest-wins";
export type CRMProviderName = "salesforce" | "hubspot" | "mock";

export interface CRMContact {
  /** External ID from the provider (Salesforce ID, HubSpot objectId, etc.) */
  externalId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  /** Lifecycle stage used across CRMs */
  stage?: "lead" | "mql" | "sql" | "opportunity" | "customer" | "churned";
  /** Free-form tags */
  tags?: string[];
  /** Provider-specific raw data (for debugging/audit) */
  raw?: Record<string, unknown>;
  updatedAt: string;
}

export interface CareAILead {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  organization?: string;
  phone?: string;
  stage: "new" | "contacted" | "qualified" | "demo" | "pilot" | "customer" | "lost";
  source: string;
  tags?: string[];
  updatedAt: string;
}

export interface SyncResult {
  direction: SyncDirection;
  provider: CRMProviderName;
  pushed: number;
  pulled: number;
  conflicts: Array<{ email: string; resolution: ConflictResolution; chosen: "crm" | "careai" }>;
  errors: Array<{ email?: string; message: string }>;
  startedAt: string;
  completedAt: string;
}

export interface SyncConfig {
  provider: CRMProviderName;
  direction: SyncDirection;
  conflictResolution: ConflictResolution;
  /** Field-level mapping overrides */
  fieldMap?: Record<string, string>;
  /** Rate limit — requests per second when hitting the CRM API */
  rateLimitRps?: number;
}

export interface CRMProvider {
  name: CRMProviderName;
  /** Fetch up-to-date CRM contacts modified since the given timestamp (ISO) */
  pullContacts(since?: string): Promise<CRMContact[]>;
  /** Push one contact; returns the provider's externalId */
  pushContact(lead: CareAILead): Promise<CRMContact>;
  /** Health-check the connection */
  ping(): Promise<{ ok: boolean; message?: string }>;
}
