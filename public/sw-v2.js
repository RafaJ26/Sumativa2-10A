
const CACHE_NAME = 'medmanager-v2';
const DYNAMIC_CACHE_NAME = 'medmanager-dynamic-v2';
const MAX_CACHE_SIZE = 50;

const urlsToCache = [
  '/',
  '/home.html',
  '/splash.html',
  '/offline',
  '/sw-test',
  '/pwa-test',
  '/css/app.css',
  '/js/app.js',
  '/js/pwa-installer.js',
  '/js/chrome-pwa-debugger.js',
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


self.addEventListener('install', event => {
  console.log('[SW] Instalando Service Worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Cache abierto, agregando recursos...');
        
        return Promise.all(
          urlsToCache.map(url => {
            return cache.add(url).catch(err => {
              console.error(`[SW] Error agregando ${url}:`, err);
              
              return Promise.resolve();
            });
          })
        );
      })
      .then(() => {
        console.log('[SW] Recursos cacheados, activando inmediatamente...');
        return self.skipWaiting();
      })
      .catch(err => {
        console.error('[SW] Error durante instalación:', err);
        throw err;
      })
  );
});

self.addEventListener('activate', event => {
  console.log('[SW] Activando Service Worker...');
  
  event.waitUntil(
    Promise.all([
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log(`[SW] Eliminando cache antiguo: ${cacheName}`);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      self.clients.claim().then(() => {
        console.log('[SW] Service Worker activo y controlando clientes');
        return self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({
              type: 'SW_ACTIVATED',
              message: 'Service Worker está ahora activo'
            });
          });
        });
      })
    ]).catch(err => {
      console.error('[SW] Error durante activación:', err);
    })
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') {
    return;
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return;
  }

  if (url.origin === location.origin) {
    event.respondWith(cacheFirst(request));
  } else {
    event.respondWith(networkFirst(request));
  }
});

async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log(`[SW] Cache hit: ${request.url}`);
      return cachedResponse;
    }

    console.log(`[SW] Cache miss, fetching: ${request.url}`);
    
    // If not in cache, fetch from network
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone()).catch(err => {
        console.error(`[SW] Error cacheando ${request.url}:`, err);
      });
      
      // Limit cache size
      limitCacheSize(DYNAMIC_CACHE_NAME, MAX_CACHE_SIZE);
    }
    
    return networkResponse;
    
  } catch (error) {
    console.error(`[SW] Error en cacheFirst para ${request.url}:`, error);
    
    // Try to return offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlineResponse = await caches.match('/offline');
      if (offlineResponse) {
        return offlineResponse;
      }
    }
    
    // Return error response
    return new Response('Offline - Recurso no disponible', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'text/plain'
      })
    });
  }
}

// Chrome-optimized network first strategy
async function networkFirst(request) {
  try {
    console.log(`[SW] Intentando red primero: ${request.url}`);
    
    // Try network first
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone()).catch(err => {
        console.error(`[SW] Error cacheando ${request.url}:`, err);
      });
      
      limitCacheSize(DYNAMIC_CACHE_NAME, MAX_CACHE_SIZE);
    }
    
    return networkResponse;
    
  } catch (error) {
    console.error(`[SW] Error en networkFirst para ${request.url}:`, error);
    
    // Try cache as fallback
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      console.log(`[SW] Fallback a cache para: ${request.url}`);
      return cachedResponse;
    }
    
    // Try offline page for navigation requests
    if (request.mode === 'navigate') {
      const offlineResponse = await caches.match('/offline');
      if (offlineResponse) {
        return offlineResponse;
      }
    }
    
    // Return error response
    return new Response('Offline - Recurso no disponible', {
      status: 503,
      statusText: 'Service Unavailable',
      headers: new Headers({
        'Content-Type': 'text/plain'
      })
    });
  }
}

// Enhanced cache size limiting
async function limitCacheSize(cacheName, maxSize) {
  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    
    if (keys.length > maxSize) {
      console.log(`[SW] Limitando cache ${cacheName} a ${maxSize} items`);
      
      // Delete oldest entries
      const entriesToDelete = keys.slice(0, keys.length - maxSize);
      await Promise.all(
        entriesToDelete.map(key => cache.delete(key))
      );
      
      console.log(`[SW] Eliminados ${entriesToDelete.length} items antiguos de ${cacheName}`);
    }
  } catch (error) {
    console.error(`[SW] Error limitando cache ${cacheName}:`, error);
  }
}

