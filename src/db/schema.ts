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

export type User = typeof users.$inferSelect;
export type Resident = typeof residents.$inferSelect;
export type CareReport = typeof careReports.$inferSelect;
export type VitalSign = typeof vitalSigns.$inferSelect;
export type Medication = typeof medications.$inferSelect;
export type CarePlan = typeof carePlans.$inferSelect;
export type Role = (typeof roleEnum.enumValues)[number];
