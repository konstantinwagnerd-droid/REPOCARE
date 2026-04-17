/**
 * Logo-Wall — Staedte-Wappen (Mock) mit Vertrauens-Claim.
 */
const cities = [
  { name: "Wien", label: "Wien" },
  { name: "Graz", label: "Graz" },
  { name: "Linz", label: "Linz" },
  { name: "Muenchen", label: "Muenchen" },
  { name: "Berlin", label: "Berlin" },
  { name: "Hamburg", label: "Hamburg" },
  { name: "Zuerich", label: "Zuerich" },
  { name: "Basel", label: "Basel" },
];

export function LogoWall() {
  return (
    <section className="border-y border-border/60 bg-muted/30">
      <div className="container py-12">
        <p className="text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Vertraut von Einrichtungen in
        </p>
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-8">
          {cities.map((c) => (
            <div key={c.name} className="flex flex-col items-center gap-2 opacity-70 transition hover:opacity-100">
              <div
                aria-hidden
                className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-card font-serif text-lg font-semibold text-primary-700 dark:text-primary-300"
              >
                {c.name[0]}
              </div>
              <span className="text-xs text-muted-foreground">{c.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
