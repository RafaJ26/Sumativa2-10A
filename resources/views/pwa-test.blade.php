<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#3b82f6">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="MedManager Test">
    
    <!-- PWA Manifest -->
    <link rel="manifest" href="/manifest.json">
    
    <!-- Icons -->
    <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png">
    <link rel="apple-touch-icon" href="/icons/icon-152x152.png">

    <title>PWA Test - MedManager</title>
    
    <!-- PWA Service Worker and Installer -->
    <script src="/js/pwa-installer.js"></script>
    
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }
        
        .test-section {
            margin: 20px 0;
            padding: 20px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            background: #f9fafb;
        }
        
        .test-result {
            display: flex;
            align-items: center;
            margin: 10px 0;
            padding: 10px;
            border-radius: 6px;
            background: white;
            border-left: 4px solid #e5e7eb;
        }
        
        .test-result.success {
            border-left-color: #10b981;
            background: #ecfdf5;
        }
        
        .test-result.error {
            border-left-color: #ef4444;
            background: #fef2f2;
        }
        
        .test-result.warning {
            border-left-color: #f59e0b;
            background: #fffbeb;
        }
        
        .status-icon {
            font-size: 1.2rem;
            margin-right: 10px;
        }
        
        .test-button {
            background: #3b82f6;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 6px;
            cursor: pointer;
            margin: 5px;
            transition: background-color 0.2s;
        }
        
        .test-button:hover {
            background: #2563eb;
        }
        
        .test-button:disabled {
            background: #9ca3af;
            cursor: not-allowed;
        }
        
        .log-output {
            background: #1f2937;
            color: #10b981;
            padding: 15px;
            border-radius: 6px;
            font-family: 'Courier New', monospace;
            font-size: 0.9rem;
            max-height: 200px;
            overflow-y: auto;
            margin-top: 10px;
        }
        
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 15px;
            margin: 20px 0;
        }
        
        .feature-card {
            background: white;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            text-align: center;
        }
        
        .feature-card.enabled {
            border-color: #10b981;
            background: #f0fdf4;
        }
        
        .feature-card.disabled {
            border-color: #ef4444;
            background: #fef2f2;
        }
        
        h1 {
            color: #1f2937;
            text-align: center;
            margin-bottom: 30px;
        }
        
        h2 {
            color: #374151;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 10px;
        }
        
        .install-section {
            text-align: center;
            padding: 20px;
            background: #eff6ff;
            border-radius: 8px;
            margin: 20px 0;
        }
        
        .debug-info {
            background: #f3f4f6;
            padding: 15px;
            border-radius: 6px;
            font-size: 0.9rem;
            margin: 10px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🧪 PWA Test Center - MedManager</h1>
        
        <!-- Installation Test Section -->
        <div class="test-section">
            <h2>📱 Instalación de PWA</h2>
            <div class="install-section">
                <p>Haz clic en el botón para probar la instalación de la PWA</p>
                <button id="installButton" class="test-button" onclick="testInstall()">
                    🚀 Probar Instalación
                </button>
                <button class="test-button" onclick="showManualInstructions()">
                    📋 Instrucciones Manuales
                </button>
            </div>
            <div id="installResults"></div>
        </div>
        
        <!-- Service Worker Test Section -->
        <div class="test-section">
            <h2>⚙️ Service Worker</h2>
            <div class="feature-grid">
                <div class="feature-card" id="sw-support">
                    <h3>Soporte Service Worker</h3>
                    <div class="status-icon" id="sw-support-icon">⏳</div>
                    <p id="sw-support-text">Verificando...</p>
                </div>
                
                <div class="feature-card" id="sw-registration">
                    <h3>Registro Service Worker</h3>
                    <div class="status-icon" id="sw-registration-icon">⏳</div>
                    <p id="sw-registration-text">Verificando...</p>
                </div>
                
                <div class="feature-card" id="sw-active">
                    <h3>Service Worker Activo</h3>
                    <div class="status-icon" id="sw-active-icon">⏳</div>
                    <p id="sw-active-text">Verificando...</p>
                </div>
                
                <div class="feature-card" id="sw-cache">
                    <h3>Caché Funcional</h3>
                    <div class="status-icon" id="sw-cache-icon">⏳</div>
                    <p id="sw-cache-text">Verificando...</p>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
                <button class="test-button" onclick="testServiceWorker()">
                    🔍 Verificar Service Worker
                </button>
                <button class="test-button" onclick="refreshSWTest()">
                    🔄 Refrescar Prueba SW
                </button>
                <button class="test-button" onclick="testOffline()">
                    🌐 Probar Modo Offline
                </button>
                <button class="test-button" onclick="clearCache()">
                    🗑️ Limpiar Caché
                </button>
            </div>
        </div>
        
        <!-- Manifest Test Section -->
        <div class="test-section">
            <h2>📋 Manifest.json</h2>
            <div class="feature-grid">
                <div class="feature-card" id="manifest-support">
                    <h3>Soporte Manifest</h3>
                    <div class="status-icon" id="manifest-support-icon">⏳</div>
                    <p id="manifest-support-text">Verificando...</p>
                </div>
                
                <div class="feature-card" id="manifest-loaded">
                    <h3>Manifest Cargado</h3>
                    <div class="status-icon" id="manifest-loaded-icon">⏳</div>
                    <p id="manifest-loaded-text">Verificando...</p>
                </div>
                
                <div class="feature-card" id="icons-available">
                    <h3>Iconos Disponibles</h3>
                    <div class="status-icon" id="icons-available-icon">⏳</div>
                    <p id="icons-available-text">Verificando...</p>
                </div>
                
                <div class="feature-card" id="installable">
                    <h3>Instalable</h3>
                    <div class="status-icon" id="installable-icon">⏳</div>
                    <p id="installable-text">Verificando...</p>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
                <button class="test-button" onclick="testManifest()">
                    📊 Verificar Manifest
                </button>
                <button class="test-button" onclick="showManifestDetails()">
                    🔍 Ver Detalles
                </button>
            </div>
        </div>
        
        <!-- IndexedDB Test Section -->
        <div class="test-section">
            <h2>💾 IndexedDB</h2>
            <div class="feature-grid">
                <div class="feature-card" id="indexeddb-support">
                    <h3>Soporte IndexedDB</h3>
                    <div class="status-icon" id="indexeddb-support-icon">⏳</div>
                    <p id="indexeddb-support-text">Verificando...</p>
                </div>
                
                <div class="feature-card" id="database-open">
                    <h3>Base de Datos</h3>
                    <div class="status-icon" id="database-open-icon">⏳</div>
                    <p id="database-open-text">Verificando...</p>
                </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
                <button class="test-button" onclick="testIndexedDB()">
                    🗄️ Probar IndexedDB
                </button>
            </div>
        </div>
        
        <!-- Debug Information -->
        <div class="test-section">
            <h2>🔧 Información de Depuración</h2>
            <div class="debug-info" id="debug-info">
                <p><strong>User Agent:</strong> <span id="user-agent"></span></p>
                <p><strong>Display Mode:</strong> <span id="display-mode"></span></p>
                <p><strong>Standalone Mode:</strong> <span id="standalone-mode"></span></p>
                <p><strong>Online Status:</strong> <span id="online-status"></span></p>
                <p><strong>URL:</strong> <span id="current-url"></span></p>
            </div>
            
            <div class="log-output" id="log-output">
                Console logs aparecerán aquí...
            </div>
        </div>
        
        <!-- Navigation -->
        <div style="text-align: center; margin-top: 30px;">
            <a href="/" class="test-button" style="text-decoration: none; display: inline-block;">
                🏠 Volver al Inicio
            </a>
            <a href="/medication-manager" class="test-button" style="text-decoration: none; display: inline-block;">
                💊 Ir a MedManager
            </a>
        </div>
    </div>

    <script>
        // Override console.log to show in test output
        const originalLog = console.log;
        const logOutput = document.getElementById('log-output');
        
        console.log = function(...args) {
            originalLog.apply(console, args);
            const message = args.map(arg => 
                typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
            ).join(' ');
            
            const timestamp = new Date().toLocaleTimeString();
            logOutput.innerHTML += `[${timestamp}] ${message}\n`;
            logOutput.scrollTop = logOutput.scrollHeight;
        };
        
        // Initialize debug info
        function updateDebugInfo() {
            document.getElementById('user-agent').textContent = navigator.userAgent;
            document.getElementById('display-mode').textContent = 
                window.matchMedia('(display-mode: standalone)').matches ? 'Standalone' : 'Browser';
            document.getElementById('standalone-mode').textContent = 
                window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches;
            document.getElementById('online-status').textContent = navigator.onLine ? 'Online' : 'Offline';
            document.getElementById('current-url').textContent = window.location.href;
        }
        
        // Test functions
        async function testServiceWorker() {
            console.log('🔍 Iniciando prueba de Service Worker...');
            
            // Check Service Worker support
            if ('serviceWorker' in navigator) {
                updateTestResult('sw-support', true, 'Service Workers soportados');
                
                try {
                    const registration = await navigator.serviceWorker.getRegistration();
                    
                    if (registration) {
                        updateTestResult('sw-registration', true, 'Service Worker registrado');
                        
                        // Check if there's an active worker AND if it's controlling this page
                        if (registration.active) {
                            console.log('Service Worker active:', registration.active);
                            console.log('Current controller:', navigator.serviceWorker.controller);
                            
                            // Check if the active SW is controlling the page
                            if (navigator.serviceWorker.controller) {
                                updateTestResult('sw-active', true, 'Service Worker activo y controlando');
                            } else {
                                updateTestResult('sw-active', false, 'Service Worker activo pero no controlando');
                                console.log('Service Worker is active but not controlling - may need reload');
                            }
                            
                            // Test cache functionality
                            try {
                                const cacheNames = await caches.keys();
                                if (cacheNames.length > 0) {
                                    updateTestResult('sw-cache', true, `Caché disponible (${cacheNames.length} caches)`);
                                } else {
                                    updateTestResult('sw-cache', false, 'No hay caches disponibles');
                                }
                            } catch (error) {
                                updateTestResult('sw-cache', false, 'Error al acceder a caché');
                            }
                        } else {
                            updateTestResult('sw-active', false, 'Service Worker no activo');
                            console.log('Service Worker registration:', registration);
                            console.log('Installation state:', registration.installing ? 'installing' : 'waiting');
                        }
                    } else {
                        updateTestResult('sw-registration', false, 'Service Worker no registrado');
                        updateTestResult('sw-active', false, 'Service Worker no activo');
                    }
                } catch (error) {
                    console.error('❌ Error al verificar Service Worker:', error);
                    updateTestResult('sw-registration', false, 'Error al verificar registro');
                }
            } else {
                updateTestResult('sw-support', false, 'Service Workers no soportados');
            }
        }
        
        async function testManifest() {
            console.log('📊 Iniciando prueba de Manifest...');
            
            // Check manifest support
            if ('beforeinstallprompt' in window || 'relList' in document.createElement('link')) {
                updateTestResult('manifest-support', true, 'Manifest soportado');
            } else {
                updateTestResult('manifest-support', false, 'Manifest no soportado');
            }
            
            // Check if manifest is loaded
            const manifestLink = document.querySelector('link[rel="manifest"]');
            if (manifestLink) {
                updateTestResult('manifest-loaded', true, 'Manifest link encontrado');
                
                try {
                    const response = await fetch(manifestLink.href);
                    if (response.ok) {
                        const manifest = await response.json();
                        console.log('✅ Manifest cargado:', manifest);
                        
                        // Check icons
                        if (manifest.icons && manifest.icons.length > 0) {
                            updateTestResult('icons-available', true, `${manifest.icons.length} iconos encontrados`);
                        } else {
                            updateTestResult('icons-available', false, 'No se encontraron iconos');
                        }
                        
                        // Check installability
                        if (manifest.name && manifest.short_name && manifest.start_url) {
                            updateTestResult('installable', true, 'Aplicación instalable');
                        } else {
                            updateTestResult('installable', false, 'Faltan campos requeridos');
                        }
                    }
                } catch (error) {
                    console.error('❌ Error al cargar manifest:', error);
                    updateTestResult('manifest-loaded', false, 'Error al cargar manifest');
                }
            } else {
                updateTestResult('manifest-loaded', false, 'No se encontró link de manifest');
            }
        }
        
        function testIndexedDB() {
            console.log('🗄️ Iniciando prueba de IndexedDB...');
            
            // Check IndexedDB support
            if ('indexedDB' in window) {
                updateTestResult('indexeddb-support', true, 'IndexedDB soportado');
                
                // Try to open database
                const request = indexedDB.open('medmanager-db', 1);
                
                request.onsuccess = function(event) {
                    updateTestResult('database-open', true, 'Base de datos accesible');
                    console.log('✅ Base de datos abierta exitosamente');
                    event.target.result.close();
                };
                
                request.onerror = function(event) {
                    updateTestResult('database-open', false, 'Error al abrir base de datos');
                    console.error('❌ Error al abrir base de datos:', event.target.error);
                };
            } else {
                updateTestResult('indexeddb-support', false, 'IndexedDB no soportado');
            }
        }
        
        function testInstall() {
            console.log('🚀 Probando instalación de PWA...');
            
            if (window.pwaInstaller) {
                window.pwaInstaller.installPWA();
            } else {
                console.log('❌ PWA Installer no disponible');
                alert('El instalador PWA no está disponible. Por favor, espera a que se cargue completamente.');
            }
        }
        
        function showManualInstructions() {
            if (window.pwaInstaller) {
                window.pwaInstaller.showManualInstallInstructions();
            }
        }
        
        async function testOffline() {
            console.log('🌐 Probando modo offline...');
            
            if (!navigator.onLine) {
                console.log('✅ Ya estás en modo offline');
                alert('Ya estás en modo offline. Prueba navegar por la aplicación.');
                return;
            }
            
            console.log('📴 Simulando modo offline...');
            alert('Para probar el modo offline:\n\n1. Ve a las Herramientas de Desarrollo (F12)\n2. Ve a la pestaña "Network"\n3. Marca "Offline"\n4. Prueba navegar por la aplicación');
        }
        
        async function clearCache() {
            console.log('🗑️ Limpiando caché...');
            
            try {
                const cacheNames = await caches.keys();
                for (const cacheName of cacheNames) {
                    await caches.delete(cacheName);
                    console.log(`✅ Caché eliminada: ${cacheName}`);
                }
                
                if (cacheNames.length > 0) {
                    alert(`✅ ${cacheNames.length} cachés eliminadas. La página se recargará.`);
                    location.reload();
                } else {
                    alert('ℹ️ No hay cachés para eliminar');
                }
            } catch (error) {
                console.error('❌ Error al limpiar caché:', error);
                alert('❌ Error al limpiar caché');
            }
        }
        
        function showManifestDetails() {
            fetch('/manifest.json')
                .then(response => response.json())
                .then(manifest => {
                    alert(`Detalles del Manifest:\n\n` +
                          `Nombre: ${manifest.name}\n` +
                          `Nombre Corto: ${manifest.short_name}\n` +
                          `Descripción: ${manifest.description || 'Sin descripción'}\n` +
                          `Versión: ${manifest.version || 'Sin versión'}\n` +
                          `Start URL: ${manifest.start_url}\n` +
                          `Display: ${manifest.display}\n` +
                          `Theme Color: ${manifest.theme_color}\n` +
                          `Background Color: ${manifest.background_color}\n` +
                          `Iconos: ${manifest.icons.length}\n` +
                          `Categoría: ${manifest.categories?.join(', ') || 'Sin categoría'}`);
                })
                .catch(error => {
                    console.error('❌ Error al cargar manifest:', error);
                    alert('❌ Error al cargar manifest');
                });
        }
        
        function updateTestResult(testId, success, message) {
            const element = document.getElementById(testId);
            const icon = document.getElementById(testId + '-icon');
            const text = document.getElementById(testId + '-text');
            
            if (element) {
                element.classList.remove('enabled', 'disabled');
                element.classList.add(success ? 'enabled' : 'disabled');
            }
            
            if (icon) {
                icon.textContent = success ? '✅' : '❌';
            }
            
            if (text) {
                text.textContent = message;
            }
        }
        
        // Initialize on page load
        window.addEventListener('load', function() {
            console.log('🧪 PWA Test Center cargado');
            updateDebugInfo();
            
            // Force service worker registration and control
                if ('serviceWorker' in navigator) {
                    navigator.serviceWorker.register('/sw-v2.js', { scope: '/' })
                        .then(registration => {
                            console.log('Service Worker registrado:', registration);
                            // Force update and claim control
                            return registration.update();
                        })
                    .then(() => {
                        console.log('Service Worker actualizado');
                        // Small delay to allow SW to take control
                        setTimeout(() => {
                            testServiceWorker();
                        }, 500);
                    })
                    .catch(error => {
                        console.error('Error registrando Service Worker:', error);
                    });
            }
            
            // Run other tests
            testManifest();
            testIndexedDB();
            
            // Update online status
            window.addEventListener('online', () => {
                document.getElementById('online-status').textContent = 'Online';
                console.log('🟢 Conexión restaurada');
            });
            
            window.addEventListener('offline', () => {
                document.getElementById('online-status').textContent = 'Offline';
                console.log('🔴 Sin conexión');
            });
        });
        
        // Check if PWA installer is ready
        const checkInstallerInterval = setInterval(() => {
            if (window.pwaInstaller) {
                console.log('✅ PWA Installer está disponible');
                clearInterval(checkInstallerInterval);
            }
        }, 500);
    </script>
</body>
</html>