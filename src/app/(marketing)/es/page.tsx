import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mic, ShieldCheck, Sparkles, HeartPulse, FileText, ClipboardCheck, BrainCircuit, ArrowRight, Check, Globe2 } from "lucide-react";

const features = [
  { icon: Mic, title: "La voz primero, no el teclado", desc: "Los cuidadores dictan, CareAI estructura. 67% menos tiempo de documentación por turno." },
  { icon: BrainCircuit, title: "Pre-llenado SIS inteligente", desc: "Evaluación estructurada con 6 campos temáticos y matriz de riesgo R1–R7 — sugerida automáticamente." },
  { icon: ClipboardCheck, title: "Plan de cuidados automático", desc: "A partir del SIS y los informes diarios, CareAI genera medidas individuales conformes al MDK." },
  { icon: HeartPulse, title: "Signos vitales y riesgos de un vistazo", desc: "Caídas, úlceras por presión, delirium — puntajes predictivos con tendencias y alertas de escalada." },
  { icon: FileText, title: "Cambio de turno en 30 segundos", desc: "La IA resume todos los eventos relevantes para la entrega — adiós al caos de los post-it." },
  { icon: ShieldCheck, title: "Seguro para MDK y listo para auditoría", desc: "Cada cambio registrado. Requisito de justificación cumplido. Exportación para auditor con un clic." },
] as const;

const pricing = [
  { name: "Starter", price: 299, seats: "hasta 25 camas", tag: "Para pequeños proveedores", features: ["Todas las funciones básicas", "Voz ilimitada", "SIS, medidas, MAR", "Soporte por email", "Alojamiento DACH"] },
  { name: "Professional", price: 599, seats: "hasta 80 camas", tag: "El más popular", highlight: true, features: ["Todo Starter", "Portal familiar", "Puntajes de riesgo avanzados", "Planificador de turnos", "Integraciones API", "Soporte prioritario"] },
  { name: "Enterprise", price: 999, seats: "desde 80 camas", tag: "Multi-sitio y on-prem", features: ["Todo Professional", "Opción on-premise", "SSO / SAML", "CSM dedicado", "SLA 99,9%", "Modelos IA personalizados"] },
];

const faqs = [
  { q: "¿CareAI cumple el RGPD?", a: "Sí. Servidores en Falkenstein (Hetzner, Alemania). Cifrado de extremo a extremo. DPA y TOM disponibles. Sin transferencias a terceros países." },
  { q: "¿Cumplen el EU AI Act?", a: "CareAI entra en la categoría Alto Riesgo (IA en salud). Cumplimos todos los requisitos: gestión de riesgos, transparencia, supervisión humana." },
  { q: "¿Cuánto dura el onboarding?", a: "Típicamente 2–4 semanas. Gestionamos la importación desde Vivendi, MediFox, Senso o Excel. Formación in situ o remota incluida." },
  { q: "¿Funciona con guantes en la tableta?", a: "Sí. Todos los objetivos táctiles miden al menos 44×44 píxeles. La voz hace innecesario escribir la mayor parte del tiempo." },
];

export default function EsHomePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 dot-pattern opacity-60" />
        <div className="absolute inset-x-0 top-0 -z-10 h-[60vh] bg-gradient-to-b from-primary-50/60 via-background to-background" />
        <div className="container grid gap-12 py-20 lg:grid-cols-12 lg:py-32">
          <div className="lg:col-span-7">
            <Badge variant="outline" className="mb-6 gap-1.5 rounded-full border-primary/20 bg-primary/5 text-primary">
              <Sparkles className="h-3 w-3" /> Nuevo: automatización SIS en beta
            </Badge>
            <h1 className="text-balance font-serif text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              Más tiempo para las personas.<br />
              <span className="text-primary-700">Menos para el papeleo.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground md:text-xl">
              CareAI es la suite de documentación asistencial con IA para Austria, Alemania, Suiza y España. Entrada por voz, automatización SIS, planificación de cuidados.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="xl" variant="accent">
                <Link href="/signup">Solicitar una demo <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="xl" variant="outline">
                <Link href="/es/contacto">Contáctanos</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              <Globe2 className="inline h-4 w-4 mr-1" />
              Alojamiento DACH · RGPD · EU AI Act · ISO 27001 en curso
            </p>
          </div>
        </div>
      </section>

      <section className="container py-16">
        <h2 className="font-serif text-4xl font-semibold">Todo lo que necesitan los cuidadores.</h2>
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
        <h2 className="font-serif text-4xl font-semibold">Precios</h2>
        <p className="mt-2 text-muted-foreground">Transparente, al mes, IVA no incluido. Facturado anualmente.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {pricing.map((p) => (
            <Card key={p.name} className={p.highlight ? "border-primary shadow-lg" : ""}>
              <CardContent className="p-6">
                {p.highlight && <Badge variant="default" className="mb-3">{p.tag}</Badge>}
                <h3 className="font-serif text-2xl font-semibold">{p.name}</h3>
                <p className="text-sm text-muted-foreground">{p.seats}</p>
                <p className="mt-4 text-4xl font-semibold">€{p.price}<span className="text-base font-normal text-muted-foreground">/mes</span></p>
                <ul className="mt-4 space-y-2 text-sm">
                  {p.features.map((feat) => <li key={feat} className="flex gap-2"><Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />{feat}</li>)}
                </ul>
                <Button asChild className="mt-6 w-full" variant={p.highlight ? "accent" : "outline"}>
                  <Link href="/es/contacto">Hablar con ventas</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container py-16">
        <h2 className="font-serif text-4xl font-semibold">Preguntas frecuentes</h2>
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
        <h2 className="font-serif text-4xl font-semibold">¿Listo para aliviar a tu equipo?</h2>
        <p className="mt-3 text-muted-foreground">Vea CareAI en acción en 20 minutos.</p>
        <Button asChild size="xl" variant="accent" className="mt-6">
          <Link href="/es/contacto">Solicitar una demo <ArrowRight className="ml-1 h-4 w-4" /></Link>
        </Button>
      </section>
    </>
  );
}
