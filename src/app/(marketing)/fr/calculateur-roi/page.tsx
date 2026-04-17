"use client";
import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, Euro } from "lucide-react";

export default function FrRoiPage() {
  const [beds, setBeds] = useState(60);
  const [staff, setStaff] = useState(45);
  const [wage, setWage] = useState(28);
  const [doc, setDoc] = useState(2);

  const result = useMemo(() => {
    const shifts = staff * 22;
    const hours = shifts * doc * 0.67;
    const annual = hours * wage * 12;
    const lic = beds <= 25 ? 299 : beds <= 80 ? 599 : 999;
    const roi = (annual - lic * 12) / (lic * 12);
    return { hours, annual, lic, roi };
  }, [beds, staff, wage, doc]);

  return (
    <div className="container py-20">
      <Badge variant="outline" className="mb-4">Calculateur ROI</Badge>
      <h1 className="font-serif text-5xl font-semibold">Combien CareAI vous ferait économiser ?</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">D&apos;après les pilotes indépendants : 67% de temps documentation économisé.</p>
      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <Card><CardContent className="p-6 space-y-5">
          <div><Label htmlFor="beds">Lits / places</Label><Input id="beds" type="number" value={beds} onChange={(e) => setBeds(+e.target.value || 0)} /></div>
          <div><Label htmlFor="staff">Soignants (ETP)</Label><Input id="staff" type="number" value={staff} onChange={(e) => setStaff(+e.target.value || 0)} /></div>
          <div><Label htmlFor="wage">Salaire horaire chargé (€)</Label><Input id="wage" type="number" value={wage} onChange={(e) => setWage(+e.target.value || 0)} /></div>
          <div><Label htmlFor="doc">Heures documentation/service</Label><Input id="doc" type="number" step="0.25" value={doc} onChange={(e) => setDoc(+e.target.value || 0)} /></div>
        </CardContent></Card>
        <div className="space-y-4">
          <Card><CardContent className="p-6"><Clock className="h-5 w-5 text-primary" /><p className="mt-2 text-sm text-muted-foreground">Heures économisées / mois</p><p className="text-3xl font-semibold">{result.hours.toFixed(0)} h</p></CardContent></Card>
          <Card><CardContent className="p-6"><Euro className="h-5 w-5 text-primary" /><p className="mt-2 text-sm text-muted-foreground">Économies annuelles</p><p className="text-3xl font-semibold">€{result.annual.toLocaleString("fr-FR", { maximumFractionDigits: 0 })}</p></CardContent></Card>
          <Card><CardContent className="p-6"><TrendingUp className="h-5 w-5 text-primary" /><p className="mt-2 text-sm text-muted-foreground">ROI (année 1)</p><p className="text-3xl font-semibold">{(result.roi * 100).toFixed(0)}%</p><p className="mt-1 text-xs text-muted-foreground">Licence €{result.lic}/mois</p></CardContent></Card>
        </div>
      </div>
    </div>
  );
}
