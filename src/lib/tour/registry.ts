import type { Tour } from "./types";

/**
 * Tour-Registry — 4 Erstlogin-Touren fuer die Hauptrollen.
 * Selectoren referenzieren `data-tour="..."`-Attribute im UI.
 * Fallback: wenn ein Element nicht existiert, wird der Step als Modal gezeigt (selector=null).
 */

const pflegekraftTour: Tour = {
  id: "first-login-pflegekraft",
  role: "pflegekraft",
  title: "Willkommen bei CareAI",
  description: "In 2 Minuten durch die wichtigsten Funktionen fuer Ihren Pflegealltag.",
  steps: [
    {
      id: "intro",
      title: "Hallo!",
      body:
        "Schoen, dass Sie da sind. Wir zeigen Ihnen die 8 wichtigsten Bereiche von CareAI. " +
        "Sie koennen die Tour jederzeit mit Esc beenden und spaeter ueber das ?-Icon neu starten.",
      selector: null,
      placement: "center",
    },
    {
      id: "dashboard",
      title: "Dashboard",
      body: "Hier sehen Sie alle relevanten Informationen fuer Ihre Schicht auf einen Blick: Bewohner-Hinweise, offene Aufgaben, aktuelle Vitalwerte.",
      selector: '[data-tour="dashboard"]',
      placement: "bottom",
      waitFor: true,
    },
    {
      id: "bewohner",
      title: "Bewohner",
      body: "Alle Bewohner Ihrer Einrichtung. Tippen Sie auf einen Namen, um die komplette Akte mit SIS, Medikamenten und Vitalwerten zu oeffnen.",
      selector: '[data-tour="nav-bewohner"]',
      placement: "right",
    },
    {
      id: "sis",
      title: "SIS-Assistent",
      body: "Die Strukturierte Informationssammlung hilft Ihnen, Pflegebedarfe systematisch zu erfassen — mit KI-Unterstuetzung und klarer Struktur.",
      selector: '[data-tour="nav-residents"]',
      placement: "right",
    },
    {
      id: "bericht",
      title: "Pflegebericht",
      body: "Taegliche Eintraege schnell per Text oder Diktat erfassen. CareAI formatiert automatisch nach SIS-Standard.",
      selector: '[data-tour="nav-handover"]',
      placement: "right",
    },
    {
      id: "voice",
      title: "Sprachbefehle",
      body: "Beide Haende voll? Sagen Sie einfach „Neuer Eintrag fuer Frau Mueller“. Voice-Commands sparen Zeit bei der Dokumentation.",
      selector: '[data-tour="nav-voice"]',
      placement: "right",
    },
    {
      id: "notfall",
      title: "Notfall-Button",
      body: "Der rote Notfall-Button ist immer erreichbar — direkte Alarmierung der Leitung und automatische Dokumentation.",
      selector: '[data-tour="topbar"]',
      placement: "bottom",
    },
    {
      id: "cmdk",
      title: "Schnell-Suche",
      body: "Druecken Sie Cmd+K (oder Strg+K) um blitzschnell zu Bewohnern, Berichten oder Aktionen zu springen.",
      selector: '[data-tour="topbar"]',
      placement: "bottom",
    },
  ],
};

const pdlTour: Tour = {
  id: "first-login-pdl",
  role: "pdl",
  title: "Willkommen, Pflegedienstleitung",
  description: "Die 7 wichtigsten Fuehrungsbereiche kompakt erklaert.",
  steps: [
    {
      id: "intro",
      title: "Fuehrung & Uebersicht",
      body: "Als PDL haben Sie Zugriff auf Dienstplan, QI-Benchmarks, Audit-Werkzeuge und Team-Uebersicht.",
      selector: null,
      placement: "center",
    },
    {
      id: "dashboard",
      title: "Leitungs-Dashboard",
      body: "KPIs Ihrer Einrichtung in Echtzeit: Auslastung, Dokumentationsquote, kritische Vitalwerte.",
      selector: '[data-tour="dashboard"]',
      placement: "bottom",
      waitFor: true,
    },
    {
      id: "dienstplan",
      title: "Dienstplan-Solver",
      body: "Der Solver erstellt automatisch Dienstplaene unter Beachtung von AZG, Qualifikationen und Wuenschen.",
      selector: '[data-tour="nav-dienstplan"]',
      placement: "right",
    },
    {
      id: "audit",
      title: "Audit-Log",
      body: "Lueckenlose Nachvollziehbarkeit aller Aenderungen — MDK-ready.",
      selector: '[data-tour="nav-audit"]',
      placement: "right",
    },
    {
      id: "qi",
      title: "Qualitaetsindikatoren",
      body: "Alle gesetzlichen QI (Dekubitus, Sturz, FEM) automatisch berechnet und gegen Benchmarks verglichen.",
      selector: '[data-tour="nav-qi"]',
      placement: "right",
    },
    {
      id: "exporte",
      title: "Exporte",
      body: "PDF-Export fuer MDK, Angehoerige, Arztbrief. Ein Klick — fertig.",
      selector: '[data-tour="nav-exporte"]',
      placement: "right",
    },
    {
      id: "team",
      title: "Team-Uebersicht",
      body: "Kompetenzen, Fortbildungen, Ausfallzeiten — alles in einem Dashboard.",
      selector: '[data-tour="nav-team"]',
      placement: "right",
    },
  ],
};

