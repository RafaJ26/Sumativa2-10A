const CACHE_NAME = 'medmanager-v1';
const urlsToCache = [
  '/',
  '/offline',
  '/css/app.css',
  '/js/app.js',
  '/manifest.json',
  '/icons/icon-72x72.png',
  '/icons/icon-96x96.png',
  '/icons/icon-128x128.png',
  '/icons/icon-144x144.png',
  '/icons/icon-152x152.png',
  '/icons/icon-192x192.png',
  '/icons/icon-384x384.png',
  '/icons/icon-512x512.png'
];

const DYNAMIC_CACHE_NAME = 'medmanager-dynamic-v1';
const MAX_CACHE_SIZE = 50;

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache abierto');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker instalado, activando inmediatamente...');
        return self.skipWaiting();
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
            console.log('Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker activado, tomando control inmediato...');
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(networkFirst(request));
  }
});

async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
      limitCacheSize(DYNAMIC_CACHE_NAME, MAX_CACHE_SIZE);
    }
    return networkResponse;
  } catch (error) {
    return caches.match('/offline');
  }
}

async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
      limitCacheSize(DYNAMIC_CACHE_NAME, MAX_CACHE_SIZE);
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return caches.match('/offline');
  }
}

async function limitCacheSize(cacheName, maxSize) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  
  if (keys.length > maxSize) {
    await cache.delete(keys[0]);
    limitCacheSize(cacheName, maxSize);
  }
}

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('sync', event => {
  if (event.tag === 'sync-medications') {
    event.waitUntil(syncMedications());
  }
});

async function syncMedications() {
  try {
    const db = await openDB('medmanager-db', 1);
    const medications = await db.getAll('sync-medications');
    
    for (const medication of medications) {
      try {
        const response = await fetch('/api/medications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(medication)
        });
        
        if (response.ok) {
          await db.delete('sync-medications', medication.id);
        }
      } catch (error) {
        console.error('Error al sincronizar medicamento:', error);
      }
    }
  } catch (error) {
    console.error('Error en la sincronización:', error);
  }
}

function openDB(name, version) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, version);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}