import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Voice client carries MediaRecorder, framer-motion and audio processing — only
// needed once the user actually lands on /app/voice. Lazy-loading it keeps the
// cost off every other /app/* page that shares the same layout chunk.
const VoiceClient = dynamic(
  () => import("./voice-client").then((m) => ({ default: m.VoiceClient })),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 animate-pulse rounded-lg bg-muted/40" aria-busy="true" />
    ),
  },
);

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