const adminTour: Tour = {
  id: "first-login-admin",
  role: "admin",
  title: "Willkommen, Admin",
  description: "9 Verwaltungsbereiche fuer System-Administratoren.",
  steps: [
    {
      id: "intro",
      title: "System-Administration",
      body: "Sie verwalten Analytics, Users, Whitelabel und Compliance. Los geht's.",
      selector: null,
      placement: "center",
    },
    {
      id: "analytics",
      title: "Analytics",
      body: "Nutzungsdaten, Anomalien, Performance — alles im Admin-Bereich.",
      selector: '[data-tour="admin-analytics"]',
      placement: "bottom",
      waitFor: true,
    },
    {
      id: "users",
      title: "Benutzerverwaltung",
      body: "Mitarbeiter anlegen, Rollen vergeben, Zugriffe revidieren.",
      selector: '[data-tour="admin-users"]',
      placement: "bottom",
    },
    {
      id: "whitelabel",
      title: "Whitelabel-Editor",
      body: "Logo, Farben, Text-Bausteine auf Ihre Einrichtung anpassen.",
      selector: '[data-tour="admin-whitelabel"]',
      placement: "bottom",
    },
    {
      id: "migration",
      title: "Daten-Migration",
      body: "Import aus Vorgaenger-Systemen (Vivendi, DAN, Medifox) inkl. Validierung.",
      selector: '[data-tour="admin-migration"]',
      placement: "bottom",
    },
    {
      id: "billing",
      title: "Abrechnung",
      body: "Lizenzen, Verbrauch, offene Posten.",
      selector: '[data-tour="admin-billing"]',
      placement: "bottom",
    },
    {
      id: "flags",
      title: "Feature-Flags",
      body: "Neue Funktionen gezielt ausrollen — pro Rolle, pro Einrichtung oder als A/B-Test.",
      selector: '[data-tour="admin-flags"]',
      placement: "bottom",
    },
    {
      id: "audit",
      title: "Audit-Log",
      body: "Alle sicherheitsrelevanten Aktionen mit lueckenlosem Protokoll.",
      selector: '[data-tour="admin-audit"]',
      placement: "bottom",
    },
    {
      id: "trust",
      title: "Trust-Center",
      body: "Zertifikate, DSGVO-Doku, Penetration-Test-Reports fuer Kunden und Auditoren.",
      selector: '[data-tour="admin-trust"]',
      placement: "bottom",
    },
  ],
};

const angehoerigeTour: Tour = {
  id: "first-login-angehoerige",
  role: "angehoerige",
  title: "Willkommen im Angehoerigen-Portal",
  description: "In 5 Schritten zu allen Informationen rund um Ihren Angehoerigen.",
  steps: [
    {
      id: "intro",
      title: "Herzlich willkommen",
      body: "Hier finden Sie Nachrichten, Termine und Dokumente rund um Ihren Angehoerigen — sicher und DSGVO-konform.",
      selector: null,
      placement: "center",
    },
    {
      id: "home",
      title: "Startseite",
      body: "Aktuelle Informationen, Vitalwerte (wenn freigegeben) und Ereignisse im Ueberblick.",
      selector: '[data-tour="family-home"]',
      placement: "bottom",
      waitFor: true,
    },
    {
      id: "nachrichten",
      title: "Nachrichten",
      body: "Direkter Kontakt zur Pflege. Sie erhalten Benachrichtigungen per E-Mail oder App.",
      selector: '[data-tour="family-messages"]',
      placement: "bottom",
    },
    {
      id: "termine",
      title: "Termine",
      body: "Besuche, Arzttermine, Feiern — alle Termine synchronisiert mit Ihrem Kalender.",
      selector: '[data-tour="family-appointments"]',
      placement: "bottom",
    },
    {
      id: "dokumente",
      title: "Dokumente & Einwilligungen",
      body: "Pflegevertrag, Vollmachten und Einwilligungen zentral abrufbar und digital unterschreibbar.",
      selector: '[data-tour="family-documents"]',
      placement: "bottom",
    },
  ],
};

export const TOURS: Record<string, Tour> = {
  [pflegekraftTour.id]: pflegekraftTour,
  [pdlTour.id]: pdlTour,
  [adminTour.id]: adminTour,
  [angehoerigeTour.id]: angehoerigeTour,
};

export function getTourForRole(role: string): Tour | null {
  const map: Record<string, string> = {
    pflegekraft: "first-login-pflegekraft",
    pflegefachkraft: "first-login-pflegekraft",
    pdl: "first-login-pdl",
    leitung: "first-login-pdl",
    admin: "first-login-admin",
    angehoeriger: "first-login-angehoerige",
    angehoerige: "first-login-angehoerige",
  };
  const tourId = map[role?.toLowerCase?.() ?? ""];
  return tourId ? TOURS[tourId] : null;
}

export function getAllTours(): Tour[] {
  return Object.values(TOURS);
}
