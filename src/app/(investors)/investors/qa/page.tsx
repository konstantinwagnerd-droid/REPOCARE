import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Investor Q&A — CareAI Data Room" };

const qas = [
  {
    q: "Wie verdient ihr Geld?",
    a: "Pro Einrichtung ein jaehrlicher Lizenzvertrag (typisch 42.000 EUR ACV), skaliert mit Bettenzahl. Zusaetzlich optionale Module (FHIR-Konnektor, Angehoerigen-Portal) als Upsell. Kein nutzerbasiertes Pricing — das scheitert in der Pflege an hoher Fluktuation.",
  },
  {
    q: "Was wenn Medifox oder Vivendi nachziehen?",
    a: "Beide sind Legacy-Systeme mit erheblicher technischer Altlast (Vivendi stammt aus den 90ern, viele Customers noch auf Desktop-Installation). Eine Voice-first-Architektur + EU-AI-Act-Konformitaet ist kein Feature, sondern Architekturentscheidung — die koennen sie nicht in 6-12 Monaten nachziehen. Unsere 2-3 Jahre Vorsprung sind realistisch.",
  },
  {
    q: "Wie schuetzt ihr euch gegen US-Big-Tech (Nuance, Oracle Cerner)?",
    a: "DSGVO Art. 9 + EU AI Act fordern praktisch EU-Hosting fuer Pflegedaten. Unser USP ist 'komplett Europa'. Auch wenn ein US-Anbieter EU-Hosting anbietet, bleibt das Klagerisiko unter CLOUD Act. Das ist fuer deutsche/oesterreichische Kommunen und Traeger ein Deal-Breaker.",
  },
  {
    q: "Warum ist der Markt nicht schon voll?",
    a: "Pflege-IT ist historisch konservativ. Medifox/Vivendi haben jahrzehntelang Marktmacht ausgenutzt, Innovation kam von keinem Player. Erst Covid + Pflegekraefte-Mangel + EU AI Act schaffen jetzt das Fenster. Timing ist unsere wichtigste These.",
  },
  {
    q: "Wie skalierbar ist Voice? Domain-Modelle sind teuer.",
    a: "Wir nutzen Open-Source-Basemodelle (Whisper Large v3 + Llama-basierte Fine-Tunes), gehostet auf unserer Infrastruktur bei Hetzner. Marginale Infrastruktur-Kosten ~3,50 EUR pro Heim/Monat. Das ergibt unsere 82% Gross Margin.",
  },
  {
    q: "Ist der Gruender nicht zu jung?",
    a: "Konstantin ist 19 und CEO. Das ist ungewoehnlich, aber keine Beschraenkung — er hat 18 Monate intensive Domain-Arbeit hinter sich, ein exzellentes Netzwerk im DACH-Pflegebereich und umgibt sich gezielt mit Senior-Advisory. Die CTO-Hire und Pflege-Expert:in-Ergaenzung sind strukturell vorgesehen.",
  },
  {
    q: "Welche Regulierungsrisiken seht ihr?",
    a: "Drei: (a) EU AI Act — wir bauen konform (Limited Risk heute, High Risk-Module separat mit CE); (b) DSGVO-Verschaerfungen — unsere EU-only-Architektur ist resilient; (c) nationale Pflegereformen — wir bilden Strukturmodell und NBA strukturell ab, aenderungsfaehig binnen Quartalen.",
  },
  {
    q: "Was ist euer Wettbewerbsvorteil in 5 Jahren?",
    a: "Daten-Advantage. Je mehr Pflegedaten (anonymisiert) wir aggregieren, desto besser unsere Fachwortschatz-Modelle und Qualitaetsindikatoren-Benchmarks. Das ist ein Netzwerkeffekt, der sich ueber Zeit verfestigt.",
  },
  {
    q: "Wie seht ihr einen moeglichen Exit?",
    a: "Primaer: Strategischer Exit an einen europaeischen Health-IT-Player (CompuGroup, Dedalus, Nexus) in 5-7 Jahren. Sekundaer: Fortfuehrung als unabhaengiger DACH-Marktfuehrer mit spaeterer Internationalisierung. IPO unwahrscheinlich bei europaeischer SaaS <100M ARR.",
  },
  {
    q: "Was tut ihr, wenn die Finanzierung nicht klappt?",
    a: "Wir haben Foerderungs-Zusagen aws Preseed (200k), EXIST-Antrag laeuft (100k+). Das haelt uns 18 Monate auch ohne Seed am Leben — dann mit staerkerer Traktion in die naechste Runde. Wir sind nicht abhaengig von einem einzigen Funding-Pfad.",
  },
  {
    q: "Wie passt der EU AI Act zu eurem Timing?",
    a: "Perfekt. Ab Aug 2026 voll wirksam. Einrichtungen werden Anbieter fragen 'sind Sie konform?'. Wer das nicht glasklar beantworten kann (Legacy-US-Anbieter), verliert Ausschreibungen. Wir nutzen das offensiv im Sales-Pitch.",
  },
  {
    q: "Habt ihr Plan B, falls der Pflegemarkt nicht schnell digitalisiert?",
    a: "Unser Produkt ist Dokumentations-Automation mit Sprach-KI. Die Kernfunktion laesst sich angrenzend in ambulante Pflege, Behindertenhilfe, Kinder- und Jugendhilfe uebertragen. Mittelfristige Markterweiterung ist technologisch gering, GTM-technisch machbar.",
  },
];

export default function InvestorQAPage() {
  return (
    <div className="container py-10">
      <h1 className="font-serif text-3xl font-semibold">Investor Q&A</h1>
      <p className="mt-2 text-muted-foreground">Haeufig gestellte Fragen. Direkt, ehrlich, mit Zahlen.</p>

      <div className="mt-8 space-y-4">
        {qas.map((x, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <p className="font-serif text-lg font-semibold">{x.q}</p>
              <p className="mt-3 text-sm text-muted-foreground">{x.a}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
