import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, ShieldCheck, Sparkles, HeartPulse, FileText, ClipboardCheck, BrainCircuit, ArrowRight, Check, Globe2 } from "lucide-react";

const features = [
  { icon: Mic, title: "Voce prima, non tastiera", desc: "Gli operatori dettano, CareAI struttura. 67% in meno di tempo di documentazione per turno." },
  { icon: BrainCircuit, title: "Pre-compilazione SIS intelligente", desc: "Valutazione strutturata con 6 campi tematici e matrice di rischio R1–R7 — suggerita automaticamente." },
  { icon: ClipboardCheck, title: "Piano assistenziale automatico", desc: "Da SIS e rapporti giornalieri, CareAI genera misure individuali conformi MDK." },
  { icon: HeartPulse, title: "Parametri vitali e rischi a colpo d'occhio", desc: "Cadute, lesioni da pressione, delirium — punteggi predittivi con trend e avvisi di escalation." },
  { icon: FileText, title: "Consegna in 30 secondi", desc: "L'IA riassume tutti gli eventi rilevanti per la consegna — niente più caos di post-it." },
  { icon: ShieldCheck, title: "Sicuro MDK e pronto per l'audit", desc: "Ogni modifica tracciata. Requisito di motivazione soddisfatto. Export auditor con un clic." },
] as const;

const pricing = [
  { name: "Starter", price: 299, seats: "fino a 25 posti letto", tag: "Per piccoli fornitori", features: ["Tutte le funzioni core", "Voce illimitata", "SIS, misure, MAR", "Supporto via email", "Hosting DACH"] },
  { name: "Professional", price: 599, seats: "fino a 80 posti letto", tag: "Il più popolare", highlight: true, features: ["Tutto Starter", "Portale famiglia", "Punteggi di rischio avanzati", "Pianificatore turni", "Integrazioni API", "Supporto prioritario"] },
  { name: "Enterprise", price: 999, seats: "da 80 posti letto", tag: "Multi-sede e on-prem", features: ["Tutto Professional", "Opzione on-premise", "SSO / SAML", "CSM dedicato", "SLA 99,9%", "Modelli IA personalizzati"] },
];

const faqs = [
  { q: "CareAI è conforme al GDPR?", a: "Sì. Server a Falkenstein (Hetzner, Germania). Crittografia end-to-end. DPA e TOM disponibili. Nessun trasferimento verso paesi terzi." },
  { q: "Rispettate l'EU AI Act?", a: "CareAI rientra nella categoria Alto Rischio (IA sanitaria). Soddisfiamo tutti i requisiti: gestione del rischio, trasparenza, supervisione umana." },
  { q: "Quanto dura l'onboarding?", a: "Tipicamente 2–4 settimane. Gestiamo l'import da Vivendi, MediFox, Senso o Excel. Formazione in loco o remota inclusa." },
  { q: "Funziona con guanti su tablet?", a: "Sì. Tutti i target tattili sono almeno 44×44 pixel. La voce rende superflua la digitazione nella maggior parte dei casi." },
];

export default function ItHomePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 dot-pattern opacity-60" />
        <div className="absolute inset-x-0 top-0 -z-10 h-[60vh] bg-gradient-to-b from-primary-50/60 via-background to-background" />
        <div className="container grid gap-12 py-20 lg:grid-cols-12 lg:py-32">
          <div className="lg:col-span-7">
            <Badge variant="outline" className="mb-6 gap-1.5 rounded-full border-primary/20 bg-primary/5 text-primary">
              <Sparkles className="h-3 w-3" /> Nuovo: automazione SIS in beta
            </Badge>
            <h1 className="text-balance font-serif text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              Più tempo per le persone.<br />
              <span className="text-primary-700">Meno per le scartoffie.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground md:text-xl">
              CareAI è la suite di documentazione assistenziale basata sull&apos;IA per Austria, Germania, Svizzera e Italia. Input vocale, automazione SIS, pianificazione assistenziale.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="xl" variant="accent">
                <Link href="/signup">Richiedi una demo <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="xl" variant="outline">
                <Link href="/it/contatti">Contattaci</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              <Globe2 className="inline h-4 w-4 mr-1" />
              Hosting DACH · GDPR · EU AI Act · ISO 27001 in corso
            </p>
          </div>
        </div>
      </section>

      <section className="container py-16">
        <h2 className="font-serif text-4xl font-semibold">Tutto ciò di cui gli operatori hanno bisogno.</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title}><CardContent className="p-6">
              <f.icon className="h-6 w-6 text-primary" />
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </CardContent></Card>
          ))}
        </div>
      </section>

      <section className="container py-16">
        <h2 className="font-serif text-4xl font-semibold">Prezzi</h2>
        <p className="mt-2 text-muted-foreground">Trasparente, al mese, IVA esclusa. Fatturato annualmente.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {pricing.map((p) => (
            <Card key={p.name} className={p.highlight ? "border-primary shadow-lg" : ""}>
              <CardContent className="p-6">
                {p.highlight && <Badge variant="default" className="mb-3">{p.tag}</Badge>}
                <h3 className="font-serif text-2xl font-semibold">{p.name}</h3>
                <p className="text-sm text-muted-foreground">{p.seats}</p>
                <p className="mt-4 text-4xl font-semibold">€{p.price}<span className="text-base font-normal text-muted-foreground">/mese</span></p>
                <ul className="mt-4 space-y-2 text-sm">
                  {p.features.map((feat) => <li key={feat} className="flex gap-2"><Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />{feat}</li>)}
                </ul>
                <Button asChild className="mt-6 w-full" variant={p.highlight ? "accent" : "outline"}>
                  <Link href="/it/contatti">Parla con le vendite</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container py-16">
        <h2 className="font-serif text-4xl font-semibold">Domande frequenti</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {faqs.map((f) => (
            <Card key={f.q}><CardContent className="p-6">
              <h3 className="font-semibold">{f.q}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.a}</p>
            </CardContent></Card>
          ))}
        </div>
      </section>

      <section className="container py-16 text-center">
        <h2 className="font-serif text-4xl font-semibold">Pronto a sgravare il tuo team?</h2>
        <p className="mt-3 text-muted-foreground">Scopri CareAI in azione in 20 minuti.</p>
        <Button asChild size="xl" variant="accent" className="mt-6">
          <Link href="/it/contatti">Richiedi una demo <ArrowRight className="ml-1 h-4 w-4" /></Link>
        </Button>
      </section>
    </>
  );
}
