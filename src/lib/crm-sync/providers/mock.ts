import type { CareAILead, CRMContact, CRMProvider } from "../types";
import { leadToContact } from "../mapper";

/**
 * In-memory mock CRM provider. Default choice — never hits network.
 * Useful for local dev and tests; replaced with Salesforce/HubSpot in prod.
 */
class MockCRMProvider implements CRMProvider {
  readonly name = "mock" as const;
  private store = new Map<string, CRMContact>();

  async pullContacts(since?: string): Promise<CRMContact[]> {
    const cutoff = since ? new Date(since).getTime() : 0;
    return Array.from(this.store.values()).filter((c) => new Date(c.updatedAt).getTime() >= cutoff);
  }

  async pushContact(lead: CareAILead): Promise<CRMContact> {
    const base = leadToContact(lead);
    const existing = Array.from(this.store.values()).find((c) => c.email === lead.email);
    const contact: CRMContact = {
      ...base,
      externalId: existing?.externalId ?? `mock_${lead.email.replace(/[^a-z0-9]/gi, "_")}`,
      updatedAt: new Date().toISOString(),
    };
    this.store.set(contact.externalId, contact);
    return contact;
  }

  async ping(): Promise<{ ok: boolean; message?: string }> {
    return { ok: true, message: "mock provider always OK" };
  }
}

export const mockProvider = new MockCRMProvider();
