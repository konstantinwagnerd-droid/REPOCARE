"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, FileWarning, FileCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_BYTES = 50 * 1024 * 1024;

export function FileDropzone({
  onFileLoaded,
  accept = ".csv,.xml,.tsv,.txt",
}: {
  onFileLoaded: (args: { name: string; size: number; content: string }) => void;
  accept?: string;
}) {
  const [dragging, setDragging] = useState(false);
  const [info, setInfo] = useState<{ name: string; size: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    async (f: File) => {
      setError(null);
      if (f.size > MAX_BYTES) {
        setError(`Datei zu groß (${(f.size / 1024 / 1024).toFixed(1)} MB). Maximum 50 MB.`);
        return;
      }
      try {
        const content = await f.text();
        setInfo({ name: f.name, size: f.size });
        onFileLoaded({ name: f.name, size: f.size, content });
      } catch (err) {
        setError(`Datei konnte nicht gelesen werden: ${(err as Error).message}`);
      }
    },
    [onFileLoaded],
  );

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const f = e.dataTransfer.files[0];
          if (f) void handleFile(f);
        }}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            inputRef.current?.click();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Datei auswählen oder per Drag-and-Drop hochladen"
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
          dragging ? "border-primary bg-primary/5" : "border-border bg-muted/30 hover:border-primary/50",
        )}
      >
        <Upload className="size-8 text-muted-foreground" aria-hidden="true" />
        <div>
          <p className="font-medium">Datei hierher ziehen oder klicken</p>
          <p className="text-sm text-muted-foreground">CSV, XML oder TSV — bis 50 MB</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleFile(f);
          }}
        />
      </div>

      {info && !error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm">
          <FileCheck className="size-5 text-primary" aria-hidden="true" />
          <span className="font-medium">{info.name}</span>
          <span className="text-muted-foreground">({(info.size / 1024).toFixed(1)} KB)</span>
        </div>
      )}
      {error && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <FileWarning className="size-5" aria-hidden="true" />
          {error}
        </div>
      )}
    </div>
  );
}
