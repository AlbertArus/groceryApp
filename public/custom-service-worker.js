/* eslint-disable no-restricted-globals */
const VERSION = '1.0';
const CACHE = "pwabuilder-offline-" + VERSION;

// Recursos críticos que necesitan estar disponibles offline
const CRITICAL_RESOURCES = [
  '/',
  '/index.html',
  '/offline.html',
  '/static/js/main.bundle.js',
  '/static/css/main.bundle.css',
  // Agrega aquí otros recursos estáticos críticos
  '/manifest.json',
  '/favicon.ico',
  // Agrega rutas de API que quieras cachear
];

// Estrategia de instalación mejorada
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      // Precacheo de recursos críticos
      await cache.addAll(CRITICAL_RESOURCES);
      // Forzar activación inmediata
      await self.skipWaiting();
    })()
  );
});

// Limpieza de cachés antiguos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Tomar el control inmediatamente
      await self.clients.claim();
      // Limpiar cachés antiguos
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames
          .filter(name => name !== CACHE)
          .map(name => caches.delete(name))
      );
    })()
  );
});

// Estrategia Stale-While-Revalidate mejorada
self.addEventListener('fetch', (event) => {
  // Ignorar requests que no sean GET
  if (event.request.method !== 'GET') return;

  // Ignorar requests a otros dominios
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);

      // Intentar obtener respuesta del cache
      const cachedResponse = await cache.match(event.request);

        // Si la petición es una ruta HTML (no recursos estáticos)
        if (event.request.headers.get('accept').includes('text/html')) {
            const response = cachedResponse || await fetch(event.request);
            // Siempre devolver index.html para rutas dinámicas
            return response || caches.match('/index.html');
        }
      
      // Iniciar fetch en background
      const fetchPromise = fetch(event.request)
        .then(async (networkResponse) => {
          if (networkResponse.ok) {
            // Actualizar el cache con la nueva respuesta
            await cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        })
        .catch(async (error) => {
          // Si el fetch falla y es una página HTML, devolver offline.html
          if (event.request.headers.get('accept').includes('text/html')) {
            return cache.match('/offline.html');
          }
          throw error;
        });

      // Devolver cached response si existe, sino esperar el fetch
      return cachedResponse || fetchPromise;
    })()
  );
});

// Manejo de mensajes
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});