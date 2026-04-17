import type { CareAILead, CRMContact, CRMProvider } from "../types";
import { leadToContact } from "../mapper";

/** HubSpot provider — uses plain REST + env-based Private-App token. */

function getToken(): string | null {
  return process.env.HUBSPOT_PRIVATE_APP_TOKEN ?? null;
}

async function hubspotFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getToken();
  if (!token) throw new Error("HUBSPOT_PRIVATE_APP_TOKEN not set");
  const res = await fetch(`https://api.hubapi.com${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) throw new Error(`HubSpot ${res.status}: ${await res.text()}`);
  return (await res.json()) as T;
}

interface HubSpotContact {
  id: string;
  properties: Record<string, string | undefined>;
  updatedAt?: string;
}

export const hubspotProvider: CRMProvider = {
  name: "hubspot",
  async ping() {
    if (!getToken()) return { ok: false, message: "hubspot not configured (HUBSPOT_PRIVATE_APP_TOKEN missing)" };
    try {
      await hubspotFetch("/crm/v3/objects/contacts?limit=1");
      return { ok: true };
    } catch (err) {
      return { ok: false, message: (err as Error).message };
    }
  },
  async pullContacts(since?: string): Promise<CRMContact[]> {
    const cutoff = since ?? new Date(Date.now() - 30 * 86_400_000).toISOString();
    const res = await hubspotFetch<{ results: HubSpotContact[] }>(
      "/crm/v3/objects/contacts/search",
      {
        method: "POST",
        body: JSON.stringify({
          filterGroups: [{ filters: [{ propertyName: "lastmodifieddate", operator: "GTE", value: new Date(cutoff).getTime() }] }],
          properties: ["email", "firstname", "lastname", "company", "phone", "lifecyclestage"],
          limit: 200,
        }),
      }
    );
    return res.results.map((c) => ({
      externalId: c.id,
      email: c.properties.email ?? "",
      firstName: c.properties.firstname,
      lastName: c.properties.lastname,
      company: c.properties.company,
      phone: c.properties.phone,
      raw: c.properties,
      updatedAt: c.updatedAt ?? new Date().toISOString(),
    }));
  },
  async pushContact(lead: CareAILead): Promise<CRMContact> {
    const base = leadToContact(lead);
    const props = {
      email: base.email,
      firstname: base.firstName,
      lastname: base.lastName,
      company: base.company,
      phone: base.phone,
    };
    const body = JSON.stringify({ properties: props });
    // Upsert by email
    try {
      const res = await hubspotFetch<HubSpotContact>(`/crm/v3/objects/contacts/${encodeURIComponent(base.email)}?idProperty=email`, {
        method: "PATCH",
        body,
      });
      return { ...base, externalId: res.id, updatedAt: res.updatedAt ?? new Date().toISOString() };
    } catch {
      const res = await hubspotFetch<HubSpotContact>(`/crm/v3/objects/contacts`, { method: "POST", body });
      return { ...base, externalId: res.id, updatedAt: res.updatedAt ?? new Date().toISOString() };
    }
  },
};
