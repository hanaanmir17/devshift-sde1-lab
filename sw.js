const CACHE = 'devshift-v1.0.2';
const ASSETS = ['/', '/index.html', '/styles.css', '/app.js', '/data.js', '/runner-worker.js', '/favicon.svg', '/manifest.webmanifest', '/url-cleanup.js'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => { const u = new URL(e.request.url); if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(response => { if (response.ok && (u.pathname === '/' || ASSETS.includes(u.pathname))) { const copy=response.clone(); caches.open(CACHE).then(cache => cache.put(u.pathname === '/' ? '/' : e.request, copy)); } return response; }).catch(async () => (await caches.match(e.request)) || (e.request.mode === 'navigate' ? await caches.match('/') : Response.error())));
});
