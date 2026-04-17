"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Lock } from "lucide-react";

// Mock-Token; in Produktion gegen Magic-Link-Auth austauschen.
const VALID_TOKENS = ["careai-seed-2026", "demo-investor-access"];
const STORAGE_KEY = "careai-investor-token";

export function InvestorGate({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState<boolean | null>(null);
  const [input, setInput] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    // Pruefen: Query-Param ?token=... oder localStorage
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    const qToken = url.searchParams.get("token");
    const stored = localStorage.getItem(STORAGE_KEY);
    const candidate = qToken ?? stored;
    if (candidate && VALID_TOKENS.includes(candidate)) {
      localStorage.setItem(STORAGE_KEY, candidate);
      setOk(true);
    } else {
      setOk(false);
    }
  }, []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (VALID_TOKENS.includes(input.trim())) {
      localStorage.setItem(STORAGE_KEY, input.trim());
      setOk(true);
    } else {
      setError(true);
    }
  }

  if (ok === null) return null;

  if (!ok) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg">
          <Lock className="mb-4 h-8 w-8 text-primary" />
          <h1 className="font-serif text-2xl font-semibold">CareAI Data Room</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Dieser Bereich ist nur fuer autorisierte Investoren zugaenglich. Geben Sie Ihren Zugangs-Token ein oder oeffnen Sie
            den von uns gesendeten Link.
          </p>
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="invtoken">Zugangs-Token</Label>
              <Input
                id="invtoken"
                type="password"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="z.B. careai-seed-2026"
                autoFocus
              />
              {error && <p className="mt-2 text-sm text-destructive">Token ungueltig.</p>}
            </div>
            <Button type="submit" variant="accent" className="w-full">Zugang oeffnen</Button>
          </form>
          <p className="mt-6 text-xs text-muted-foreground">
            Kein Token? Schreiben Sie an <a className="text-primary underline-offset-4 hover:underline" href="mailto:investors@careai.eu">investors@careai.eu</a>.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
