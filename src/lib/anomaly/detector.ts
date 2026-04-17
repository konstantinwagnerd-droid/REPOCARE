import type { AnomalyEvent, AnomalyFinding, AnomalyRule } from "./types";
import { defaultRules } from "./rules";
import { buildBaselines, zScore } from "./scorer";

/**
 * Scanner. Für Demo on-demand, optional setInterval.
 * Analysiert die letzten 7 Tage, Baseline aus 30 Tagen.
 */

let findings: AnomalyFinding[] = [];
let rules: AnomalyRule[] = [...defaultRules];
let idCounter = 0;

function fid(): string {
  idCounter++;
  return `fnd_${Date.now().toString(36)}_${idCounter.toString(36)}`;
}

export interface DetectorOptions {
  /** Stunden, die als "Off-Hours" gelten (inklusive). */
  offHoursStart?: number; // e.g. 22
  offHoursEnd?: number; // e.g. 6
}

export function scan(events: AnomalyEvent[], now = Date.now(), opts: DetectorOptions = {}): AnomalyFinding[] {
  const offStart = opts.offHoursStart ?? 22;
  const offEnd = opts.offHoursEnd ?? 6;
  const sevenDays = now - 7 * 86_400_000;
  const recent = events.filter((e) => e.ts >= sevenDays);
  const baselines = buildBaselines(events, now);
  const out: AnomalyFinding[] = [];

  const byUser = new Map<string, AnomalyEvent[]>();
  for (const e of recent) {
    if (!e.userId) continue;
    const arr = byUser.get(e.userId) ?? [];
    arr.push(e);
    byUser.set(e.userId, arr);
  }

  const ruleMap = new Map(rules.filter((r) => r.enabled).map((r) => [r.kind, r]));

  // Bulk delete
  if (ruleMap.has("bulk-delete")) {
    const rule = ruleMap.get("bulk-delete")!;
    for (const [userId, arr] of byUser) {
      const deletes = arr.filter((e) => e.action === "delete").sort((a, b) => a.ts - b.ts);
      for (let i = 0; i < deletes.length; i++) {
        const window = deletes.filter((d) => d.ts >= deletes[i].ts && d.ts < deletes[i].ts + rule.windowMs);
        if (window.length >= rule.threshold) {
          out.push(makeFinding("bulk-delete", rule.severity, userId, window, `Bulk-Delete: ${window.length} Löschungen in ${rule.windowMs / 60000} Min`));
          break;
        }
      }
    }
  }

  // Off-hours export
  if (ruleMap.has("off-hours-export")) {
    const rule = ruleMap.get("off-hours-export")!;
    for (const [userId, arr] of byUser) {
      const exports = arr.filter((e) => e.entityType === "export" || e.action === "export");
      const offHour = exports.filter((e) => {
        const h = new Date(e.ts).getHours();
        return offStart > offEnd ? h >= offStart || h < offEnd : h >= offStart && h < offEnd;
      });
      if (offHour.length >= rule.threshold) {
        out.push(
          makeFinding("off-hours-export", rule.severity, userId, offHour, `Export außerhalb Kernzeit (${offHour.length} Event(s))`),
        );
      }
    }
  }

  // Role escalation
  if (ruleMap.has("role-escalation")) {
    const rule = ruleMap.get("role-escalation")!;
    for (const [userId, arr] of byUser) {
      const esc = arr.filter((e) => e.entityType === "user-role" && e.action === "update");
      if (esc.length >= rule.threshold) {
        out.push(makeFinding("role-escalation", rule.severity, userId, esc, `Rolle geändert (${esc.length}x) – Privilegien-Eskalation prüfen`));
      }
    }
  }

  // Geo unusual
  if (ruleMap.has("geo-unusual")) {
    const rule = ruleMap.get("geo-unusual")!;
    for (const [userId, arr] of byUser) {
      const baseline = baselines.get(userId);
      if (!baseline || baseline.typicalCountries.size === 0) continue;
      const unusual = arr.filter((e) => e.country && !baseline.typicalCountries.has(e.country));
      if (unusual.length >= rule.threshold) {
        const countries = [...new Set(unusual.map((e) => e.country!))].join(", ");
        out.push(makeFinding("geo-unusual", rule.severity, userId, unusual, `Login aus ungewohntem Land: ${countries}`));
      }
    }
  }

  // Rapid access
  if (ruleMap.has("rapid-access")) {
    const rule = ruleMap.get("rapid-access")!;
    for (const [userId, arr] of byUser) {
      const reads = arr.filter((e) => e.action === "read" && e.entityType === "resident").sort((a, b) => a.ts - b.ts);
      for (let i = 0; i < reads.length; i++) {
        const window = reads.filter((d) => d.ts >= reads[i].ts && d.ts < reads[i].ts + rule.windowMs);
        if (window.length >= rule.threshold) {
          out.push(makeFinding("rapid-access", rule.severity, userId, window, `Serienzugriff: ${window.length} Bewohner in ${rule.windowMs / 60000} Min`));
          break;
        }
      }
    }
  }

  // Credential stuffing (by IP)
  if (ruleMap.has("credential-stuffing")) {
    const rule = ruleMap.get("credential-stuffing")!;
    const byIp = new Map<string, AnomalyEvent[]>();
    for (const e of recent) {
      if (e.action !== "login-failed" || !e.ip) continue;
      const arr = byIp.get(e.ip) ?? [];
      arr.push(e);
      byIp.set(e.ip, arr);
    }
    for (const [ip, arr] of byIp) {
      arr.sort((a, b) => a.ts - b.ts);
      for (let i = 0; i < arr.length; i++) {
        const window = arr.filter((d) => d.ts >= arr[i].ts && d.ts < arr[i].ts + rule.windowMs);
        if (window.length >= rule.threshold) {
          out.push(
            makeFinding(
              "credential-stuffing",
              rule.severity,
              undefined,
              window,
              `${window.length} fehlgeschlagene Logins von IP ${ip}`,
            ),
          );
          break;
        }
      }
    }
  }

  // Data spike via Z-score
  if (ruleMap.has("data-spike")) {
    const rule = ruleMap.get("data-spike")!;
    for (const [userId, arr] of byUser) {
      const baseline = baselines.get(userId);
      if (!baseline || baseline.sampleDays < 3) continue;
      const todayCount = arr.filter((e) => e.ts >= now - 86_400_000).length;
      const z = zScore(todayCount, baseline);
      if (z > rule.threshold) {
        out.push({
          ...makeFinding("data-spike", rule.severity, userId, arr.slice(-10), `Aktivität ${todayCount} (Baseline Ø ${baseline.meanDaily.toFixed(1)}). Z=${z.toFixed(2)}`),
          zScore: z,
        });
      }
    }
  }

  // Permission overuse (variety of entities)
  if (ruleMap.has("permission-overuse")) {
    const rule = ruleMap.get("permission-overuse")!;
    for (const [userId, arr] of byUser) {
      arr.sort((a, b) => a.ts - b.ts);
      for (let i = 0; i < arr.length; i++) {
        const window = arr.filter((d) => d.ts >= arr[i].ts && d.ts < arr[i].ts + rule.windowMs);
        const entities = new Set(window.map((e) => `${e.entityType}:${e.id}`));
        if (entities.size >= rule.threshold) {
          out.push(makeFinding("permission-overuse", rule.severity, userId, window, `Zugriff auf ${entities.size} Entitäten in ${rule.windowMs / 60000} Min`));
          break;
        }
      }
    }
  }

  // Dormant reactivation
  if (ruleMap.has("dormant-reactivation")) {
    const rule = ruleMap.get("dormant-reactivation")!;
    for (const [userId, arr] of byUser) {
      const logins = arr.filter((e) => e.action === "login").sort((a, b) => a.ts - b.ts);
      if (logins.length < 2) continue;
      for (let i = 1; i < logins.length; i++) {
        const gapDays = (logins[i].ts - logins[i - 1].ts) / 86_400_000;
        if (gapDays >= rule.threshold) {
          out.push(
            makeFinding(
              "dormant-reactivation",
              rule.severity,
              userId,
              [logins[i]],
              `Reaktivierung nach ${Math.round(gapDays)} Tagen Inaktivität`,
            ),
          );
          break;
        }
      }
    }
  }

  // After-hours login
  if (ruleMap.has("after-hours-login")) {
    const rule = ruleMap.get("after-hours-login")!;
    for (const [userId, arr] of byUser) {
      const baseline = baselines.get(userId);
      const logins = arr.filter((e) => e.action === "login");
      const unusual = logins.filter((e) => {
        const h = new Date(e.ts).getHours();
        if (baseline && baseline.typicalHours.size > 0) return !baseline.typicalHours.has(h);
        return h >= 22 || h < 6;
      });
      if (unusual.length >= rule.threshold) {
        out.push(makeFinding("after-hours-login", rule.severity, userId, unusual, `${unusual.length} Login(s) außerhalb typischer Stunden`));
      }
    }
  }

  findings = [...out, ...findings].slice(0, 500);
  return out;
}

