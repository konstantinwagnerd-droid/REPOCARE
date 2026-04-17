import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Passwort zurücksetzen</h1>
        <p className="mt-2 text-muted-foreground">
          Geben Sie Ihre E-Mail-Adresse ein. Wir senden Ihnen einen Link zum Zurücksetzen.
        </p>
      </div>
      <form className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">E-Mail-Adresse</Label>
          <Input id="email" type="email" required autoComplete="email" />
        </div>
        <Button type="submit" size="lg" className="w-full">Reset-Link senden</Button>
      </form>
      <p className="text-sm text-muted-foreground">
        <Link href="/login" className="font-semibold text-primary hover:underline">Zurück zum Login</Link>
      </p>
    </div>
  );
}
