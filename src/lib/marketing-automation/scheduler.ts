import { FLOWS, findFlow } from "./flows";
import { conditionHolds } from "./conditions";
import type { Flow, FlowStats, Lead, TriggerType } from "./types";

/**
 * In-memory lead scheduler. Mirrors the shape that a future cron worker
 * would adopt. `tick()` processes all active leads and advances them.
 */
class MarketingScheduler {
  private leads = new Map<string, Lead>();
  /** Hook to deliver an email — replaced by real transport in production */
  deliver: (lead: Lead, flow: Flow, step: Flow["steps"][number]) => void | Promise<void> = async (lead, flow, step) => {
    // Default no-op deliver: push an event so stats reflect it
    lead.events.push({ at: new Date().toISOString(), kind: "email-sent", meta: { flowId: flow.id, stepId: step.id, template: step.template } });
  };

  listFlows(): Flow[] { return FLOWS; }

  enroll(email: string, trigger: TriggerType, name?: string): Lead | null {
    const flow = findFlow(trigger);
    if (!flow || !flow.active) return null;
    const lead: Lead = {
      id: `lead_${Math.random().toString(36).slice(2, 10)}`,
      email,
      name,
      flowId: flow.id,
      stepIndex: 0,
      enrolledAt: new Date().toISOString(),
      lastActionAt: new Date().toISOString(),
      completed: false,
      events: [{ at: new Date().toISOString(), kind: "enrolled", meta: { trigger } }],
    };
    this.leads.set(lead.id, lead);
    return lead;
  }

  recordEvent(leadId: string, kind: string, meta?: Record<string, unknown>): void {
    const lead = this.leads.get(leadId);
    if (!lead) return;
    lead.events.push({ at: new Date().toISOString(), kind, meta });
    lead.lastActionAt = new Date().toISOString();
  }

  /**
   * Advance any leads whose next step is due. Returns number of sends performed.
   * Designed to be invoked by a cron (hourly) or manually for simulation.
   */
  async tick(now = new Date()): Promise<number> {
    let sends = 0;
    for (const lead of this.leads.values()) {
      if (lead.completed) continue;
      const flow = FLOWS.find((f) => f.id === lead.flowId);
      if (!flow) continue;
      const next = flow.steps[lead.stepIndex];
      if (!next) { lead.completed = true; continue; }

      const enrolledAt = new Date(lead.enrolledAt).getTime();
      const due = enrolledAt + next.delayDays * 86_400_000;
      if (now.getTime() < due) continue;

      if (!conditionHolds(lead, next.condition)) {
        // Skip this step for this lead (condition not met); advance anyway so
        // later steps become eligible
        lead.events.push({ at: new Date().toISOString(), kind: "step-skipped", meta: { stepId: next.id, reason: "condition-not-met" } });
        lead.stepIndex++;
        continue;
      }

      await this.deliver(lead, flow, next);
      sends++;
      lead.stepIndex++;
      if (lead.stepIndex >= flow.steps.length) lead.completed = true;
    }
    return sends;
  }

  stats(flowId: string): FlowStats {
    const leads = Array.from(this.leads.values()).filter((l) => l.flowId === flowId);
    const opens = leads.reduce((acc, l) => acc + l.events.filter((e) => e.kind === "email-opened").length, 0);
    const clicks = leads.reduce((acc, l) => acc + l.events.filter((e) => e.kind === "link-clicked").length, 0);
    const sends = leads.reduce((acc, l) => acc + l.events.filter((e) => e.kind === "email-sent").length, 0) || 1;
    return {
      flowId,
      activeLeads: leads.filter((l) => !l.completed).length,
      completedLeads: leads.filter((l) => l.completed).length,
      totalEnrolled: leads.length,
      openRate: opens / sends,
      clickRate: clicks / sends,
    };
  }

  listLeadsForFlow(flowId: string): Lead[] {
    return Array.from(this.leads.values()).filter((l) => l.flowId === flowId);
  }
}

const g = globalThis as unknown as { __maScheduler?: MarketingScheduler };
export const marketingScheduler = g.__maScheduler ?? new MarketingScheduler();
if (!g.__maScheduler) g.__maScheduler = marketingScheduler;
