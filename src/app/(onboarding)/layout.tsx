import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-primary-50/30 via-background to-background">
      <header className="border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 font-serif text-xl font-semibold">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </span>
            CareAI
          </Link>
          <Link href="/app" className="text-sm text-muted-foreground hover:text-foreground">
            Spaeter abschliessen
          </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
