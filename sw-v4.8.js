// 檔名：sw-v4.8.js
// 說明：PWA Service Worker (v6.8)
// 修正：加入 CDN 快取以支援離線模式

const CACHE_NAME = 'seafood-boss-v6.8-stable'; // 更新版本號以強制刷新

const ASSETS_TO_CACHE = [
    './',
    './index.html',        // 確保 GitHub Pages 讀取的是改名後的 index.html
    './manifest.json',
    // 如果你還沒有 icons 資料夾，這兩行會導致 SW 安裝失敗，請確保檔案存在，或暫時註解掉
    // './icons/icon-192.png', 
    // './icons/icon-512.png',
    
    // 關鍵修正：快取 HTML 內用到的外部 CDN，確保離線可用
    'https://cdn.tailwindcss.com',
    'https://unpkg.com/react@18/umd/react.production.min.js',
    'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
    'https://unpkg.com/@babel/standalone/babel.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// 安裝
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                // 如果有任何一個檔案下載失敗 (例如 icon 不存在)，SW 就不會安裝
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
    self.skipWaiting();
});

// 啟用 & 清除舊快取
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('清除舊快取:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// 攔截請求
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // 1. 命中快取則回傳
                if (response) {
                    return response;
                }
                // 2. 沒命中則發送網絡請求 (並可選擇動態寫入快取，此處保持簡單策略)
                return fetch(event.request);
            })
    );
});