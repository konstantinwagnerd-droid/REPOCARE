/**
 * Partner-Mock-Datenstore für das Demo-Portal.
 * In-Memory, session-persistent. Produktion: durch eigene Partner-Tabelle
 * im DB-Schema ersetzen (separater Agent / separates Feature-Ticket).
 */

export type PartnerTier = "reseller" | "implementation" | "integration" | "consulting";

export type LeadStatus = "neu" | "qualifiziert" | "demo" | "verhandlung" | "won" | "lost";

export interface PartnerAccount {
  id: string;
  email: string;
  password: string; // NUR Demo-Layer — niemals so in Produktion!
  companyName: string;
  contactName: string;
  tier: PartnerTier;
  certified: boolean;
  commissionRate: number; // z. B. 0.15 = 15 %
  createdAt: string;
}

export interface Lead {
  id: string;
  partnerId: string;
  facilityName: string;
  contactName: string;
  email: string;
  phone?: string;
  places: number;
  status: LeadStatus;
  estimatedMonthlyValue: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  wonAt?: string;
}

export interface Commission {
  id: string;
  partnerId: string;
  leadId: string;
  facilityName: string;
  monthlyValue: number;
  rate: number;
  firstMonthEuro: number;
  annualEuro: number;
  status: "pending" | "paid";
  earnedAt: string;
  paidAt?: string;
}

const _partners = new Map<string, PartnerAccount>();
const _leads = new Map<string, Lead>();
const _commissions = new Map<string, Commission>();

function seed() {
  if (_partners.size > 0) return;
  const now = new Date().toISOString();
  const demos: Array<Omit<PartnerAccount, "id" | "createdAt">> = [
    {
      email: "partner@muellertech.de",
      password: "demo2026",
      companyName: "Müller IT-Systemhaus GmbH",
      contactName: "Anja Müller",
      tier: "reseller",
      certified: true,
      commissionRate: 0.2,
    },
    {
      email: "ops@pflegenetz.at",
      password: "demo2026",
      companyName: "Pflegenetz Consulting Austria",
      contactName: "Thomas Reiter",
      tier: "consulting",
      certified: true,
      commissionRate: 0.15,
    },
    {
      email: "sales@digihaus.de",
      password: "demo2026",
      companyName: "DigiHaus Integrationen",
      contactName: "Sebastian Klein",
      tier: "integration",
      certified: false,
      commissionRate: 0.1,
    },
  ];
  demos.forEach((d, i) => {
    const id = `p_demo_${i + 1}`;
    _partners.set(id, { id, createdAt: now, ...d });
  });

  // Demo-Leads für Partner 1
  const leadDemo: Array<Omit<Lead, "id" | "partnerId" | "createdAt" | "updatedAt">> = [
    {
      facilityName: "Seniorenresidenz Grinzing",
      contactName: "Mag. Helene Fischer",
      email: "fischer@res-grinzing.at",
      phone: "+43 1 234 5678",
      places: 65,
      status: "demo",
      estimatedMonthlyValue: 599,
      notes: "Interesse an Enterprise-Modul, Demo am 25.04. vereinbart",
    },
    {
      facilityName: "Pflege am Ring",
      contactName: "DGKP Josef Baumgartner",
      email: "j.baumgartner@ring-pflege.at",
      places: 28,
      status: "qualifiziert",
      estimatedMonthlyValue: 299,
      notes: "Budget für Q3 bestätigt",
    },
    {
      facilityName: "Residenz Mariahilf",
      contactName: "Claudia Winkler",
      email: "winkler@mariahilf.at",
      places: 110,
      status: "won",
      estimatedMonthlyValue: 999,
      notes: "Vertrag unterzeichnet 08.03.",
      wonAt: "2026-03-08",
    },
    {
      facilityName: "Haus am Wienerwald",
      contactName: "Peter Fuchs",
      email: "fuchs@wienerwald.at",
      places: 45,
      status: "verhandlung",
      estimatedMonthlyValue: 599,
    },
    {
      facilityName: "Pflegeheim Hütteldorf",
      contactName: "Maria Ebner",
      email: "ebner@huetteldorf.at",
      places: 80,
      status: "lost",
      estimatedMonthlyValue: 599,
      notes: "Konkurrenzsystem gewonnen — Preisdruck",
    },
  ];

  leadDemo.forEach((l, i) => {
    const id = `l_demo_${i + 1}`;
    const createdAt = new Date(Date.now() - (i + 1) * 5 * 86400000).toISOString();
    _leads.set(id, {
      id,
      partnerId: "p_demo_1",
      createdAt,
      updatedAt: createdAt,
      ...l,
    });
  });

  // Commission für "won"-Lead
  const wonLead = Array.from(_leads.values()).find((l) => l.status === "won");
  if (wonLead) {
    const partner = _partners.get(wonLead.partnerId)!;
    const id = `c_demo_1`;
    _commissions.set(id, {
      id,
      partnerId: partner.id,
      leadId: wonLead.id,
      facilityName: wonLead.facilityName,
      monthlyValue: wonLead.estimatedMonthlyValue,
      rate: partner.commissionRate,
      firstMonthEuro: wonLead.estimatedMonthlyValue * partner.commissionRate,
      annualEuro: wonLead.estimatedMonthlyValue * 12 * partner.commissionRate,
      status: "pending",
      earnedAt: wonLead.wonAt ?? new Date().toISOString(),
    });
  }
}

