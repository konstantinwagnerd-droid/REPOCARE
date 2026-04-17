import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Lock, Server, FileCheck, Users, Globe2 } from "lucide-react";

export const metadata = { title: "Centro de Confianza", alternates: { canonical: "/es/confianza", languages: { "de-DE": "/trust", "en-US": "/en/trust", "fr-FR": "/fr/confiance", "it-IT": "/it/fiducia", "es-ES": "/es/confianza" } } };

const pillars = [
  { icon: ShieldCheck, title: "RGPD por diseño", desc: "Minimización de datos, limitación de fines, flujos de borrado, plantillas DPA." },
  { icon: Lock, title: "Cifrado de extremo a extremo", desc: "TLS 1.3 en tránsito, AES-256 en reposo, claves gestionadas por el cliente en Enterprise." },
  { icon: Server, title: "Alojamiento solo DACH", desc: "CPD primario Hetzner Falkenstein (DE), DR Viena (AT). Ningún dato sale de la UE." },
  { icon: FileCheck, title: "ISO 27001 en curso", desc: "Auditoría de certificación en Q4 2026." },
  { icon: Users, title: "Supervisión humana", desc: "Cada sugerencia de IA es verificable antes del registro." },
  { icon: Globe2, title: "Cumple EU AI Act", desc: "Sistema de alto riesgo completamente documentado." },
];

const certs = [
  { name: "RGPD", status: "Conforme" },
  { name: "EU AI Act", status: "Conforme (Art. 6 + Anexo III)" },
  { name: "ISO 27001", status: "Auditoría Q4 2026" },
  { name: "ENS (ES)", status: "Hoja de ruta 2027" },
];

export default function EsTrustPage() {
  return (
    <div className="container py-20">
      <Badge variant="outline" className="mb-4">Centro de Confianza</Badge>
      <h1 className="font-serif text-5xl font-semibold">Seguridad verificable.</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">Los datos asistenciales son los más sensibles. Así los protegemos.</p>
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pillars.map((p) => (
          <Card key={p.title}><CardContent className="p-6">
            <p.icon className="h-6 w-6 text-primary" />
            <h2 className="mt-4 text-lg font-semibold">{p.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
          </CardContent></Card>
        ))}
      </div>
      <h2 className="mt-16 font-serif text-3xl font-semibold">Certificaciones</h2>
      <div className="mt-6 overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50"><tr><th className="p-3 text-left">Framework</th><th className="p-3 text-left">Estado</th></tr></thead>
          <tbody>{certs.map((c) => <tr key={c.name} className="border-t"><td className="p-3 font-medium">{c.name}</td><td className="p-3 text-muted-foreground">{c.status}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
