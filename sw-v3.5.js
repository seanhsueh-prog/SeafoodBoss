// Service Worker Version 3.5 (Final Polish - GH Pages Fix)
// 檔名: sw-v3.5.js
const CACHE_NAME = 'seafood-boss-v3.5-final-gh';
const FILES_TO_CACHE = [
    './',               // 代表根目錄
    './index.html',     // 修正重點：GitHub Pages 的首頁必定是 index.html，這裡必須對應
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
    self.skipWaiting(); // 強制跳過等待，立即安裝新版
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
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
        }).then(() => self.clients.claim()) // 立即接管頁面
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // 如果網路請求有效，就回傳並更新快取
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
                // 如果離線，就從快取抓取
                return caches.match(event.request);
            })
    );
});