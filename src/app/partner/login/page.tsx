import Link from "next/link";
import { ArrowLeft, Handshake } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PartnerLoginForm } from "@/components/partner/PartnerLoginForm";

export const metadata = { title: "Login" };

export default function PartnerLoginPage() {
  return (
    <div className="container flex min-h-[calc(100vh-80px)] max-w-md flex-col justify-center py-12">
      <Link href="/partner" className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" />
        Zurück zur Partner-Seite
      </Link>

      <Card>
        <CardContent className="space-y-6 p-8">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Handshake className="size-5" aria-hidden="true" />
            </div>
            <div>
              <h1 className="font-serif text-2xl font-semibold">Partner-Login</h1>
              <p className="text-sm text-muted-foreground">Zugriff aufs Partner-Dashboard.</p>
            </div>
          </div>

          <PartnerLoginForm />

          <div className="rounded-xl border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
            <strong>Demo-Zugang:</strong> <code>partner@muellertech.de</code> · Passwort <code>demo2026</code>
          </div>

          <p className="text-center text-sm">
            Noch kein Partner?{" "}
            <Link href="/partner#bewerbung" className="font-medium text-primary hover:underline">
              Jetzt bewerben
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
