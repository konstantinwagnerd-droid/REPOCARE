import { TerminForm } from './termin-form';

export const metadata = { title: 'Neue Konsultation · CareAI Telemedizin' };

export default function TerminVereinbarenPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6 p-6 lg:p-10">
      <header>
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Neue Konsultation planen</h1>
        <p className="mt-1 text-muted-foreground">
          Termin mit einer Ärzt:in anlegen. Das Pflegeteam wird benachrichtigt.
        </p>
      </header>
      <TerminForm />
    </div>
  );
}
