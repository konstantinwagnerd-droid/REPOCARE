import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Lock, Server, FileCheck, Users, Globe2 } from "lucide-react";

export const metadata = { title: "Trust Center", alternates: { canonical: "/it/fiducia", languages: { "de-DE": "/trust", "en-US": "/en/trust", "fr-FR": "/fr/confiance", "it-IT": "/it/fiducia", "es-ES": "/es/confianza" } } };

const pillars = [
  { icon: ShieldCheck, title: "GDPR by design", desc: "Minimizzazione dei dati, finalità, workflow di cancellazione, modelli DPA." },
  { icon: Lock, title: "Crittografia end-to-end", desc: "TLS 1.3 in transito, AES-256 a riposo, chiavi gestite dal cliente su Enterprise." },
  { icon: Server, title: "Hosting solo DACH", desc: "Data center primario Hetzner Falkenstein (DE), DR Vienna (AT). Nessun dato lascia l'UE." },
  { icon: FileCheck, title: "ISO 27001 in corso", desc: "Audit di certificazione previsto Q4 2026." },
  { icon: Users, title: "Supervisione umana", desc: "Ogni suggerimento IA è verificabile prima dell'inserimento." },
  { icon: Globe2, title: "Conforme EU AI Act", desc: "Sistema ad alto rischio pienamente documentato." },
];

const certs = [
  { name: "GDPR", status: "Conforme" },
  { name: "EU AI Act", status: "Conforme (Art. 6 + Allegato III)" },
  { name: "ISO 27001", status: "Audit Q4 2026" },
  { name: "AgID (IT)", status: "Roadmap 2027" },
];

export default function ItTrustPage() {
  return (
    <div className="container py-20">
      <Badge variant="outline" className="mb-4">Trust Center</Badge>
      <h1 className="font-serif text-5xl font-semibold">Sicurezza verificabile.</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">I dati assistenziali sono i più sensibili. Ecco esattamente come li proteggiamo.</p>
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pillars.map((p) => (
          <Card key={p.title}><CardContent className="p-6">
            <p.icon className="h-6 w-6 text-primary" />
            <h2 className="mt-4 text-lg font-semibold">{p.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
          </CardContent></Card>
        ))}
      </div>
      <h2 className="mt-16 font-serif text-3xl font-semibold">Certificazioni</h2>
      <div className="mt-6 overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50"><tr><th className="p-3 text-left">Framework</th><th className="p-3 text-left">Stato</th></tr></thead>
          <tbody>{certs.map((c) => <tr key={c.name} className="border-t"><td className="p-3 font-medium">{c.name}</td><td className="p-3 text-muted-foreground">{c.status}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
