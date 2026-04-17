export type HelpArticle = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  body: string;
  related?: string[];
};

/**
 * 15 Hilfe-Artikel, jeder 300–500 Worte, Markdown-freundlich.
 * Simpler HTML-Render: Zeilen beginnend mit '## ' werden Headings, '- ' Listen.
 */
export const articles: HelpArticle[] = [
  {
    slug: "erste-schritte",
    title: "Erste Schritte mit CareAI",
    category: "Erste Schritte",
    excerpt: "In 10 Minuten vom Login zur ersten Dokumentation.",
    body: `## Willkommen

Nach dem Login landen Sie auf Ihrem Dashboard. Links sehen Sie die Navigation: Bewohner, Dokumentation, Maßnahmen, Berichte. Rechts oben befindet sich Ihr Profil.

## Ersten Bewohner anlegen

Gehen Sie auf "Bewohner" und klicken Sie "Neu anlegen". Sie brauchen mindestens Vor- und Nachname sowie Geburtsdatum. Alles andere koennen Sie spaeter ergaenzen — CareAI blockiert Sie nie, weil Felder fehlen.

## Erste Dokumentation

Oeffnen Sie den Bewohner, klicken Sie "Neuer Eintrag". Es erscheint ein Mikrofon-Button — tippen oder druecken Sie ihn, und sprechen Sie. CareAI transkribiert live und schlaegt Ihnen strukturierte Eintraege vor. Sie akzeptieren, aendern oder verwerfen — in Sekunden.

## SIS beginnen

SIS wird automatisch aus Ihren Dokumentationen gespeist. Sobald Sie genug Eintraege haben, erscheint ein SIS-Vorschlag oben rechts. Lesen Sie ihn, passen Sie ihn an, bestaetigen Sie.

## Erste Woche

Fokussieren Sie sich in der ersten Woche auf Spracheingabe. Das ist das Feature, das den groessten Unterschied macht. Fortgeschrittene Features (Massnahmenplan-Generator, MD-Export, Risiko-Matrix) werden mit der zweiten Woche freigeschaltet.

## Wo Hilfe finden?

Fragezeichen-Symbol oben rechts in der App oeffnet den passenden Hilfe-Artikel. Bei Fragen: support@careai.app, Antwort innerhalb 8h.`,
    related: ["spracheingabe-grundlagen", "sis-anleitung"],
  },
  {
    slug: "spracheingabe-grundlagen",
    title: "Spracheingabe — das Wichtigste in 3 Minuten",
    category: "Spracheingabe",
    excerpt: "Mikrofon, Formulierung, Fallstricke.",
    body: `## Wann Spracheingabe?

Immer, wenn Sie mehr als 20 Zeichen tippen wuerden. Spracheingabe ist 5–7x schneller.

## Wie Sie formulieren

CareAI versteht natuerliche Sprache. Sie muessen nicht "Pflegesprache" sprechen. Beispiel: "Frau Huber hat heute gut gegessen, Blutdruck hoch, 160 zu 95, keine Beschwerden." CareAI trennt automatisch: Nahrungsaufnahme, RR, Subjektives.

## Dialekte

Getestet: Standarddeutsch, Oesterreichisch (Wienerisch, Tirolerisch, Kaerntnerisch), Bayerisch, Schweizerdeutsch (rudimentaer). Wenn ein Wort nicht verstanden wird, korrigieren Sie — CareAI merkt sich das fuer Ihren Account.

## Fachbegriffe

Pflege-Terminologie ist eingepflegt: R1–R7, Dekubitusstufen, MDK-Kriterien, Wund-Klassifikationen, Medikamenten-Namen (DE + AT + CH). Wenn ein Fachbegriff fehlt: Admin → Einstellungen → Woerterbuch.

## Hintergrundrauschen

CareAI filtert aktiv. Flurgeraeusche, Tuerschlagen, leise Gespraeche — kein Problem. Vermeiden Sie nur: laute Musik, Lautsprecher-Durchsagen direkt neben Ihnen.

## Privatsphaere

Das Mikrofon ist nur aktiv, solange Sie den Button druecken. Audio wird in Echtzeit transkribiert und sofort verworfen (nicht gespeichert). Nur der strukturierte Text landet im System.

## Offline

Bei Verbindungsabbruch laeuft Spracheingabe lokal weiter — synchronisiert, sobald wieder online. Nichts geht verloren.`,
    related: ["erste-schritte", "sis-anleitung"],
  },
  {
    slug: "sis-anleitung",
    title: "SIS — Strukturierte Informationssammlung",
    category: "SIS",
    excerpt: "6 Themenfelder, Risiko-Matrix R1–R7, Automatik.",
    body: `## Was ist SIS?

Die Strukturierte Informationssammlung ist das Herzstueck der Pflegedokumentation nach SIS-Modell. Sechs Themenfelder decken alle Pflege-relevanten Bereiche ab.

## Die sechs Themenfelder

- Themenfeld 1: Kognitive und kommunikative Faehigkeiten
- Themenfeld 2: Mobilitaet und Beweglichkeit
- Themenfeld 3: Krankheitsbezogene Anforderungen
- Themenfeld 4: Selbstversorgung
- Themenfeld 5: Leben in sozialen Beziehungen
- Themenfeld 6: Haushaltsfuehrung (bei Ambulant)

## Risiko-Matrix R1–R7

- R1: Sturz
- R2: Dekubitus
- R3: Inkontinenz
- R4: Schmerz
- R5: Ernaehrungs-/Flüssigkeitsmangel
- R6: Sedierung / Delir
- R7: Sonstige

Jedes Risiko wird als "nicht vorhanden / niedrig / mittel / hoch" bewertet, mit Trend-Pfeil ueber die letzten 30 Tage.

## Automatik-Vorschlaege

Nach 5–10 Dokumentationen erstellt CareAI einen SIS-Erstvorschlag. Sie lesen ihn durch, aendern, verwerfen einzelne Punkte oder akzeptieren im Ganzen.

## Revisionsfestigkeit

Jede SIS-Aenderung wird im Audit-Log mit Nutzer, Zeit und Grund festgehalten. Kein Eintrag wird jemals ueberschrieben — Versionen bleiben alle abrufbar.

## MD-Export

Einmalig die Pruefung vorbereiten: "Berichte → Pruefer-Export". Alle SIS, Risiko-Historie, Audit-Log in einem PDF. Dauer: 15 Sekunden.`,
    related: ["erste-schritte", "spracheingabe-grundlagen", "md-export"],
  },
  {
    slug: "md-export",
    title: "MD-Pruefung vorbereiten",
    category: "Abrechnung & Pruefung",
    excerpt: "Pruefer-Paket in 15 Sekunden erstellen.",
    body: `## Vor der Pruefung

Der MD-Pruefer kuendigt sich ueblicherweise 24–48h im Voraus an. Bei CareAI muessen Sie nichts vorbereiten.

## Export starten

Berichte → Pruefer-Export. Waehlen Sie Zeitraum (meist: letzten 6 oder 12 Monate) und Bewohner-Gruppe (alle oder Stichprobe). Klick auf "Generieren".

## Inhalt des Exports

- Vollstaendige SIS inkl. Versionshistorie
- Risiko-Matrix mit Trendpfeilen
- Audit-Log: Wer hat wann was geaendert? Warum?
- MAR (Medikationsnachweis)
- Sturz-, Dekubitus-, Delir-Protokolle

## Zeitstempel & Signaturen

Jede Aenderung ist mit Zeitstempel, Nutzer-ID und digitaler Signatur versehen. Keine Nachbearbeitung moeglich.

## Tipp fuer den Pruefungs-Termin

Geben Sie dem Pruefer einen Gast-Zugang (Berichte → "Pruefer-Session starten"). Er kann live im System lesen, aber nichts aendern. Die Session endet automatisch nach 8h.

## Nach der Pruefung

Im Audit-Log sehen Sie, welche Akten der Pruefer geoeffnet hat — fuer Ihre eigene Nachbereitung.`,
    related: ["sis-anleitung", "audit-log"],
  },
  {
    slug: "audit-log",
    title: "Audit-Log verstehen",
    category: "Abrechnung & Pruefung",
    excerpt: "Wer hat was wann geaendert — und warum.",
    body: `## Was wird geloggt?

Alles. Jede Aenderung an Bewohner-Daten, Dokumentation, SIS, Massnahmen, Medikation. Auch: Logins, Rollen-Aenderungen, Export-Erstellungen.

## Zugriff

Pflegedienstleitung und Admin haben Lese-Zugriff auf den kompletten Log. DGKP sehen nur eigene Aktionen. Pflegehilfen sehen gar nichts (um Mikromanagement zu vermeiden).

## Filter

Nach Nutzer, Zeitraum, Aktionstyp, Bewohner. Volltextsuche im Begruendungsfeld.

## Begruendungspflicht

Kritische Aenderungen (z. B. Medikamenten-Plan) erfordern eine Begruendung. CareAI fragt automatisch ab.

## Export

Als CSV, PDF oder JSON. Fuer MD: PDF-Variante ist signiert.`,
    related: ["md-export", "rbac-rollen"],
  },
  {
    slug: "rbac-rollen",
    title: "Rollen und Rechte",
    category: "DSGVO & Rechte",
    excerpt: "6 Rollen, klarer Geltungsbereich.",
    body: `## Die 6 Rollen

- **Admin**: System-Einstellungen, Rollen-Verwaltung, keine Pflege-Daten standardmaessig
- **Pflegedienstleitung (PDL)**: Alles lesend, alles schreibend, Audit-Log voll
- **DGKP**: Bewohner-Daten lesend+schreibend, eigener Audit-Log
- **Pflegehilfe**: Dokumentation lesend, eigene Eintraege schreibend
- **Angehoeriger**: Nur freigegebene Inhalte
- **Pruefer (MD)**: Lesend, Session-begrenzt

## Best Practice

- Keine geteilten Konten — jeder Mitarbeitende einen eigenen Account.
- Admin-Rolle nur fuer 1–2 Personen pro Einrichtung.
- PDL bekommt Vertretung, die automatisch beim PDL-Urlaub aktiv wird.

## 2FA erzwingen

Einstellungen → Sicherheit → "2FA fuer alle erforderlich". Unterstuetzt TOTP (Google Authenticator, 1Password, Authy) und Security-Keys (YubiKey).`,
    related: ["audit-log", "dsgvo-grundlagen"],
  },
  {
    slug: "dsgvo-grundlagen",
    title: "DSGVO in CareAI",
    category: "DSGVO & Rechte",
    excerpt: "Was CareAI automatisch macht, was Sie tun muessen.",
    body: `## Was CareAI uebernimmt

- Verschluesselung at rest + in transit
- Access-Logs und Audit-Trail
- Automatische Loeschfristen-Verwaltung
- AVV-Vertrag (Anforderung: Kontakt → DPA)

## Was Sie tun muessen

- Einwilligungen von Bewohnern und Angehoerigen dokumentieren (CareAI bietet Template-Formulare)
- Ihre eigenen Mitarbeiter auf DSGVO schulen
- Ihre eigene Datenschutzerklaerung pflegen (wir helfen mit Template)
- Betroffenen-Anfragen (Art. 15) bearbeiten — CareAI erstellt den Export, Sie versenden

## Betroffenen-Rechte

Fuer jeden Bewohner gibt es einen "DSGVO-Export" Button (Admin-Rolle). Liefert JSON + PDF mit allen gespeicherten Daten dieser Person.

## Loeschung

Nach Auszug/Tod wird der Datensatz in "Archiviert" verschoben. Nach gesetzlicher Aufbewahrungsfrist (10 Jahre in AT/DE) automatisch geloescht. Vorzeitige Loeschung auf Antrag moeglich.

## Datenuebermittlung

KEINE Uebertragung in Drittlaender. Alle Anbieter in EU (siehe Trust Center fuer Liste).`,
    related: ["rbac-rollen"],
  },
  {
    slug: "massnahmenplan",
    title: "Massnahmenplan erstellen",
    category: "Dokumentation",
    excerpt: "Aus SIS automatisch generiert, individuell anpassbar.",
    body: `## Grundgedanke

Der Massnahmenplan leitet sich aus der SIS ab. CareAI schlaegt vor — Sie entscheiden.

## Vorschlag-Logik

Basierend auf Themenfeldern und Risiko-Bewertungen generiert CareAI 8–15 Massnahmen mit Haeufigkeit ("3x taeglich", "einmal pro Schicht", "bei Bedarf"). Jede Massnahme hat Ziel und Erfolgskriterium.

## Anpassung

Massnahme streichen: 1 Klick. Aendern: Direkt im Text editieren. Neue hinzufuegen: "+" am Ende.

## Evaluation

Alle 3 Monate mahnt CareAI die Evaluation an. Sie sehen: Welche Ziele wurden erreicht? Welche nicht? Warum?

## MD-konform

Formulierung und Struktur folgen den MDK-Qualitaetskriterien. Der Export entspricht dem Format, das Pruefer erwarten.`,
    related: ["sis-anleitung", "md-export"],
  },
  {
    slug: "angehoerigen-portal",
    title: "Angehoerigen-Portal einrichten",
    category: "Angehoerige",
    excerpt: "Was sehen Angehoerige, was nicht.",
    body: `## Grundsatz

Angehoerige sehen nur, was aktiv freigegeben wurde. Standard: Wohlbefindens-Score, Aktivitaeten (bei Einwilligung), Nachrichten. NICHT: medizinische Details, Diagnosen, Pflegeprobleme.

## Einladung

Pflegedienstleitung legt Angehoerigen im Bewohner-Profil an. E-Mail-Adresse + Beziehung (Kind, Partner, Vollmacht). Einladungslink gilt 7 Tage.

## Einwilligung

Bei jedem Angehoerigen muss die schriftliche Einwilligung des Bewohners (oder des gesetzl. Vertreters) vorliegen. CareAI erfasst das Einwilligungsdatum.

## Inhalte freigeben

Pro Bewohner, pro Kategorie, pro Angehoerigem: was ist sichtbar? Beispiel: Tochter sieht Aktivitaeten + Wohlbefinden, Bruder nur Wohlbefinden.

## Nachrichten-Funktion

Moderiert — d.h. Pflegekraft liest Nachricht bevor sie im System verteilt wird. Missbrauch ist damit minimiert.`,
    related: ["dsgvo-grundlagen"],
  },
  {
    slug: "medikation-mar",
    title: "Medikation / MAR",
    category: "Dokumentation",
    excerpt: "Medikamentenplan und Gabe-Dokumentation.",
    body: `## Medikamentenplan

Unter Bewohner → Medikation pflegen Sie den aktuellen Plan. Eintraege haben: Wirkstoff, Praeparat, Dosierung, Zeiten, Grund.

## Interaktions-Check

CareAI prueft bei Neueintrag auf bekannte Wechselwirkungen. Warnung erscheint — Sie entscheiden.

## MAR

Medikamentengabe-Dokumentation erfolgt direkt am Bett, per Tablet. Ein Tap = dokumentiert, mit Zeitstempel und Nutzer.

## Abweichungen

Nicht gegeben? Ausgelassen? Erbrochen? Alle Abweichungen werden separat festgehalten — inklusive Grund.

## Export fuer Apotheke

Monatsmedikation als PDF fuer Apotheken-Vorbereitung. Auf Wunsch direkt per KIM (DE) versendet.`,
    related: ["massnahmenplan"],
  },
  {
    slug: "dienstplan-grundlagen",
    title: "Dienstplan — Grundlagen",
    category: "Dienstplan",
    excerpt: "Schichten planen, Tausch, Urlaub.",
    body: `## Schichtmodell

Ihr Standardmodell (z. B. Frueh 06–14, Spaet 14–22, Nacht 22–06) wird einmalig eingestellt. Abweichungen individuell.

## Planung

Monats- oder Wochenansicht. Drag & Drop. CareAI warnt bei Gesetzesverstoessen (Ruhezeit, Maximalstunden).

## Tausch-Funktion

Mitarbeitende koennen Schichten tauschen — mit Bestaetigung der PDL. Kein Email-Chaos mehr.

## Urlaub

Antraege digital, Freigabe per Klick, automatisches Dienstplan-Update.

## Integrationen

Mit DATEV / BMD synchronisiert fuer Lohnabrechnung.`,
    related: [],
  },
  {
    slug: "notfall-workflow",
    title: "Notfall-Workflow",
    category: "Dokumentation",
    excerpt: "Schnellerfassung bei Akut-Situation.",
    body: `## Schnell-Dokumentation

Der rote "Notfall"-Button oben rechts oeffnet ein minimalistisches Formular: Was ist passiert? Wer ist informiert? Was wurde getan? Zeitstempel automatisch.

## Automatische Eskalation

Bei Begriffen wie "Sturz", "Bewusstlosigkeit", "Blutung" triggert CareAI automatisch:
- Benachrichtigung an PDL
- Erinnerung: Arzt informieren
- Checkliste: Angehoerige kontaktieren

## Sturzprotokoll

Spezielles Formular fuer Stuerze — erfasst alle Daten, die der MD erwartet. Wird automatisch mit Risiko-Matrix R1 verknuepft.

## Nach dem Notfall

Reflexion am Schichtende: Was haben wir gelernt? Was veraendern wir? Die Antworten fliessen in den Massnahmenplan.`,
    related: ["massnahmenplan"],
  },
  {
    slug: "faq-technik",
    title: "FAQ — Technik",
    category: "FAQs",
    excerpt: "Browser, Geraete, Offline.",
    body: `## Welche Browser?

Chrome, Edge, Safari, Firefox — jeweils die letzten 2 Haupt-Versionen. Kein Internet Explorer.

## Welche Tablets?

Empfohlen: iPad (ab Gen 8), Samsung Galaxy Tab S7+, Microsoft Surface. Alles mit mind. 10" Bildschirm.

## Funktioniert's mit Handschuhen?

Ja. Alle interaktiven Elemente sind mindestens 44x44 Pixel. Spracheingabe macht Handschuhe meist sowieso ueberfluessig.

## Offline-Modus?

Ja. Dokumentation, Spracheingabe (lokal), MAR funktionieren offline. SIS-Vorschlaege und Reports brauchen Internet.

## Druckerfreundlich?

Jede Seite hat eine "Drucken"-Ansicht ohne Navigation. Tinten- und papiersparend.`,
    related: ["barrierefreiheit"],
  },
  {
    slug: "barrierefreiheit",
    title: "Barrierefreiheit",
    category: "FAQs",
    excerpt: "WCAG AA, Screenreader, Kontraste.",
    body: `## Standard

WCAG 2.2 Level AA wird eingehalten — regelmaessig auditiert. AAA fuer kritische Flows (Anmeldung, Notfall).

## Screenreader

Getestet mit NVDA (Windows), VoiceOver (macOS/iOS), TalkBack (Android). Alle Formulare haben Labels, alle Icons Alt-Texte.

## Kontraste

Mindestens 4.5:1 fuer Text, 3:1 fuer Icons. "Hoher Kontrast"-Modus in Einstellungen.

## Tastaturbedienung

Jede Funktion per Tastatur erreichbar. Tab-Reihenfolge logisch, Skip-Links vorhanden.

## Schriftgroesse

Zoomt bis 200% ohne Layout-Zusammenbruch. Eigene Schriftgroesse in Profil einstellbar.

## Bewegung reduzieren

Respektiert die prefers-reduced-motion-Einstellung — alle Animationen werden auf Fade reduziert.`,
    related: ["faq-technik"],
  },
  {
    slug: "abrechnung-rechnung",
    title: "Rechnung und Zahlung",
    category: "Abrechnung & Pruefung",
    excerpt: "Wie Sie CareAI bezahlen.",
    body: `## Abrechnungs-Modell

Pro Einrichtung (nicht pro User), monatlich, SEPA-Lastschrift Standard. Rechnungen werden zum Monatsende erstellt.

## Rechnungen abrufen

Admin → Rechnungen. Alle PDFs historisch. Export als ZIP fuer Buchhaltung.

## Zahlungsarten

SEPA-Lastschrift (bevorzugt), Ueberweisung, Kreditkarte (Stripe).

## USt

AT: 20%, DE: 19%. Bei Sozialtraegern auf Wunsch ohne USt (Reverse-Charge bei gueltiger UID).

## Laufzeit

Monatlich kuendbar mit 30 Tagen Frist. Jahresvertrag = 10% Rabatt.`,
    related: ["md-export"],
  },
];

export const articleMap = Object.fromEntries(articles.map((a) => [a.slug, a]));

export const categories = Array.from(new Set(articles.map((a) => a.category)));
