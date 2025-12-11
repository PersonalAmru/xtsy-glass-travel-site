// XTSY Service Worker - Mobile-Optimized for Performance
const CACHE_NAME = 'xtsy-mobile-v2';
const STATIC_CACHE = 'xtsy-static-v2';

// Reduced cache limit for mobile (was 500)
const MAX_CACHE_SIZE = 150;

// Critical assets to cache immediately
const CRITICAL_RESOURCES = [
  '/',
  '/index.html',
  '/placeholder.svg',
];

// Patterns to cache at runtime
const RUNTIME_CACHE_PATTERNS = [
  '/assets/',
  '/lovable-uploads/',
  '.jpg',
  '.jpeg', 
  '.png',
  '.webp',
  '.css',
  '.js',
  '.woff2',
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => cache.addAll(CRITICAL_RESOURCES))
      .then(() => self.skipWaiting())
      .catch(err => console.warn('SW: Install failed:', err))
  );
});

// Activate event - cleanup old caches
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

// Fetch event - optimized for mobile
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip external requests (except fonts)
  if (!url.origin.includes(self.location.origin) && 
      !url.hostname.includes('fonts.googleapis.com') &&
      !url.hostname.includes('fonts.gstatic.com') &&
      !url.hostname.includes('supabase.co')) {
    return;
  }

  // Determine if this should be cached
  const shouldCache = RUNTIME_CACHE_PATTERNS.some(pattern => 
    request.url.includes(pattern)
  );

  if (shouldCache) {
    // Cache-first for static assets
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        
        return fetch(request).then((response) => {
          if (response.ok && response.type === 'basic') {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, clone);
              trimCache(cache, MAX_CACHE_SIZE);
            });
          }
          return response;
        }).catch(() => caches.match('/placeholder.svg'));
      })
    );
  } else {
    // Network-first for dynamic content
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
  }
});

// Trim cache to prevent memory issues on mobile
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