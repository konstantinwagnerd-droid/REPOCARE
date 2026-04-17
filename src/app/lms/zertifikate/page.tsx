import { CertificateViewer } from "@/components/lms/CertificateViewer";
import { Card, CardContent } from "@/components/ui/card";
import { db, DEMO_CURRENT_USER } from "@/lib/lms/store";
import { Award } from "lucide-react";

export default function ZertifikatePage() {
  const user = DEMO_CURRENT_USER;
  const certs = db().certificates.filter((c) => c.userId === user.id);
  return (
    <div className="space-y-6 p-6 lg:p-10">
      <div>
        <h1 className="font-serif text-4xl font-semibold tracking-tight">Meine Zertifikate</h1>
        <p className="mt-1 text-muted-foreground">
          {certs.length} Zertifikat{certs.length === 1 ? "" : "e"} — verifizierbar via QR-Code und Code.
        </p>
      </div>
      {certs.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-10 text-center">
            <Award className="h-10 w-10 text-muted-foreground" />
            <h2 className="font-serif text-xl font-semibold">Noch keine Zertifikate</h2>
            <p className="text-sm text-muted-foreground">
              Nach erfolgreichem Abschluss eines Kurses erscheint Ihr Zertifikat hier.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {certs
            .slice()
            .sort((a, b) => (a.issuedAt > b.issuedAt ? -1 : 1))
            .map((c) => (
              <CertificateViewer key={c.id} cert={c} />
            ))}
        </div>
      )}
    </div>
  );
}
