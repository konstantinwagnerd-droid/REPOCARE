import type { BrandConfig } from "./types";
import { PRESETS } from "./presets";

/**
 * Einfacher In-Memory-Store pro Tenant. Kein DB-Schema-Change.
 * In Prod würde das gegen eine tenants-Tabelle oder KV laufen.
 */
const STORE = new Map<string, BrandConfig>();

export const DEFAULT_TENANT = "demo-tenant";

export function defaultConfig(tenantId: string = DEFAULT_TENANT): BrandConfig {
  const p = PRESETS[0];
  return {
    id: `bc-${tenantId}`,
    tenantId,
    identity: {
      productName: "CareAI",
      tagline: "Pflege-Dokumentation, die mitdenkt.",
      footerText: "© CareAI GmbH — Mit Sorgfalt gebaut in Wien.",
      supportEmail: "support@careai.at",
      supportPhone: "+43 1 000 00 00",
    },
    colors: p.colors,
    typography: p.typography,
    domain: { customDomain: "", sslStatus: "n/a" },
    assets: { logoDataUrl: null, faviconDataUrl: null, socialPreviewDataUrl: null, emailHeaderDataUrl: null },
    updatedAt: new Date().toISOString(),
  };
}

export function getBrand(tenantId: string = DEFAULT_TENANT): BrandConfig {
  return STORE.get(tenantId) ?? defaultConfig(tenantId);
}

export function saveBrand(cfg: BrandConfig): BrandConfig {
  const persisted = { ...cfg, updatedAt: new Date().toISOString() };
  STORE.set(cfg.tenantId, persisted);
  return persisted;
}

export function resetBrand(tenantId: string = DEFAULT_TENANT): BrandConfig {
  STORE.delete(tenantId);
  return defaultConfig(tenantId);
}

export function uploadAsset(tenantId: string, slot: keyof BrandConfig["assets"], dataUrl: string): BrandConfig {
  const current = getBrand(tenantId);
  const next = { ...current, assets: { ...current.assets, [slot]: dataUrl }, updatedAt: new Date().toISOString() };
  STORE.set(tenantId, next);
  return next;
}
