import type { CareAILead, CRMContact, CRMProvider } from "../types";
import { leadToContact } from "../mapper";

/**
 * Salesforce provider — real implementation lazy-loads `jsforce` only when
 * credentials are configured. Falls back to a stub that reports an explicit
 * not-configured status, so importing this module is always safe.
 */
interface SalesforceConfig {
  loginUrl: string; // e.g. https://login.salesforce.com
  username: string;
  password: string;
  securityToken: string;
}

function getConfig(): SalesforceConfig | null {
  const loginUrl = process.env.SALESFORCE_LOGIN_URL;
  const username = process.env.SALESFORCE_USERNAME;
  const password = process.env.SALESFORCE_PASSWORD;
  const securityToken = process.env.SALESFORCE_SECURITY_TOKEN;
  if (!loginUrl || !username || !password || !securityToken) return null;
  return { loginUrl, username, password, securityToken };
}

async function login(cfg: SalesforceConfig): Promise<unknown> {
  // Lazy import so projects without the dep still build
  // @ts-expect-error — optional peer dep
  const mod = await import("jsforce").catch(() => null);
  if (!mod) throw new Error("jsforce not installed — run `npm i jsforce` to enable Salesforce provider.");
  const conn = new mod.Connection({ loginUrl: cfg.loginUrl });
  await conn.login(cfg.username, `${cfg.password}${cfg.securityToken}`);
  return conn;
}

export const salesforceProvider: CRMProvider = {
  name: "salesforce",
  async ping() {
    const cfg = getConfig();
    if (!cfg) return { ok: false, message: "salesforce not configured (missing env vars)" };
    try {
      await login(cfg);
      return { ok: true };
    } catch (err) {
      return { ok: false, message: (err as Error).message };
    }
  },
  async pullContacts(since?: string): Promise<CRMContact[]> {
    const cfg = getConfig();
    if (!cfg) throw new Error("salesforce not configured");
    const conn = (await login(cfg)) as {
      query: (soql: string) => Promise<{ records: Array<Record<string, unknown>> }>;
    };
    const cutoff = since ?? new Date(Date.now() - 30 * 86_400_000).toISOString();
    const soql = `SELECT Id, Email, FirstName, LastName, Company, Phone, LeadStatus, LastModifiedDate FROM Lead WHERE LastModifiedDate >= ${cutoff} LIMIT 500`;
    const res = await conn.query(soql);
    return res.records.map((r) => ({
      externalId: String(r.Id),
      email: String(r.Email ?? ""),
      firstName: r.FirstName ? String(r.FirstName) : undefined,
      lastName: r.LastName ? String(r.LastName) : undefined,
      company: r.Company ? String(r.Company) : undefined,
      phone: r.Phone ? String(r.Phone) : undefined,
      raw: r,
      updatedAt: String(r.LastModifiedDate ?? new Date().toISOString()),
    }));
  },
  async pushContact(lead: CareAILead): Promise<CRMContact> {
    const cfg = getConfig();
    if (!cfg) throw new Error("salesforce not configured");
    const conn = (await login(cfg)) as {
      sobject: (name: string) => { upsert: (rec: Record<string, unknown>, ext: string) => Promise<{ id: string }> };
    };
    const base = leadToContact(lead);
    const rec = {
      Email: base.email,
      FirstName: base.firstName,
      LastName: base.lastName ?? "(none)",
      Company: base.company ?? "(none)",
      Phone: base.phone,
    };
    const result = await conn.sobject("Lead").upsert(rec, "Email");
    return { ...base, externalId: result.id, updatedAt: new Date().toISOString() };
  },
};
