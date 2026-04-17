import type { Flow } from "./types";

/** 5 pre-seeded, production-ready flows for CareAI */
export const FLOWS: Flow[] = [
  {
    id: "flow_demo_request",
    name: "Demo-Anfrage Follow-up",
    description: "7-Tage-Sequenz nach Demo-Anfrage zur Terminbestätigung und Materialverteilung.",
    trigger: "demo-requested",
    durationDays: 7,
    active: true,
    steps: [
      { id: "s1", delayDays: 0, template: "demo-confirmation", subjectOverride: "Dein Demo-Termin bei CareAI – Kalender-Link" },
      { id: "s2", delayDays: 1, template: "demo-reminder", subjectOverride: "Habe ich an deinen Termin gedacht?", condition: { type: "email-opened", matches: "Demo-Termin" } },
      { id: "s3", delayDays: 3, template: "pilot-kit", subjectOverride: "Dein Pilot-Kit zum Download (PDF, 3MB)" },
      { id: "s4", delayDays: 5, template: "soft-reminder", subjectOverride: "Fragen vor der Demo?", condition: { type: "demo-attended" } },
      { id: "s5", delayDays: 7, template: "demo-recap", subjectOverride: "Wie geht es weiter?", subjectExperiment: "demo-recap-subject" },
    ],
  },
  {
    id: "flow_whitepaper",
    name: "Whitepaper-Download Nurture",
    description: "21-Tage-Nurture-Flow nach Whitepaper-Download.",
    trigger: "whitepaper-downloaded",
    durationDays: 21,
    active: true,
    steps: [
      { id: "s1", delayDays: 0, template: "whitepaper-delivery", subjectOverride: "Dein Whitepaper ist da" },
      { id: "s2", delayDays: 3, template: "related-case-study", subjectOverride: "Ein Fallbeispiel passend zum Whitepaper" },
      { id: "s3", delayDays: 10, template: "value-deep-dive", subjectOverride: "3 Metriken, die jeder Pflege-PDL kennen sollte" },
      { id: "s4", delayDays: 21, template: "soft-demo-offer", subjectOverride: "Bereit für einen echten Einblick?" },
    ],
  },
  {
    id: "flow_trial_signup",
    name: "Trial-Signup Onboarding",
    description: "14-Tage-Onboarding während der kostenlosen Testphase.",
    trigger: "trial-signup",
    durationDays: 14,
    active: true,
    steps: [
      { id: "s1", delayDays: 0, template: "trial-welcome", subjectOverride: "Willkommen bei CareAI – deine ersten Schritte" },
      { id: "s2", delayDays: 1, template: "trial-first-task", subjectOverride: "Erster Tipp: 5 Minuten-Setup fürs Team" },
      { id: "s3", delayDays: 3, template: "voice-input-guide", subjectOverride: "Sprachdiktat optimal nutzen" },
      { id: "s4", delayDays: 7, template: "midtrial-checkin", subjectOverride: "Halbzeit – wie läuft es?", condition: { type: "trial-activated" } },
      { id: "s5", delayDays: 12, template: "conversion-offer", subjectOverride: "2 Tage bis Testende – dein Upgrade-Angebot" },
      { id: "s6", delayDays: 14, template: "trial-expiry", subjectOverride: "Deine Testphase endet heute" },
    ],
  },
  {
    id: "flow_stale_reactivation",
    name: "Stale-Lead Reaktivierung",
    description: "Nach 90 Tagen Inaktivität: 3-Step-Reaktivierung.",
    trigger: "stale-lead",
    durationDays: 14,
    active: true,
    steps: [
      { id: "s1", delayDays: 0, template: "reactivation-soft", subjectOverride: "Wir haben uns weiterentwickelt" },
      { id: "s2", delayDays: 7, template: "reactivation-value", subjectOverride: "Was andere PDLs in 6 Monaten erreicht haben" },
      { id: "s3", delayDays: 14, template: "reactivation-final", subjectOverride: "Letzte Nachricht – sollen wir dich ausblenden?" },
    ],
  },
  {
    id: "flow_customer_onboarding",
    name: "Customer-Onboarding 30 Tage",
    description: "Post-Signup-Onboarding über 30 Tage.",
    trigger: "customer-onboarded",
    durationDays: 30,
    active: true,
    steps: [
      { id: "s1", delayDays: 0, template: "welcome-customer", subjectOverride: "Willkommen an Bord" },
      { id: "s2", delayDays: 2, template: "setup-checklist", subjectOverride: "Deine Setup-Checkliste" },
      { id: "s3", delayDays: 5, template: "first-win", subjectOverride: "Der erste Erfolg: Sprachdiktat in 2 Minuten" },
      { id: "s4", delayDays: 10, template: "advanced-features", subjectOverride: "Erweiterte Features freischalten" },
      { id: "s5", delayDays: 15, template: "team-rollout", subjectOverride: "Dein Team einladen" },
      { id: "s6", delayDays: 20, template: "integration-intro", subjectOverride: "CareAI und deine bestehenden Systeme" },
      { id: "s7", delayDays: 25, template: "success-review", subjectOverride: "Ein Monat CareAI – dein Bericht" },
      { id: "s8", delayDays: 30, template: "customer-csm-intro", subjectOverride: "Dein CSM stellt sich vor" },
    ],
  },
];

/** Look up a flow by id or by trigger */
export function findFlow(idOrTrigger: string): Flow | undefined {
  return FLOWS.find((f) => f.id === idOrTrigger || f.trigger === idOrTrigger);
}
