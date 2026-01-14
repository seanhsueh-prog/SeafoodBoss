// 檔名：sw-v2.8.js
// Version 2.8 - Force Update & Model Fix
// 更改 CACHE_NAME 會強迫瀏覽器重新下載所有檔案

const CACHE_NAME = 'seafood-boss-v2.8-force-update';
const ASSETS_TO_CACHE = [
    './',
    './SeafoodBossApp_Spec_new.v2.8.html', // 確保快取這個新檔名
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
                    // 刪除所有舊版本的快取 (v2.7, v2.6 etc.)
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
    // 永遠不快取 API 請求，確保連線到最新 Google 伺服器
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