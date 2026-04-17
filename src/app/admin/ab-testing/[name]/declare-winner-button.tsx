"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function DeclareWinnerButton({
  experimentId,
  variantId,
  variantName,
  disabled,
}: {
  experimentId: string;
  variantId: string;
  variantName: string;
  disabled?: boolean;
}) {
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function onClick() {
    const ok = window.confirm(`Variante "${variantName}" als Gewinner deklarieren?\n\nDer Test wird abgeschlossen.`);
    if (!ok) return;
    setBusy(true);
    try {
      const res = await fetch("/api/ab-testing/winner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experimentId, variantId }),
      });
      if (res.ok) router.refresh();
      else window.alert("Fehler beim Deklarieren des Gewinners.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button size="sm" variant="outline" disabled={disabled || busy} onClick={onClick}>
      {busy ? "…" : "Als Gewinner"}
    </Button>
  );
}
