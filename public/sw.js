// Service Worker for AQI-App Weather & Rain Notifications with full offline caching
const CACHE_NAME = 'aqi-app-cache-v3';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/privacy-policy.html',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/pwa-96x96.png',
  '/pwa-128x128.png',
  '/pwa-192x192.png',
  '/pwa-maskable-192x192.png',
  '/pwa-256x256.png',
  '/pwa-384x384.png',
  '/pwa-512x512.png',
  '/pwa-maskable-512x512.png',
  '/screenshot-mobile-narrow.png',
  '/screenshot-desktop-wide.png'
];

// Install: Pre-cache shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('Pre-caching partial warning:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Offline-first with network fallback for static, network-first for APIs
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // For API calls (Open-Meteo or internal /api), try network first, then cache
  if (url.hostname.includes('open-meteo.com') || url.pathname.startsWith('/api')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // For navigation & static assets: Stale-While-Revalidate or Offline Fallback
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch fresh copy in background
        fetch(event.request).then((freshResponse) => {
          if (freshResponse && freshResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, freshResponse));
          }
        }).catch(() => {});
        return cachedResponse;
      }

      return fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        }
        return networkResponse;
      }).catch(() => {
        // Fallback to offline page for HTML navigation
        if (event.request.headers.get('accept')?.includes('text/html') || event.request.mode === 'navigate') {
          return caches.match('/offline.html') || caches.match('/index.html');
        }
      });
    })
  );
});

// Handle incoming push notification events
self.addEventListener('push', (event) => {
  let data = {
    title: '🌧️ Rain Alert - AQI App',
    body: 'Rain or precipitation is expected in your current area soon.',
    icon: '/pwa-192x192.png',
    badge: '/favicon.ico',
    tag: 'rain-alert',
  };

  if (event.data) {
    try {
      data = { ...data, ...event.data.json() };
    } catch {
      data.body = event.data.text();
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.badge,
      tag: data.tag,
      vibrate: [200, 100, 200],
    })
  );
});

// Focus or open window when user clicks notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url && 'focus' in client) {
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow('/');
      }
    })
  );
});
