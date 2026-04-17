"use client";

import { useTransition } from "react";
import { FileDown } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ExportButton({
  endpoint,
  body,
  label = "PDF Export",
  variant = "outline",
  size = "sm",
}: {
  endpoint: string;
  body?: Record<string, unknown>;
  label?: string;
  variant?: "default" | "accent" | "outline" | "ghost" | "secondary" | "destructive" | "link";
  size?: "default" | "sm" | "lg" | "xl" | "icon";
}) {
  const [pending, start] = useTransition();

  const run = () => {
    start(async () => {
      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: body ? JSON.stringify(body) : "{}",
        });
        if (!res.ok) throw new Error(await res.text());
        const blob = await res.blob();
        const cd = res.headers.get("Content-Disposition") ?? "";
        const filename = cd.match(/filename="([^"]+)"/)?.[1] ?? "export.pdf";
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = filename; a.click();
        URL.revokeObjectURL(url);
        toast.success("Export fertig", { description: filename });
      } catch (e: unknown) {
        toast.error("Export fehlgeschlagen", { description: (e as Error).message });
      }
    });
  };

  return (
    <Button onClick={run} disabled={pending} variant={variant} size={size} className="no-print">
      <FileDown className="h-4 w-4" /> {pending ? "Generiere…" : label}
    </Button>
  );
}
