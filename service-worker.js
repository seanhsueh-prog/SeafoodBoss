// 檔名：service-worker.js (固定名稱，不再帶版本號)
// 內部版本：v8.8 (透過 Cache Name 控制更新)

const CACHE_NAME = 'seafood-boss-v8.8';
const ASSETS = [
    './',
    './index.html', // 建議你的 HTML 檔名如果是 SeafoodBossApp_v8.8.html，這裡要對應修改，或是直接用 ./
    './manifest.json',
    './icons/icon-192.png',
    'https://cdn.tailwindcss.com',
    'https://unpkg.com/react@18/umd/react.production.min.js',
    'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
    'https://unpkg.com/@babel/standalone/babel.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', (event) => {
    // 強制進入等待中的 SW 立即生效
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('activate', (event) => {
    // 立即接管所有頁面
    event.waitUntil(clients.claim());
    
    // 清除舊版本的 Cache
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => response || fetch(event.request))
    );
});