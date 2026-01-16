// Service Worker Version 3.3 (Restore & Cleanup)
// 檔名: sw-v3.3.js
const CACHE_NAME = 'seafood-boss-v3.3-restore-final';
const FILES_TO_CACHE = [
    './',
    './SeafoodBossApp_v3.3_Final.html', // 確保這裡對應你的主程式檔名
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png'
];

// Install Event
self.addEventListener('install', (event) => {
    self.skipWaiting(); // 強制跳過等待，立即啟用新版
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(FILES_TO_CACHE);
        })
    );
});

// Activate Event (Cleanup Old Caches - 包含清除 v3.2)
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('[SW] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        }).then(() => self.clients.claim()) // 立即接管頁面
    );
});

// Fetch Event (Network First for reliability, Fallback to Cache)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Update cache with new response
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
                return caches.match(event.request);
            })
    );
});