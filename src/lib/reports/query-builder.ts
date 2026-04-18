/**
 * No-Code Query Builder fuer PDL.
 *
 * Baut parameterisierte SQL-Queries aus strukturierten Input-Objekten.
 * Whitelist-basiert — NUR vordefinierte Tabellen + Spalten sind erlaubt.
 * Tenant-Scoping wird AUTOMATISCH hinzugefuegt.
 *
 * Verwendung: nur fuer SELECT-Abfragen (read-only).
 */

export type EntityKey =
  | "bewohner"
  | "mitarbeitende"
  | "pflegeberichte"
  | "incidents"
  | "audit_log"
  | "medikation";

export type Operator = "=" | "!=" | ">" | "<" | ">=" | "<=" | "contains" | "in" | "is_null" | "is_not_null";

export type Filter = {
  field: string;
  op: Operator;
  value?: string | number | string[] | null;
  logic?: "AND" | "OR"; // Verknuepfung zum vorhergehenden Filter
};

export type Sort = { field: string; dir: "asc" | "desc" };

export type QuerySpec = {
  entity: EntityKey;
  filters: Filter[];
  columns: string[];
  sort?: Sort;
  limit?: number;
};

export type FieldType = "text" | "number" | "date" | "enum" | "uuid" | "boolean";

export type FieldDef = {
  key: string;
  label: string;
  dbColumn: string; // tatsaechliche SQL-Spalte inkl. Table-Prefix bei JOINs
  type: FieldType;
  enumValues?: string[];
};

export type EntityDef = {
  key: EntityKey;
  label: string;
  table: string;
  tenantScopedVia: { column: string } | { joinTable: string; joinOn: string; tenantColumn: string };
  fields: FieldDef[];
};

export const ENTITY_DEFS: Record<EntityKey, EntityDef> = {
  bewohner: {
    key: "bewohner",
    label: "Bewohner:innen",
    table: "residents",
    tenantScopedVia: { column: "tenant_id" },
    fields: [
      { key: "full_name", label: "Name", dbColumn: "residents.full_name", type: "text" },
      { key: "birthdate", label: "Geburtsdatum", dbColumn: "residents.birthdate", type: "date" },
      { key: "age", label: "Alter (Jahre)", dbColumn: "EXTRACT(YEAR FROM AGE(residents.birthdate))::int", type: "number" },
      { key: "pflegegrad", label: "Pflegegrad", dbColumn: "residents.pflegegrad", type: "number" },
      { key: "room", label: "Zimmer", dbColumn: "residents.room", type: "text" },
      { key: "station", label: "Station", dbColumn: "residents.station", type: "text" },
      { key: "admission_date", label: "Aufnahmedatum", dbColumn: "residents.admission_date", type: "date" },
      { key: "wellbeing_score", label: "Wohlbefinden", dbColumn: "residents.wellbeing_score", type: "number" },
      { key: "deleted_at", label: "Gelöscht am", dbColumn: "residents.deleted_at", type: "date" },
    ],
  },
  mitarbeitende: {
    key: "mitarbeitende",
    label: "Mitarbeitende",
    table: "users",
    tenantScopedVia: { column: "tenant_id" },
    fields: [
      { key: "full_name", label: "Name", dbColumn: "users.full_name", type: "text" },
      { key: "email", label: "E-Mail", dbColumn: "users.email", type: "text" },
      { key: "role", label: "Rolle", dbColumn: "users.role", type: "enum", enumValues: ["admin", "pdl", "pflegekraft", "angehoeriger"] },
      { key: "created_at", label: "Angelegt am", dbColumn: "users.created_at", type: "date" },
    ],
  },
  pflegeberichte: {
    key: "pflegeberichte",
    label: "Pflegeberichte",
    table: "care_reports",
    tenantScopedVia: {
      joinTable: "residents",
      joinOn: "care_reports.resident_id = residents.id",
      tenantColumn: "residents.tenant_id",
    },
    fields: [
      { key: "content", label: "Inhalt", dbColumn: "care_reports.content", type: "text" },
      { key: "shift", label: "Schicht", dbColumn: "care_reports.shift", type: "enum", enumValues: ["frueh", "spaet", "nacht"] },
      { key: "created_at", label: "Erstellt am", dbColumn: "care_reports.created_at", type: "date" },
      { key: "signed_at", label: "Signiert am", dbColumn: "care_reports.signed_at", type: "date" },
      { key: "resident_name", label: "Bewohner:in", dbColumn: "residents.full_name", type: "text" },
    ],
  },
  incidents: {
    key: "incidents",
    label: "Incidents / Stürze",
    table: "incidents",
    tenantScopedVia: {
      joinTable: "residents",
      joinOn: "incidents.resident_id = residents.id",
      tenantColumn: "residents.tenant_id",
    },
    fields: [
      { key: "type", label: "Typ", dbColumn: "incidents.type", type: "text" },
      { key: "severity", label: "Schweregrad", dbColumn: "incidents.severity", type: "enum", enumValues: ["niedrig", "mittel", "hoch", "kritisch"] },
      { key: "description", label: "Beschreibung", dbColumn: "incidents.description", type: "text" },
      { key: "occurred_at", label: "Ereignis-Zeit", dbColumn: "incidents.occurred_at", type: "date" },
      { key: "resident_name", label: "Bewohner:in", dbColumn: "residents.full_name", type: "text" },
      { key: "pflegegrad", label: "Pflegegrad", dbColumn: "residents.pflegegrad", type: "number" },
    ],
  },
  audit_log: {
    key: "audit_log",
    label: "Audit-Log",
    table: "audit_log",
    tenantScopedVia: { column: "tenant_id" },
    fields: [
      { key: "entity_type", label: "Entität", dbColumn: "audit_log.entity_type", type: "text" },
      { key: "action", label: "Aktion", dbColumn: "audit_log.action", type: "text" },
      { key: "created_at", label: "Zeitpunkt", dbColumn: "audit_log.created_at", type: "date" },
      { key: "ip", label: "IP", dbColumn: "audit_log.ip", type: "text" },
    ],
  },
  medikation: {
    key: "medikation",
    label: "Medikation",
    table: "medications",
    tenantScopedVia: {
      joinTable: "residents",
      joinOn: "medications.resident_id = residents.id",
      tenantColumn: "residents.tenant_id",
    },
    fields: [
      { key: "name", label: "Medikament", dbColumn: "medications.name", type: "text" },
      { key: "dosage", label: "Dosierung", dbColumn: "medications.dosage", type: "text" },
      { key: "start_date", label: "Start", dbColumn: "medications.start_date", type: "date" },
      { key: "end_date", label: "Ende", dbColumn: "medications.end_date", type: "date" },
      { key: "prescribed_by", label: "Verschrieben von", dbColumn: "medications.prescribed_by", type: "text" },
      { key: "resident_name", label: "Bewohner:in", dbColumn: "residents.full_name", type: "text" },
      { key: "pflegegrad", label: "Pflegegrad", dbColumn: "residents.pflegegrad", type: "number" },
    ],
  },
};

