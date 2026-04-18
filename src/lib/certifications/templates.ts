/**
 * Zertifikats-Templates mit vorgefertigten Anforderungs-Katalogen.
 *
 * Quellen:
 * - ISO 27001:2022 Annex A (93 Controls, hier Top-10 relevante fuer Pflegeheime)
 * - KTQ-Manual Altenhilfe 6. Version (6 Kategorien)
 * - NQZ Nationales Qualitaetszeichen (AT) — 10 Qualitaetskategorien
 */

export type RequirementTemplate = {
  title: string;
  description: string;
  category: string;
};

export type CertificationTemplate = {
  id: string;
  label: string;
  validityMonths: number;
  requirements: RequirementTemplate[];
};

export const CERTIFICATION_TEMPLATES: Record<string, CertificationTemplate> = {
  "iso-27001": {
    id: "iso-27001",
    label: "ISO 27001 Informationssicherheit",
    validityMonths: 36,
    requirements: [
      { category: "A.5 Organisational", title: "A.5.1 Richtlinien zur Informationssicherheit", description: "Schriftliche IS-Leitlinie vom Geschaeftsfuehrer unterschrieben; jaehrliche Ueberpruefung." },
      { category: "A.5 Organisational", title: "A.5.10 Akzeptable Nutzung von Informationen und anderen Werten", description: "Nutzungsrichtlinie fuer IT-Geraete, E-Mail, Cloud-Dienste." },
      { category: "A.6 People", title: "A.6.3 Sensibilisierung und Schulung", description: "Jaehrliches IS-Training aller Mitarbeiter; Nachweise dokumentiert." },
      { category: "A.7 Physical", title: "A.7.2 Physische Sicherheitsperimeter", description: "Zutrittskontrolle Server-Raum, Besucherprotokoll, Schluesselkonzept." },
      { category: "A.8 Technological", title: "A.8.2 Privilegierte Zugriffsrechte", description: "RBAC dokumentiert, Least-Privilege-Prinzip, quartalsweises Access-Review." },
      { category: "A.8 Technological", title: "A.8.7 Schutz vor Schadsoftware", description: "Antivirus auf allen Endgeraeten, Patch-Management, Update-Pflicht." },
      { category: "A.8 Technological", title: "A.8.13 Informationssicherung (Backup)", description: "3-2-1-Backup, verschluesselt, regelmaessige Recovery-Tests." },
      { category: "A.8 Technological", title: "A.8.24 Kryptographie", description: "TLS 1.3, Datenbank-Verschluesselung, Schluesselmanagement." },
      { category: "A.8 Technological", title: "A.8.28 Sichere Softwareentwicklung", description: "SDLC mit Code-Review, SAST/DAST, Dependency-Scans." },
      { category: "A.5 Organisational", title: "A.5.30 IKT-Bereitschaft fuer Business Continuity", description: "Notfallplan, RTO/RPO, jaehrliche BCP-Uebung." },
    ],
  },
  ktq: {
    id: "ktq",
    label: "KTQ Altenhilfe",
    validityMonths: 36,
    requirements: [
      { category: "1. Bewohnerorientierung", title: "Erstkontakt und Aufnahme", description: "Strukturierter Erstkontakt, Aufnahmegespraech, Bewohnerakte binnen 7 Tagen vollstaendig." },
      { category: "1. Bewohnerorientierung", title: "Pflegeprozess & SIS", description: "SIS-Assessment bei Aufnahme + halbjaehrlich, DNQP-Standards angewendet." },
      { category: "1. Bewohnerorientierung", title: "Biographie & Lebensgestaltung", description: "Biographie nach IzEB gefuehrt, taegliche Rituale dokumentiert." },
      { category: "2. Mitarbeiterorientierung", title: "Einarbeitungskonzept", description: "Strukturierte Einarbeitung neuer Mitarbeiter; Mentor-Programm." },
      { category: "2. Mitarbeiterorientierung", title: "Fort- und Weiterbildung", description: "Jaehrlicher Fortbildungsplan, 40 h/MA, LMS-Nachweise." },
      { category: "2. Mitarbeiterorientierung", title: "Mitarbeiterjahresgespraeche", description: "Mind. 1x/Jahr strukturiertes Gespraech mit Zielvereinbarung." },
      { category: "3. Sicherheit", title: "Arbeitssicherheit & Brandschutz", description: "Jaehrliche Brandschutzuebung, Unterweisung SiGe-Beauftragter." },
      { category: "3. Sicherheit", title: "Hygiene-Management", description: "Hygieneplan, Hygienebeauftragte/r, MRE-Screening." },
      { category: "3. Sicherheit", title: "Sturzmanagement", description: "DNQP Sturzprophylaxe angewendet, Tinetti-Test bei Risikopatienten." },
      { category: "4. Informationswesen", title: "Dokumentations-Standards", description: "Pflegedokumentation digital, DSGVO-konform, Zugriffsprotokolle." },
      { category: "5. Fuehrung", title: "Leitbild & Strategie", description: "Schriftliches Leitbild, jaehrliche Strategie-Klausur, OKR/Ziele." },
      { category: "6. Qualitaetsmanagement", title: "QM-Handbuch aktuell", description: "QM-HB regelmaessig reviewed, Prozess-Landkarte, Verfahrensanweisungen." },
      { category: "6. Qualitaetsmanagement", title: "Interne Audits", description: "Quartalsweise interne Audits, Auditprogramm, Massnahmen-Tracking." },
      { category: "6. Qualitaetsmanagement", title: "CAPA / Beschwerdemanagement", description: "Strukturiertes Beschwerdewesen, Ursachenanalyse, Wirksamkeitspruefung." },
    ],
  },
  nqz: {
    id: "nqz",
    label: "NQZ Nationales Qualitaetszeichen (AT)",
    validityMonths: 36,
    requirements: [
      { category: "Ergebnisqualitaet", title: "Bewohnerzufriedenheit", description: "Jaehrliche anonyme Befragung; Ergebnisquote > 70%, Zufriedenheit > 80%." },
      { category: "Ergebnisqualitaet", title: "Angehoerigenzufriedenheit", description: "Befragung Angehoerige 1x/Jahr, Rueckmeldung binnen 4 Wochen." },
      { category: "Ergebnisqualitaet", title: "Pflegequalitaet (NBA-Indikatoren)", description: "Dekubitus-Rate, Sturz-Rate, Freiheitsbeschraenkung-Quote dokumentiert." },
      { category: "Prozessqualitaet", title: "Pflegeprozess & Dokumentation", description: "Pflegeplan nach Fiechter/Meier, PFLEGE-Standards, Pflegevisite quartalsweise." },
      { category: "Prozessqualitaet", title: "Medikamentenmanagement", description: "AMTS-Check, Interaktions-Pruefung, Doppelverordnungs-Check." },
      { category: "Strukturqualitaet", title: "Personalqualifikation", description: "Mindestens 50% Fachkraftquote, DGKP-Ausstattung pro Schicht." },
      { category: "Strukturqualitaet", title: "Raeumliche Ausstattung", description: "Einzelzimmer-Quote > 80%, barrierefrei, Pflegebaeder." },
      { category: "Fuehrung", title: "Leitbild gelebt", description: "Leitbild im Alltag sichtbar, Mitarbeiter-Befragung zur Kultur." },
      { category: "Fuehrung", title: "Mitarbeiter-Gesundheit", description: "BGM-Programm, Gefaehrdungsbeurteilung psychischer Belastung." },
      { category: "Einbettung", title: "Gemeinwesen-Einbindung", description: "Kooperation mit Vereinen, Schulen, Kirchen; offene Angebote fuer Quartier." },
    ],
  },
  diakonie: {
    id: "diakonie",
    label: "Diakonie-Siegel",
    validityMonths: 36,
    requirements: [
      { category: "Christliches Profil", title: "Diakonisches Leitbild", description: "Schriftliches Leitbild mit diakonischem Bezug." },
      { category: "Christliches Profil", title: "Seelsorge", description: "Regelmaessige seelsorgliche Angebote, Kooperation mit Gemeinde." },
      { category: "Qualitaet", title: "Qualitaetsmanagement", description: "QM-System mit Diakonie-Leitfaden abgeglichen." },
    ],
  },
  caritas: {
    id: "caritas",
    label: "Caritas-Qualitaetszeichen",
    validityMonths: 36,
    requirements: [
      { category: "Caritas-Leitbild", title: "Christliche Grundhaltung", description: "Leitbild mit christlichem Menschenbild; Mitarbeiter-Einbindung." },
      { category: "Qualitaet", title: "Pflegestandards", description: "Caritas-Pflegestandards angewendet, regelmaessige Audits." },
    ],
  },
  "mdk-qualitaet": {
    id: "mdk-qualitaet",
    label: "MDK Qualitaetspruefung §114 SGB XI",
    validityMonths: 12,
    requirements: [
      { category: "Ergebnisindikatoren", title: "QI 1 Mobilitaet", description: "Veraenderung Mobilitaetsgrad, Sturz-Ereignisse dokumentiert." },
      { category: "Ergebnisindikatoren", title: "QI 2 Selbststaendigkeit Alltag", description: "Veraenderung Selbststaendigkeit bei Alltagsverrichtungen." },
      { category: "Ergebnisindikatoren", title: "QI 3 Dekubitusentstehung", description: "Anzahl neu entstandener Dekubitus, Grad 2+." },
      { category: "Ergebnisindikatoren", title: "QI 4 Schwerwiegende Stuerze", description: "Anzahl Stuerze mit Klinik-Einweisung." },
      { category: "Prozesse", title: "Pflegedokumentation", description: "SIS-Assessment, Massnahmenplanung, Evaluation." },
      { category: "Prozesse", title: "Schmerzmanagement", description: "DNQP Schmerzmanagement angewendet, Schmerz-Assessment." },
    ],
  },
};

export const CERT_STATUS_LIST = [
  "aktiv",
  "läuft-ab",
  "erneuerung-anstehend",
  "abgelaufen",
  "in-vorbereitung",
] as const;

export function computeCertStatus(expiresDate: Date | null | string | undefined): string {
  if (!expiresDate) return "in-vorbereitung";
  const d = typeof expiresDate === "string" ? new Date(expiresDate) : expiresDate;
  const now = new Date();
  const diffDays = (d.getTime() - now.getTime()) / 86400_000;
  if (diffDays < 0) return "abgelaufen";
  if (diffDays < 90) return "läuft-ab";
  if (diffDays < 180) return "erneuerung-anstehend";
  return "aktiv";
}

export const CERT_REMINDER_DAYS = [90, 60, 30, 14, 7] as const;
