// Replaces the old XTSY SW so returning users stop receiving cached SPA assets.
// Cache Storage is origin-scoped; only delete this SW's own caches
// (Workbox-named buckets plus the hand-rolled xtsy-* caches from public/sw.js v3).

function isCacheForThisRegistration(name) {
  const hasWorkboxBucket = /(^|-)precache-v\d+-|(^|-)runtime-|(^|-)googleAnalytics-/.test(name);
  if (hasWorkboxBucket && name.endsWith(self.registration.scope)) return true;
  // Hand-rolled caches created by the pre-migration XTSY service worker.
  return name.indexOf("xtsy-") === 0;
}

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // activate fires once: any reject above unregister() would strand the SW
      // registered forever, so unregister() lives in finally.
      try {
        const cacheNames = await caches.keys();
        const staleCacheNames = cacheNames.filter(isCacheForThisRegistration);
        await Promise.allSettled(staleCacheNames.map((name) => caches.delete(name)));
        await self.clients.claim();
        const windowClients = await self.clients.matchAll({ type: "window" });
        await Promise.allSettled(
          windowClients.map((client) => client.navigate(client.url)),
        );
      } finally {
        await self.registration.unregister();
      }
    })(),
  );
});
