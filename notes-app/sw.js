// ============================================
// Чайная лавка - Service Worker с App Shell
// ============================================

const STATIC_CACHE = 'tea-shell-v2';
const DYNAMIC_CACHE = 'tea-dynamic-v1';

// Статические ресурсы (App Shell)
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/app.js',
    '/manifest.json',
    '/icons/favicon.ico',
    '/icons/favicon-16x16.png',
    '/icons/favicon-32x32.png',
    '/icons/favicon-64x64.png',
    '/icons/favicon-128x128.png',
    '/icons/favicon-256x256.png',
    '/icons/favicon-512x512.png'
];

// Установка - кэшируем App Shell
self.addEventListener('install', (event) => {
    console.log('[SW] Установка App Shell...');
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('[SW] Кэширование статики');
                return cache.addAll(STATIC_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Активация - чистим старые кэши
self.addEventListener('activate', (event) => {
    console.log('[SW] Активация...');
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
                    .map(key => {
                        console.log('[SW] Удалён старый кэш:', key);
                        return caches.delete(key);
                    })
            );
        }).then(() => self.clients.claim())
    );
});

// Перехват запросов
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    
    // Пропускаем запросы к сторонним ресурсам
    if (url.origin !== location.origin) {
        return;
    }
    
    // Динамический контент (/content/*) - стратегия Network First
    if (url.pathname.startsWith('/content/')) {
        event.respondWith(
            fetch(event.request)
                .then(networkResponse => {
                    const clone = networkResponse.clone();
                    caches.open(DYNAMIC_CACHE).then(cache => {
                        cache.put(event.request, clone);
                    });
                    return networkResponse;
                })
                .catch(() => {
                    return caches.match(event.request)
                        .then(cached => {
                            if (cached) return cached;
                            // Фолбек на главную страницу
                            return caches.match('/content/home.html');
                        });
                })
        );
        return;
    }
    
    // Статические ресурсы - стратегия Cache First
    event.respondWith(
        caches.match(event.request)
            .then(cached => {
                if (cached) {
                    return cached;
                }
                return fetch(event.request)
                    .then(networkResponse => {
                        if (networkResponse && networkResponse.status === 200) {
                            const clone = networkResponse.clone();
                            caches.open(DYNAMIC_CACHE).then(cache => {
                                cache.put(event.request, clone);
                            });
                        }
                        return networkResponse;
                    })
                    .catch(() => {
                        if (event.request.mode === 'navigate') {
                            return caches.match('/index.html');
                        }
                        return new Response('🍵 Офлайн: контент недоступен', {
                            status: 503,
                            headers: new Headers({ 'Content-Type': 'text/plain; charset=utf-8' })
                        });
                    });
            })
    );
});