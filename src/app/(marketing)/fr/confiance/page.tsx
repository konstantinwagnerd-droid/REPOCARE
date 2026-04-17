import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Lock, Server, FileCheck, Users, Globe2 } from "lucide-react";

export const metadata = { title: "Centre de confiance", alternates: { canonical: "/fr/confiance", languages: { "de-DE": "/trust", "en-US": "/en/trust", "fr-FR": "/fr/confiance", "it-IT": "/it/fiducia", "es-ES": "/es/confianza" } } };

const pillars = [
  { icon: ShieldCheck, title: "RGPD by design", desc: "Minimisation des données, limitation finalisée, workflows d'effacement, modèles DPA pour clients." },
  { icon: Lock, title: "Chiffrement de bout en bout", desc: "TLS 1.3 en transit, AES-256 au repos, clés gérées par le client sur Enterprise." },
  { icon: Server, title: "Hébergement DACH uniquement", desc: "Centre principal Hetzner Falkenstein (DE), site de secours Vienne (AT). Aucune donnée ne quitte l'UE." },
  { icon: FileCheck, title: "ISO 27001 en cours", desc: "Audit de certification prévu Q4 2026. Tous les contrôles en place." },
  { icon: Users, title: "Supervision humaine", desc: "Chaque suggestion IA est vérifiable. Les soignants confirment avant toute écriture." },
  { icon: Globe2, title: "Conforme EU AI Act", desc: "Système à haut risque pleinement documenté : gestion des risques, transparence, journalisation." },
];

const certs = [
  { name: "RGPD / DSGVO", status: "Conforme" },
  { name: "EU AI Act", status: "Conforme (Art. 6 + Annexe III)" },
  { name: "ISO 27001", status: "Audit Q4 2026" },
  { name: "BSI C5", status: "En préparation" },
  { name: "HDS (FR)", status: "Feuille de route 2027" },
];

export default function FrTrustPage() {
  return (
    <div className="container py-20">
      <Badge variant="outline" className="mb-4">Centre de confiance</Badge>
      <h1 className="font-serif text-5xl font-semibold">Une sécurité vérifiable.</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">Les données de soins sont parmi les plus sensibles qui soient. Voici comment nous les protégeons.</p>
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {pillars.map((p) => (
          <Card key={p.title}><CardContent className="p-6">
            <p.icon className="h-6 w-6 text-primary" />
            <h2 className="mt-4 text-lg font-semibold">{p.title}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
          </CardContent></Card>
        ))}
      </div>
      <h2 className="mt-16 font-serif text-3xl font-semibold">Certifications et cadres</h2>
      <div className="mt-6 overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50"><tr><th className="p-3 text-left">Cadre</th><th className="p-3 text-left">Statut</th></tr></thead>
          <tbody>{certs.map((c) => <tr key={c.name} className="border-t"><td className="p-3 font-medium">{c.name}</td><td className="p-3 text-muted-foreground">{c.status}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
