// Quick PWA Status Test
console.log('🚀 MedManager PWA Status Test');

// Check basic PWA requirements
const checks = {
    serviceWorker: 'serviceWorker' in navigator,
    caches: 'caches' in window,
    indexedDB: 'indexedDB' in window,
    beforeInstallPrompt: 'beforeinstallprompt' in window,
    manifest: document.querySelector('link[rel="manifest"]') !== null,
    standalone: window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone,
    online: navigator.onLine
};

console.log('📋 PWA Feature Checks:');
Object.entries(checks).forEach(([feature, supported]) => {
    console.log(`${supported ? '✅' : '❌'} ${feature}: ${supported}`);
});

// Check service worker status
if (checks.serviceWorker) {
    navigator.serviceWorker.getRegistration().then(registration => {
        console.log('🔧 Service Worker Registration:');
        if (registration) {
            console.log('✅ Service Worker registrado');
            console.log('📍 Scope:', registration.scope);
            console.log('🔄 State:', registration.active ? 'Active' : registration.waiting ? 'Waiting' : registration.installing ? 'Installing' : 'Unknown');
            console.log('🎯 Controlling page:', navigator.serviceWorker.controller ? 'Yes' : 'No');
            
            if (registration.active && navigator.serviceWorker.controller) {
                console.log('🎉 PWA está funcionando correctamente!');
            } else if (registration.active) {
                console.log('⚠️ Service Worker activo pero no controlando - recarga necesaria');
            } else {
                console.log('⚠️ Service Worker registrado pero no activo');
            }
        } else {
            console.log('❌ Service Worker no registrado');
        }
    }).catch(error => {
        console.error('❌ Error al verificar Service Worker:', error);
    });
} else {
    console.log('❌ Service Workers no soportados');
}

// Check manifest
if (checks.manifest) {
    fetch('/manifest.json')
        .then(response => response.json())
        .then(manifest => {
            console.log('📋 Manifest cargado:');
            console.log('📱 Nombre:', manifest.name);
            console.log('🔤 Nombre corto:', manifest.short_name);
            console.log('🚀 Start URL:', manifest.start_url);
            console.log('🖥️ Display:', manifest.display);
            console.log('🎨 Theme color:', manifest.theme_color);
            console.log('📸 Screenshots:', manifest.screenshots ? manifest.screenshots.length : 0);
            console.log('🔗 Shortcuts:', manifest.shortcuts ? manifest.shortcuts.length : 0);
        })
        .catch(error => {
            console.error('❌ Error al cargar manifest:', error);
        });
}

// Check cache status
if (checks.caches) {
    caches.keys().then(cacheNames => {
        console.log('💾 Caches disponibles:', cacheNames.length);
        cacheNames.forEach(cacheName => {
            console.log(`📦 ${cacheName}`);
        });
    });
}

// Final status
setTimeout(() => {
    const workingFeatures = Object.values(checks).filter(Boolean).length;
    const totalFeatures = Object.keys(checks).length;
    
    console.log(`\n📊 Resumen PWA: ${workingFeatures}/${totalFeatures} características funcionando`);
    
    if (workingFeatures === totalFeatures) {
        console.log('🎉 ¡Tu PWA está completamente configurada y lista para usar!');
    } else if (workingFeatures >= totalFeatures * 0.7) {
        console.log('✅ Tu PWA está casi lista - algunas características pueden necesitar atención');
    } else {
        console.log('⚠️ Tu PWA necesita configuración adicional');
    }
    
    // Installation instructions
    if (!checks.standalone && checks.beforeInstallPrompt) {
        console.log('📱 La PWA es instalable - usa el botón de instalación o el prompt del navegador');
    } else if (!checks.standalone) {
        console.log('📱 La PWA puede ser instalable - revisa los requisitos del navegador');
    } else {
        console.log('✅ La PWA ya está instalada');
    }
}, 1000);

console.log('🔍 Verificación PWA completada');