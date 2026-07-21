// sw.js — service worker minimal pour EtaChop
// Volontairement SANS mise en cache : chaque page reste toujours la dernière version en ligne.
// Sert uniquement à rendre le site "installable" comme une application.

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
