const CACHE = 'nbr-v48';
const CORE = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon-512-maskable.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const isDoc = e.request.mode === 'navigate' || (e.request.headers.get('accept') || '').includes('text/html');
  if (isDoc) {
    // Network-first for pages: design updates land on the first reload.
    // The cache copy is only the offline fallback.
    e.respondWith(
      fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put('index.html', copy));
        return res;
      }).catch(() => caches.match('index.html', { ignoreSearch: true }))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(hit =>
      hit || fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
        return res;
      }).catch(() => caches.match('index.html'))
    )
  );
});