export function listEntities(): Array<{ key: EntityKey; label: string; fields: FieldDef[] }> {
  return Object.values(ENTITY_DEFS).map((e) => ({ key: e.key, label: e.label, fields: e.fields }));
}

export class QueryBuildError extends Error {}

/**
 * Baut eine parameterisierte SQL-Query. Gibt { sql, params } zurueck.
 * $1 ist IMMER der tenantId (automatisch prepended).
 */
export function buildQuery(spec: QuerySpec, tenantId: string): { sql: string; params: unknown[] } {
  const entity = ENTITY_DEFS[spec.entity];
  if (!entity) throw new QueryBuildError(`Unknown entity: ${spec.entity}`);

  const fieldMap = new Map(entity.fields.map((f) => [f.key, f]));

  // Columns
  const columns = spec.columns.length > 0 ? spec.columns : entity.fields.map((f) => f.key);
  const selectExprs: string[] = [];
  for (const c of columns) {
    const f = fieldMap.get(c);
    if (!f) throw new QueryBuildError(`Unknown field: ${c}`);
    selectExprs.push(`${f.dbColumn} AS "${f.key}"`);
  }

  // FROM + JOIN
  let fromClause = entity.table;
  if ("joinTable" in entity.tenantScopedVia) {
    fromClause = `${entity.table} JOIN ${entity.tenantScopedVia.joinTable} ON ${entity.tenantScopedVia.joinOn}`;
  }

  // WHERE — tenant scoping always $1
  const params: unknown[] = [tenantId];
  const tenantCol =
    "column" in entity.tenantScopedVia
      ? `${entity.table}.${entity.tenantScopedVia.column}`
      : entity.tenantScopedVia.tenantColumn;
  const whereParts: string[] = [`${tenantCol} = $1`];

  for (let i = 0; i < spec.filters.length; i++) {
    const filter = spec.filters[i];
    const f = fieldMap.get(filter.field);
    if (!f) throw new QueryBuildError(`Unknown filter field: ${filter.field}`);
    const logic = i === 0 ? "AND" : (filter.logic ?? "AND");

    let frag: string;
    switch (filter.op) {
      case "is_null":
        frag = `${f.dbColumn} IS NULL`;
        break;
      case "is_not_null":
        frag = `${f.dbColumn} IS NOT NULL`;
        break;
      case "contains":
        params.push(`%${String(filter.value ?? "")}%`);
        frag = `${f.dbColumn}::text ILIKE $${params.length}`;
        break;
      case "in": {
        if (!Array.isArray(filter.value) || filter.value.length === 0) {
          throw new QueryBuildError("'in' requires array value");
        }
        const placeholders = filter.value.map((v) => {
          params.push(coerceValue(f.type, v));
          return `$${params.length}`;
        });
        frag = `${f.dbColumn} IN (${placeholders.join(", ")})`;
        break;
      }
      case "=":
      case "!=":
      case ">":
      case "<":
      case ">=":
      case "<=":
        params.push(coerceValue(f.type, filter.value));
        frag = `${f.dbColumn} ${filter.op} $${params.length}`;
        break;
      default:
        throw new QueryBuildError(`Unknown operator: ${String(filter.op)}`);
    }
    whereParts.push(`${logic} (${frag})`);
  }

  let sqlStr = `SELECT ${selectExprs.join(", ")} FROM ${fromClause} WHERE ${whereParts.join(" ")}`;

  if (spec.sort) {
    const sortField = fieldMap.get(spec.sort.field);
    if (!sortField) throw new QueryBuildError(`Unknown sort field: ${spec.sort.field}`);
    const dir = spec.sort.dir === "desc" ? "DESC" : "ASC";
    sqlStr += ` ORDER BY ${sortField.dbColumn} ${dir}`;
  }

  const limit = Math.min(Math.max(spec.limit ?? 100, 1), 1000);
  sqlStr += ` LIMIT ${limit}`;

  return { sql: sqlStr, params };
}

function coerceValue(type: FieldType, v: unknown): unknown {
  if (v === null || v === undefined) return null;
  switch (type) {
    case "number":
      return typeof v === "number" ? v : Number(v);
    case "date":
      return v instanceof Date ? v : new Date(String(v));
    case "boolean":
      return v === true || v === "true" || v === 1 || v === "1";
    default:
      return String(v);
  }
}
