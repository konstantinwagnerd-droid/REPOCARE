/**
 * Glossar — Pflege, Recht, Technik.
 * Mehr als 50 Begriffe alphabetisch sortiert.
 */

export type GlossaryEntry = {
  slug: string;
  term: string;
  definition: string;
  context: string;
  related?: string[];
  blogSlug?: string;
  category: "Pflege" | "Recht" | "Technik" | "Qualitaet";
};

export const GLOSSARY: GlossaryEntry[] = [
  {
    slug: "audit-log",
    term: "Audit-Log",
    definition:
      "Automatische, manipulationssichere Protokollierung aller sicherheitsrelevanten Ereignisse in einem System — wer hat wann was gelesen, geaendert oder geloescht.",
    context:
      "In Pflegesoftware Pflicht nach DSGVO Art. 32 und meist auch durch Expertenstandard der Informationssicherheit (ISO 27001).",
    related: ["RBAC", "DSGVO", "Pseudonymisierung"],
    category: "Technik",
  },
  {
    slug: "av-vertrag",
    term: "AV-Vertrag (Auftragsverarbeitungsvertrag)",
    definition:
      "Vertraglich fixierte Vereinbarung nach Art. 28 DSGVO, in der der Verantwortliche (z.B. Pflegeeinrichtung) den Auftragsverarbeiter (z.B. Software-Anbieter) zur weisungsgebundenen Datenverarbeitung verpflichtet.",
    context:
      "Zwingend erforderlich bei jeder SaaS-Nutzung mit personenbezogenen Daten. Mindestinhalte sind in Art. 28 Abs. 3 DSGVO aufgelistet.",
    related: ["DSGVO", "Subprozessor", "DSFA"],
    blogSlug: "dsgvo-art-9-pflege",
    category: "Recht",
  },
  {
    slug: "anonymisierung",
    term: "Anonymisierung",
    definition:
      "Prozess, bei dem personenbezogene Daten so veraendert werden, dass die Person ohne unverhaeltnismaessigen Aufwand nicht mehr identifizierbar ist.",
    context:
      "Anonymisierte Daten fallen nicht mehr unter die DSGVO. Unterschied zur Pseudonymisierung: bei Anonymisierung ist die Re-Identifikation technisch unmoeglich.",
    related: ["Pseudonymisierung", "DSGVO"],
    category: "Recht",
  },
  {
    slug: "akutgeriatrie",
    term: "Akutgeriatrie",
    definition:
      "Akutmedizinische Behandlung aelterer Patient:innen mit multiplen chronischen Erkrankungen, Fokus auf Funktionserhalt und Rehabilitation.",
    context:
      "Abgrenzung zur reinen Pflege: Akutgeriatrie ist stationaere Krankenhausmedizin, typischerweise 14-21 Tage Aufenthaltsdauer.",
    category: "Pflege",
  },
  {
    slug: "barrierefreiheit",
    term: "Barrierefreiheit (WCAG)",
    definition:
      "Gestaltung von Webinhalten, sodass Menschen mit Behinderungen sie wahrnehmen, bedienen und verstehen koennen. Standard: WCAG 2.2, Stufen A, AA, AAA.",
    context:
      "Seit BFSG 2025 in Deutschland fuer Software-Dienstleister ab bestimmter Groesse gesetzlich verpflichtend.",
    related: ["WCAG"],
    category: "Technik",
  },
  {
    slug: "behandlungspflege",
    term: "Behandlungspflege",
    definition:
      "Aerztlich verordnete pflegerische Massnahmen (z.B. Injektionen, Wundversorgung, Medikamentenverabreichung), abgegrenzt von der Grundpflege.",
    context:
      "In Deutschland finanziert die gesetzliche Krankenversicherung (SGB V), nicht die Pflegeversicherung.",
    related: ["Grundpflege"],
    category: "Pflege",
  },
  {
    slug: "biographie-arbeit",
    term: "Biographie-Arbeit",
    definition:
      "Systematische Erfassung und Nutzung biographischer Daten einer Bewohnerin oder eines Bewohners zur Pflege- und Aktivitaetsgestaltung.",
    context:
      "Zentral bei Demenz-sensibler Pflege. Nicht Selbstzweck, sondern Grundlage fuer individuelle Massnahmen.",
    related: ["Validationstherapie", "SIS"],
    category: "Pflege",
  },
  {
    slug: "bmp",
    term: "BMP (Bundeseinheitlicher Medikationsplan)",
    definition:
      "Seit 2016 gesetzlich festgelegtes einheitliches Format fuer den Medikationsplan in Deutschland. Anspruch ab 3 Dauermedikamenten.",
    context:
      "Maschinenlesbarer QR-Code, ab 2026 zunehmend in elektronischer Form (eMedikationsplan in der ePA).",
    related: ["MAR", "FHIR"],
    category: "Technik",
  },
  {
    slug: "dta-abrechnung",
    term: "DTA (Datenaustauschverfahren)",
    definition:
      "Elektronische Abrechnung zwischen Leistungserbringern (Pflegeheime, Pflegedienste) und Kostentraegern (Pflegekassen) nach § 302 und § 105 SGB XI.",
    context:
      "Verwendet XML-Dateiformate. In Pflegesoftware Standard-Funktion. Format wird regelmaessig vom GKV-Spitzenverband aktualisiert.",
    category: "Technik",
  },
  {
    slug: "dekubitus",
    term: "Dekubitus",
    definition:
      "Druckgeschwuer der Haut und des darunter liegenden Gewebes infolge laenger anhaltenden Drucks, typischerweise an druckbelasteten Koerperstellen.",
    context:
      "Vier Grade nach EPUAP. QI nach § 113c SGB XI. Weitgehend vermeidbar durch konsequente Prophylaxe.",
    related: ["Expertenstandards"],
    blogSlug: "dekubitus-ki-frueherkennung",
    category: "Pflege",
  },
  {
    slug: "delir",
    term: "Delir",
    definition:
      "Akut einsetzendes, meist reversibles, hirnorganisch bedingtes Syndrom mit Bewusstseinsstoerung und kognitiven Stoerungen.",
    context:
      "Besonders haeufig bei aelteren Menschen nach OP oder bei Infekten. Fruehzeitige Erkennung reduziert Dauer und Folgeschaeden.",
    category: "Pflege",
  },
  {
    slug: "dsfa",
    term: "DSFA (Datenschutz-Folgenabschaetzung)",
    definition:
      "Strukturierte Risikobewertung nach Art. 35 DSGVO fuer Datenverarbeitungen mit hohem Risiko fuer Rechte und Freiheiten natuerlicher Personen.",
    context:
      "In der Pflege bei KI-Einsatz, groesseren Software-Einfuehrungen und bei Videoueberwachung verpflichtend.",
    related: ["DSGVO", "EU AI Act"],
    blogSlug: "dsgvo-art-9-pflege",
    category: "Recht",
  },
  {
    slug: "dsgvo",
    term: "DSGVO",
    definition:
      "Datenschutz-Grundverordnung (EU 2016/679), europaweit gueltiges Datenschutzrecht seit 25. Mai 2018.",
    context:
      "Bei Pflegedaten zusaetzlich Art. 9 einschlaegig (besondere Kategorien personenbezogener Daten).",
    related: ["AV-Vertrag", "DSFA", "Anonymisierung"],
    blogSlug: "dsgvo-art-9-pflege",
    category: "Recht",
  },
  {
    slug: "elga",
    term: "ELGA",
    definition:
      "Elektronische Gesundheitsakte in Oesterreich. Seit 2015 schrittweise eingefuehrt, umfasst u.a. Entlassbriefe, Laborbefunde, Medikationsliste.",
    context:
      "Pflegeeinrichtungen sind seit 2024 zunehmend direkt angebunden. Opt-out-System: Buerger:innen koennen widersprechen.",
    related: ["FHIR", "ePA"],
    category: "Technik",
  },
  {
    slug: "einwilligung",
    term: "Einwilligung (Art. 7 DSGVO)",
    definition:
      "Freiwillige, informierte und eindeutige Willensbekundung einer Person, mit der sie der Verarbeitung ihrer personenbezogenen Daten zustimmt.",
    context:
      "Bei Einwilligungsunfaehigkeit (Demenz): gesetzliche Vertretung, Patientenverfuegung oder mutmasslicher Wille.",
    related: ["DSGVO"],
    category: "Recht",
  },
  {
    slug: "eu-ai-act",
    term: "EU AI Act",
    definition:
      "Verordnung (EU) 2024/1689 zur Regulierung von KI-Systemen. Klassifiziert nach Risiko, mit abgestuften Pflichten fuer Hersteller und Betreiber.",
    context:
      "Voll wirksam ab August 2026. Pflegesoftware mit KI-Funktionen muss eingestuft und konform gestaltet werden.",
    related: ["DSFA", "Human-in-the-Loop"],
    blogSlug: "eu-ai-act-pflegesoftware",
    category: "Recht",
  },
  {
    slug: "ernaehrungsprotokoll",
    term: "Ernaehrungsprotokoll",
    definition:
      "Dokumentation der Nahrungs- und Fluessigkeitsaufnahme ueber einen definierten Zeitraum.",
    context:
      "Nicht taegliche Pflicht, sondern indikationsbezogen (Gewichtsverlust, Schluckstoerung, Diabetes-Einstellung).",
    related: ["Trinkprotokoll", "MNA"],
    category: "Pflege",
  },
  {
    slug: "expertenstandards",
    term: "Expertenstandards",
    definition:
      "Fachliche Handlungsleitlinien in der Pflege, entwickelt vom DNQP (Deutsches Netzwerk fuer Qualitaetsentwicklung in der Pflege).",
    context:
      "Aktuelle Standards u.a. zu Dekubitusprophylaxe, Sturzpraevention, Ernaehrungsmanagement, Schmerzmanagement, Mobilitaet. Werden bei MD-Pruefung vorausgesetzt.",
    related: ["Dekubitus", "Sturzprophylaxe"],
    category: "Qualitaet",
  },
  {
    slug: "fem",
    term: "FEM (Freiheitsentziehende Massnahme)",
    definition:
      "Jede Massnahme, die die Bewegungsfreiheit einer Person einschraenkt: Fixierung, Gurt, Bettseitenteile, abgeschlossene Tueren.",
    context:
      "Drei Nachweise noetig: medizinische Indikation, Einwilligung bzw. richterliche Genehmigung, Alternativen-Pruefung.",
    related: ["Heimaufsicht"],
    blogSlug: "md-pruefung-checkliste",
    category: "Recht",
  },
  {
    slug: "fhir",
    term: "FHIR",
    definition:
      "Fast Healthcare Interoperability Resources — internationaler Standard fuer den Austausch von Gesundheitsdaten, basierend auf REST und JSON.",
    context:
      "Aktuelle Version: R4 (2019 stabil), R5 (2023). Deutsche Profile: ISIK, MIO Pflegeueberleitungsbogen.",
    related: ["HL7", "MIO", "GDT"],
    blogSlug: "hl7-fhir-pflege",
    category: "Technik",
  },
  {
    slug: "fixierung",
    term: "Fixierung",
    definition:
      "Mechanische Einschraenkung der Bewegungsfreiheit (Gurte, Bettgitter). Spezialfall der FEM.",
    context:
      "In Deutschland erfordert eine Fixierung ueber mehr als nur kurze Zeit einen richterlichen Beschluss (§ 1906 BGB).",
    related: ["FEM"],
    category: "Pflege",
  },
  {
    slug: "gdt",
    term: "GDT (Geraete-Datentraeger-Schnittstelle)",
    definition:
      "Urspruenglich fuer medizinische Geraete entwickelte Textdatei-Schnittstelle zum Datenaustausch mit Praxis- und Pflegesoftware.",
    context:
      "Wird zunehmend durch FHIR abgeloest, ist aber im DACH-Raum noch verbreitet, besonders bei Labor- und Vitalparameter-Geraeten.",
    related: ["FHIR", "HL7"],
    category: "Technik",
  },
  {
    slug: "grundpflege",
    term: "Grundpflege",
    definition:
      "Pflege im Bereich Koerperpflege, Ernaehrung, Mobilitaet und Ausscheidung — abgegrenzt von Behandlungspflege.",
    context:
      "Finanzierung ueber die Pflegeversicherung (SGB XI). Kernbereich der pflegerischen Taetigkeit.",
    related: ["Behandlungspflege"],
    category: "Pflege",
  },
  {
    slug: "hauswirtschaft",
    term: "Hauswirtschaft",
    definition:
      "Taetigkeiten zur Aufrechterhaltung der Wohnumgebung: Reinigung, Einkauf, Waeschepflege, Mahlzeitenzubereitung.",
    context:
      "Teilweise Pflegeversicherungsleistung (ambulant), in stationaeren Einrichtungen meist integraler Service.",
    category: "Pflege",
  },
  {
    slug: "heimaufsicht",
    term: "Heimaufsicht",
    definition:
      "Oeffentliche Aufsichtsbehoerde fuer Pflegeeinrichtungen. In Deutschland nach Landesrecht, in Oesterreich laenderweise organisiert.",
    context:
      "Ueberprueft u.a. die Umsetzung landesrechtlicher Vorschriften, FEM, bauliche Standards. Unterschieden von der MD-Pruefung.",
    related: ["MD", "Landespflegegesetze"],
    category: "Recht",
  },
  {
    slug: "human-in-the-loop",
    term: "Human-in-the-Loop",
    definition:
      "KI-Design-Prinzip, bei dem eine KI-Entscheidung vor Wirkung von einem Menschen bestaetigt oder korrigiert wird.",
    context:
      "Bei Pflege-KI nach EU AI Act und pflegefachlicher Ethik zwingend. Unterschied zu Human-on-the-Loop (nachgelagerte Aufsicht).",
    related: ["EU AI Act"],
    blogSlug: "human-in-the-loop",
    category: "Technik",
  },
  {
    slug: "kontraktur",
    term: "Kontraktur",
    definition:
      "Bewegungseinschraenkung eines Gelenks durch Verkuerzung von Weichteilen, haeufig bei langer Immobilitaet.",
    context:
      "Vermeidung durch regelmaessige Mobilisation, Positionierung, Physiotherapie. Bei Demenz oder schwerer Behinderung besonderes Risiko.",
    category: "Pflege",
  },
  {
    slug: "kurzzeitpflege",
    term: "Kurzzeitpflege",
    definition:
      "Zeitlich befristete vollstationaere Pflege (max. 8 Wochen pro Jahr), oft als Ueberbrueckung nach Krankenhausaufenthalt oder bei Ausfall pflegender Angehoeriger.",
    context:
      "Leistung der Pflegekasse nach § 42 SGB XI. In Oesterreich analoge Regelung im Rahmen der Langzeitpflege.",
    category: "Pflege",
  },
  {
    slug: "landespflegegesetze",
    term: "Landespflegegesetze",
    definition:
      "Neben dem Bundesgesetz (SGB XI in DE) regeln die Bundeslaender bauliche, personelle und organisatorische Anforderungen an Pflegeeinrichtungen.",
    context:
      "Erhebliche Unterschiede zwischen Bundeslaendern. In Oesterreich noch staerker foederal ausgepraegt.",
    related: ["Heimaufsicht"],
    category: "Recht",
  },
  {
    slug: "mar",
    term: "MAR (Medication Administration Record)",
    definition:
      "Dokumentation der tatsaechlich verabreichten Medikation — im Unterschied zum Medikationsplan (was soll verabreicht werden).",
    context:
      "In digitalen Systemen zunehmend integriert mit Barcode-Scan am Bewohner zur Identifikation.",
    related: ["BMP"],
    category: "Technik",
  },
  {
    slug: "md-mdk",
    term: "MD / MDK",
    definition:
      "Medizinischer Dienst (seit 2020 eigenstaendig, zuvor MDK). Fuehrt Pflegebegutachtungen und Qualitaetspruefungen nach § 114 SGB XI durch.",
    context:
      "Dreijaehrlich im Regelfall, unangekuendigt oder mit 24h Vorlauf.",
    related: ["Heimaufsicht", "QI"],
    blogSlug: "md-pruefung-checkliste",
    category: "Qualitaet",
  },
  {
    slug: "mdr",
    term: "MDR (Medical Device Regulation)",
    definition:
      "EU-Verordnung 2017/745 ueber Medizinprodukte. Regelt Zulassung, CE-Kennzeichnung, Post-Market-Surveillance.",
    context:
      "Pflegesoftware kann unter MDR fallen, wenn sie medizinische Entscheidungen unterstuetzt (Klassifikation I-III).",
    category: "Recht",
  },
  {
    slug: "nba",
    term: "NBA (Neues Begutachtungsassessment)",
    definition:
      "Seit 2017 gueltiges Verfahren zur Einstufung in Pflegegrade 1-5 in Deutschland. Sechs Module mit unterschiedlicher Gewichtung.",
    context:
      "Abloesung der frueheren Pflegestufen. In Oesterreich gilt weiter das stundenwertbasierte System der Pflegegeldstufen.",
    related: ["Pflegegrad", "Pflegegeldstufe"],
    blogSlug: "pflegegrad-vs-pflegegeldstufe",
    category: "Pflege",
  },
  {
    slug: "nis-2",
    term: "NIS-2-Richtlinie",
    definition:
      "EU-Richtlinie 2022/2555 zur Cybersicherheit. Verschaerft Anforderungen an IT-Sicherheit und Meldepflichten.",
    context:
      "Pflegeeinrichtungen ab bestimmter Groesse fallen unter NIS-2. Umsetzung in nationales Recht in DE: NIS-2-Umsetzungsgesetz.",
    related: ["DSGVO"],
    category: "Recht",
  },
  {
    slug: "opt-in-opt-out",
    term: "Opt-in / Opt-out",
    definition:
      "Einwilligungsmodelle: Opt-in = Zustimmung muss aktiv erfolgen; Opt-out = Widerspruch muss aktiv erfolgen.",
    context:
      "DSGVO fordert fuer die meisten Zwecke Opt-in. Die deutsche ePA ab 2026: Opt-out — BuergerIn muss widersprechen, sonst automatisch dabei.",
    related: ["Einwilligung"],
    category: "Recht",
  },
  {
    slug: "palliative-care",
    term: "Palliative Care",
    definition:
      "Ganzheitliche Betreuung von Menschen mit lebensbegrenzenden Erkrankungen. Fokus auf Lebensqualitaet, Symptomkontrolle, psychosoziale und spirituelle Begleitung.",
    context:
      "In Pflegeeinrichtungen durch qualifizierte Palliativ-Pflegekraefte und Kooperation mit Palliativdiensten umgesetzt.",
    category: "Pflege",
  },
  {
    slug: "patientenverfuegung",
    term: "Patientenverfuegung",
    definition:
      "Vorausschauende Willenserklaerung einer Person ueber medizinische Massnahmen fuer den Fall der Einwilligungsunfaehigkeit.",
    context:
      "In DE nach § 1901a BGB, in AT nach Patientenverfuegungsgesetz. Muss konkret genug formuliert sein, um rechtswirksam zu sein.",
    category: "Recht",
  },
  {
    slug: "pflegeberatung",
    term: "Pflegeberatung",
    definition:
      "Gesetzlicher Anspruch (§ 7a SGB XI in DE) auf individuelle Beratung zu Leistungen, Versorgungsformen und Hilfsangeboten.",
    context:
      "In AT durch diplomiertes Gesundheits- und Krankenpflegepersonal als Pflegegeldbegutachtung.",
    category: "Pflege",
  },
  {
    slug: "pflegegeldstufe",
    term: "Pflegegeldstufe",
    definition:
      "Einstufung in Oesterreich (1-7) auf Basis des Pflegebedarfs in Stunden pro Monat. Grundlage fuer das bundeseinheitliche Pflegegeld.",
    context:
      "Klare Abgrenzung zum deutschen Pflegegrad: unterschiedliche Assessment-Logik, unterschiedliche Stufenzahl.",
    related: ["Pflegegrad", "NBA"],
    blogSlug: "pflegegrad-vs-pflegegeldstufe",
    category: "Pflege",
  },
  {
    slug: "pflegegrad",
    term: "Pflegegrad",
    definition:
      "Seit 2017 in Deutschland verwendete fuenfstufige Einstufung (1-5) des Pflegebedarfs, basierend auf dem NBA.",
    context:
      "Abloesung der alten Pflegestufen I-III. Nicht identisch mit oesterreichischen Pflegegeldstufen.",
    related: ["NBA", "Pflegegeldstufe"],
    blogSlug: "pflegegrad-vs-pflegegeldstufe",
    category: "Pflege",
  },
  {
    slug: "pflegezeitgesetz",
    term: "Pflegezeitgesetz (DE)",
    definition:
      "Regelt das Recht Beschaeftigter auf Freistellung zur Pflege naher Angehoeriger. Bis zu 6 Monate Pflegezeit, 24 Monate Familienpflegezeit.",
    context:
      "In Oesterreich analoge Regelung im Arbeitsvertragsrechts-Anpassungsgesetz (AVRAG).",
    category: "Recht",
  },
  {
    slug: "praeventives-assessment",
    term: "Praeventives Assessment",
    definition:
      "Strukturierte Einschaetzung von Risiken (Sturz, Dekubitus, Mangelernaehrung) vor Eintritt des Problems.",
    context:
      "Grundlage fuer individuelle Praeventionsmassnahmen. Beispiele: Bradenskala, MNA, Tinetti-Test.",
    category: "Qualitaet",
  },
  {
    slug: "pseudonymisierung",
    term: "Pseudonymisierung",
    definition:
      "Verarbeitung personenbezogener Daten so, dass eine Zuordnung ohne Zusatzinformationen nicht moeglich ist (Art. 4 Nr. 5 DSGVO).",
    context:
      "Daten bleiben personenbezogen, aber mit reduziertem Identifikationsrisiko. Unterschied zur Anonymisierung: Re-Identifikation grundsaetzlich moeglich.",
    related: ["Anonymisierung", "DSGVO"],
    category: "Recht",
  },
  {
    slug: "psg-ii",
    term: "PSG II (Pflegestaerkungsgesetz II)",
    definition:
      "Gesetz von 2016 mit grosser Pflegereform in Deutschland: neuer Pflegebegriff, fuenf Pflegegrade, NBA, Qualitaetsindikatoren.",
    context:
      "Die vielleicht groesste Pflegereform der letzten 20 Jahre. Ab 1. Januar 2017 wirksam.",
    related: ["NBA", "Pflegegrad"],
    category: "Recht",
  },
  {
    slug: "qi",
    term: "QI (Qualitaetsindikatoren)",
    definition:
      "Zehn Ergebnisqualitaets-Indikatoren nach § 113c SGB XI. Halbjaehrliche Erhebung in jedem vollstationaeren Heim.",
    context:
      "Wesentliche Grundlage der MD-Pruefung seit 2019. Dienen auch als interne Steuerungs-Kennzahlen.",
    related: ["MD", "Expertenstandards"],
    blogSlug: "qualitaetsindikatoren-113c",
    category: "Qualitaet",
  },
  {
    slug: "rbac",
    term: "RBAC (Role-Based Access Control)",
    definition:
      "Berechtigungskonzept, bei dem Zugriffsrechte an Rollen gebunden sind (z.B. Pflegefachkraft, PDL, Haushaltshilfe), nicht an einzelne Personen.",
    context:
      "Grundprinzip sauberer IT-Sicherheit. In Pflegesoftware essentiell fuer Art. 32 DSGVO (Integritaet, Vertraulichkeit).",
    related: ["Audit-Log"],
    category: "Technik",
  },
  {
    slug: "schmerzmanagement",
    term: "Schmerzmanagement",
    definition:
      "Systematische Erfassung, Bewertung und Behandlung von Schmerz. Expertenstandard des DNQP seit 2004.",
    context:
      "Schmerzeinschaetzung (z.B. NRS, BESD bei Demenz) ist einer der zehn QIs — muss aktuell gehalten werden.",
    related: ["Expertenstandards", "QI"],
    category: "Pflege",
  },
  {
    slug: "sis",
    term: "SIS (Strukturierte Informationssammlung)",
    definition:
      "Dialogisches Dokument im Strukturmodell der deutschen Pflegedokumentation. Sechs Themenfelder, Pflegebedarf aus Sicht der Person.",
    context:
      "Herzstueck des Strukturmodells. Keine reine Anamnese, sondern eine Gespraechsgrundlage fuer Pflegeplanung.",
    related: ["Strukturmodell"],
    blogSlug: "sis-richtig-ausfuellen",
    category: "Pflege",
  },
  {
    slug: "soziale-betreuung",
    term: "Soziale Betreuung",
    definition:
      "Unterstuetzung bei der Teilhabe am sozialen Leben — Aktivitaeten, Gespraeche, Veranstaltungen. Eigener Kostenbestandteil in stationaeren Einrichtungen.",
    context:
      "In DE durch § 43b SGB XI staerker finanziell abgesichert, aber oft weiterhin unterbesetzt.",
    category: "Pflege",
  },
  {
    slug: "stuhlprotokoll",
    term: "Stuhlprotokoll",
    definition:
      "Dokumentation der Stuhlgaenge, typischerweise bei Obstipation, Diarrhoe oder im Kontext der medikamentoesen Einstellung.",
    context:
      "Kein Routine-Dokument, sondern indikationsbezogen. Bristol-Stuhlformen-Skala als Standard-Klassifikation.",
    category: "Pflege",
  },
  {
    slug: "strukturmodell",
    term: "Strukturmodell",
    definition:
      "Entbuerokratisierungskonzept fuer die Pflegedokumentation in Deutschland seit 2015. Basis: SIS, Massnahmenplan, Berichteverlauf, Evaluation.",
    context:
      "In der Mehrheit der Einrichtungen umgesetzt, Qualitaet der Umsetzung stark schwankend. Nicht in allen Bundeslaendern gleich akzeptiert.",
    related: ["SIS"],
    blogSlug: "sis-richtig-ausfuellen",
    category: "Pflege",
  },
  {
    slug: "subprozessor",
    term: "Subprozessor",
    definition:
      "Weiterer Auftragsverarbeiter, der vom Hauptauftragsverarbeiter mit einer Teilverarbeitung betraut wird (z.B. Cloud-Hosting-Anbieter).",
    context:
      "Nach Art. 28 DSGVO zustimmungs- und dokumentationspflichtig. Jede Software muss ihre Subprozessoren transparent auflisten.",
    related: ["AV-Vertrag", "DSGVO"],
    category: "Recht",
  },
  {
    slug: "sturzprophylaxe",
    term: "Sturzprophylaxe",
    definition:
      "Massnahmen zur Vermeidung von Stuerzen: Risikoerfassung, Umgebungsanpassung, Mobilitaetsfoerderung, Medikamenten-Review.",
    context:
      "Expertenstandard des DNQP. Schwerwiegende Sturzfolgen sind QI nach § 113c.",
    related: ["Expertenstandards", "QI"],
    category: "Pflege",
  },
  {
    slug: "tagespflege",
    term: "Tagespflege",
    definition:
      "Teilstationaere Pflege tagsueber, Rueckkehr am Abend nach Hause. Entlastet pflegende Angehoerige.",
    context:
      "Leistung nach § 41 SGB XI. In AT je nach Bundesland verschieden geregelt.",
    category: "Pflege",
  },
  {
    slug: "trinkprotokoll",
    term: "Trinkprotokoll",
    definition:
      "Dokumentation der taeglichen Fluessigkeitsaufnahme, typischerweise bei Risiko fuer Dehydration.",
    context:
      "Kein Routine-Dokument, sondern indikationsbezogen (nach Entbuerokratisierungsgesetz II klar geregelt).",
    category: "Pflege",
  },
  {
    slug: "validationstherapie",
    term: "Validationstherapie",
    definition:
      "Therapeutisches Konzept nach Naomi Feil fuer Menschen mit Demenz: Emotionen werden ernst genommen, nicht korrigiert.",
    context:
      "Grundlage vieler demenz-sensibler Pflegeansaetze. Keine eigenstaendige medizinische Leistung, aber Haltungsgrundlage.",
    related: ["Biographie-Arbeit"],
    category: "Pflege",
  },
  {
    slug: "zwanzigvier-h-betreuung",
    term: "24-Stunden-Betreuung",
    definition:
      "Betreuung einer pflegebeduerftigen Person zu Hause durch rund-um-die-Uhr anwesende Betreuungskraefte, meist auf selbststaendiger Basis.",
    context:
      "In Oesterreich sehr verbreitet (rechtlich geregelt im HBeG), in Deutschland zunehmend, oft in rechtlicher Grauzone bei osteuropaeischen Kraeften.",
    category: "Pflege",
  },
];

export function getAllGlossaryEntries(): GlossaryEntry[] {
  return [...GLOSSARY].sort((a, b) => a.term.localeCompare(b.term, "de"));
}

export function getGlossaryEntry(slug: string): GlossaryEntry | undefined {
  return GLOSSARY.find((g) => g.slug === slug);
}

export function groupGlossaryByLetter(): Record<string, GlossaryEntry[]> {
  const out: Record<string, GlossaryEntry[]> = {};
  for (const e of getAllGlossaryEntries()) {
    const letter = e.term[0].toUpperCase();
    if (!out[letter]) out[letter] = [];
    out[letter].push(e);
  }
  return out;
}
