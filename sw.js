// Auto Gestió: el Service Worker anterior es desactiva.
// La nova aplicació no registra cap Service Worker per evitar versions antigues en memòria.
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>event.respondWith(fetch(event.request)));
