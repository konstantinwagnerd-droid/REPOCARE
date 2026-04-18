import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VoiceClient } from "./voice-client";

// voice-client is a Client Component ("use client") — Next.js automatically
// code-splits it, so we don't need `dynamic({ ssr: false })`. That directive is
// forbidden in Server Components in Next 15.
export default function VoicePage() {
  return (
    <div className="space-y-8 p-6 lg:p-10">
      <div>
        <h1 className="font-serif text-4xl font-semibold tracking-tight">Spracheingabe</h1>
        <p className="mt-1 text-muted-foreground">
          Diktieren Sie frei — CareAI strukturiert automatisch nach SIS-Themenfeldern und schlägt Maßnahmen vor.
        </p>
      </div>
      <Card>
        <CardHeader><CardTitle>Aufnahme</CardTitle></CardHeader>
        <CardContent><VoiceClient /></CardContent>
      </Card>
    </div>
  );
}
