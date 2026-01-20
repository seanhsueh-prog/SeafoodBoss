// Service Worker Version 4.9 (Model Downgrade Fix & Force Update)
// 檔名: sw-v4.9.js
const CACHE_NAME = 'seafood-boss-v4.9-force-update-lite'; // 修改快取名稱，強制瀏覽器更新
const FILES_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './icons/icon-192.png',
    './icons/icon-512.png'
];

self.addEventListener('install', (event) => {
    self.skipWaiting(); // 強制跳過等待，立即啟用
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
                    console.log('[SW] Removing old cache', key); // 記錄清除舊快取的動作
                    return caches.delete(key);
                }
            }));
        }).then(() => self.clients.claim()) // 立即接管頁面
    );
});

self.addEventListener('fetch', (event) => {
    // 排除 API 請求 (尤其是 Google Gemini API)，避免快取導致連線問題
    if (event.request.url.includes('googleapis.com')) {
        return; 
    }

    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // 如果網路請求成功且有效，就更新快取
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
                // 如果網路失敗（離線），才讀取快取
                return caches.match(event.request);
            })
    );
});