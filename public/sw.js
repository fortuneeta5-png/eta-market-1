// sw.js — service worker minimal pour EtaChop
// Volontairement SANS mise en cache : chaque page reste toujours la dernière version en ligne.
// Sert uniquement à rendre le site "installable" comme une application.

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});

// Affiche la notification reçue, même app fermée
self.addEventListener('push', (event) => {
  let data = { title: 'EtaChop', body: '', url: '/' };
  try { data = event.data.json(); } catch(e){}
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '20260720_075600.png',
      badge: '20260720_075600.png',
      data: { url: data.url },
    })
  );
});

// Ouvre la bonne page quand on touche la notification
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(url) && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});
