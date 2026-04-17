"use client";

import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import type { BrandConfig, BrandPreset, HeadlineFont, BodyFont } from "@/lib/whitelabel/types";
import { checkContrast, hexToOklchApprox, scaleFromHex, validateColors } from "@/lib/whitelabel/validator";
import { Copy, RefreshCcw, Save, Upload } from "lucide-react";

const HEADLINE_FONTS: HeadlineFont[] = ["Fraunces", "Playfair Display", "EB Garamond", "Alegreya", "Instrument Serif"];
const BODY_FONTS: BodyFont[] = ["Geist", "Inter Tight", "Manrope", "DM Sans", "Atkinson Hyperlegible"];

export function WhitelabelEditor({ initial, presets }: { initial: BrandConfig; presets: BrandPreset[] }) {
  const [cfg, setCfg] = useState<BrandConfig>(initial);
  const [message, setMessage] = useState<string | null>(null);

  const update = <K extends keyof BrandConfig>(key: K, value: BrandConfig[K]) => setCfg((c) => ({ ...c, [key]: value }));

  const applyPreset = (p: BrandPreset) => {
    setCfg((c) => ({ ...c, colors: p.colors, typography: p.typography }));
    setMessage(`Preset „${p.label}" angewendet`);
  };

  const save = async () => {
    const res = await fetch("/api/whitelabel/save", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(cfg) });
    if (res.ok) setMessage("Gespeichert");
    else setMessage("Fehler beim Speichern");
  };

  const reset = async () => {
    const res = await fetch("/api/whitelabel/reset", { method: "POST" });
    if (res.ok) {
      const data = await res.json();
      setCfg(data.brand);
      setMessage("Auf Default zurückgesetzt");
    }
  };

  const colorValidation = validateColors(cfg.colors);
  const contrastWhite = checkContrast(cfg.colors.primary, "#ffffff");
  const contrastOnPrimary = checkContrast("#ffffff", cfg.colors.primary);
  const scale = scaleFromHex(cfg.colors.primary);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => applyPreset(p)}
              className="group flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium hover:border-primary"
              title={p.description}
            >
              <span className="flex h-5 w-5 rounded" style={{ background: `linear-gradient(135deg, ${p.colors.gradientFrom}, ${p.colors.gradientTo})` }} />
              {p.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={reset}><RefreshCcw className="h-4 w-4" /> Reset</Button>
          <Button onClick={save}><Save className="h-4 w-4" /> Speichern</Button>
        </div>
      </div>
      {message && <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200">{message}</div>}

      <Tabs defaultValue="identity">
        <TabsList>
          <TabsTrigger value="identity">Identität</TabsTrigger>
          <TabsTrigger value="colors">Farben</TabsTrigger>
          <TabsTrigger value="typography">Typografie</TabsTrigger>
          <TabsTrigger value="domain">Domain</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="assets">Assets</TabsTrigger>
        </TabsList>

        <TabsContent value="identity">
          <Card><CardContent className="grid gap-4 p-6 md:grid-cols-2">
            <Field label="Produktname" value={cfg.identity.productName} onChange={(v) => update("identity", { ...cfg.identity, productName: v })} />
            <Field label="Tagline" value={cfg.identity.tagline} onChange={(v) => update("identity", { ...cfg.identity, tagline: v })} />
            <Field label="Footer-Text" value={cfg.identity.footerText} onChange={(v) => update("identity", { ...cfg.identity, footerText: v })} />
            <Field label="Support-E-Mail" value={cfg.identity.supportEmail} onChange={(v) => update("identity", { ...cfg.identity, supportEmail: v })} />
            <Field label="Support-Telefon" value={cfg.identity.supportPhone} onChange={(v) => update("identity", { ...cfg.identity, supportPhone: v })} />
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="colors">
          <Card><CardContent className="space-y-5 p-6">
            <div className="grid gap-4 md:grid-cols-2">
              <ColorField label="Primärfarbe" hex={cfg.colors.primary} onChange={(v) => update("colors", { ...cfg.colors, primary: v })} />
              <ColorField label="Akzentfarbe" hex={cfg.colors.accent} onChange={(v) => update("colors", { ...cfg.colors, accent: v })} />
              <ColorField label="Gradient-Start" hex={cfg.colors.gradientFrom} onChange={(v) => update("colors", { ...cfg.colors, gradientFrom: v })} />
              <ColorField label="Gradient-Ende" hex={cfg.colors.gradientTo} onChange={(v) => update("colors", { ...cfg.colors, gradientTo: v })} />
            </div>
            <div>
              <Label>Gradient-Vorschau</Label>
              <div className="mt-2 h-14 rounded-xl" style={{ background: `linear-gradient(135deg, ${cfg.colors.gradientFrom}, ${cfg.colors.gradientTo})` }} />
            </div>
            <div>
              <Label>10-Stufen-Skala (Primärfarbe)</Label>
              <div className="mt-2 flex h-9 overflow-hidden rounded-xl border border-border">
                {scale.map((c, i) => (
                  <div key={i} style={{ background: c, width: `${100 / scale.length}%` }} title={`${(i + 1) * 100}: ${c}`} />
                ))}
              </div>
            </div>
            <div className="grid gap-2 text-sm md:grid-cols-2">
              <div className="rounded-xl border border-border p-3">
                <div className="font-medium">Primär auf Weiß: {contrastWhite.ratio.toFixed(2)}:1</div>
                <div className="text-xs text-muted-foreground">{contrastWhite.note}</div>
                {!contrastWhite.wcagAA && <Badge variant="danger" className="mt-2">A11y-Warnung: WCAG AA nicht erfüllt</Badge>}
              </div>
              <div className="rounded-xl border border-border p-3">
                <div className="font-medium">Weiß auf Primär: {contrastOnPrimary.ratio.toFixed(2)}:1</div>
                <div className="text-xs text-muted-foreground">{contrastOnPrimary.note}</div>
              </div>
            </div>
            {!colorValidation.ok && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
                {colorValidation.errors.map((e) => <div key={e}>{e}</div>)}
              </div>
            )}
            <div className="rounded-xl border border-border bg-muted/30 p-3 text-xs text-muted-foreground">
              <strong>OKLCH (Näherung):</strong> Primär = <code>{hexToOklchApprox(cfg.colors.primary)}</code>
            </div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="typography">
          <Card><CardContent className="space-y-5 p-6">
            <div>
              <Label>Headline-Font</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {HEADLINE_FONTS.map((f) => (
                  <button
                    key={f}
                    onClick={() => update("typography", { ...cfg.typography, headline: f })}
                    className={`rounded-xl border px-3 py-2 text-sm transition-colors ${cfg.typography.headline === f ? "border-primary bg-primary/10" : "border-border hover:bg-secondary"}`}
                    style={{ fontFamily: f }}
                  >{f}</button>
                ))}
              </div>
            </div>
            <div>
              <Label>Body-Font</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {BODY_FONTS.map((f) => (
                  <button
                    key={f}
                    onClick={() => update("typography", { ...cfg.typography, body: f })}
                    className={`rounded-xl border px-3 py-2 text-sm transition-colors ${cfg.typography.body === f ? "border-primary bg-primary/10" : "border-border hover:bg-secondary"}`}
                    style={{ fontFamily: f }}
                  >{f}</button>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-border bg-background p-6">
              <div className="text-xs uppercase tracking-wide text-muted-foreground">Vorschau</div>
              <div className="mt-2 text-3xl" style={{ fontFamily: cfg.typography.headline }}>Die bessere Pflegeeinrichtung beginnt mit guter Dokumentation.</div>
              <div className="mt-3 text-sm leading-relaxed text-muted-foreground" style={{ fontFamily: cfg.typography.body }}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pflegekräfte dokumentieren am Bett. Das System fasst zusammen, prüft Konsistenz und erinnert an Pflichtfelder.
              </div>
            </div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="domain">
          <Card><CardContent className="space-y-5 p-6">
            <Field
              label="Custom-Domain"
              value={cfg.domain.customDomain}
              onChange={(v) => update("domain", { ...cfg.domain, customDomain: v, sslStatus: v ? "pending" : "n/a" })}
              placeholder="z.B. pflege.caritas-wien.at"
            />
            <div className="rounded-xl border border-border bg-muted/20 p-4">
              <div className="mb-2 text-sm font-medium">DNS-Setup</div>
              <DnsRow type="A" name="@" value="76.76.21.21" />
              <DnsRow type="CNAME" name="www" value="cname.careai.app" />
              <DnsRow type="TXT" name="_careai-verify" value={`careai-verify=${cfg.tenantId.slice(0, 8)}`} />
            </div>
            <div className="rounded-xl border border-border p-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-medium">SSL-Status:</span>
                {cfg.domain.sslStatus === "n/a" && <Badge variant="outline">nicht konfiguriert</Badge>}
                {cfg.domain.sslStatus === "pending" && <Badge variant="warning">Zertifikat wird automatisch geholt…</Badge>}
                {cfg.domain.sslStatus === "issued" && <Badge variant="success">Ausgestellt</Badge>}
                {cfg.domain.sslStatus === "failed" && <Badge variant="danger">Fehlgeschlagen</Badge>}
              </div>
              <p className="mt-2 text-xs text-muted-foreground">CareAI holt TLS-Zertifikate automatisch per Let&apos;s-Encrypt nach DNS-Verifikation. Keine manuelle Arbeit.</p>
            </div>
          </CardContent></Card>
        </TabsContent>

        <TabsContent value="preview">
          <BrandPreview cfg={cfg} />
        </TabsContent>

        <TabsContent value="assets">
          <AssetsPanel cfg={cfg} onChange={setCfg} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  );
}

function ColorField({ label, hex, onChange }: { label: string; hex: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <input type="color" value={hex} onChange={(e) => onChange(e.target.value)} className="h-11 w-14 cursor-pointer rounded-lg border border-border bg-background" />
        <Input value={hex} onChange={(e) => onChange(e.target.value)} />
      </div>
    </div>
  );
}

function DnsRow({ type, name, value }: { type: string; name: string; value: string }) {
  const copy = () => navigator.clipboard.writeText(value);
  return (
    <div className="grid grid-cols-[80px_120px_1fr_auto] items-center gap-2 border-t border-border py-2 first:border-0 text-xs">
      <span className="font-semibold">{type}</span>
      <code className="rounded bg-background px-2 py-1">{name}</code>
      <code className="truncate rounded bg-background px-2 py-1 font-mono">{value}</code>
      <button onClick={copy} className="rounded-md p-1.5 hover:bg-secondary" aria-label="Wert kopieren"><Copy className="h-3.5 w-3.5" /></button>
    </div>
  );
}

function BrandPreview({ cfg }: { cfg: BrandConfig }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <PreviewPane label="Default (CareAI)" cfg={defaultPreview()} />
      <PreviewPane label={`White-Label · ${cfg.identity.productName}`} cfg={cfg} />
    </div>
  );
}

function defaultPreview(): BrandConfig {
  return {
    id: "default",
    tenantId: "default",
    identity: { productName: "CareAI", tagline: "Pflege-Dokumentation, die mitdenkt.", footerText: "© CareAI GmbH", supportEmail: "support@careai.at", supportPhone: "+43 1 000 00 00" },
    colors: { primary: "#0F766E", accent: "#E11D48", gradientFrom: "#0F766E", gradientTo: "#14B8A6" },
    typography: { headline: "Fraunces", body: "Geist" },
    domain: { customDomain: "", sslStatus: "n/a" },
    assets: { logoDataUrl: null, faviconDataUrl: null, socialPreviewDataUrl: null, emailHeaderDataUrl: null },
    updatedAt: new Date().toISOString(),
  };
}

function PreviewPane({ label, cfg }: { label: string; cfg: BrandConfig }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-background">
      <div className="border-b border-border px-4 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
      <div className="space-y-4 p-6" style={{ fontFamily: cfg.typography.body }}>
        <div className="flex items-center gap-2">
          {cfg.assets.logoDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={cfg.assets.logoDataUrl} alt="Logo" className="h-8 w-auto" />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white" style={{ background: cfg.colors.primary }}>
              {cfg.identity.productName.charAt(0)}
            </span>
          )}
          <span className="font-semibold" style={{ fontFamily: cfg.typography.headline, color: cfg.colors.primary }}>{cfg.identity.productName}</span>
        </div>
        <div className="rounded-2xl p-6 text-white" style={{ background: `linear-gradient(135deg, ${cfg.colors.gradientFrom}, ${cfg.colors.gradientTo})` }}>
          <div className="text-xs uppercase opacity-80">Willkommen</div>
          <div className="mt-1 text-2xl font-semibold" style={{ fontFamily: cfg.typography.headline }}>{cfg.identity.tagline}</div>
        </div>
        <div className="grid gap-2 md:grid-cols-2">
          <div className="rounded-xl border border-border p-4">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Dashboard-Beispiel</div>
            <div className="mt-1 text-xl font-semibold" style={{ fontFamily: cfg.typography.headline }}>92,4%</div>
            <div className="text-xs text-muted-foreground">Doku-Quote</div>
          </div>
          <button
            className="rounded-xl px-4 py-3 text-sm font-semibold text-white"
            style={{ background: cfg.colors.primary }}
          >
            Bericht öffnen
          </button>
        </div>
        <div className="border-t border-border pt-3 text-[11px] text-muted-foreground">{cfg.identity.footerText}</div>
      </div>
    </div>
  );
}

