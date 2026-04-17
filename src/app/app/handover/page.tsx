import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HandoverGenerator } from "./handover-client";
import { FileText } from "lucide-react";

export default function HandoverPage() {
  return (
    <div className="space-y-8 p-6 lg:p-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-semibold tracking-tight">Schichtbericht</h1>
          <p className="mt-1 text-muted-foreground">
            KI-gestützte Übergabe für die nächste Schicht — aus Tagesberichten, Vitalwerten und Vorfällen.
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary">Früh → Spät</Badge>
          <Badge variant="outline">{new Date().toLocaleDateString("de-AT")}</Badge>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" /> Generierter Bericht</CardTitle>
        </CardHeader>
        <CardContent><HandoverGenerator /></CardContent>
      </Card>
    </div>
  );
}
