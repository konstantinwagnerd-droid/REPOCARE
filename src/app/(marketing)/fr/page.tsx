import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, ShieldCheck, Sparkles, HeartPulse, FileText, ClipboardCheck, BrainCircuit, ArrowRight, Check, Globe2 } from "lucide-react";

const features = [
  { icon: Mic, title: "Voix d'abord, pas le clavier", desc: "Les soignants dictent, CareAI structure. 67% de temps de documentation en moins par service." },
  { icon: BrainCircuit, title: "Pré-remplissage SIS intelligent", desc: "Évaluation structurée avec 6 champs thématiques et matrice de risque R1–R7 — suggérée automatiquement." },
  { icon: ClipboardCheck, title: "Plan de soins automatique", desc: "À partir du SIS et des rapports quotidiens, CareAI génère des mesures individuelles conformes MDK." },
  { icon: HeartPulse, title: "Vitaux et risques en un coup d'œil", desc: "Chutes, escarres, délire — scores prédictifs avec flèches de tendance et alertes d'escalade." },
  { icon: FileText, title: "Transmission en 30 secondes", desc: "L'IA résume tous les événements pertinents pour la transmission — fini le chaos des post-it." },
  { icon: ShieldCheck, title: "Sûr MDK et prêt pour l'audit", desc: "Chaque modification est tracée. Exigence de justification satisfaite. Export auditeur en un clic." },
] as const;

const pricing = [
  { name: "Starter", price: 299, seats: "jusqu'à 25 lits", tag: "Pour petits prestataires", features: ["Toutes les fonctions de base", "Voix illimitée", "SIS, mesures, MAR", "Support par e-mail", "Hébergement DACH"] },
  { name: "Professional", price: 599, seats: "jusqu'à 80 lits", tag: "Le plus populaire", highlight: true, features: ["Tout Starter", "Portail familial", "Scores de risque avancés", "Planificateur d'équipes", "Intégrations API", "Support prioritaire"] },
  { name: "Enterprise", price: 999, seats: "à partir de 80 lits", tag: "Multi-sites et on-prem", features: ["Tout Professional", "Option on-premise", "SSO / SAML", "CSM dédié", "SLA 99,9%", "Modèles IA personnalisés"] },
];

const faqs = [
  { q: "CareAI est-il conforme au RGPD ?", a: "Oui. Serveurs à Falkenstein (Hetzner, Allemagne). Chiffrement de bout en bout. DPA et TOM disponibles. Aucun transfert vers des pays tiers." },
  { q: "Respectez-vous l'EU AI Act ?", a: "CareAI relève de la catégorie Haut risque (IA en santé). Nous remplissons toutes les exigences : système de gestion des risques, obligations de transparence, supervision humaine." },
  { q: "Combien de temps dure l'intégration ?", a: "Généralement 2 à 4 semaines. Nous prenons en charge l'import depuis Vivendi, MediFox, Senso ou Excel. Formation sur site ou à distance incluse." },
  { q: "Cela fonctionne-t-il avec des gants sur tablette ?", a: "Oui. Toutes les cibles tactiles font au moins 44×44 pixels. La voix rend la saisie inutile la plupart du temps." },
];

export default function FrHomePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 dot-pattern opacity-60" />
        <div className="absolute inset-x-0 top-0 -z-10 h-[60vh] bg-gradient-to-b from-primary-50/60 via-background to-background" />
        <div className="container grid gap-12 py-20 lg:grid-cols-12 lg:py-32">
          <div className="lg:col-span-7">
            <Badge variant="outline" className="mb-6 gap-1.5 rounded-full border-primary/20 bg-primary/5 text-primary">
              <Sparkles className="h-3 w-3" /> Nouveau : automatisation SIS en bêta
            </Badge>
            <h1 className="text-balance font-serif text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              Plus de temps pour les personnes.<br />
              <span className="text-primary-700">Moins pour la paperasse.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground md:text-xl">
              CareAI est la suite de documentation assistée par IA pour l&apos;Autriche, l&apos;Allemagne, la Suisse et la France. Entrée vocale, automatisation SIS, planification des soins.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="xl" variant="accent">
                <Link href="/signup">Demander une démo <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="xl" variant="outline">
                <Link href="/fr/contact">Nous contacter</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              <Globe2 className="inline h-4 w-4 mr-1" />
              Hébergement DACH · RGPD · EU AI Act · ISO 27001 en cours
            </p>
          </div>
        </div>
      </section>

      <section className="container py-16">
        <h2 className="font-serif text-4xl font-semibold">Tout ce dont les soignants ont besoin.</h2>
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
        <h2 className="font-serif text-4xl font-semibold">Tarifs</h2>
        <p className="mt-2 text-muted-foreground">Transparent, par mois, hors TVA. Facturé annuellement.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {pricing.map((p) => (
            <Card key={p.name} className={p.highlight ? "border-primary shadow-lg" : ""}>
              <CardContent className="p-6">
                {p.highlight && <Badge variant="default" className="mb-3">{p.tag}</Badge>}
                <h3 className="font-serif text-2xl font-semibold">{p.name}</h3>
                <p className="text-sm text-muted-foreground">{p.seats}</p>
                <p className="mt-4 text-4xl font-semibold">€{p.price}<span className="text-base font-normal text-muted-foreground">/mois</span></p>
                <ul className="mt-4 space-y-2 text-sm">
                  {p.features.map((feat) => <li key={feat} className="flex gap-2"><Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />{feat}</li>)}
                </ul>
                <Button asChild className="mt-6 w-full" variant={p.highlight ? "accent" : "outline"}>
                  <Link href="/fr/contact">Parler au commercial</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container py-16">
        <h2 className="font-serif text-4xl font-semibold">Questions fréquentes</h2>
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
        <h2 className="font-serif text-4xl font-semibold">Prêt à soulager votre équipe ?</h2>
        <p className="mt-3 text-muted-foreground">Voyez CareAI en action en 20 minutes.</p>
        <Button asChild size="xl" variant="accent" className="mt-6">
          <Link href="/fr/contact">Demander une démo <ArrowRight className="ml-1 h-4 w-4" /></Link>
        </Button>
      </section>
    </>
  );
}
