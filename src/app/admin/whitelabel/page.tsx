import { getBrand } from "@/lib/whitelabel/store";
import { PRESETS } from "@/lib/whitelabel/presets";
import { WhitelabelEditor } from "@/components/whitelabel/WhitelabelEditor";

export const metadata = { title: "White-Label · CareAI" };

export default async function WhitelabelPage() {
  const brand = getBrand();
  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6 lg:p-10">
      <header>
        <h1 className="font-serif text-3xl font-semibold tracking-tight">White-Label Brand-Builder</h1>
        <p className="mt-1 text-sm text-muted-foreground">Passe Name, Farben, Typografie, Domain und Assets für deinen Trägerverbund an.</p>
      </header>
      <WhitelabelEditor initial={brand} presets={PRESETS} />
    </div>
  );
}
