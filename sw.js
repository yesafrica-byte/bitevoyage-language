/* BiteVoyage R10 shell-only installer cache; learning JS stays online. */
const CACHE = 'bvq63-install-shell-20261126-r10';
const FILES = ['./install.html','./launch.html','./manifest.webmanifest','./favicon-192.png','./favicon-512.png','./favicon-maskable-512.png'];
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('bvq')&&k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()]));});
self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin||req.mode!=='navigate')return;
 event.respondWith(fetch(req).catch(()=>caches.match(req).then(res=>res||caches.match('./install.html'))));
});
