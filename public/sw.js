// CareAI Service Worker — Basis-Shell fuer Offline-Support.
// - cache-first fuer statische Assets
// - network-first mit Cache-Fallback fuer HTML
// - skip fuer /api/* (Mutations werden vom Outbox-Engine behandelt)
// Kompatibel zu Next.js (App-Router).

const SW_VERSION = "careai-v1-2026-04-17";
const STATIC_CACHE = `static-${SW_VERSION}`;
const HTML_CACHE = `html-${SW_VERSION}`;

const STATIC_PRECACHE = [
  "/manifest.json",
  "/robots.txt",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      try {
        await cache.addAll(STATIC_PRECACHE);
      } catch {
        // still OK — precache is best-effort
      }
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => !k.endsWith(SW_VERSION))
          .map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

function isStaticAsset(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/illustrations/") ||
    /\.(?:js|css|woff2?|ttf|png|jpg|jpeg|svg|webp|ico|gif)$/i.test(url.pathname)
  );
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Skip API — Offline-Mutations laufen ueber Outbox + /api/sync wenn online.
  if (url.pathname.startsWith("/api/")) return;

  // Static assets: cache-first
  if (isStaticAsset(url)) {
    event.respondWith(
      (async () => {
        const cached = await caches.match(req);
        if (cached) return cached;
        try {
          const res = await fetch(req);
          if (res.ok) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(req, res.clone());
          }
          return res;
        } catch {
          return cached ?? Response.error();
        }
      })(),
    );
    return;
  }

  // HTML navigation: network-first, fallback to cache
  const isHtml =
    req.mode === "navigate" ||
    (req.headers.get("accept") ?? "").includes("text/html");
  if (isHtml) {
    event.respondWith(
      (async () => {
        try {
          const res = await fetch(req);
          if (res.ok) {
            const cache = await caches.open(HTML_CACHE);
            cache.put(req, res.clone());
          }
          return res;
        } catch {
          const cached = await caches.match(req);
          if (cached) return cached;
          const fallback = await caches.match("/");
          return fallback ?? new Response("Offline", { status: 503, statusText: "Offline" });
        }
      })(),
    );
  }
});

// Optional: Message-Channel fuer manuelles Cache-Busting vom Client.
self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
  if (event.data === "CLEAR_CACHES") {
    event.waitUntil(
      (async () => {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      })(),
    );
  }
});
