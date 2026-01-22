// 檔名：sw-v7.1.js 
// 版本：v7.1 Final
// 說明：配合主程式的自動清除腳本，這是新的快取核心

const CACHE_NAME = 'seafood-boss-v7.1-final-clean'; 

const ASSETS_TO_CACHE = [
    './',
    './index.html',        
    './manifest.json'
];

// 1. 安裝 (Install)
self.addEventListener('install', (event) => {
    // 強制立即進入 waiting 狀態
    self.skipWaiting();
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// 2. 啟用 & 清除舊版 (Activate)
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // 只要不是這次的新版 v7.1-final，全部殺掉 (包含 v4.8, v6.8, v7.0)
                    if (cacheName !== CACHE_NAME) {
                        console.log('SW: 清除舊版快取 ->', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    // 立即接管所有頁面，不用等到下次重新整理
    self.clients.claim();
});

// 3. 攔截請求 (Fetch)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // 有快取就回傳快取，沒有就聯網，確保離線能開，連線能更
                return response || fetch(event.request);
            })
    );
});