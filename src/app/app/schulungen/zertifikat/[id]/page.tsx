import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db/client";
import { trainingCertificates, trainingModules, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { PrintButton } from "./PrintButton";

export const metadata = { title: "Zertifikat · CareAI" };

export default async function ZertifikatPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { id } = await params;
  const [row] = await db
    .select({
      id: trainingCertificates.id,
      issuedAt: trainingCertificates.issuedAt,
      expiresAt: trainingCertificates.expiresAt,
      hash: trainingCertificates.certificateHash,
      userId: trainingCertificates.userId,
      userName: users.fullName,
      moduleTitle: trainingModules.title,
      category: trainingModules.category,
    })
    .from(trainingCertificates)
    .innerJoin(users, eq(users.id, trainingCertificates.userId))
    .innerJoin(trainingModules, eq(trainingModules.id, trainingCertificates.moduleId))
    .where(eq(trainingCertificates.id, id))
    .limit(1);

  if (!row) return <div className="p-6">Zertifikat nicht gefunden.</div>;

  const sessionUserId = (session.user as { id?: string }).id;
  const role = (session.user as { role?: string }).role;
  if (row.userId !== sessionUserId && role !== "admin" && role !== "pdl") {
    return <div className="p-6">Kein Zugriff.</div>;
  }

  return (
    <div className="mx-auto max-w-3xl p-6">
      <div className="mb-4 flex justify-end print:hidden">
        <PrintButton />
      </div>

      <article className="relative aspect-[1/1.4142] rounded-lg border-4 border-emerald-700 bg-white p-12 shadow-sm">
        <div className="absolute right-6 top-6 text-xs text-muted-foreground">CareAI · Nr. {row.hash.slice(0, 12).toUpperCase()}</div>
        <header className="text-center">
          <div className="mx-auto mb-6 h-12 w-48 rounded bg-emerald-100 text-center text-xs leading-[3rem] text-emerald-900">
            [Logo-Platzhalter]
          </div>
          <p className="text-sm uppercase tracking-widest text-emerald-800">Zertifikat</p>
          <h1 className="mt-2 font-serif text-4xl font-semibold">Schulungsnachweis</h1>
        </header>

        <section className="mt-10 text-center">
          <p className="text-sm text-slate-600">hiermit wird bestaetigt, dass</p>
          <p className="mt-3 font-serif text-3xl font-semibold">{row.userName}</p>
          <p className="mt-3 text-sm text-slate-600">am</p>
          <p className="mt-1 text-lg">{new Date(row.issuedAt).toLocaleDateString("de-AT", { day: "2-digit", month: "long", year: "numeric" })}</p>
          <p className="mt-3 text-sm text-slate-600">die Pflichtschulung</p>
          <p className="mt-1 text-xl font-semibold">{row.moduleTitle}</p>
          <p className="mt-1 text-xs uppercase tracking-widest text-slate-500">Kategorie: {row.category}</p>
          <p className="mt-5 text-sm text-slate-600">
            mit Erfolg abgeschlossen hat.
          </p>
          {row.expiresAt && (
            <p className="mt-2 text-xs text-slate-500">
              Gueltig bis: {new Date(row.expiresAt).toLocaleDateString("de-AT")}
            </p>
          )}
        </section>

        <footer className="absolute bottom-12 left-12 right-12 flex items-end justify-between">
          <div>
            <div className="h-px w-48 bg-slate-400" />
            <p className="mt-1 text-xs text-slate-500">Unterschrift Pflegedienstleitung</p>
          </div>
          <div>
            <div className="h-px w-48 bg-slate-400" />
            <p className="mt-1 text-xs text-slate-500">Unterschrift Teilnehmer:in</p>
          </div>
        </footer>
      </article>
    </div>
  );
}
