const cache_name = 'cache-v0.0.0';

self.addEventListener('install', (event: ExtendableEvent) => {
    event.waitUntil(
        caches.open(cache_name).then((cache: Cache) => {
            return cache.addAll([]);
        })
    );
});

self.addEventListener('activate', (event: ExtendableEvent) => {
    event.waitUntil(
        caches.keys().then((cache_names: string[]) => {
            return Promise.all(
                cache_names.map((name: string) => {
                    if (name !== cache_name) {
                        return caches.delete(name);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event: FetchEvent) => {
    event.respondWith(
        caches.match(event.request).then((response: Response | undefined) => {
            return response || fetch(event.request).then((fetch_response: Response) => {
                return caches.open(cache_name).then((cache: Cache) => {
                    cache.put(event.request, fetch_response.clone());
                    return fetch_response;
                });
            });
        })
    );
});
