// 檔名：sw-v7.1.js 
// 版本：v7.1 Light Pro
// 說明：強制清除舊版 Dark Mode 快取，載入全新 Light Mode

const CACHE_NAME = 'seafood-boss-v7.1-light'; 

const ASSETS_TO_CACHE = [
    './',
    './index.html',        
    './manifest.json'
];

// 1. 安裝
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
    self.skipWaiting();
});

// 2. 啟用 & 清除舊版 (殺掉 v7.0-neon 等所有舊檔)
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Clean up old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// 3. 攔截請求
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            })
    );
});