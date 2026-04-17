import Link from "next/link";
import { MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
  return (
    <div className="space-y-6 text-center">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <MailCheck className="h-7 w-7" />
      </span>
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight">E-Mail bestätigen</h1>
        <p className="mt-2 text-muted-foreground">
          Wir haben Ihnen einen Bestätigungslink gesendet. Bitte prüfen Sie Ihr Postfach.
        </p>
      </div>
      <Button asChild variant="outline" size="lg"><Link href="/login">Zum Login</Link></Button>
    </div>
  );
}
