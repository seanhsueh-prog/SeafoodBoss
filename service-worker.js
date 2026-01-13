/* 檔名：service-worker.js (v2.1) */
const CACHE_NAME = 'seafood-boss-v2.1';
const FILES_TO_CACHE = [
  './',
  './index.html', // 實際請指向 SeafoodBossApp_Spec_new.v2.1.html
  './manifest.json',
  './icons/icon-192.png',
  'https://cdn.tailwindcss.com',
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Pre-caching offline pages (v2.1)');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[ServiceWorker] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('cdn') || event.request.url.includes('unpkg') || event.request.url.includes('cdnjs')) {
      event.respondWith(
        caches.match(event.request).then((response) => {
          return response || fetch(event.request);
        })
      );
  } else {
      event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
      );
  }
});