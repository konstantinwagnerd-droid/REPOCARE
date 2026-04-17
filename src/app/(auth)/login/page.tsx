import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Willkommen zurück</h1>
        <p className="mt-2 text-muted-foreground">
          Melden Sie sich mit Ihrer E-Mail-Adresse und Ihrem Passwort an.
        </p>
      </div>

      <Suspense fallback={<div className="h-48 animate-pulse rounded-xl bg-muted" />}>
        <LoginForm />
      </Suspense>

      <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm">
        <div className="mb-2 font-semibold">Demo-Zugänge</div>
        <ul className="space-y-1 text-xs text-muted-foreground">
          <li><code className="font-mono">admin@careai.demo</code> · Admin</li>
          <li><code className="font-mono">pdl@careai.demo</code> · Pflegedienstleitung</li>
          <li><code className="font-mono">pflege@careai.demo</code> · Pflegekraft</li>
          <li><code className="font-mono">familie@careai.demo</code> · Angehöriger</li>
          <li className="mt-2">Passwort für alle: <code className="font-mono font-semibold">Demo2026!</code></li>
        </ul>
      </div>

      <p className="text-sm text-muted-foreground">
        Noch kein Zugang?{" "}
        <Link href="/signup" className="font-semibold text-primary hover:underline">
          Demo anfragen
        </Link>
      </p>
    </div>
  );
}

export const dynamic = "force-dynamic";
