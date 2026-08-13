// Kill-switch service worker — replaces the old XTSY cache-first SW so returning
// users stop receiving cached SPA assets after the TanStack Start migration.
// Cache Storage is origin-scoped; only delete this app's old SW caches.

function isStaleCacheForThisRegistration(name) {
  // Old hand-rolled XTSY SW caches (xtsy-mobile-v*, xtsy-static-v*)
  if (/^xtsy-/.test(name)) return true;
  // Workbox-named caches, scoped to this registration
  const hasWorkboxBucket = /(^|-)precache-v\d+-|(^|-)runtime-|(^|-)googleAnalytics-/.test(name);
  return hasWorkboxBucket && name.endsWith(self.registration.scope);
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
        const staleCacheNames = cacheNames.filter(isStaleCacheForThisRegistration);
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