export function authenticate(email: string, password: string): PartnerAccount | null {
  seed();
  const partner = Array.from(_partners.values()).find(
    (p) => p.email.toLowerCase() === email.toLowerCase() && p.password === password,
  );
  return partner ?? null;
}

export function getPartner(id: string): PartnerAccount | undefined {
  seed();
  return _partners.get(id);
}

export function listLeadsByPartner(partnerId: string): Lead[] {
  seed();
  return Array.from(_leads.values())
    .filter((l) => l.partnerId === partnerId)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function createLead(input: Omit<Lead, "id" | "createdAt" | "updatedAt" | "status"> & { status?: LeadStatus }): Lead {
  seed();
  const now = new Date().toISOString();
  const id = `l_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
  const lead: Lead = {
    id,
    ...input,
    status: input.status ?? "neu",
    createdAt: now,
    updatedAt: now,
  };
  _leads.set(id, lead);
  return lead;
}

export function updateLead(id: string, patch: Partial<Lead>): Lead | null {
  seed();
  const existing = _leads.get(id);
  if (!existing) return null;
  const next: Lead = { ...existing, ...patch, id, updatedAt: new Date().toISOString() };
  // Auto-Commission bei "won"
  if (patch.status === "won" && existing.status !== "won") {
    next.wonAt = next.updatedAt;
    const partner = _partners.get(next.partnerId);
    if (partner) {
      const cid = `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
      _commissions.set(cid, {
        id: cid,
        partnerId: partner.id,
        leadId: id,
        facilityName: next.facilityName,
        monthlyValue: next.estimatedMonthlyValue,
        rate: partner.commissionRate,
        firstMonthEuro: next.estimatedMonthlyValue * partner.commissionRate,
        annualEuro: next.estimatedMonthlyValue * 12 * partner.commissionRate,
        status: "pending",
        earnedAt: next.updatedAt,
      });
    }
  }
  _leads.set(id, next);
  return next;
}

export function listCommissionsByPartner(partnerId: string): Commission[] {
  seed();
  return Array.from(_commissions.values())
    .filter((c) => c.partnerId === partnerId)
    .sort((a, b) => b.earnedAt.localeCompare(a.earnedAt));
}

interface PartnerApplication {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  tier: PartnerTier;
  message?: string;
  createdAt: string;
}

const _applications = new Map<string, PartnerApplication>();

export function registerApplicant(input: {
  companyName: string;
  contactName: string;
  email: string;
  tier: PartnerTier;
  message?: string;
}): { ok: true; id: string } {
  seed();
  const id = `app_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
  _applications.set(id, { id, createdAt: new Date().toISOString(), ...input });
  return { ok: true, id };
}

export function listApplications(): PartnerApplication[] {
  return Array.from(_applications.values()).sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

// --- Partner-Stats ---

export function partnerStats(partnerId: string) {
  seed();
  const leads = listLeadsByPartner(partnerId);
  const commissions = listCommissionsByPartner(partnerId);
  const won = leads.filter((l) => l.status === "won");
  const open = leads.filter((l) => !["won", "lost"].includes(l.status));
  const pipeline = open.reduce((sum, l) => sum + l.estimatedMonthlyValue * 12, 0);
  const annualCommission = commissions.reduce((s, c) => s + c.annualEuro, 0);
  const pendingPayout = commissions.filter((c) => c.status === "pending").reduce((s, c) => s + c.firstMonthEuro, 0);
  return {
    leads: leads.length,
    openLeads: open.length,
    wonLeads: won.length,
    pipelineEuro: pipeline,
    annualCommissionEuro: annualCommission,
    pendingPayoutEuro: pendingPayout,
  };
}
