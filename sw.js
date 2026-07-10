// Service worker — offline app shell for the Learning Trackers PWA.
// Bump CACHE when shipping changes so clients pick up new assets.
const CACHE = 'lt-shell-v5';
const SHELL = [
  './',
  './index.html',
  './ai-engineering.html',
  './data-engineering.html',
  './databricks.html',
  './styles.css',
  './app.js',
  './auth.js',
  './data.js',
  './config.js',
  './manifest.json',
  './icon.svg'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(SHELL))
      .then(() => self.skipWaiting())
      .catch(() => {}) // a missing file shouldn't abort install
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Never cache Supabase API/auth/realtime traffic — always hit the network.
  if (url.hostname.endsWith('supabase.co')) return;

  const sameOrigin = url.origin === location.origin;

  if (sameOrigin) {
    // NETWORK-FIRST for our own files so a new deploy shows up immediately;
    // fall back to cache (and the landing page) only when offline.
    e.respondWith(
      fetch(req).then(res => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() =>
        caches.match(req).then(hit => hit || (req.mode === 'navigate' ? caches.match('./index.html') : undefined))
      )
    );
  } else {
    // CACHE-FIRST for third-party assets (fonts, CDN) that rarely change.
    e.respondWith(
      caches.match(req).then(hit => hit || fetch(req).then(res => {
        if (res && res.status === 200 && (res.type === 'basic' || res.type === 'cors')) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => undefined))
    );
  }
});
