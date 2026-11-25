/* BiteVoyage R10.1 Direct Landing · installer only */
const CACHE='bvq63-install-shell-20261126-r101';
const BASE=new URL('./',self.location.href);
const LAUNCH=new URL('launch.html',BASE).href;
const INSTALL=new URL('install.html',BASE).href;
const FILES=['install.html','launch.html','manifest.webmanifest','favicon-192.png','favicon-512.png','favicon-maskable-512.png'];
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 // Fetch the current shell, not the browser's previously cached version.
 await cache.addAll(FILES.map(path=>new Request(new URL(path,BASE),{cache:'reload'})));
 await self.skipWaiting();
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 const keys=await caches.keys();
 await Promise.all(keys.filter(k=>k.startsWith('bvq')&&k!==CACHE).map(k=>caches.delete(k)));
 await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
 const req=event.request,url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==BASE.origin||!url.pathname.startsWith(BASE.pathname)||req.mode!=='navigate')return;
 const path=url.pathname;
 const isLaunch=path===new URL(LAUNCH).pathname;
 const isInstall=path===new URL(INSTALL).pathname;
 // Never serve the installer in place of a failed launch or learning page.
 event.respondWith((async()=>{
  try{return await fetch(req,{cache:'no-store'});}catch(err){
   if(isLaunch||isInstall){const cache=await caches.open(CACHE);const saved=await cache.match(isLaunch?LAUNCH:INSTALL);if(saved)return saved;}
   return new Response('BiteVoyage: 인터넷 연결을 확인한 후 다시 실행해 주세요.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}});
  }
 })());
});
