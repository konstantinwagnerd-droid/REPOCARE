// CareAI Service Worker — v2 Offline-Modus
// Strategies:
//   - /api/* GET          → StaleWhileRevalidate (Cache first, update in BG)
//   - /api/* POST/PUT/... → passthrough (Outbox handles offline via IndexedDB)
//   - /_next/static/*, /illustrations/*, static assets → CacheFirst
//   - HTML navigations    → NetworkFirst with cache fallback
//
// Compatible with Next.js App Router. No external deps.

const SW_VERSION = "careai-v2-2026-04-18";
const STATIC_CACHE = `static-${SW_VERSION}`;
const HTML_CACHE = `html-${SW_VERSION}`;
const API_CACHE = `api-${SW_VERSION}`;

const STATIC_PRECACHE = [
  "/manifest.json",
  "/robots.txt",
  "/",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE);
      try { await cache.addAll(STATIC_PRECACHE); } catch { /* best-effort */ }
      await self.skipWaiting();
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.filter((k) => !k.endsWith(SW_VERSION)).map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

function isStaticAsset(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/illustrations/") ||
    url.pathname.startsWith("/assets/") ||
    /\.(?:js|css|woff2?|ttf|png|jpg|jpeg|svg|webp|ico|gif)$/i.test(url.pathname)
  );
}

async function cacheFirst(req, cacheName) {
  const cached = await caches.match(req);
  if (cached) return cached;
  try {
    const res = await fetch(req);
    if (res && res.ok) {
      const cache = await caches.open(cacheName);
      cache.put(req, res.clone());
    }
    return res;
  } catch {
    return cached ?? Response.error();
  }
}

async function networkFirst(req, cacheName, fallbackUrl) {
  try {
    const res = await fetch(req);
    if (res && res.ok) {
      const cache = await caches.open(cacheName);
      cache.put(req, res.clone());
    }
    return res;
  } catch {
    const cached = await caches.match(req);
    if (cached) return cached;
    if (fallbackUrl) {
      const fb = await caches.match(fallbackUrl);
      if (fb) return fb;
    }
    return new Response("Offline", { status: 503, statusText: "Offline" });
  }
}

async function staleWhileRevalidate(req, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(req);
  const network = fetch(req).then((res) => {
    if (res && res.ok) cache.put(req, res.clone());
    return res;
  }).catch(() => null);
  return cached ?? (await network) ?? new Response("Offline", { status: 503 });
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  if (url.origin !== self.location.origin) return;

  // Outbox handles POST/PUT/PATCH/DELETE to /api — passthrough.
  if (req.method !== "GET") return;

  // Static assets → cache-first
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(req, STATIC_CACHE));
    return;
  }

  // /api GET → stale-while-revalidate
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(staleWhileRevalidate(req, API_CACHE));
    return;
  }

  // HTML navigations → network-first with cache + "/" fallback
  const isHtml = req.mode === "navigate" || (req.headers.get("accept") ?? "").includes("text/html");
  if (isHtml) {
    event.respondWith(networkFirst(req, HTML_CACHE, "/"));
  }
});

// Allow the client to trigger SKIP_WAITING and cache clearing.
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
  if (event.data && event.data.type === "PRECACHE_ROUTES" && Array.isArray(event.data.urls)) {
    event.waitUntil(
      (async () => {
        const cache = await caches.open(HTML_CACHE);
        await Promise.all(event.data.urls.map((u) => cache.add(u).catch(() => {})));
      })(),
    );
  }
});
