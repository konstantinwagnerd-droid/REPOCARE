#!/usr/bin/env node
// Screenshots-Generator fuer CareAI.
//
// Nutzt Playwright (muss via "npx playwright install" verfuegbar sein).
// Erwartet einen laufenden Next.js-Server auf http://localhost:3000 (oder
// PLAYWRIGHT_BASE_URL).
//
// Usage:
//   npm run dev                              # in Terminal 1
//   node scripts/generate-screenshots.mjs    # in Terminal 2
//
// Optional:
//   BASE_URL=http://localhost:3000 node scripts/generate-screenshots.mjs
//   OUT_DIR=./docs/screenshots node scripts/generate-screenshots.mjs
//
// Output:
//   docs/screenshots/<nn>-<name>.png  (Desktop)
//   docs/screenshots/mobile-<name>.png (Mobile, 390x844)
//   docs/screenshots/dark-<name>.png  (Dark-Mode)
//   docs/screenshots/INDEX.md         (Markdown-Uebersicht)

import { mkdir, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";

const BASE_URL = process.env.BASE_URL || process.env.PLAYWRIGHT_BASE_URL || "http://localhost:3000";
const OUT_DIR = resolve(process.env.OUT_DIR || "./docs/screenshots");

const PFLEGE_EMAIL = process.env.LOGIN_EMAIL || "pflegekraft@careai.demo";
const PFLEGE_PASS = process.env.LOGIN_PASS || "DemoPk!2026";
const ADMIN_EMAIL = "admin@careai.demo";
const ADMIN_PASS = "DemoAdmin!2026";

// ---------------- URL-Plan ----------------

/** @type {Array<{name:string, url:string, fullPage?:boolean, waitSel?:string, needsLogin?: "pflege" | "admin"}>} */
const DESKTOP = [
  // Marketing
  { name: "01-marketing-home", url: "/", fullPage: true },
  { name: "02-marketing-trust", url: "/trust", fullPage: true },
  { name: "03-marketing-integrations", url: "/integrations", fullPage: true },
  { name: "04-marketing-roi", url: "/roi-rechner", fullPage: true },
  { name: "05-marketing-demo", url: "/demo-anfrage", fullPage: true },
  { name: "06-marketing-blog", url: "/blog", fullPage: true },
  { name: "07-marketing-case-studies", url: "/case-studies", fullPage: true },
  { name: "08-marketing-changelog", url: "/changelog", fullPage: true },
  { name: "09-marketing-status", url: "/status", fullPage: true },
  { name: "10-marketing-karriere", url: "/karriere", fullPage: true },
  // Auth
  { name: "11-login", url: "/login" },
  // App (Pflegekraft)
  { name: "12-app-dashboard", url: "/app", needsLogin: "pflege", fullPage: true },
  { name: "13-app-residents", url: "/app/residents", needsLogin: "pflege", fullPage: true },
  { name: "14-app-resident-detail", url: "/app/bewohner", needsLogin: "pflege", fullPage: true },
  { name: "15-app-voice", url: "/app/voice", needsLogin: "pflege", fullPage: true },
  { name: "16-app-handover", url: "/app/handover", needsLogin: "pflege", fullPage: true },
  // Admin
  { name: "17-admin-audit", url: "/admin/audit", needsLogin: "admin", fullPage: true },
  { name: "18-admin-analytics", url: "/admin/analytics", needsLogin: "admin", fullPage: true },
  { name: "19-admin-benchmarks", url: "/admin/benchmarks", needsLogin: "admin", fullPage: true },
  { name: "20-admin-lms", url: "/lms", needsLogin: "admin", fullPage: true },
];

const DARK_MODE = [
  { name: "dark-home", url: "/" },
  { name: "dark-dashboard", url: "/app", needsLogin: "pflege" },
  { name: "dark-resident-detail", url: "/app/bewohner", needsLogin: "pflege" },
];

const MOBILE = [
  { name: "mobile-hero", url: "/" },
  { name: "mobile-dashboard", url: "/app", needsLogin: "pflege" },
  { name: "mobile-resident-detail", url: "/app/bewohner", needsLogin: "pflege" },
];

// ---------------- Runner ----------------

async function loadPlaywright() {
  try {
    const mod = await import("playwright");
    return mod.chromium;
  } catch {
    try {
      const mod = await import("@playwright/test");
      return mod.chromium;
    } catch {
      console.error(
        "[screenshots] Playwright nicht gefunden. Bitte einmalig installieren:\n" +
          "  npx playwright install chromium",
      );
      process.exit(1);
    }
  }
}

async function waitServer() {
  const maxTries = 30;
  for (let i = 0; i < maxTries; i++) {
    try {
      const res = await fetch(BASE_URL + "/api/health", { cache: "no-store" });
      if (res.ok) return true;
    } catch {
      /* noop */
    }
    await new Promise((r) => setTimeout(r, 1000));
  }
  console.error(`[screenshots] Server auf ${BASE_URL} nicht erreichbar. Bitte npm run dev starten.`);
  return false;
}

async function login(page, email, pass) {
  await page.goto(BASE_URL + "/login", { waitUntil: "domcontentloaded" });
  await page.fill('input[type="email"], input[name="email"]', email);
  await page.fill('input[type="password"], input[name="password"]', pass);
  await Promise.all([
    page.waitForLoadState("domcontentloaded"),
    page.click('button[type="submit"]'),
  ]);
  // warte auf Redirect weg von /login
  await page.waitForFunction(() => !location.pathname.startsWith("/login"), { timeout: 15_000 });
}

async function shoot(page, entry, { dark = false, mobile = false } = {}) {
  const filename = `${entry.name}.png`;
  const outPath = join(OUT_DIR, filename);
  try {
    await page.goto(BASE_URL + entry.url, { waitUntil: "networkidle", timeout: 30_000 });
  } catch {
    await page.goto(BASE_URL + entry.url, { waitUntil: "domcontentloaded", timeout: 30_000 });
  }
  if (dark) {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.evaluate(() => {
      document.documentElement.classList.add("dark");
    });
  }
  // kleines Warten fuer Animationen
  await page.waitForTimeout(800);
  await page.screenshot({ path: outPath, fullPage: Boolean(entry.fullPage) && !mobile });
  return { entry, filename, ok: true };
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  if (!existsSync(OUT_DIR)) {
    console.error(`[screenshots] OUT_DIR konnte nicht erstellt werden: ${OUT_DIR}`);
    process.exit(1);
  }

  const ok = await waitServer();
  if (!ok) process.exit(1);

  const chromium = await loadPlaywright();
  const browser = await chromium.launch();
  const results = [];

  // --- Desktop Session: Pflegekraft
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: "de-DE" });
    const page = await ctx.newPage();
    await login(page, PFLEGE_EMAIL, PFLEGE_PASS).catch((e) =>
      console.warn("[screenshots] Pflege-Login failed:", e.message),
    );
    for (const entry of DESKTOP.filter((e) => e.needsLogin === "pflege" || !e.needsLogin)) {
      // Marketing / Login ohne Auth-Kontext besser in eigener Session — aber Cookie schadet nicht.
      try {
        const r = await shoot(page, entry);
        results.push(r);
        console.log("[ok]", entry.name);
      } catch (err) {
        console.warn("[skip]", entry.name, err.message);
        results.push({ entry, filename: `${entry.name}.png`, ok: false, error: err.message });
      }
    }
    await ctx.close();
  }

  // --- Desktop Session: Admin (fuer Admin-URLs)
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: "de-DE" });
    const page = await ctx.newPage();
    await login(page, ADMIN_EMAIL, ADMIN_PASS).catch((e) =>
      console.warn("[screenshots] Admin-Login failed:", e.message),
    );
    for (const entry of DESKTOP.filter((e) => e.needsLogin === "admin")) {
      try {
        const r = await shoot(page, entry);
        results.push(r);
        console.log("[ok]", entry.name);
      } catch (err) {
        console.warn("[skip]", entry.name, err.message);
        results.push({ entry, filename: `${entry.name}.png`, ok: false, error: err.message });
      }
    }
    await ctx.close();
  }

  // --- Dark-Mode Session (Pflegekraft)
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: "dark", locale: "de-DE" });
    const page = await ctx.newPage();
    await login(page, PFLEGE_EMAIL, PFLEGE_PASS).catch(() => {});
    for (const entry of DARK_MODE) {
      try {
        const r = await shoot(page, entry, { dark: true });
        results.push(r);
        console.log("[ok]", entry.name);
      } catch (err) {
        console.warn("[skip]", entry.name, err.message);
        results.push({ entry, filename: `${entry.name}.png`, ok: false, error: err.message });
      }
    }
    await ctx.close();
  }

  // --- Mobile Session (Pflegekraft)
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: "de-DE" });
    const page = await ctx.newPage();
    await login(page, PFLEGE_EMAIL, PFLEGE_PASS).catch(() => {});
    for (const entry of MOBILE) {
      try {
        const r = await shoot(page, entry, { mobile: true });
        results.push(r);
        console.log("[ok]", entry.name);
      } catch (err) {
        console.warn("[skip]", entry.name, err.message);
        results.push({ entry, filename: `${entry.name}.png`, ok: false, error: err.message });
      }
    }
    await ctx.close();
  }

  await browser.close();

  // --- INDEX.md
  const okShots = results.filter((r) => r.ok);
  const lines = [
    "# CareAI — Screenshots-Index",
    "",
    `Generiert: ${new Date().toISOString()}`,
    `Basis-URL: ${BASE_URL}`,
    `Anzahl erfolgreich: ${okShots.length} / ${results.length}`,
    "",
    "## Desktop (1440x900)",
    "",
    ...DESKTOP.filter((e) => okShots.some((r) => r.entry.name === e.name)).map(
      (e) => `### ${e.name}\n\nRoute: \`${e.url}\`\n\n![${e.name}](./${e.name}.png)\n`,
    ),
    "",
    "## Dark-Mode",
    "",
    ...DARK_MODE.filter((e) => okShots.some((r) => r.entry.name === e.name)).map(
      (e) => `![${e.name}](./${e.name}.png)\n`,
    ),
    "",
    "## Mobile (390x844)",
    "",
    ...MOBILE.filter((e) => okShots.some((r) => r.entry.name === e.name)).map(
      (e) => `![${e.name}](./${e.name}.png)\n`,
    ),
    "",
    "## Fehlgeschlagen",
    "",
    ...results.filter((r) => !r.ok).map((r) => `- ${r.entry.name} (${r.entry.url}) — ${r.error}`),
    "",
  ];
  await writeFile(join(OUT_DIR, "INDEX.md"), lines.join("\n"), "utf8");

  console.log(`\n[done] ${okShots.length}/${results.length} Screenshots in ${OUT_DIR}`);
  console.log(`[done] INDEX.md generiert.`);
}

main().catch((err) => {
  console.error("[screenshots] fatal:", err);
  process.exit(1);
});
