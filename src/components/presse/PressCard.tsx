import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface PressItem {
  slug: string;
  date: string;
  category: string;
  title: string;
  subtitle: string;
  location: string;
}

export function PressCard({ item }: { item: PressItem }) {
  return (
    <Card className="group h-full transition-all hover:border-primary/50 hover:shadow-md">
      <CardContent className="flex h-full flex-col gap-4 p-6">
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <Badge variant="outline">{item.category}</Badge>
          <span className="inline-flex items-center gap-1">
            <Calendar className="size-3.5" aria-hidden="true" />
            <time dateTime={item.date}>
              {new Date(item.date).toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </time>
          </span>
          <span>·</span>
          <span>{item.location}</span>
        </div>
        <h3 className="font-serif text-xl font-semibold leading-tight">
          <Link href={`/presse/pressemeldungen/${item.slug}`} className="hover:text-primary">
            {item.title}
          </Link>
        </h3>
        <p className="flex-1 text-sm text-muted-foreground">{item.subtitle}</p>
        <Link
          href={`/presse/pressemeldungen/${item.slug}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Meldung lesen <ArrowRight className="size-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
