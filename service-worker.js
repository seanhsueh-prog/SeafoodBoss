/* 檔名：service-worker.js (v2.2 Network First) */
const CACHE_NAME = 'seafood-boss-v2.2-netfirst';
const FILES_TO_CACHE = [
  './',
  './index.html', // 實際部署時請確保檔名對應
  './manifest.json',
  './icons/icon-192.png'
];

self.addEventListener('install', (event) => {
  self.skipWaiting(); // 跳過等待，立即接管
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching offline pages');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('[SW] Removing old cache', key);
          return caches.delete(key);
        }
      }));
    })
  );
  self.clients.claim();
});

// Network First Strategy
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 網路成功：回傳新版並更新快取
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      })
      .catch(() => {
        // 網路失敗：使用快取
        return caches.match(event.request);
      })
  );
});