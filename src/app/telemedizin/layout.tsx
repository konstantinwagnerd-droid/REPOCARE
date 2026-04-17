import Link from 'next/link';
import { Stethoscope, CalendarPlus, History, Pill, Home } from 'lucide-react';

export const metadata = { title: 'Telemedizin · CareAI' };

export default function TelemedizinLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 flex-col border-r border-border bg-card/50 p-4 md:flex">
        <Link href="/telemedizin" className="mb-8 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Stethoscope className="h-5 w-5" />
          </span>
          <span className="font-serif text-lg font-semibold">Telemedizin</span>
        </Link>
        <nav className="flex flex-1 flex-col gap-1 text-sm">
          <NavLink href="/telemedizin" icon={<Home className="h-4 w-4" />}>Dashboard</NavLink>
          <NavLink href="/telemedizin/termin-vereinbaren" icon={<CalendarPlus className="h-4 w-4" />}>
            Neuer Termin
          </NavLink>
          <NavLink href="/telemedizin/historie" icon={<History className="h-4 w-4" />}>Historie</NavLink>
          <NavLink href="/telemedizin/rezepte" icon={<Pill className="h-4 w-4" />}>e-Rezepte</NavLink>
        </nav>
        <div className="rounded-lg border border-border p-3 text-xs text-muted-foreground">
          TI / ELGA-kompatible Daten­struktur. Siehe{' '}
          <Link href="/telemedizin" className="underline">Docs</Link>.
        </div>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}

function NavLink({ href, icon, children }: { href: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      {icon}
      <span>{children}</span>
    </Link>
  );
}
