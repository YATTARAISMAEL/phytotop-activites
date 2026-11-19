// Fonctionne hors connexion : l'appli est gardée en mémoire sur le téléphone
const CACHE = "phytotop-ca715711";
const FILES = ["./","index.html","manifest.webmanifest","vendor/jspdf.umd.min.js","vendor/jspdf.plugin.autotable.min.js","vendor/xlsx.full.min.js","icons/icon-192.png","icons/icon-512.png","icons/icon-maskable-512.png","icons/apple-touch-icon.png","vendor/firebase.js"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;
  // page : réseau d'abord (pour les mises à jour), sinon la version gardée
  if (e.request.mode === "navigate") {
    e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put("index.html", cp)); return r; }).catch(() => caches.match("index.html")));
    return;
  }
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
