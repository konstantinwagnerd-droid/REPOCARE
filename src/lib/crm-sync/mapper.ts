import type { CareAILead, CRMContact } from "./types";

/** Map CareAI's stage taxonomy to the CRM-wide one and back */
const CAREAI_TO_CRM: Record<CareAILead["stage"], CRMContact["stage"]> = {
  new: "lead",
  contacted: "lead",
  qualified: "mql",
  demo: "sql",
  pilot: "opportunity",
  customer: "customer",
  lost: "churned",
};

const CRM_TO_CAREAI: Record<NonNullable<CRMContact["stage"]>, CareAILead["stage"]> = {
  lead: "new",
  mql: "qualified",
  sql: "demo",
  opportunity: "pilot",
  customer: "customer",
  churned: "lost",
};

export function leadToContact(lead: CareAILead): Omit<CRMContact, "externalId" | "raw"> {
  return {
    email: lead.email,
    firstName: lead.firstName,
    lastName: lead.lastName,
    company: lead.organization,
    phone: lead.phone,
    stage: CAREAI_TO_CRM[lead.stage],
    tags: lead.tags,
    updatedAt: lead.updatedAt,
  };
}

export function contactToLead(contact: CRMContact, existingId?: string): CareAILead {
  return {
    id: existingId ?? `lead_${Buffer.from(contact.email).toString("hex").slice(0, 12)}`,
    email: contact.email,
    firstName: contact.firstName,
    lastName: contact.lastName,
    organization: contact.company,
    phone: contact.phone,
    stage: contact.stage ? CRM_TO_CAREAI[contact.stage] : "new",
    source: `crm-sync`,
    tags: contact.tags,
    updatedAt: contact.updatedAt,
  };
}
