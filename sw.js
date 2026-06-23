// Service worker — offline app shell for the Learning Trackers PWA.
// Bump CACHE when shipping changes so clients pick up new assets.
const CACHE = 'lt-shell-v1';
const SHELL = [
  './',
  './index.html',
  './ai-engineering.html',
  './data-engineering.html',
  './databricks.html',
  './styles.css',
  './app.js',
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

  // Cache-first with network refresh, falling back to the landing page offline.
  e.respondWith(
    caches.match(req).then(hit => {
      const fetchAndCache = fetch(req).then(res => {
        if (res && res.status === 200 && (res.type === 'basic' || res.type === 'cors')) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy));
        }
        return res;
      }).catch(() => hit || (req.mode === 'navigate' ? caches.match('./index.html') : undefined));
      return hit || fetchAndCache;
    })
  );
});
