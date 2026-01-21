// 檔名：sw-v4.8.js
// 說明：Product Version 專用 Service Worker (偽裝成舊檔名以覆蓋更新)

const CACHE_NAME = 'seafood-boss-product-v1.0';

// 注意：這裡我們快取 index.html (對應客戶端的路徑)
const ASSETS_TO_CACHE = [
    './',
    './index.html',        // 客戶端的主程式檔案
    './manifest.json',     // 描述檔
    './icons/icon-192.png',
    './icons/icon-512.png'
];

// 安裝 Service Worker 並快取靜態資源
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
    self.skipWaiting();
});

// 啟用 Service Worker 並清除舊快取
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // 清除舊版快取，確保客戶載入新的 Product 版內容
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// 攔截請求並回傳快取內容
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});