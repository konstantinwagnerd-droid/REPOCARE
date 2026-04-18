/**
 * Seed-Content fuer die Schulungs-Quiz-Engine.
 *
 * 4 Pflicht-Module mit fachlich korrektem Inhalt nach:
 *  - DNQP Expertenstandard Dekubitus (2017)
 *  - KRINKO / RKI Haendehygiene
 *  - BtMG §13, WHO-Stufenschema
 *  - AStV / Evakuierungskonzepte Altenheim
 *
 * Korrekte Antwort-Indizes sind 0-basiert. Bei `multi` Typ sind mehrere
 * Indizes zulaessig, beim Scoring zaehlt nur vollstaendige Uebereinstimmung.
 */

export type SeedQuestion = {
  question: string;
  type: "single" | "multi" | "truefalse";
  options: string[];
  correct: number[];
  explanation: string;
};

export type SeedModule = {
  slug: string;
  title: string;
  category: "dnqp" | "hygiene" | "btm" | "brandschutz" | "dsgvo" | "custom";
  description: string;
  passingScore: number;
  durationMinutes: number;
  isMandatory: boolean;
  validityMonths: number;
  questions: SeedQuestion[];
};

export const SEED_MODULES: SeedModule[] = [
  {
    slug: "dnqp-dekubitus",
    title: "DNQP-Expertenstandard Dekubitusprophylaxe",
    category: "dnqp",
    description:
      "Pflichtschulung nach DNQP-Expertenstandard (2. Aktualisierung 2017). Braden-Skala, Lagerungsintervalle, Hilfsmittel.",
    passingScore: 80,
    durationMinutes: 20,
    isMandatory: true,
    validityMonths: 12,
    questions: [
      {
        question: "Ab welchem Braden-Score besteht ein Dekubitusrisiko, das systematische Prophylaxe erfordert?",
        type: "single",
        options: ["≤ 9", "≤ 18", "≤ 23", "jeder Score unter 25"],
        correct: [1],
        explanation:
          "Braden ≤ 18 gilt laut DNQP als Risiko-Schwelle. Werte ≤ 9 zeigen sehr hohes Risiko an.",
      },
      {
        question: "Welches maximale Lagerungsintervall gilt bei einem immobilen Bewohner mit Risiko?",
        type: "single",
        options: ["Alle 30 Minuten", "Alle 2 Stunden (individuell anzupassen)", "Alle 4 Stunden fix", "Nur bei Schmerzaeusserung"],
        correct: [1],
        explanation:
          "2-Stunden-Rhythmus ist Orientierung. DNQP fordert individuelle Anpassung je nach Haut, Matratze, Mobilitaet.",
      },
      {
        question: "Welche Koerperstellen sind besonders dekubitus-gefaehrdet? (Mehrfachauswahl)",
        type: "multi",
        options: ["Sakrum", "Fersen", "Trochanter", "Bauchnabel"],
        correct: [0, 1, 2],
        explanation:
          "Klassische Praedilektionsstellen: Kreuzbein, Fersen, Trochanter. Knochenvorspruenge.",
      },
      {
        question: "Die Braden-Skala umfasst 6 Risikofaktoren. Welcher gehoert NICHT dazu?",
        type: "single",
        options: ["Sensorische Wahrnehmung", "Hautfeuchtigkeit", "Blutdruck", "Reibung und Scherkraefte"],
        correct: [2],
        explanation:
          "Braden: Wahrnehmung, Feuchtigkeit, Aktivitaet, Mobilitaet, Ernaehrung, Reibung/Scherkraefte. Kein Blutdruck.",
      },
      {
        question: "Die Dokumentation der Dekubitus-Risikoeinschaetzung muss bei stationaeren Bewohnern ... erfolgen.",
        type: "truefalse",
        options: ["bei Aufnahme und bei jeder wesentlichen Veraenderung", "nur einmal jaehrlich"],
        correct: [0],
        explanation:
          "Standard-Kriterium: Ersteinschaetzung bei Aufnahme + Aktualisierung bei Zustandsaenderung.",
      },
    ],
  },
  {
    slug: "hygiene-basis",
    title: "Hygiene-Basisschulung (KRINKO)",
    category: "hygiene",
    description:
      "Jaehrliche Pflichtschulung nach §36 IfSG. 5 Momente der Haendedesinfektion, Schutzkleidung, Isolierungen.",
    passingScore: 80,
    durationMinutes: 15,
    isMandatory: true,
    validityMonths: 12,
    questions: [
      {
        question: "Nennen Sie die 5 Momente der Haendedesinfektion (WHO). Welcher Moment fehlt: vor Patientenkontakt, vor aseptischer Taetigkeit, ___ , nach Patientenkontakt, nach Kontakt mit Patientenumgebung?",
        type: "single",
        options: [
          "Nach Kontakt mit potenziell infektioesem Material",
          "Nach dem Mittagessen",
          "Zu Schichtbeginn",
          "Nach dem Toilettengang",
        ],
        correct: [0],
        explanation: "Der 3. Moment ist: Nach Kontakt mit potenziell infektioesem Material.",
      },
      {
        question: "Welche Einwirkzeit ist bei haendedesinfektionsmittel nach RKI mindestens einzuhalten?",
        type: "single",
        options: ["5 Sekunden", "15 Sekunden", "30 Sekunden", "2 Minuten"],
        correct: [2],
        explanation: "Mindestens 30 Sekunden. Haende muessen waehrend der gesamten Zeit feucht bleiben.",
      },
      {
        question: "Welche Schutzkleidung ist bei einem Bewohner mit bestaetigter Norovirus-Infektion im Zimmer mindestens noetig? (Mehrfachauswahl)",
        type: "multi",
        options: ["Schutzkittel", "FFP2-Maske oder chirurgischer MNS", "Einmalhandschuhe", "Schutzhaube immer"],
        correct: [0, 1, 2],
        explanation:
          "Kittel, MNS und Handschuhe verpflichtend. Schutzhaube nur bei erhoehter Spritzgefahr (z.B. Erbrechen).",
      },
      {
        question: "MRSA-positive Bewohner werden in Pflegeheimen grundsaetzlich ___ untergebracht.",
        type: "single",
        options: [
          "im Einzelzimmer mit strikter Isolation wie im Krankenhaus",
          "unter Basishygiene, meist kein Einzelzimmer noetig (individuelle Risikobewertung)",
          "zusammen mit anderen MRSA-Patienten (Kohortierung)",
          "in einer externen Fachklinik",
        ],
        correct: [1],
        explanation:
          "KRINKO: Altenheim ≠ Krankenhaus. Basishygiene reicht meist. Einzelzimmer nur bei besonderen Risikofaktoren.",
      },
      {
        question: "Nach Gebrauch kontaminierter Einmalhandschuhe duerfen die gleichen Handschuhe fuer den naechsten Bewohner verwendet werden.",
        type: "truefalse",
        options: ["Wahr", "Falsch"],
        correct: [1],
        explanation: "Klarer Verstoss gegen Basishygiene. Handschuhwechsel + Haendedesinfektion zwischen Bewohnern.",
      },
      {
        question: "Wann ist das Haendewaschen mit Seife der Haendedesinfektion vorzuziehen?",
        type: "single",
        options: [
          "Immer, da gruendlicher",
          "Bei sichtbarer Verschmutzung und nach Kontakt mit C.-difficile-Patienten",
          "Nur abends zum Schichtende",
          "Niemals, Desinfektion ist immer besser",
        ],
        correct: [1],
        explanation:
          "Alkoholische Desinfektion wirkt nicht gegen C. difficile-Sporen. Bei sichtbarer Verschmutzung ebenfalls waschen.",
      },
    ],
  },
  {
    slug: "btm-opiate",
    title: "Umgang mit Betaeubungsmitteln und Opiaten (BtMG)",
    category: "btm",
    description:
      "Pflichtschulung nach BtMG §13. Doppeldokumentation, Tresor, Bestandspruefung, WHO-Stufenschema.",
    passingScore: 80,
    durationMinutes: 20,
    isMandatory: true,
    validityMonths: 12,
    questions: [
      {
        question: "Wer darf nach BtMG §13 Betaeubungsmittel anordnen?",
        type: "single",
        options: [
          "Jede examinierte Pflegekraft",
          "Ausschliesslich der behandelnde Arzt mittels BtM-Rezept",
          "Die Pflegedienstleitung bei Nacht",
          "Der Apotheker bei Rezepturherstellung",
        ],
        correct: [1],
        explanation: "BtM duerfen nur aerztlich verordnet werden - persoenlich unterzeichnet auf gelbem BtM-Rezept.",
      },
      {
        question: "Wie muss die Verabreichung eines BtM dokumentiert werden?",
        type: "single",
        options: [
          "Unterschrift der Pflegekraft reicht",
          "Doppeldokumentation: Pflegekraft + zweite Pflegekraft als Zeugin bei Vorbereitung",
          "Muendliche Uebergabe an die Kollegin",
          "Erst am Monatsende sammeln",
        ],
        correct: [1],
        explanation:
          "BtM-Verabreichung erfordert Doppeldokumentation (4-Augen-Prinzip) und fortlaufende BtM-Buchfuehrung.",
      },
      {
        question: "Wie muessen BtM gelagert werden?",
        type: "multi",
        options: [
          "In einem verschlossenen, fest verankerten Tresor/Schrank",
          "Getrennt von uebrigen Medikamenten",
          "Frei zugaenglich im Dienstzimmer",
          "Mit Bestandskontrolle bei jeder Schichtuebergabe oder arbeitstaeglich",
        ],
        correct: [0, 1, 3],
        explanation:
          "Verschlossener Behaelter, getrennte Lagerung, regelmaessige Bestandsfuehrung laut BtMVV §13+14.",
      },
      {
        question: "Welche Stufen umfasst das WHO-Stufenschema der Schmerztherapie?",
        type: "single",
        options: [
          "1 Stufe (nur Morphin)",
          "2 Stufen (Paracetamol, Morphin)",
          "3 Stufen (Nicht-Opioid → schwaches Opioid → starkes Opioid, jeweils +/- Koanalgetika)",
          "5 Stufen inkl. Cannabinoide",
        ],
        correct: [2],
        explanation:
          "Klassisches WHO-Stufenschema: 3 Stufen. Koanalgetika und Adjuvantien auf allen Stufen moeglich.",
      },
      {
        question: "Ein Fentanyl-Pflaster faellt beim Wechsel auf den Boden und ist verunreinigt. Was ist korrekt?",
        type: "single",
        options: [
          "In den normalen Restmuell",
          "Neu applizieren, altes Pflaster weiter verwenden",
          "Mit Zeugin vernichten (Falten, Hausmuell oder Rueckgabe Apotheke) und dokumentieren",
          "Dem Bewohner zur Aufbewahrung geben",
        ],
        correct: [2],
        explanation:
          "Verlust/Vernichtung eines BtM muss mit Zeugin dokumentiert und im BtM-Buch eingetragen werden.",
      },
      {
        question: "Nicht-aufgebrauchte BtM eines verstorbenen Bewohners duerfen fuer andere Bewohner verwendet werden.",
        type: "truefalse",
        options: ["Wahr", "Falsch"],
        correct: [1],
        explanation:
          "Patientenindividuelle Verordnung: Reste muessen dokumentiert vernichtet oder an die Apotheke zurueckgegeben werden.",
      },
    ],
  },
  {
    slug: "brandschutz-evakuierung",
    title: "Brandschutz und Evakuierung im Pflegeheim",
    category: "brandschutz",
    description:
      "Jaehrliche Pflichtschulung nach AStV. Brandklassen, horizontale vs. vertikale Evakuierung, Umgang mit bettlaegrigen Bewohnern.",
    passingScore: 80,
    durationMinutes: 15,
    isMandatory: true,
    validityMonths: 12,
    questions: [
      {
        question: "Was bedeutet 'horizontale Evakuierung' in einem Pflegeheim?",
        type: "single",
        options: [
          "Alle Bewohner ins Erdgeschoss",
          "Verlegung in den naechsten Brandabschnitt auf dem GLEICHEN Stockwerk",
          "Sofortige Raeumung des Gebaeudes",
          "Rettung nur ueber Balkone",
        ],
        correct: [1],
        explanation:
          "Horizontale Evakuierung = in sicheren Brandabschnitt auf derselben Etage. Im Altenheim vorrangig!",
      },
      {
        question: "Welche Brandklasse beschreibt brennende Festkoerper (Holz, Papier, Textilien)?",
        type: "single",
        options: ["Klasse A", "Klasse B", "Klasse D", "Klasse F"],
        correct: [0],
        explanation:
          "A = feste Stoffe. B = Fluessigkeiten, C = Gase, D = Metalle, F = Fettbrand.",
      },
      {
        question: "Welche Massnahmen gehoeren zur ersten Reaktion im Brandfall? (Mehrfachauswahl)",
        type: "multi",
        options: [
          "Brand melden (112 + Hausalarm)",
          "Bewohner aus Gefahrenzone bringen (Menschen retten geht vor Loeschen)",
          "Fenster weit oeffnen",
          "Brandabschnittstueren schliessen",
        ],
        correct: [0, 1, 3],
        explanation:
          "Melden, Retten, Loeschen - in dieser Reihenfolge. Fenster bleiben geschlossen (Sauerstoff).",
      },
      {
        question: "Ein bettlaegriger Bewohner kann nicht in den Rollstuhl transferiert werden. Wie evakuieren Sie ihn?",
        type: "single",
        options: [
          "Er bleibt zurueck",
          "Ueber Bettlaken auf dem Boden ziehen (Rettungstuch-Technik) in sicheren Brandabschnitt",
          "Nur mit Aerztin zusammen heben",
          "Durch das Fenster auf eine Leiter",
        ],
        correct: [1],
        explanation:
          "Matratzentransport / Rettungstuch-Technik: Bewohner auf Laken oder Matratze aus dem Bett auf den Boden ziehen.",
      },
      {
        question: "Die Brandschutzuebung muss in Pflegeeinrichtungen mindestens ___ stattfinden.",
        type: "single",
        options: ["alle 5 Jahre", "einmal jaehrlich", "bei Bedarf", "nur bei Neueinstellung"],
        correct: [1],
        explanation:
          "Nach AStV und ASR A2.2: regelmaessige Unterweisung + jaehrliche Uebung fuer alle Mitarbeiter.",
      },
    ],
  },
];
