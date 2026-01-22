// 檔名：sw-v4.8.js
// 說明：Product Version v6.8 (Rescue Mode)
// 修正：移除外部 CDN 強制快取，確保 SW 絕對安裝成功，解決「卡舊版」問題。

const CACHE_NAME = 'seafood-boss-v6.8-rescue-patch'; // 改了版本號，強制瀏覽器更新

const ASSETS_TO_CACHE = [
    './',
    './index.html',        
    './manifest.json'
    // 移除所有 icons 和 CDN 連結，避免任何讀取錯誤導致安裝失敗
    // 讓 CDN 改由瀏覽器自動處理快取，不透過 SW 強制介入
];

// 安裝 (保證成功版)
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
    self.skipWaiting(); // 強制跳過等待，直接接管
});

// 啟用 & 殺掉舊版
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // 只要不是這次的新版，全部殺掉
                    if (cacheName !== CACHE_NAME) {
                        console.log('清除舊版快取:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim(); // 立即控制所有頁面
});

// 攔截請求
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            })
    );
});