import { pgTable, text, timestamp, integer, uuid, jsonb, pgEnum, boolean, real } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const roleEnum = pgEnum("role", ["admin", "pdl", "pflegekraft", "angehoeriger"]);
export const planEnum = pgEnum("plan", ["starter", "professional", "enterprise"]);
export const shiftEnum = pgEnum("shift", ["frueh", "spaet", "nacht"]);
export const carePlanStatusEnum = pgEnum("care_plan_status", ["offen", "laufend", "erledigt", "pausiert"]);
export const marStatusEnum = pgEnum("mar_status", ["geplant", "verabreicht", "verweigert", "ausgefallen"]);
export const incidentSeverityEnum = pgEnum("incident_severity", ["niedrig", "mittel", "hoch", "kritisch"]);
export const woundStageEnum = pgEnum("wound_stage", ["grad_1", "grad_2", "grad_3", "grad_4", "verheilt"]);

export const tenants = pgTable("tenants", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  address: text("address"),
  plan: planEnum("plan").notNull().default("professional"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: roleEnum("role").notNull().default("pflegekraft"),
  fullName: text("full_name").notNull(),
  emailVerified: timestamp("email_verified"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const residents = pgTable("residents", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  fullName: text("full_name").notNull(),
  birthdate: timestamp("birthdate").notNull(),
  pflegegrad: integer("pflegegrad").notNull(),
  room: text("room").notNull(),
  station: text("station").notNull().default("Station A"),
  admissionDate: timestamp("admission_date").notNull(),
  diagnoses: jsonb("diagnoses_json").$type<string[]>().default([]),
  allergies: jsonb("allergies_json").$type<string[]>().default([]),
  emergencyContact: jsonb("emergency_contact_json").$type<{ name: string; phone: string; relation: string }>(),
  primaryFamilyUserId: uuid("primary_family_user_id"),
  wellbeingScore: integer("wellbeing_score").default(7),
  deletedAt: timestamp("deleted_at"),
  deletionReason: text("deletion_reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const dsgvoRequestStatusEnum = pgEnum("dsgvo_request_status", ["offen", "in_pruefung", "abgelehnt_aufbewahrungspflicht", "erledigt"]);
export const dsgvoRequestTypeEnum = pgEnum("dsgvo_request_type", ["auskunft", "loeschung", "einschraenkung", "uebertragung"]);

export const dsgvoRequests = pgTable("dsgvo_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  residentId: uuid("resident_id").references(() => residents.id, { onDelete: "cascade" }).notNull(),
  type: dsgvoRequestTypeEnum("type").notNull(),
  status: dsgvoRequestStatusEnum("status").notNull().default("offen"),
  requestedBy: text("requested_by").notNull(),
  reason: text("reason"),
  decisionNote: text("decision_note"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  resolvedAt: timestamp("resolved_at"),
});

export const exportRecords = pgTable("export_records", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => users.id),
  kind: text("kind").notNull(),
  residentId: uuid("resident_id"),
  hash: text("hash").notNull(),
  filename: text("filename").notNull(),
  recipient: text("recipient"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const sisAssessments = pgTable("sis_assessments", {
  id: uuid("id").defaultRandom().primaryKey(),
  residentId: uuid("resident_id").references(() => residents.id, { onDelete: "cascade" }).notNull(),
  themenfeld1: jsonb("themenfeld_1").$type<{ finding: string; resources: string; needs: string }>(),
  themenfeld2: jsonb("themenfeld_2").$type<{ finding: string; resources: string; needs: string }>(),
  themenfeld3: jsonb("themenfeld_3").$type<{ finding: string; resources: string; needs: string }>(),
  themenfeld4: jsonb("themenfeld_4").$type<{ finding: string; resources: string; needs: string }>(),
  themenfeld5: jsonb("themenfeld_5").$type<{ finding: string; resources: string; needs: string }>(),
  themenfeld6: jsonb("themenfeld_6").$type<{ finding: string; resources: string; needs: string }>(),
  risikoMatrix: jsonb("risiko_matrix").$type<Record<"R1" | "R2" | "R3" | "R4" | "R5" | "R6" | "R7", { level: "keins" | "niedrig" | "mittel" | "hoch"; note: string }>>(),
  createdBy: uuid("created_by").references(() => users.id),
  version: integer("version").notNull().default(1),
  previousVersionHash: text("previous_version_hash"),
  isCurrent: boolean("is_current").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const carePlans = pgTable("care_plans", {
  id: uuid("id").defaultRandom().primaryKey(),
  residentId: uuid("resident_id").references(() => residents.id, { onDelete: "cascade" }).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  frequency: text("frequency").notNull(),
  responsibleRole: roleEnum("responsible_role").notNull().default("pflegekraft"),
  status: carePlanStatusEnum("status").notNull().default("offen"),
  dueDate: timestamp("due_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const careReports = pgTable("care_reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  residentId: uuid("resident_id").references(() => residents.id, { onDelete: "cascade" }).notNull(),
  authorId: uuid("author_id").references(() => users.id).notNull(),
  shift: shiftEnum("shift").notNull(),
  content: text("content").notNull(),
  aiStructured: jsonb("ai_structured_json").$type<{ summary: string; vitals: string[]; actions: string[]; concerns: string[] }>(),
  sisTags: jsonb("sis_tags_json").$type<string[]>().default([]),
  version: integer("version").notNull().default(1),
  previousVersionHash: text("previous_version_hash"),
  signatureHash: text("signature_hash"),
  signedAt: timestamp("signed_at"),
  isCurrent: boolean("is_current").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const vitalSigns = pgTable("vital_signs", {
  id: uuid("id").defaultRandom().primaryKey(),
  residentId: uuid("resident_id").references(() => residents.id, { onDelete: "cascade" }).notNull(),
  type: text("type").notNull(),
  valueNumeric: real("value_numeric"),
  valueText: text("value_text"),
  recordedAt: timestamp("recorded_at").notNull(),
  recordedBy: uuid("recorded_by").references(() => users.id),
});

export const medications = pgTable("medications", {
  id: uuid("id").defaultRandom().primaryKey(),
  residentId: uuid("resident_id").references(() => residents.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  dosage: text("dosage").notNull(),
  frequency: jsonb("frequency_json").$type<{ times: string[]; days: string[] }>(),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  prescribedBy: text("prescribed_by"),
});

export const medicationAdministrations = pgTable("medication_administrations", {
  id: uuid("id").defaultRandom().primaryKey(),
  medicationId: uuid("medication_id").references(() => medications.id, { onDelete: "cascade" }).notNull(),
  scheduledAt: timestamp("scheduled_at").notNull(),
  administeredAt: timestamp("administered_at"),
  administeredBy: uuid("administered_by").references(() => users.id),
  status: marStatusEnum("status").notNull().default("geplant"),
  notes: text("notes"),
});

export const wounds = pgTable("wounds", {
  id: uuid("id").defaultRandom().primaryKey(),
  residentId: uuid("resident_id").references(() => residents.id, { onDelete: "cascade" }).notNull(),
  location: text("location").notNull(),
  type: text("type").notNull(),
  stage: woundStageEnum("stage").notNull(),
  openedAt: timestamp("opened_at").notNull(),
  closedAt: timestamp("closed_at"),
});

export const woundObservations = pgTable("wound_observations", {
  id: uuid("id").defaultRandom().primaryKey(),
  woundId: uuid("wound_id").references(() => wounds.id, { onDelete: "cascade" }).notNull(),
  observation: text("observation").notNull(),
  photoUrl: text("photo_url"),
  recordedAt: timestamp("recorded_at").defaultNow().notNull(),
  recordedBy: uuid("recorded_by").references(() => users.id),
});

export const incidents = pgTable("incidents", {
  id: uuid("id").defaultRandom().primaryKey(),
  residentId: uuid("resident_id").references(() => residents.id, { onDelete: "cascade" }).notNull(),
  type: text("type").notNull(),
  severity: incidentSeverityEnum("severity").notNull(),
  description: text("description").notNull(),
  occurredAt: timestamp("occurred_at").notNull(),
  reportedBy: uuid("reported_by").references(() => users.id),
});

export const riskScores = pgTable("risk_scores", {
  id: uuid("id").defaultRandom().primaryKey(),
  residentId: uuid("resident_id").references(() => residents.id, { onDelete: "cascade" }).notNull(),
  type: text("type").notNull(),
  score: real("score").notNull(),
  computedAt: timestamp("computed_at").defaultNow().notNull(),
  modelVersion: text("model_version").default("v1.0"),
});

export const auditLog = pgTable("audit_log", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => users.id),
  entityType: text("entity_type").notNull(),
  entityId: text("entity_id").notNull(),
  action: text("action").notNull(),
  before: jsonb("before_json"),
  after: jsonb("after_json"),
  ip: text("ip"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const shifts = pgTable("shifts", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  startsAt: timestamp("starts_at").notNull(),
  endsAt: timestamp("ends_at").notNull(),
  station: text("station").notNull(),
});

export const familyMessages = pgTable("family_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  residentId: uuid("resident_id").references(() => residents.id, { onDelete: "cascade" }).notNull(),
  fromUserId: uuid("from_user_id").references(() => users.id).notNull(),
  toRole: roleEnum("to_role").notNull().default("pflegekraft"),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const tenantsRelations = relations(tenants, ({ many }) => ({
  users: many(users),
  residents: many(residents),
}));

export const residentsRelations = relations(residents, ({ one, many }) => ({
  tenant: one(tenants, { fields: [residents.tenantId], references: [tenants.id] }),
  sisAssessments: many(sisAssessments),
  carePlans: many(carePlans),
  careReports: many(careReports),
  vitalSigns: many(vitalSigns),
  medications: many(medications),
  wounds: many(wounds),
  incidents: many(incidents),
  riskScores: many(riskScores),
}));

export const usersRelations = relations(users, ({ one }) => ({
  tenant: one(tenants, { fields: [users.tenantId], references: [tenants.id] }),
}));

// ============================================================================
// DACH COMPETITIVE GAP-CLOSE (2026-04-18)
// Siehe docs/competitor-analysis/GAP-ANALYSIS.md fuer Priorisierung.
// Tabellen bilden Feature-Paritaet mit Medifox/Vivendi/Senso/Novatec ab.
// ============================================================================

// DNQP Expertenstandards (Deutsches Netzwerk fuer Qualitaetsentwicklung in der Pflege)
// 10 Standards mit je ~6 Themenkomplexen. Quelle: DNQP / Hochschule Osnabrueck.
export const dnqpStandardEnum = pgEnum("dnqp_standard", [
  "sturzprophylaxe",
  "dekubitusprophylaxe",
  "schmerzmanagement_akut",
  "schmerzmanagement_chronisch",
  "ernaehrungsmanagement",
  "kontinenzfoerderung",
  "entlassungsmanagement",
  "wundversorgung_chronisch",
  "demenz",
  "mundgesundheit",
  "beziehungsgestaltung",
]);

export const dnqpAssessments = pgTable("dnqp_assessments", {
  id: uuid("id").defaultRandom().primaryKey(),
  residentId: uuid("resident_id").references(() => residents.id, { onDelete: "cascade" }).notNull(),
  standard: dnqpStandardEnum("standard").notNull(),
  // Themenkomplexe des jeweiligen Standards (z.B. bei Sturz: Assessment, Information,
  // Interventionen, Umgebungsanpassung, Evaluation, Dokumentation)
  sections: jsonb("sections_json").$type<Record<string, { finding: string; measure: string; evaluation: string }>>(),
  // Validierte Score-Skalen: Braden (Dekubitus), Tinetti (Sturz), MNA (Ernaehrung), NRS/VAS (Schmerz)
  scoreName: text("score_name"),
  scoreValue: real("score_value"),
  riskLevel: text("risk_level"), // niedrig/mittel/hoch
  recommendedMeasures: jsonb("recommended_measures_json").$type<string[]>().default([]),
  assessedBy: uuid("assessed_by").references(() => users.id),
  assessedAt: timestamp("assessed_at").defaultNow().notNull(),
  nextReviewDue: timestamp("next_review_due"),
});

// NANDA-I Pflegediagnosen im PES-Schema: Problem, Aetiologie, Symptome
// Quelle: NANDA International 2021-2023 Taxonomie II.
export const nandaDiagnoses = pgTable("nanda_diagnoses", {
  id: uuid("id").defaultRandom().primaryKey(),
  residentId: uuid("resident_id").references(() => residents.id, { onDelete: "cascade" }).notNull(),
  code: text("code").notNull(), // z.B. "00155" Sturzgefahr
  label: text("label").notNull(),
  problem: text("problem").notNull(),
  etiology: text("etiology").notNull(), // beeinflussende Faktoren
  symptoms: jsonb("symptoms_json").$type<string[]>().default([]),
  priority: integer("priority").notNull().default(3), // 1=hoch .. 5=niedrig
  status: text("status").notNull().default("aktiv"), // aktiv/geloest/ruht
  resolvedAt: timestamp("resolved_at"),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// NIC Nursing Interventions Classification + NOC Nursing Outcomes Classification
// Quelle: University of Iowa College of Nursing. Bibliothek fuer Interventionen/Outcomes.
export const nicInterventions = pgTable("nic_interventions", {
  id: uuid("id").defaultRandom().primaryKey(),
  diagnosisId: uuid("diagnosis_id").references(() => nandaDiagnoses.id, { onDelete: "cascade" }).notNull(),
  nicCode: text("nic_code").notNull(), // z.B. "6490" Sturzpraevention
  nicLabel: text("nic_label").notNull(),
  activities: jsonb("activities_json").$type<string[]>().default([]),
  frequency: text("frequency"),
  nocCode: text("noc_code"), // Ziel-Outcome
  nocLabel: text("noc_label"),
  targetScore: integer("target_score"), // 1-5 Likert
  currentScore: integer("current_score"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Dienstplan-Qualifikations-Matrix
export const staffQualifications = pgTable("staff_qualifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  qualification: text("qualification").notNull(), // DGKP, PFA, PA, Azubi, Praktikant, Hilfskraft
  validFrom: timestamp("valid_from"),
  validUntil: timestamp("valid_until"),
  certificateUrl: text("certificate_url"),
});

export const shiftRequirements = pgTable("shift_requirements", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  station: text("station").notNull(),
  shift: shiftEnum("shift").notNull(),
  minFachkraefte: integer("min_fachkraefte").notNull().default(1),
  minHilfskraefte: integer("min_hilfskraefte").notNull().default(0),
  minAzubis: integer("min_azubis").notNull().default(0),
});

// AMTS (Arzneimittel-Therapie-Sicherheit). Quelle: §31a SGB V, Fachinformationen ABDA/MMI.
export const medicationInteractions = pgTable("medication_interactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  residentId: uuid("resident_id").references(() => residents.id, { onDelete: "cascade" }).notNull(),
  medAId: uuid("med_a_id").references(() => medications.id, { onDelete: "cascade" }).notNull(),
  medBId: uuid("med_b_id").references(() => medications.id, { onDelete: "cascade" }),
  severity: text("severity").notNull(), // kontraindiziert / schwerwiegend / moderat / geringfuegig
  mechanism: text("mechanism"),
  recommendation: text("recommendation").notNull(),
  // Auch Doppelverordnung / Allergie-Kontra / Dosis-Warnung
  kind: text("kind").notNull().default("interaktion"),
  detectedAt: timestamp("detected_at").defaultNow().notNull(),
  acknowledgedBy: uuid("acknowledged_by").references(() => users.id),
  acknowledgedAt: timestamp("acknowledged_at"),
});

// Wund-Doku: Vermessung L x B x T mit Typ-Klassifikation (WCS Wundklassifikation)
export const woundMeasurements = pgTable("wound_measurements", {
  id: uuid("id").defaultRandom().primaryKey(),
  woundId: uuid("wound_id").references(() => wounds.id, { onDelete: "cascade" }).notNull(),
  lengthMm: real("length_mm").notNull(),
  widthMm: real("width_mm").notNull(),
  depthMm: real("depth_mm"),
  areaMm2: real("area_mm2"),
  exudate: text("exudate"), // kein/gering/maessig/stark
  woundBed: text("wound_bed"), // granulation/fibrin/nekrose/gemischt
  edges: text("edges"), // vital/mazeriert/unterminiert
  surrounding: text("surrounding"),
  odor: boolean("odor").default(false),
  painScore: integer("pain_score"), // NRS 0-10
  photoUrl: text("photo_url"),
  measuredAt: timestamp("measured_at").defaultNow().notNull(),
  measuredBy: uuid("measured_by").references(() => users.id),
});

// Aufnahme-Assistent: strukturierter 7-Tage-Einzugsprozess
export const admissionChecklists = pgTable("admission_checklists", {
  id: uuid("id").defaultRandom().primaryKey(),
  residentId: uuid("resident_id").references(() => residents.id, { onDelete: "cascade" }).notNull(),
  tasks: jsonb("tasks_json").$type<Array<{
    day: number; // 0-7
    task: string;
    category: string; // dokumente/medizin/pflege/sozial/recht
    done: boolean;
    doneAt?: string;
    doneBy?: string;
    note?: string;
  }>>().default([]),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

// Leistungsnachweis — SGB XI DE + Pflegegeld AT
export const serviceRecords = pgTable("service_records", {
  id: uuid("id").defaultRandom().primaryKey(),
  residentId: uuid("resident_id").references(() => residents.id, { onDelete: "cascade" }).notNull(),
  serviceCode: text("service_code").notNull(), // SGB XI §36/§37/§37b/§39c/§45a/§45b bzw. AT-Leistung
  serviceLabel: text("service_label").notNull(),
  quantity: real("quantity").notNull().default(1),
  unit: text("unit").notNull().default("Einsatz"),
  performedAt: timestamp("performed_at").notNull(),
  performedBy: uuid("performed_by").references(() => users.id).notNull(),
  signatureHash: text("signature_hash"),
  billingStatus: text("billing_status").notNull().default("offen"), // offen/abgerechnet/storniert
  jurisdiction: text("jurisdiction").notNull().default("DE"), // DE/AT
});

// Pflegevisite — strukturiertes Template nach PDL-Quartals-Visite
export const careVisits = pgTable("care_visits", {
  id: uuid("id").defaultRandom().primaryKey(),
  residentId: uuid("resident_id").references(() => residents.id, { onDelete: "cascade" }).notNull(),
  visitedBy: uuid("visited_by").references(() => users.id).notNull(),
  visitDate: timestamp("visit_date").defaultNow().notNull(),
  // Dimensionen: Struktur, Prozess, Ergebnis (nach Donabedian) + Bewohner-Erleben
  structureFindings: text("structure_findings"),
  processFindings: text("process_findings"),
  outcomeFindings: text("outcome_findings"),
  residentFeedback: text("resident_feedback"),
  actionsAgreed: jsonb("actions_agreed_json").$type<Array<{ action: string; dueDate: string; owner: string }>>().default([]),
  overallRating: integer("overall_rating"), // 1-5
  nextVisitDue: timestamp("next_visit_due"),
});

// Biographie nach DNQP / IzEB (Institut zur Erforschung biographischer Pflege)
export const biographies = pgTable("biographies", {
  id: uuid("id").defaultRandom().primaryKey(),
  residentId: uuid("resident_id").references(() => residents.id, { onDelete: "cascade" }).notNull().unique(),
  // 10 Kapitel: Herkunft, Kindheit, Schule/Ausbildung, Beruf, Familie/Partnerschaft,
  //  Wohnen, Freizeit/Hobbys, Glauben/Werte, pragendes/Krisen, Gewohnheiten/Rituale
  chapters: jsonb("chapters_json").$type<Record<string, { text: string; lastUpdatedAt: string; source: string }>>(),
  dailyRituals: jsonb("daily_rituals_json").$type<Array<{ time: string; ritual: string }>>().default([]),
  preferences: jsonb("preferences_json").$type<{ food?: string[]; music?: string[]; activities?: string[]; dislikes?: string[] }>(),
  // Relevant bei Demenz: validierende Erinnerungsanker
  memoryAnchors: jsonb("memory_anchors_json").$type<string[]>().default([]),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// HEIMaufG (AT) — Meldung an Bewohnervertretung bei Freiheitsbeschraenkung
// Quelle: Heimaufenthaltsgesetz §3-§5 (AT). Pflicht fuer AT-Einrichtungen.
export const heimaufgMeldungen = pgTable("heimaufg_meldungen", {
  id: uuid("id").defaultRandom().primaryKey(),
  residentId: uuid("resident_id").references(() => residents.id, { onDelete: "cascade" }).notNull(),
  kind: text("kind").notNull(), // mechanisch (Gurt/Bettgitter), medikamentoes, psychisch
  reason: text("reason").notNull(),
  gelinderesMittelGeprueft: text("gelinderes_mittel_geprueft").notNull(),
  anordnungDurch: text("anordnung_durch").notNull(), // Arzt-Name
  startAt: timestamp("start_at").notNull(),
  endAt: timestamp("end_at"),
  bewohnervertretungNotified: boolean("bewohnervertretung_notified").default(false),
  notifiedAt: timestamp("notified_at"),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ============================================================================
// LLM Cost-Tracking + AMTS Flags (2026-04-18)
// ============================================================================

// Pro LLM-Request: Tokens, Kosten (in Cent als integer), Status, Fehler.
export const billingLlmUsage = pgTable("billing_llm_usage", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  userId: uuid("user_id").references(() => users.id),
  requestType: text("request_type").notNull(), // sis-structure | handover | risk-assess | ...
  model: text("model").notNull(),
  promptTokens: integer("prompt_tokens").notNull(),
  completionTokens: integer("completion_tokens").notNull(),
  costEurCents: integer("cost_eur_cents").notNull(),
  durationMs: integer("duration_ms").notNull(),
  status: text("status").notNull(), // success | error | cached | budget-exceeded
  errorMessage: text("error_message"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// AMTS: per Medikation generierte Warnungen (PRISCUS, FORTA, Interaktionen).
export const amtsFlags = pgTable("amts_flags", {
  id: uuid("id").defaultRandom().primaryKey(),
  residentId: uuid("resident_id").references(() => residents.id, { onDelete: "cascade" }).notNull(),
  medicationId: uuid("medication_id").references(() => medications.id),
  flagType: text("flag_type").notNull(), // priscus | forta-d | forta-c | interaction
  severity: text("severity").notNull(), // hoch | mittel | niedrig
  detailsJson: jsonb("details_json").notNull(),
  acknowledgedBy: uuid("acknowledged_by").references(() => users.id),
  acknowledgedAt: timestamp("acknowledged_at"),
  acknowledgementReason: text("acknowledgement_reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type BillingLlmUsage = typeof billingLlmUsage.$inferSelect;
export type AmtsFlag = typeof amtsFlags.$inferSelect;

// Pflegegeld / Pflegegrad Antragsgenerator
// DE: Antrag auf Leistungen nach SGB XI (NBA-basiert, Pflegegrade 1-5)
// AT: Antrag auf Bundespflegegeld nach BPGG (Stufen 1-7)
export const pensionApplicationTypeEnum = pgEnum("pension_application_type", [
  "de-sgb-xi",
  "at-bpgg",
]);
export const pensionApplicationStatusEnum = pgEnum("pension_application_status", [
  "draft",
  "submitted",
  "approved",
  "rejected",
]);

export const pensionApplications = pgTable("pension_applications", {
  id: uuid("id").defaultRandom().primaryKey(),
  residentId: uuid("resident_id").references(() => residents.id, { onDelete: "cascade" }).notNull(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  applicationType: pensionApplicationTypeEnum("application_type").notNull(),
  status: pensionApplicationStatusEnum("status").notNull().default("draft"),
  // Vollständige Form-Felder (auto-befüllt aus Bewohner-Daten + PDL-ergänzungen)
  formData: jsonb("form_data_json").$type<Record<string, unknown>>().default({}).notNull(),
  // Ergebnis nach Bescheid
  assignedGrade: integer("assigned_grade"), // DE: 1-5, AT: 1-7
  notes: text("notes"),
  pdfHash: text("pdf_hash"),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  submittedAt: timestamp("submitted_at"),
  statusUpdatedAt: timestamp("status_updated_at"),
});

export type PensionApplication = typeof pensionApplications.$inferSelect;
export type PensionApplicationType = (typeof pensionApplicationTypeEnum.enumValues)[number];
export type PensionApplicationStatus = (typeof pensionApplicationStatusEnum.enumValues)[number];

// ============================================================================
// WhatsApp Integration (Evolution API) — 2026-04-18
// ============================================================================
export const whatsappContacts = pgTable("whatsapp_contacts", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  residentId: uuid("resident_id").references(() => residents.id, { onDelete: "cascade" }),
  familyUserId: uuid("family_user_id").references(() => users.id, { onDelete: "set null" }),
  phone: text("phone").notNull(),
  verified: boolean("verified").default(false),
  consentGivenAt: timestamp("consent_given_at"),
  consentScope: text("consent_scope").default("critical"), // all | critical | daily
  quietHoursStart: text("quiet_hours_start").default("22:00"),
  quietHoursEnd: text("quiet_hours_end").default("07:00"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const whatsappMessages = pgTable("whatsapp_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  contactId: uuid("contact_id").references(() => whatsappContacts.id, { onDelete: "cascade" }),
  direction: text("direction").notNull(), // outbound | inbound
  eventType: text("event_type"), // incident | wellbeing | daily-report | ...
  body: text("body").notNull(),
  sentAt: timestamp("sent_at"),
  deliveredAt: timestamp("delivered_at"),
  readAt: timestamp("read_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Fallbesprechung (strukturierter Workflow)
export const caseConferences = pgTable("case_conferences", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  date: timestamp("date").notNull(),
  durationMinutes: integer("duration_minutes"),
  participantsJson: jsonb("participants_json").$type<Array<{ name: string; role: string }>>().default([]),
  residentIds: jsonb("resident_ids_json").$type<string[]>().default([]),
  agendaItemsJson: jsonb("agenda_items_json").$type<Array<{ title: string; notes?: string }>>().default([]),
  notes: text("notes"),
  actionItemsJson: jsonb("action_items_json").$type<Array<{ residentId: string; action: string; owner: string; dueDate: string; criteria: string }>>().default([]),
  summary: text("summary"),
  pdfHash: text("pdf_hash"),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type WhatsappContact = typeof whatsappContacts.$inferSelect;
export type WhatsappMessage = typeof whatsappMessages.$inferSelect;
export type CaseConference = typeof caseConferences.$inferSelect;

export type User = typeof users.$inferSelect;
export type Resident = typeof residents.$inferSelect;
export type CareReport = typeof careReports.$inferSelect;
export type VitalSign = typeof vitalSigns.$inferSelect;
export type Medication = typeof medications.$inferSelect;
export type CarePlan = typeof carePlans.$inferSelect;
export type Role = (typeof roleEnum.enumValues)[number];
export type DnqpAssessment = typeof dnqpAssessments.$inferSelect;
export type NandaDiagnosis = typeof nandaDiagnoses.$inferSelect;
export type Biography = typeof biographies.$inferSelect;

// ============================================================================
// PDL ADMIN FEATURES (2026-04-18)
// Feature 1: Kosten-Controlling — Stundensaetze + Pflegegrad-Raten + Fix-Kosten
// Feature 2: Zertifizierungs-Tracker — ISO, KTQ, NQZ, Diakonie
// Feature 3: Saved Reports — No-Code Query Builder fuer PDL
// ============================================================================

export const staffHourlyRates = pgTable("staff_hourly_rates", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  role: text("role").notNull(),
  qualification: text("qualification"),
  hourlyRateCents: integer("hourly_rate_cents").notNull(),
  validFrom: timestamp("valid_from").notNull(),
  validUntil: timestamp("valid_until"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const pflegegradRevenue = pgTable("pflegegrad_revenue", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  pflegegrad: integer("pflegegrad").notNull(),
  monthlyRevenueCents: integer("monthly_revenue_cents").notNull(),
  validFrom: timestamp("valid_from").notNull(),
  validUntil: timestamp("valid_until"),
  country: text("country").notNull().default("DE"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const fixedCosts = pgTable("fixed_costs", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  category: text("category").notNull(),
  label: text("label").notNull(),
  monthlyCostCents: integer("monthly_cost_cents").notNull(),
  validFrom: timestamp("valid_from").notNull(),
  validUntil: timestamp("valid_until"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const certifications = pgTable("certifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  certificationType: text("certification_type").notNull(),
  status: text("status").notNull(),
  awardedDate: timestamp("awarded_date"),
  expiresDate: timestamp("expires_date"),
  auditor: text("auditor"),
  certificateNumber: text("certificate_number"),
  scope: text("scope"),
  documentsJson: jsonb("documents_json").$type<Array<{ name: string; uploadedAt: string; size: number; hash: string }>>().default([]),
  nextAuditDate: timestamp("next_audit_date"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const certificationRequirements = pgTable("certification_requirements", {
  id: uuid("id").defaultRandom().primaryKey(),
  certificationId: uuid("certification_id").references(() => certifications.id, { onDelete: "cascade" }).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category"),
  status: text("status").notNull().default("offen"),
  dueDate: timestamp("due_date"),
  responsibleUserId: uuid("responsible_user_id").references(() => users.id),
  evidenceJson: jsonb("evidence_json").$type<Array<{ name: string; url?: string; note?: string }>>().default([]),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const savedReports = pgTable("saved_reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  name: text("name").notNull(),
  description: text("description"),
  entity: text("entity").notNull(),
  filtersJson: jsonb("filters_json").notNull(),
  columnsJson: jsonb("columns_json").notNull(),
  sortJson: jsonb("sort_json"),
  limitRows: integer("limit_rows").default(100),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastRunAt: timestamp("last_run_at"),
});

export type StaffHourlyRate = typeof staffHourlyRates.$inferSelect;
export type PflegegradRevenue = typeof pflegegradRevenue.$inferSelect;
export type FixedCost = typeof fixedCosts.$inferSelect;
export type Certification = typeof certifications.$inferSelect;
export type CertificationRequirement = typeof certificationRequirements.$inferSelect;

// --- Training / Schulungs-Quiz-Engine ----------------------------------------
export const trainingCategoryEnum = pgEnum("training_category", [
  "dnqp",
  "hygiene",
  "btm",
  "brandschutz",
  "dsgvo",
  "custom",
]);
export const trainingQuestionTypeEnum = pgEnum("training_question_type", [
  "single",
  "multi",
  "truefalse",
]);

export const trainingModules = pgTable("training_modules", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  title: text("title").notNull(),
  category: trainingCategoryEnum("category").notNull().default("custom"),
  description: text("description"),
  contentJson: jsonb("content_json").default({}),
  passingScore: integer("passing_score").notNull().default(80),
  durationMinutes: integer("duration_minutes").notNull().default(15),
  isMandatory: boolean("is_mandatory").notNull().default(true),
  validityMonths: integer("validity_months").notNull().default(12),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const trainingQuestions = pgTable("training_questions", {
  id: uuid("id").defaultRandom().primaryKey(),
  moduleId: uuid("module_id").references(() => trainingModules.id, { onDelete: "cascade" }).notNull(),
  question: text("question").notNull(),
  type: trainingQuestionTypeEnum("type").notNull().default("single"),
  optionsJson: jsonb("options_json").$type<string[]>().notNull().default([]),
  correctIndicesJson: jsonb("correct_indices_json").$type<number[]>().notNull().default([]),
  explanation: text("explanation"),
  orderIndex: integer("order_index").notNull().default(0),
});

export const trainingAttempts = pgTable("training_attempts", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  moduleId: uuid("module_id").references(() => trainingModules.id, { onDelete: "cascade" }).notNull(),
  startedAt: timestamp("started_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
  score: integer("score"),
  passed: boolean("passed"),
  answersJson: jsonb("answers_json").default({}),
});

export const trainingCertificates = pgTable("training_certificates", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  moduleId: uuid("module_id").references(() => trainingModules.id, { onDelete: "cascade" }).notNull(),
  attemptId: uuid("attempt_id").references(() => trainingAttempts.id, { onDelete: "cascade" }).notNull(),
  issuedAt: timestamp("issued_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
  certificateHash: text("certificate_hash").notNull(),
});

export type TrainingModule = typeof trainingModules.$inferSelect;
export type TrainingQuestion = typeof trainingQuestions.$inferSelect;
export type TrainingAttempt = typeof trainingAttempts.$inferSelect;
export type TrainingCertificate = typeof trainingCertificates.$inferSelect;

// --- E-Mail Auto-Routing -----------------------------------------------------
export const emailClassificationEnum = pgEnum("email_classification", [
  "lead",
  "application",
  "complaint",
  "support",
  "other",
]);
export const emailRuleMatchTypeEnum = pgEnum("email_rule_match_type", [
  "subject_contains",
  "body_contains",
  "from_domain",
]);

export const emailInbound = pgTable("email_inbound", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  fromEmail: text("from_email").notNull(),
  fromName: text("from_name"),
  subject: text("subject").notNull().default(""),
  bodyText: text("body_text"),
  bodyHtml: text("body_html"),
  receivedAt: timestamp("received_at").defaultNow().notNull(),
  classification: emailClassificationEnum("classification").notNull().default("other"),
  confidence: real("confidence").notNull().default(0),
  routedTo: text("routed_to"),
  notifiedAt: timestamp("notified_at"),
  metadataJson: jsonb("metadata_json").default({}),
});

export const emailRoutingRules = pgTable("email_routing_rules", {
  id: uuid("id").defaultRandom().primaryKey(),
  tenantId: uuid("tenant_id").references(() => tenants.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  matchType: emailRuleMatchTypeEnum("match_type").notNull(),
  matchValue: text("match_value").notNull(),
  classification: emailClassificationEnum("classification").notNull(),
  priority: integer("priority").notNull().default(100),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type EmailInbound = typeof emailInbound.$inferSelect;
export type EmailRoutingRule = typeof emailRoutingRules.$inferSelect;
export type EmailClassification = EmailInbound["classification"];
export type SavedReport = typeof savedReports.$inferSelect;
