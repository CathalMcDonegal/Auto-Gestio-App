const CACHE='auto-gestio-v2';
const ASSETS=['./','./index.html','./manifest.webmanifest','./grok_1792261932370.jpg','./insurance-dashboard.js'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const url=new URL(e.request.url);
  if(url.pathname.endsWith('/index.html')||url.pathname.endsWith('/')){
    e.respondWith(fetch(e.request).then(async r=>{
      if(!r.ok)return r;
      const text=await r.text();
      const injected=text.includes('insurance-dashboard.js')?text:text.replace('</body>','<script src="./insurance-dashboard.js"></script></body>');
      const out=new Response(injected,{status:r.status,statusText:r.statusText,headers:r.headers});
      const c=await caches.open(CACHE);c.put(e.request,out.clone());return out;
    }).catch(()=>caches.match(e.request)));
    return;
  }
  e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r}).catch(()=>cached)));
});
