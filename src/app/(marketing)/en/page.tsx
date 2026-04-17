import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mic, ShieldCheck, Sparkles, HeartPulse, FileText, ClipboardCheck,
  BrainCircuit, ArrowRight, Check, Quote, Globe2,
} from "lucide-react";

const features = [
  { icon: Mic, title: "Voice-first instead of typing", desc: "Caregivers dictate, CareAI structures. 67% less documentation time per shift." },
  { icon: BrainCircuit, title: "Smart SIS pre-fill", desc: "Structured assessment with 6 topic fields and R1–R7 risk matrix — auto-suggested." },
  { icon: ClipboardCheck, title: "Automatic care plan", desc: "From SIS and daily reports, CareAI generates individual, MDK-compliant measures." },
  { icon: HeartPulse, title: "Vitals & risks at a glance", desc: "Falls, pressure ulcers, delirium — predictive scores with trend arrows and escalation hints." },
  { icon: FileText, title: "Shift handover in 30 seconds", desc: "AI summarises all relevant events for handover — no more sticky-note chaos." },
  { icon: ShieldCheck, title: "MDK-safe & audit-proof", desc: "Every change logged. Justification requirement satisfied. Auditor export at the push of a button." },
] as const;

const impacts = [
  { sdg: "SDG 3", title: "Good Health & Well-being", desc: "More time at the bedside." },
  { sdg: "SDG 5", title: "Gender Equality", desc: "Care is 80% female — we unburden." },
  { sdg: "SDG 8", title: "Decent Work", desc: "Less burnout, more meaning." },
  { sdg: "SDG 10", title: "Reduced Inequalities", desc: "Affordable for small providers too." },
];

const pricing = [
  { name: "Starter", price: 299, seats: "up to 25 beds", tag: "For small providers", features: ["All core features", "Unlimited voice input", "SIS, measures, MAR", "Email support", "DACH hosting"] },
  { name: "Professional", price: 599, seats: "up to 80 beds", tag: "Most popular", highlight: true, features: ["Everything in Starter", "Family portal", "Advanced risk scores", "Shift & roster planner", "API integrations", "Priority support"] },
  { name: "Enterprise", price: 999, seats: "from 80 beds", tag: "Multi-site & on-prem", features: ["Everything in Professional", "On-premise option", "SSO / SAML", "Dedicated CSM", "SLA 99.9%", "Custom AI models"] },
];

const testimonials = [
  { name: "Maria Kreuzer", role: "Director of Nursing, Senior Residence Hietzing", quote: "We no longer write — we care. Documentation has become a side task. That's exactly how it should be." },
  { name: "Dr. Ahmed Sadeghi", role: "Managing Director, Pflege Aktiv Süd", quote: "After six weeks of piloting we had 90 minutes more time per shift. Our attrition has dropped 21% since." },
];

const faqs = [
  { q: "Is CareAI GDPR-compliant?", a: "Yes. Servers in Falkenstein (Hetzner, Germany). End-to-end encrypted. DPA and TOMs available. No data transfer to third countries." },
  { q: "Do you meet the EU AI Act?", a: "CareAI falls under the High-Risk category (AI in healthcare). We satisfy all requirements: risk management system, transparency duties, human oversight. Documentation on request." },
  { q: "How long does onboarding take?", a: "Typically 2–4 weeks. We handle data import from Vivendi, MediFox, Senso or Excel. On-site or remote training included." },
  { q: "Does it work with gloves on tablets?", a: "Yes. All touch targets are at least 44×44 pixels. Voice input makes typing unnecessary most of the time." },
];

export default function EnHomePage() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 dot-pattern opacity-60" />
        <div className="absolute inset-x-0 top-0 -z-10 h-[60vh] bg-gradient-to-b from-primary-50/60 via-background to-background" />
        <div className="container grid gap-12 py-20 lg:grid-cols-12 lg:py-32">
          <div className="lg:col-span-7">
            <Badge variant="outline" className="mb-6 gap-1.5 rounded-full border-primary/20 bg-primary/5 text-primary">
              <Sparkles className="h-3 w-3" /> New: SIS automation in beta
            </Badge>
            <h1 className="text-balance font-serif text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
              More time for people.<br />
              <span className="text-primary-700">Less for paperwork.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted-foreground md:text-xl">
              CareAI is the AI-powered care documentation suite for Austria, Germany and Switzerland.
              Voice input, SIS automation, care planning — in a calm interface that caregivers actually enjoy using.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="xl" variant="accent">
                <Link href="/signup">Book a demo <ArrowRight className="ml-1 h-4 w-4" /></Link>
              </Button>
              <Button asChild size="xl" variant="outline">
                <Link href="/login">Open live demo</Link>
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              <Globe2 className="inline h-4 w-4 mr-1" />
              DACH-hosted · GDPR · EU AI Act · ISO 27001 on track
            </p>
          </div>
        </div>
      </section>

      <section className="container py-16">
        <h2 className="font-serif text-4xl font-semibold">Everything caregivers need. Nothing they don&apos;t.</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title}>
              <CardContent className="p-6">
                <f.icon className="h-6 w-6 text-primary" />
                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container py-16">
        <h2 className="font-serif text-4xl font-semibold">Impact that matters</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {impacts.map((i) => (
            <Card key={i.sdg}><CardContent className="p-5">
              <Badge>{i.sdg}</Badge>
              <h3 className="mt-3 font-semibold">{i.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{i.desc}</p>
            </CardContent></Card>
          ))}
        </div>
      </section>

      <section className="container py-16">
        <h2 className="font-serif text-4xl font-semibold">Pricing</h2>
        <p className="mt-2 text-muted-foreground">Transparent, per month, excl. VAT. Billed annually.</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {pricing.map((p) => (
            <Card key={p.name} className={p.highlight ? "border-primary shadow-lg" : ""}>
              <CardContent className="p-6">
                {p.highlight && <Badge variant="default" className="mb-3">{p.tag}</Badge>}
                <h3 className="font-serif text-2xl font-semibold">{p.name}</h3>
                <p className="text-sm text-muted-foreground">{p.seats}</p>
                <p className="mt-4 text-4xl font-semibold">€{p.price}<span className="text-base font-normal text-muted-foreground">/mo</span></p>
                <ul className="mt-4 space-y-2 text-sm">
                  {p.features.map((feat) => <li key={feat} className="flex gap-2"><Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />{feat}</li>)}
                </ul>
                <Button asChild className="mt-6 w-full" variant={p.highlight ? "accent" : "outline"}>
                  <Link href="/en/contact">Talk to sales</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="container py-16">
        <h2 className="font-serif text-4xl font-semibold">What customers say</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {testimonials.map((t) => (
            <Card key={t.name}><CardContent className="p-6">
              <Quote className="h-6 w-6 text-primary" />
              <p className="mt-3 italic">&ldquo;{t.quote}&rdquo;</p>
              <p className="mt-4 font-semibold">{t.name}</p>
              <p className="text-sm text-muted-foreground">{t.role}</p>
            </CardContent></Card>
          ))}
        </div>
      </section>

      <section className="container py-16">
        <h2 className="font-serif text-4xl font-semibold">Frequently asked questions</h2>
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
        <h2 className="font-serif text-4xl font-semibold">Ready to unburden your team?</h2>
        <p className="mt-3 text-muted-foreground">See CareAI in action in 20 minutes.</p>
        <Button asChild size="xl" variant="accent" className="mt-6">
          <Link href="/en/contact">Book a demo <ArrowRight className="ml-1 h-4 w-4" /></Link>
        </Button>
      </section>
    </>
  );
}