function AssetsPanel({ cfg, onChange }: { cfg: BrandConfig; onChange: (c: BrandConfig) => void }) {
  return (
    <Card><CardContent className="space-y-4 p-6">
      <AssetSlot label="Logo (PNG/SVG, max. 2 MB)" slot="logoDataUrl" cfg={cfg} onChange={onChange} />
      <AssetSlot label="Favicon (32×32, PNG/ICO)" slot="faviconDataUrl" cfg={cfg} onChange={onChange} />
      <AssetSlot label="Social-Preview (1200×630)" slot="socialPreviewDataUrl" cfg={cfg} onChange={onChange} />
      <AssetSlot label="E-Mail-Header (600×200)" slot="emailHeaderDataUrl" cfg={cfg} onChange={onChange} />
    </CardContent></Card>
  );
}

function AssetSlot({ label, slot, cfg, onChange }: { label: string; slot: keyof BrandConfig["assets"]; cfg: BrandConfig; onChange: (c: BrandConfig) => void }) {
  const [error, setError] = useState<string | null>(null);
  const current = cfg.assets[slot];

  const handle = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = String(reader.result);
      const res = await fetch("/api/whitelabel/upload-asset", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ slot, dataUrl }) });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Upload fehlgeschlagen"); return; }
      setError(null);
      onChange(data.brand);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex items-center gap-4 rounded-xl border border-border p-4">
      <div className="flex h-16 w-24 items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-xs text-muted-foreground">
        {current ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={current} alt={label} className="max-h-full max-w-full object-contain" />
        ) : (
          "leer"
        )}
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium">{label}</div>
        {error && <div className="mt-1 text-xs text-rose-700">{error}</div>}
      </div>
      <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-background px-3 py-2 text-xs font-medium hover:bg-secondary">
        <Upload className="h-3.5 w-3.5" /> Hochladen
        <input
          type="file"
          className="hidden"
          accept="image/png,image/svg+xml,image/jpeg,image/webp,image/x-icon"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) handle(f); }}
        />
      </label>
    </div>
  );
}
