import { db } from "@/db/client";
import { exportRecords } from "@/db/schema";
import { eq } from "drizzle-orm";
import { formatDateTime } from "@/lib/utils";
import { CheckCircle2, XCircle, Shield } from "lucide-react";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function VerifyPage({ params }: { params: Promise<{ hash: string }> }) {
  const { hash } = await params;
  const [rec] = await db.select().from(exportRecords).where(eq(exportRecords.hash, hash)).limit(1);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E6F3F2] to-white px-6 py-16">
      <div className="mx-auto max-w-xl rounded-3xl border border-border bg-white p-10 shadow-xl">
        <div className="flex items-center gap-3">
          <Shield className="h-8 w-8 text-[#0E6B67]" />
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">CareAI</div>
            <h1 className="font-serif text-2xl font-semibold">Dokument-Verifikation</h1>
          </div>
        </div>

        {rec ? (
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-emerald-900">
              <CheckCircle2 className="h-6 w-6 flex-shrink-0" />
              <div>
                <div className="font-semibold">Hash gültig — Dokument authentisch</div>
                <div className="text-sm opacity-80">Dieses Dokument wurde aus CareAI exportiert und nicht verändert.</div>
              </div>
            </div>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between border-b border-border py-2">
                <dt className="text-muted-foreground">Typ</dt>
                <dd className="font-medium">{rec.kind}</dd>
              </div>
              <div className="flex justify-between border-b border-border py-2">
                <dt className="text-muted-foreground">Dateiname</dt>
                <dd className="font-mono text-xs">{rec.filename}</dd>
              </div>
              <div className="flex justify-between border-b border-border py-2">
                <dt className="text-muted-foreground">Exportiert am</dt>
                <dd className="font-medium">{formatDateTime(rec.createdAt)}</dd>
              </div>
              {rec.recipient ? (
                <div className="flex justify-between border-b border-border py-2">
                  <dt className="text-muted-foreground">Empfänger</dt>
                  <dd className="font-medium">{rec.recipient}</dd>
                </div>
              ) : null}
              <div className="py-2">
                <dt className="text-muted-foreground">SHA-256 Hash</dt>
                <dd className="mt-1 break-all font-mono text-xs">{rec.hash}</dd>
              </div>
            </dl>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-2 rounded-2xl bg-rose-50 p-4 text-rose-900">
              <XCircle className="h-6 w-6 flex-shrink-0" />
              <div>
                <div className="font-semibold">Hash nicht gefunden</div>
                <div className="text-sm opacity-80">Dieser Hash ist in CareAI nicht registriert. Das Dokument stammt nicht aus diesem System oder wurde verändert.</div>
              </div>
            </div>
            <div className="py-2 text-sm">
              <div className="text-muted-foreground">Gesuchter Hash</div>
              <div className="mt-1 break-all font-mono text-xs">{hash}</div>
            </div>
          </div>
        )}

        <p className="mt-8 text-xs text-muted-foreground">
          CareAI speichert für jeden Export einen revisionssicheren SHA-256-Hash. Diese Verifikation funktioniert offline
          innerhalb der Einrichtung — externe API-Aufrufe sind nicht nötig.
        </p>
      </div>
    </div>
  );
}
