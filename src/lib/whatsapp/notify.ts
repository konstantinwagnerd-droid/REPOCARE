/**
 * Trigger-Logik: ruft Evolution API bei Events auf und loggt in whatsapp_messages.
 * Respektiert Consent-Scope und Quiet-Hours.
 */
import { db } from "@/db/client";
import { whatsappContacts, whatsappMessages } from "@/db/schema";
import { and, eq, isNotNull } from "drizzle-orm";
import { sendText, isConfigured, isQuietNow } from "./evolution-client";
import { renderTemplate, type TemplateName, templates } from "./templates";

export interface NotifyResult {
  sent: number;
  skipped: number;
  failed: number;
  reasons: string[];
}

/**
 * Benachrichtigt alle Kontakte eines Residents per Template.
 * - Nur verifizierte Kontakte mit consent_given_at
 * - Scope-Filter: Template.scope muss im consent_scope enthalten sein
 *   (consent=all -> alle, critical -> critical, daily -> critical+daily)
 * - Quiet-Hours: bei scope != 'critical' ueberspringen
 */
export async function notifyResidentContacts(opts: {
  tenantId: string;
  residentId: string;
  template: TemplateName;
  vars: Record<string, string>;
  eventType?: string;
}): Promise<NotifyResult> {
  const result: NotifyResult = { sent: 0, skipped: 0, failed: 0, reasons: [] };
  if (!isConfigured()) {
    result.reasons.push("evolution-not-configured");
    return result;
  }
  const tpl = templates[opts.template];
  if (!tpl) {
    result.reasons.push("unknown-template");
    return result;
  }

  const contacts = await db
    .select()
    .from(whatsappContacts)
    .where(and(eq(whatsappContacts.tenantId, opts.tenantId), eq(whatsappContacts.residentId, opts.residentId), isNotNull(whatsappContacts.consentGivenAt)));

  for (const c of contacts) {
    const allowed = scopeAllows(c.consentScope ?? "critical", tpl.scope);
    if (!allowed) {
      result.skipped++;
      result.reasons.push(`scope-skip:${c.id}`);
      continue;
    }
    if (tpl.scope !== "critical" && isQuietNow(c.quietHoursStart ?? "22:00", c.quietHoursEnd ?? "07:00")) {
      result.skipped++;
      result.reasons.push(`quiet:${c.id}`);
      continue;
    }
    const body = renderTemplate(opts.template, opts.vars);
    const sendResult = await sendText(c.phone, body);
    await db.insert(whatsappMessages).values({
      tenantId: opts.tenantId,
      contactId: c.id,
      direction: "outbound",
      eventType: opts.eventType ?? opts.template,
      body,
      sentAt: sendResult.ok ? new Date() : null,
    });
    if (sendResult.ok) result.sent++;
    else {
      result.failed++;
      if (sendResult.error) result.reasons.push(sendResult.error);
    }
  }
  return result;
}

function scopeAllows(consent: string, templateScope: "all" | "critical" | "daily"): boolean {
  if (consent === "all") return true;
  if (consent === "critical") return templateScope === "critical";
  if (consent === "daily") return templateScope === "critical" || templateScope === "daily";
  return false;
}
