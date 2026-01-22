// 檔名：sw-v4.8.js 
// 內容版本：v7.1 Neon Chinese Stable
// 說明：升級快取版本號，強制客戶端更新介面與翻譯

const CACHE_NAME = 'seafood-boss-v7.1-neon-cn'; // 關鍵：版本號更新，確保手機吃到最新的全中文介面

const ASSETS_TO_CACHE = [
    './',
    './index.html',        
    './manifest.json'
    // 不快取外部 CDN，避免安裝失敗
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

// 2. 啟用 & 清除舊版 (殺掉 v7.0, v6.8 等舊檔)
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