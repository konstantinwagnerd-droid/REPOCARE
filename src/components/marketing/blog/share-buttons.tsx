"use client";

import { Button } from "@/components/ui/button";
import { Share2, Link2, Check } from "lucide-react";
import { useState } from "react";

export function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url: window.location.href });
      } catch {
        // abgebrochen
      }
    } else {
      void copyLink();
    }
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={share}>
        <Share2 className="mr-2 h-4 w-4" /> Teilen
      </Button>
      <Button variant="outline" size="sm" onClick={copyLink}>
        {copied ? <Check className="mr-2 h-4 w-4" /> : <Link2 className="mr-2 h-4 w-4" />}
        {copied ? "Kopiert" : "Link kopieren"}
      </Button>
    </div>
  );
}