// Chrome-specific: Handle messages from clients
self.addEventListener('message', event => {
  console.log('[SW] Mensaje recibido:', event.data);
  
  if (event.data && event.data.type) {
    switch (event.data.type) {
      case 'SKIP_WAITING':
        console.log('[SW] Saltando espera...');
        self.skipWaiting();
        break;
        
      case 'GET_VERSION':
        event.ports[0].postMessage({
          version: '2.0',
          cacheName: CACHE_NAME
        });
        break;
        
      case 'GET_CACHE_STATUS':
        Promise.all([
          caches.keys(),
          caches.open(CACHE_NAME).then(cache => cache.keys()),
          caches.open(DYNAMIC_CACHE_NAME).then(cache => cache.keys())
        ]).then(([cacheNames, staticKeys, dynamicKeys]) => {
          event.ports[0].postMessage({
            cacheNames,
            staticCacheCount: staticKeys.length,
            dynamicCacheCount: dynamicKeys.length
          });
        });
        break;
        
      default:
        console.log('[SW] Tipo de mensaje no reconocido:', event.data.type);
    }
  }
});

// Chrome-specific: Enhanced background sync
self.addEventListener('sync', event => {
  console.log(`[SW] Evento de sincronización: ${event.tag}`);
  
  if (event.tag === 'sync-medications') {
    event.waitUntil(syncMedications());
  }
});

// Enhanced medication sync with better error handling
async function syncMedications() {
  console.log('[SW] Iniciando sincronización de medicamentos...');
  
  try {
    const db = await openDB('medmanager-db', 1);
    const medications = await db.getAll('sync-medications');
    
    console.log(`[SW] Encontrados ${medications.length} medicamentos para sincronizar`);
    
    let successCount = 0;
    let errorCount = 0;
    
    for (const medication of medications) {
      try {
        console.log(`[SW] Sincronizando medicamento: ${medication.name || medication.id}`);
        
        const response = await fetch('/api/medications', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(medication)
        });
        
        if (response.ok) {
          await db.delete('sync-medications', medication.id);
          successCount++;
          console.log(`[SW] Medicamento sincronizado exitosamente: ${medication.id}`);
        } else {
          errorCount++;
          console.error(`[SW] Error sincronizando medicamento ${medication.id}: ${response.status}`);
        }
      } catch (error) {
        errorCount++;
        console.error(`[SW] Error sincronizando medicamento ${medication.id}:`, error);
      }
    }
    
    console.log(`[SW] Sincronización completada. Éxitos: ${successCount}, Errores: ${errorCount}`);
    
    // Notify clients of sync completion
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        successCount,
        errorCount
      });
    });
    
  } catch (error) {
    console.error('[SW] Error en sincronización:', error);
  }
}

// Enhanced IndexedDB helper
function openDB(name, version) {
  return new Promise((resolve, reject) => {
    console.log(`[SW] Abriendo base de datos: ${name} v${version}`);
    
    const request = indexedDB.open(name, version);
    
    request.onsuccess = () => {
      console.log(`[SW] Base de datos abierta exitosamente`);
      resolve(request.result);
    };
    
    request.onerror = () => {
      console.error('[SW] Error abriendo base de datos:', request.error);
      reject(request.error);
    };
    
    request.onupgradeneeded = (event) => {
      console.log(`[SW] Actualización de base de datos necesaria: v${event.oldVersion} -> v${event.newVersion}`);
      const db = request.result;
      
      // Create object stores if they don't exist
      if (!db.objectStoreNames.contains('sync-medications')) {
        const store = db.createObjectStore('sync-medications', { keyPath: 'id' });
        console.log('[SW] Creado object store: sync-medications');
      }
    };
  });
}

// Chrome-specific: Handle push notifications (if needed in future)
self.addEventListener('push', event => {
  console.log('[SW] Evento push recibido');
  // Implementation for push notifications would go here
});

// Chrome-specific: Handle notification clicks
self.addEventListener('notificationclick', event => {
  console.log('[SW] Click en notificación');
  // Implementation for notification clicks would go here
});

// Log that service worker is loaded
console.log('[SW] Service Worker v2.0 cargado exitosamente');

// Chrome DevTools: Enable debugging
if (typeof self.__WB_DISABLE_DEV_LOGS === 'undefined') {
  self.__WB_DISABLE_DEV_LOGS = false;
}