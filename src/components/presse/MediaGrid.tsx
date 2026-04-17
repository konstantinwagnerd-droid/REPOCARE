import { Download, ImageIcon, FileVideo, Presentation, Palette } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface MediaAsset {
  id: string;
  label: string;
  description: string;
  format: string;
  size: string;
  kind: "logo" | "photo" | "video" | "deck" | "illustration";
}

const ICONS = {
  logo: Palette,
  photo: ImageIcon,
  video: FileVideo,
  deck: Presentation,
  illustration: ImageIcon,
} as const;

export function MediaGrid({ assets }: { assets: MediaAsset[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {assets.map((asset) => {
        const Icon = ICONS[asset.kind];
        return (
          <Card key={asset.id} className="h-full">
            <CardContent className="flex gap-4 p-5">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Icon className="size-6" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold leading-tight">{asset.label}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{asset.description}</p>
                <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="rounded-full bg-muted px-2 py-0.5">{asset.format}</span>
                  <span>·</span>
                  <span>{asset.size}</span>
                </div>
              </div>
              <button
                type="button"
                className="inline-flex size-10 shrink-0 items-center justify-center self-start rounded-xl border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary"
                aria-label={`${asset.label} herunterladen`}
              >
                <Download className="size-4" />
              </button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