function makeFinding(
  kind: AnomalyFinding["kind"],
  severity: AnomalyFinding["severity"],
  userId: string | undefined,
  events: AnomalyEvent[],
  summary: string,
): AnomalyFinding {
  return {
    id: fid(),
    kind,
    severity,
    userId,
    title: titleFor(kind),
    summary,
    eventIds: events.map((e) => e.id),
    detectedAt: Date.now(),
    acknowledged: false,
    recommendedAction: recommendationFor(kind),
  };
}

function titleFor(kind: AnomalyFinding["kind"]): string {
  const map: Record<AnomalyFinding["kind"], string> = {
    "bulk-delete": "Massenhaftes Löschen erkannt",
    "off-hours-export": "Export außerhalb der Kernzeit",
    "role-escalation": "Rollen-Eskalation",
    "geo-unusual": "Login aus neuem Land",
    "rapid-access": "Schneller Serienzugriff",
    "credential-stuffing": "Credential Stuffing",
    "data-spike": "Aktivitäts-Spike",
    "permission-overuse": "Permission-Übernutzung",
    "dormant-reactivation": "Reaktivierung ruhendes Konto",
    "after-hours-login": "Login außerhalb typischer Zeiten",
  };
  return map[kind];
}

function recommendationFor(kind: AnomalyFinding["kind"]): string {
  const map: Record<AnomalyFinding["kind"], string> = {
    "bulk-delete": "Sessions des Users invalidieren, Delete-Operation blockieren, Rücksprache mit User.",
    "off-hours-export": "Export-Berechtigung temporär entziehen, Export-Blockade aktivieren.",
    "role-escalation": "Änderung review-en, ggf. zurücksetzen, PDL informieren.",
    "geo-unusual": "User kontaktieren (2-Faktor prüfen), Login-History durchgehen.",
    "rapid-access": "Rate-Limit temporär aktivieren, Nutzer auf Sinnhaftigkeit prüfen.",
    "credential-stuffing": "IP blockieren, 2FA erzwingen, Passwortrotation empfehlen.",
    "data-spike": "User kontaktieren, Auftrag prüfen, Audit-Detail einsehen.",
    "permission-overuse": "Rollen-Review, least privilege anwenden.",
    "dormant-reactivation": "Identität verifizieren, Passwort-Reset empfehlen.",
    "after-hours-login": "Nachfrage beim User, 2FA aktivieren.",
  };
  return map[kind];
}

export const detectorStore = {
  list(): AnomalyFinding[] {
    return findings;
  },
  acknowledge(id: string, by: string): boolean {
    const f = findings.find((x) => x.id === id);
    if (!f) return false;
    f.acknowledged = true;
    f.acknowledgedBy = by;
    f.acknowledgedAt = Date.now();
    return true;
  },
  rules(): AnomalyRule[] {
    return rules;
  },
  saveRules(next: AnomalyRule[]): void {
    rules = next;
  },
  _reset(): void {
    findings = [];
    rules = [...defaultRules];
  },
};
