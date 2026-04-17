import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ToursDemoClient } from "./client";

/**
 * Admin-Demo-Seite fuer alle Touren.
 * Erlaubt Testen ohne localStorage zu resetten.
 */
export default async function AdminToursPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "admin") redirect("/app");

  return (
    <div className="container mx-auto max-w-4xl py-10">
      <h1 className="font-serif text-3xl font-semibold">Tour-Demo</h1>
      <p className="mt-2 text-muted-foreground">
        Starten Sie eine beliebige Tour zum Testen. Fortschritt wird bei jedem Start zurueckgesetzt.
      </p>
      <ToursDemoClient />
    </div>
  );
}
