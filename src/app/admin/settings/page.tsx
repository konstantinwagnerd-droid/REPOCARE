import { db } from "@/db/client";
import { auth } from "@/lib/auth";
import { tenants } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Server, Lock } from "lucide-react";

export default async function SettingsPage() {
  const session = await auth();
  const [tenant] = await db.select().from(tenants).where(eq(tenants.id, session!.user.tenantId)).limit(1);

  return (
    <div className="space-y-8 p-6 lg:p-10">
      <div>
        <h1 className="font-serif text-4xl font-semibold tracking-tight">Einstellungen</h1>
        <p className="mt-1 text-muted-foreground">Einrichtungsstamm, Hosting und Datenschutz.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Einrichtungsstamm</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2"><Label htmlFor="name">Name der Einrichtung</Label><Input id="name" defaultValue={tenant?.name} /></div>
            <div className="space-y-2"><Label htmlFor="address">Anschrift</Label><Input id="address" defaultValue={tenant?.address ?? ""} /></div>
            <div className="space-y-2"><Label>Aktueller Tarif</Label><div><Badge variant="accent" className="capitalize">{tenant?.plan}</Badge></div></div>
            <Button variant="outline">Speichern</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Hosting & Datenschutz</CardTitle></CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex items-start gap-3 rounded-xl border border-border p-3"><Server className="mt-0.5 h-4 w-4 text-primary" /><div><div className="font-semibold">Rechenzentrum</div><div className="text-muted-foreground">Hetzner Falkenstein (Deutschland), ISO 27001</div></div></div>
            <div className="flex items-start gap-3 rounded-xl border border-border p-3"><Lock className="mt-0.5 h-4 w-4 text-primary" /><div><div className="font-semibold">Verschlüsselung</div><div className="text-muted-foreground">AES-256 at rest · TLS 1.3 in transit</div></div></div>
            <div className="flex items-start gap-3 rounded-xl border border-border p-3"><ShieldCheck className="mt-0.5 h-4 w-4 text-primary" /><div><div className="font-semibold">Auftragsverarbeitung</div><div className="text-muted-foreground">AV-Vertrag unterschrieben am 01.03.2026</div></div></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
