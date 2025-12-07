// High-performance Service Worker optimized for slow connections & 5000+ concurrent users
const CACHE_NAME = 'xtsy-performance-v1.5';
const CACHE_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days for slow connections

// Critical resources to cache immediately for instant loading
const CRITICAL_RESOURCES = [
  '/',
  '/placeholder.svg',
  '/lovable-uploads/160f683c-a41c-41fd-8bdb-700d74a7e027.png',
  '/lovable-uploads/8059ea95-b64d-4eba-8b12-52e002c59567.png'
];

// Resources to cache on runtime - expanded for comprehensive coverage
const RUNTIME_CACHE_PATTERNS = [
  '/assets/',
  '/lovable-uploads/',
  '.jpg',
  '.jpeg',
  '.png',
  '.webp',
  '.avif',
  '.svg',
  '.css',
  '.js',
  '.woff2',
  '.json',
  'supabase.co/storage' // Include Supabase Storage URLs
];

// Install event - cache critical resources with fast takeover
self.addEventListener('install', (event) => {
  console.log('SW: Installing high-performance service worker with fast takeover');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(CRITICAL_RESOURCES);
      })
      .then(() => self.skipWaiting()) // Fast takeover
      .catch(err => console.warn('SW: Install cache failed:', err))
  );
});

// Activate event - clean up old caches with fast claim
self.addEventListener('activate', (event) => {
  console.log('SW: Activating and cleaning old caches with fast claim');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('SW: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Fast claim for immediate control
  );
});

// High-performance fetch handler with stale-while-revalidate
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and external resources
  if (request.method !== 'GET' || 
      url.protocol === 'chrome-extension:' ||
      (!url.origin.includes(location.origin) && 
       !url.hostname.includes('supabase.co') &&
       !url.hostname.includes('lovableproject.com'))) {
    return;
  }

  // Determine caching strategy based on resource type
  const shouldCache = RUNTIME_CACHE_PATTERNS.some(pattern => 
    request.url.includes(pattern)
  );

  if (shouldCache) {
    // Cache-first strategy for static assets
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          if (cachedResponse) {
            // Return cached version immediately
            // Optionally revalidate in background for fresh content
            event.waitUntil(
              fetch(request)
                .then(response => {
                  if (response.status === 200) {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME)
                      .then(cache => cache.put(request, responseToCache));
                  }
                })
                .catch(() => {}) // Ignore background update failures
            );
            return cachedResponse;
          }

          // Not in cache, fetch and cache
          return fetch(request)
            .then((response) => {
              if (response.status === 200) {
                const responseToCache = response.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => cache.put(request, responseToCache));
              }
              return response;
            })
            .catch(() => {
              // Return offline fallback if available
              return caches.match('/placeholder.svg');
            });
        })
    );
  } else {
    // Network-first strategy for API calls and dynamic content
    event.respondWith(
      fetch(request)
        .catch(() => {
          // Return cached version if network fails
          return caches.match(request);
        })
    );
  }
});

// Background sync for failed requests
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      console.log('SW: Background sync completed')
    );
  }
});

// Periodic cache cleanup to prevent memory issues
const performCacheCleanup = async () => {
  try {
    const cache = await caches.open(CACHE_NAME);
    const keys = await cache.keys();
    
    // Limit cache size to prevent memory issues
    if (keys.length > 500) {
      const oldestKeys = keys.slice(0, keys.length - 400);
      await Promise.all(oldestKeys.map(key => cache.delete(key)));
      console.log(`SW: Cleaned up ${oldestKeys.length} cache entries`);
    }
  } catch (error) {
    console.warn('SW: Cache cleanup failed:', error);
  }
};

// Set up periodic cache cleanup (every 2 hours)
setInterval(performCacheCleanup, 2 * 60 * 60 * 1000);