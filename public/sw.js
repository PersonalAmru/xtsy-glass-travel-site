// XTSY Service Worker - Mobile-Optimized for Performance
const CACHE_NAME = 'xtsy-mobile-v3';
const STATIC_CACHE = 'xtsy-static-v3';
const MAX_CACHE_SIZE = 150;

const CRITICAL_RESOURCES = ['/', '/index.html', '/placeholder.svg'];

const RUNTIME_CACHE_PATTERNS = [
  '/assets/', '/lovable-uploads/',
  '.jpg', '.jpeg', '.png', '.webp',
  '.css', '.js', '.woff2',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(CRITICAL_RESOURCES))
      .then(() => self.skipWaiting())
      .catch(err => console.warn('SW: Install failed:', err))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== STATIC_CACHE)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Wave 4I — defer cache.put to idle so navigation isn't blocked mid-scroll on slow connections
const idle = (cb) => {
  if (typeof self.requestIdleCallback === 'function') {
    self.requestIdleCallback(cb, { timeout: 2000 });
  } else {
    setTimeout(cb, 0);
  }
};

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;

  if (!url.origin.includes(self.location.origin) &&
      !url.hostname.includes('fonts.googleapis.com') &&
      !url.hostname.includes('fonts.gstatic.com') &&
      !url.hostname.includes('supabase.co')) {
    return;
  }

  const shouldCache = RUNTIME_CACHE_PATTERNS.some(pattern => request.url.includes(pattern));

  if (shouldCache) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;

        return fetch(request).then((response) => {
          if (response.ok && response.type === 'basic') {
            const clone = response.clone();
            // Defer write to idle time
            idle(() => {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, clone);
                trimCache(cache, MAX_CACHE_SIZE);
              }).catch(() => {});
            });
          }
          return response;
        }).catch(() => caches.match('/placeholder.svg'));
      })
    );
  } else {
    event.respondWith(fetch(request).catch(() => caches.match(request)));
  }
});

async function trimCache(cache, maxSize) {
  try {
    const keys = await cache.keys();
    if (keys.length > maxSize) {
      const toDelete = keys.slice(0, keys.length - maxSize);
      await Promise.all(toDelete.map((key) => cache.delete(key)));
    }
  } catch (e) {
    // Ignore errors
  }
}
