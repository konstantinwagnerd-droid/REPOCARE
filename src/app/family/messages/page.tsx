import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const thread = [
  { from: "Pflegeteam", name: "Anna Weber", ts: "Heute, 14:22", text: "Guten Tag Frau Huber, Ihre Mutter hat heute wunderbar beim Singkreis mitgemacht. Sie war richtig gut gelaunt." },
  { from: "Familie", name: "Sie", ts: "Heute, 12:10", text: "Danke für die lieben Nachrichten. Bringen Sie bitte die Fotos vom letzten Besuch zur nächsten Visite?" },
  { from: "Pflegeteam", name: "Dr. Ahmed Sadeghi", ts: "Gestern, 16:45", text: "Die Laborwerte sind heute gekommen und erfreulich — wir reduzieren Marcumar leicht. Angehörigengespräch am Freitag 16:00?" },
];

export default function MessagesPage() {
  return (
    <div className="space-y-8 p-6 lg:p-10">
      <div>
        <h1 className="font-serif text-4xl font-semibold tracking-tight">Nachrichten</h1>
        <p className="mt-1 text-muted-foreground">Asynchroner Austausch mit dem Pflegeteam.</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Aktuelle Konversation</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {thread.map((m, i) => (
            <div key={i} className={`flex ${m.from === "Familie" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-md rounded-2xl p-4 ${m.from === "Familie" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                <div className="mb-1 flex items-center gap-2 text-xs">
                  <Badge variant={m.from === "Familie" ? "outline" : "secondary"} className={m.from === "Familie" ? "border-primary-foreground/30 text-primary-foreground" : ""}>{m.from}</Badge>
                  <span className={m.from === "Familie" ? "text-primary-100" : "text-muted-foreground"}>{m.name} · {m.ts}</span>
                </div>
                <p className="text-sm">{m.text}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
