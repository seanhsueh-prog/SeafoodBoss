// 檔名：sw-v2.9.js
// Version 2.9 - Force Update & Clean Slate
// 更改 CACHE_NAME 為 v2.9 強迫清除所有舊版

const CACHE_NAME = 'seafood-boss-v2.9-final';
const ASSETS_TO_CACHE = [
    './',
    './SeafoodBossApp_Spec_new.v2.9.html', // 確保這裡對應正確的 HTML 檔名
    './manifest.json',
    './icons/icon-192.png',
    'https://cdn.tailwindcss.com',
    'https://unpkg.com/react@18/umd/react.production.min.js',
    'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
    'https://unpkg.com/@babel/standalone/babel.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

self.addEventListener('install', (event) => {
    self.skipWaiting(); // 強制跳過等待，立即啟用新版
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    // 刪除所有舊版本的快取 (v2.8, v2.7, v2.6 etc.)
                    if (cacheName !== CACHE_NAME) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim(); // 立即接管頁面控制權
});

self.addEventListener('fetch', (event) => {
    // 永遠不快取 API 請求
    if (event.request.url.includes('generativelanguage.googleapis.com')) {
        return; 
    }

    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).then((fetchRes) => {
                return caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, fetchRes.clone());
                    return fetchRes;
                });
            });
        })
    );
});