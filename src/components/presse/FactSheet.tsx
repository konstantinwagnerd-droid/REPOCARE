import { Card, CardContent } from "@/components/ui/card";

export interface FactRow {
  label: string;
  value: string;
}

export interface FactSection {
  title: string;
  rows: FactRow[];
}

export function FactSheet({ sections }: { sections: FactSection[] }) {
  return (
    <div className="print:break-inside-avoid space-y-6">
      {sections.map((section) => (
        <Card key={section.title}>
          <CardContent className="p-6">
            <h3 className="mb-4 font-serif text-lg font-semibold">{section.title}</h3>
            <dl className="grid gap-x-6 gap-y-3 md:grid-cols-[180px_1fr]">
              {section.rows.map((r) => (
                <div key={r.label} className="contents">
                  <dt className="text-sm font-medium text-muted-foreground">{r.label}</dt>
                  <dd className="text-sm">{r.value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
