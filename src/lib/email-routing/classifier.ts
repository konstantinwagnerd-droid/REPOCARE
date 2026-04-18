/**
 * E-Mail Auto-Routing Classifier.
 *
 * Regex-basierte Klassifikation fuer eingehende E-Mails. Kein LLM noetig,
 * fuer die Grundlast ausreichend. Rules aus DB koennen Default-Matching
 * ueberschreiben (hoechste `priority` gewinnt).
 *
 * Kategorien:
 *  - lead        -> Nex (Sales)
 *  - application -> Aria (HR)
 *  - complaint   -> Zara (CS)
 *  - support     -> Zara (CS)
 *  - other       -> allgemeiner Posteingang
 */

export type EmailClassification = "lead" | "application" | "complaint" | "support" | "other";
export type RuleMatchType = "subject_contains" | "body_contains" | "from_domain";

export type RoutingRule = {
  id: string;
  matchType: RuleMatchType;
  matchValue: string;
  classification: EmailClassification;
  priority: number;
  active: boolean;
};

export type ClassificationInput = {
  fromEmail: string;
  subject: string;
  bodyText: string;
  attachments?: Array<{ filename?: string | null }>;
};

export type ClassificationResult = {
  classification: EmailClassification;
  confidence: number; // 0..1
  routedTo: string; // "nex" | "aria" | "zara" | "inbox"
  matchedRule?: string;
  reason: string;
};

const AGENT_BY_CLASS: Record<EmailClassification, string> = {
  lead: "nex",
  application: "aria",
  complaint: "zara",
  support: "zara",
  other: "inbox",
};

// --- Keyword-Sets (case-insensitive) ------------------------------------------
const LEAD_KEYWORDS = [
  "interesse", "demo", "angebot", "preise", "kosten", "informationen zu",
  "anfrage", "vorstellung", "termin", "beratung", "testzugang",
];
const APPLICATION_KEYWORDS = [
  "bewerbung", "initiativbewerbung", "lebenslauf", "stelle", "praktikum",
  "bewerbe mich", "arbeitsplatz", "stellenangebot", "stellenanzeige",
];
const COMPLAINT_KEYWORDS = [
  "beschwerde", "unzufrieden", "kritik", "mangel", "reklamiere", "reklamation",
  "fordere", "beanstande", "inakzeptabel", "enttaeuscht", "skandal",
];
const SUPPORT_KEYWORDS = [
  "problem", "funktioniert nicht", "fehler", "login", "passwort", "fehlermeldung",
  "geht nicht", "buggy", "absturz", "hilfe", "support",
];

function containsAny(haystack: string, needles: string[]): { matched: boolean; which: string | null; count: number } {
  let count = 0;
  let which: string | null = null;
  for (const n of needles) {
    if (haystack.includes(n)) {
      count += 1;
      if (!which) which = n;
    }
  }
  return { matched: count > 0, which, count };
}

function normalise(s: string | null | undefined): string {
  return (s ?? "").toLowerCase();
}

/**
 * Hauptklassifikations-Funktion.
 *  1. Custom-Rules zuerst (hoechste Prio gewinnt)
 *  2. Keyword-basierte Default-Klassifikation
 */
export function classifyEmail(input: ClassificationInput, rules: RoutingRule[] = []): ClassificationResult {
  const subject = normalise(input.subject);
  const body = normalise(input.bodyText);
  const combined = subject + " \n " + body;
  const fromDomain = (input.fromEmail.split("@")[1] ?? "").toLowerCase();

  // 1. Custom Rules (sortiert absteigend nach priority; nur aktive)
  const sortedRules = rules
    .filter((r) => r.active)
    .sort((a, b) => b.priority - a.priority);

  for (const rule of sortedRules) {
    const value = rule.matchValue.toLowerCase();
    let hit = false;
    if (rule.matchType === "subject_contains" && subject.includes(value)) hit = true;
    if (rule.matchType === "body_contains" && body.includes(value)) hit = true;
    if (rule.matchType === "from_domain" && fromDomain === value) hit = true;

    if (hit) {
      return {
        classification: rule.classification,
        confidence: 0.95,
        routedTo: AGENT_BY_CLASS[rule.classification],
        matchedRule: rule.id,
        reason: `Regel "${rule.matchType}=${rule.matchValue}" getroffen`,
      };
    }
  }

  // 2. Attachment-Heuristik fuer Bewerbung (PDF mit "cv" oder "lebenslauf")
  const hasCvAttachment = (input.attachments ?? []).some((a) => {
    const fn = (a.filename ?? "").toLowerCase();
    return fn.endsWith(".pdf") && (fn.includes("cv") || fn.includes("lebenslauf") || fn.includes("bewerbung"));
  });
  if (hasCvAttachment) {
    return {
      classification: "application",
      confidence: 0.85,
      routedTo: AGENT_BY_CLASS.application,
      reason: "PDF-Anhang mit 'cv'/'lebenslauf'/'bewerbung' erkannt",
    };
  }

  // 3. Keyword-Matching (Score: Anzahl Treffer)
  const leadHits = containsAny(combined, LEAD_KEYWORDS);
  const applicationHits = containsAny(combined, APPLICATION_KEYWORDS);
  const complaintHits = containsAny(combined, COMPLAINT_KEYWORDS);
  const supportHits = containsAny(combined, SUPPORT_KEYWORDS);

  // Beschwerde bevorzugen, wenn Sentiment-Signale vorhanden
  const exclamationDensity = (body.match(/!/g) ?? []).length;
  const complaintSentiment = exclamationDensity >= 3 ? 1 : 0;
  const complaintScore = complaintHits.count + complaintSentiment;

  type Candidate = { cls: EmailClassification; score: number; reason: string };
  const candidates: Candidate[] = [
    { cls: "complaint", score: complaintScore, reason: `${complaintHits.count} Keyword(s), !-Dichte ${exclamationDensity}` },
    { cls: "application", score: applicationHits.count, reason: `${applicationHits.count} Bewerbungs-Keyword(s)` },
    { cls: "lead", score: leadHits.count, reason: `${leadHits.count} Lead-Keyword(s)` },
    { cls: "support", score: supportHits.count, reason: `${supportHits.count} Support-Keyword(s)` },
  ];

  candidates.sort((a, b) => b.score - a.score);
  const best = candidates[0];

  if (best.score === 0) {
    return {
      classification: "other",
      confidence: 0.3,
      routedTo: AGENT_BY_CLASS.other,
      reason: "Keine Keywords erkannt",
    };
  }

  // Confidence: heuristisch aus Trefferanzahl (max 5 normiert)
  const confidence = Math.min(0.95, 0.5 + best.score * 0.12);

  return {
    classification: best.cls,
    confidence: Number(confidence.toFixed(2)),
    routedTo: AGENT_BY_CLASS[best.cls],
    reason: best.reason,
  };
}
