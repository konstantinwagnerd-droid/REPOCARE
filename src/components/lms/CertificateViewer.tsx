import type { Certificate } from "@/lib/lms/types";
import { qrPlaceholderSvg } from "@/lib/lms/certificate";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Download, ShieldCheck } from "lucide-react";

export function CertificateViewer({ cert }: { cert: Certificate }) {
  const qrSvg = qrPlaceholderSvg(cert.verificationCode, 96);
  const issued = new Date(cert.issuedAt).toLocaleDateString("de-AT");
  const valid = cert.validUntil ? new Date(cert.validUntil).toLocaleDateString("de-AT") : "unbegrenzt";
  const pct = Math.round((cert.score / cert.total) * 100);
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col gap-6 bg-gradient-to-br from-primary/10 via-muted/30 to-accent/10 p-6 sm:flex-row sm:items-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Award className="h-8 w-8" />
          </div>
          <div className="flex-1">
            <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Teilnahmebestätigung</div>
            <h3 className="mt-1 font-serif text-xl font-semibold leading-tight">{cert.courseTitle}</h3>
            <p className="text-sm text-muted-foreground">
              {cert.userName} · Personal-Nr. {cert.personnelNumber}
            </p>
          </div>
          <div dangerouslySetInnerHTML={{ __html: qrSvg }} aria-label="Verifikations-QR" />
        </div>
        <div className="grid gap-4 p-6 sm:grid-cols-4">
          <Meta label="Dauer">{cert.durationMinutes} Min</Meta>
          <Meta label="Punkte">{cert.score}/{cert.total} ({pct} %)</Meta>
          <Meta label="Ausgestellt">{issued}</Meta>
          <Meta label="Gültig bis">{valid}</Meta>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-muted/20 p-4">
          <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            Verifikations-Code <code className="font-mono text-foreground">{cert.verificationCode}</code>
          </span>
          <a
            href={`/api/lms/certificates/${cert.id}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground"
          >
            <Download className="h-4 w-4" /> Zertifikat (PDF / Druck)
          </a>
        </div>
      </CardContent>
    </Card>
  );
}

function Meta({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="font-serif text-lg font-semibold">{children}</div>
    </div>
  );
}
