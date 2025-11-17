// PWA Service Worker Registration and Installation Handler
class PWAInstaller {
    constructor() {
        this.deferredPrompt = null;
        this.swRegistration = null;
        this.init();
    }

    init() {
        this.registerServiceWorker();
        this.handleInstallPrompt();
        this.setupOfflineDetection();
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                // Chrome-specific: Clear any existing registrations first
                const existingRegistrations = await navigator.serviceWorker.getRegistrations();
                for (const registration of existingRegistrations) {
                    console.log('🗑️ Eliminando Service Worker existente:', registration.scope);
                    await registration.unregister();
                }

                // Chrome-specific: Wait a moment before registering
                await new Promise(resolve => setTimeout(resolve, 100));

                // Register enhanced service worker with Chrome-specific options
                const registration = await navigator.serviceWorker.register('/sw-v2.js', {
                    scope: '/',
                    updateViaCache: 'none',
                    type: 'classic' // Chrome works better with classic type
                });
                
                this.swRegistration = registration;
                console.log('✅ Service Worker registrado exitosamente:', registration.scope);
                
                // Check for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            console.log('📦 Nueva versión disponible');
                            this.showUpdateNotification();
                        }
                    });
                });

                // Check if page is controlled by SW
                if (navigator.serviceWorker.controller) {
                    console.log('🎯 Service Worker está controlando la página');
                } else {
                    console.log('🔄 Service Worker no está controlando aún, esperando...');
                }

            } catch (error) {
                console.error('❌ Error al registrar Service Worker:', error);
                this.showServiceWorkerError(error);
            }
        } else {
            console.warn('⚠️ Service Workers no soportados en este navegador');
            this.showBrowserCompatibilityWarning();
        }
    }

    handleInstallPrompt() {
        // Handle the beforeinstallprompt event
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('📱 Evento beforeinstallprompt detectado');
            
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            
            // Stash the event so it can be triggered later
            this.deferredPrompt = e;
            
            // Update UI to notify the user they can install the PWA
            this.showInstallPromotion();
        });

        // Handle appinstalled event
        window.addEventListener('appinstalled', () => {
            console.log('🎉 PWA fue instalada exitosamente');
            this.hideInstallPromotion();
            this.showInstallationSuccess();
            
            // Clear the deferredPrompt
            this.deferredPrompt = null;
        });
    }

    setupOfflineDetection() {
        // Detect online/offline status
        window.addEventListener('online', () => {
            console.log('🟢 Conexión restaurada');
            this.updateOnlineStatus(true);
            this.syncOfflineData();
        });

        window.addEventListener('offline', () => {
            console.log('🔴 Sin conexión - Modo offline activado');
            this.updateOnlineStatus(false);
        });

        // Initial status
        this.updateOnlineStatus(navigator.onLine);
    }

    async installPWA() {
        if (!this.deferredPrompt) {
            console.log('❌ No hay prompt de instalación disponible');
            this.showManualInstallInstructions();
            return;
        }

        try {
            console.log('🚀 Iniciando instalación de PWA...');
            
            // Show the install prompt
            this.deferredPrompt.prompt();
            
            // Wait for the user to respond to the prompt
            const { outcome } = await this.deferredPrompt.userChoice;
            
            console.log(`📊 Respuesta del usuario: ${outcome}`);
            
            if (outcome === 'accepted') {
                console.log('✅ Usuario aceptó la instalación');
            } else {
                console.log('❌ Usuario rechazó la instalación');
                this.showInstallRejectedMessage();
            }
            
            // We've used the prompt, and can't use it again, throw it away
            this.deferredPrompt = null;
            
        } catch (error) {
            console.error('❌ Error durante la instalación:', error);
            this.showInstallError(error);
        }
    }

    // UI Methods
    showInstallPromotion() {
        // Create install banner if it doesn't exist
        if (!document.getElementById('pwa-install-banner')) {
            const banner = document.createElement('div');
            banner.id = 'pwa-install-banner';
            banner.className = 'pwa-install-banner';
            banner.innerHTML = `
                <div class="pwa-install-content">
                    <div class="pwa-install-icon">📱</div>
                    <div class="pwa-install-text">
                        <h3>Instalar MedManager</h3>
                        <p>Instala nuestra aplicación para usarla sin conexión y acceso rápido</p>
                    </div>
                    <div class="pwa-install-buttons">
                        <button onclick="pwaInstaller.installPWA()" class="pwa-install-btn">
                            Instalar
                        </button>
                        <button onclick="pwaInstaller.dismissInstallBanner()" class="pwa-dismiss-btn">
                            Más tarde
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(banner);
        }
        
        document.getElementById('pwa-install-banner').style.display = 'block';
    }

    hideInstallPromotion() {
        const banner = document.getElementById('pwa-install-banner');
        if (banner) {
            banner.style.display = 'none';
        }
    }

    dismissInstallBanner() {
        this.hideInstallPromotion();
        // Store dismissal in localStorage to prevent showing again in this session
        localStorage.setItem('pwa-install-dismissed', 'true');
        localStorage.setItem('pwa-dismissal-time', Date.now().toString());
    }

    updateOnlineStatus(isOnline) {
        const statusElement = document.getElementById('online-status');
        if (statusElement) {
            if (isOnline) {
                statusElement.className = 'online-status online';
                statusElement.innerHTML = '🟢 Online';
            } else {
                statusElement.className = 'online-status offline';
                statusElement.innerHTML = '🔴 Offline - Modo local activado';
            }
        }
    }

    async syncOfflineData() {
        console.log('🔄 Sincronizando datos offline...');
        // This would trigger sync of any offline data
        // Implementation depends on your specific sync logic
        
        // Dispatch custom event for other parts of the app to handle sync
        window.dispatchEvent(new CustomEvent('pwa-sync-start'));
    }

    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'pwa-update-notification';
        notification.innerHTML = `
            <div class="pwa-update-content">
                <span>🆕 Nueva versión disponible</span>
                <button onclick="location.reload()" class="pwa-update-btn">Actualizar</button>
            </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 10000);
    }

    showInstallationSuccess() {
        const notification = document.createElement('div');
        notification.className = 'pwa-success-notification';
        notification.innerHTML = `
            <div class="pwa-success-content">
                <span>🎉 ¡MedManager instalado exitosamente!</span>
            </div>
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }

    showServiceWorkerError(error) {
        console.error('Service Worker Error:', error);
        // You could show a user-friendly message here
    }

    showBrowserCompatibilityWarning() {
        console.warn('Este navegador no soporta Service Workers completamente');
    }

    showManualInstallInstructions() {
        // Show instructions for manual installation (especially for iOS)
        const instructions = document.createElement('div');
        instructions.className = 'pwa-manual-install-instructions';
        instructions.innerHTML = `
            <div class="pwa-manual-content">
                <h3>📱 Instalación Manual</h3>
                <p>Para instalar MedManager:</p>
                <ul>
                    <li><strong>iPhone/iPad:</strong> Toca el botón compartir y selecciona "Agregar a Inicio"</li>
                    <li><strong>Android:</strong> Toca el menú del navegador y selecciona "Agregar a pantalla de inicio"</li>
                    <li><strong>Desktop:</strong> Busca el ícono de instalación en la barra de direcciones</li>
                </ul>
                <button onclick="this.parentElement.parentElement.remove()" class="pwa-close-instructions">Entendido</button>
            </div>
        `;
        document.body.appendChild(instructions);
    }

    showInstallRejectedMessage() {
        const message = document.createElement('div');
        message.className = 'pwa-message';
        message.innerHTML = `
            <div class="pwa-message-content">
                <span>❌ Instalación cancelada. Puedes intentarlo nuevamente cuando quieras.</span>
            </div>
        `;
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 3000);
    }

    showInstallError(error) {
        const message = document.createElement('div');
        message.className = 'pwa-error-message';
        message.innerHTML = `
            <div class="pwa-error-content">
                <span>❌ Error durante la instalación: ${error.message}</span>
            </div>
        `;
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 5000);
    }
}

// CSS for PWA installer
const pwaStyles = `
.pwa-install-banner {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: white;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    padding: 20px;
    z-index: 10000;
    max-width: 400px;
    width: 90%;
    display: none;
    border: 1px solid #e5e7eb;
}

.pwa-install-content {
    display: flex;
    align-items: center;
    gap: 15px;
}

.pwa-install-icon {
    font-size: 2rem;
}

.pwa-install-text {
    flex: 1;
}

.pwa-install-text h3 {
    margin: 0 0 5px 0;
    font-size: 1.1rem;
    color: #1f2937;
}

.pwa-install-text p {
    margin: 0;
    font-size: 0.9rem;
    color: #6b7280;
}

.pwa-install-buttons {
    display: flex;
    gap: 10px;
}

.pwa-install-btn {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background-color 0.2s;
}

.pwa-install-btn:hover {
    background: #2563eb;
}

.pwa-dismiss-btn {
    background: #f3f4f6;
    color: #374151;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: background-color 0.2s;
}

.pwa-dismiss-btn:hover {
    background: #e5e7eb;
}

.online-status {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 500;
    z-index: 9999;
    transition: all 0.3s ease;
}

.online-status.online {
    background: #10b981;
    color: white;
}

.online-status.offline {
    background: #ef4444;
    color: white;
}

.pwa-update-notification,
.pwa-success-notification,
.pwa-message,
.pwa-error-message {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 12px 20px;
    border-radius: 6px;
    z-index: 10001;
    animation: slideDown 0.3s ease;
}

.pwa-update-notification {
    background: #f59e0b;
    color: white;
}

.pwa-success-notification {
    background: #10b981;
    color: white;
}

.pwa-message {
    background: #6b7280;
    color: white;
}

.pwa-error-message {
    background: #ef4444;
    color: white;
}

.pwa-manual-install-instructions {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: white;
    border-radius: 12px;
    padding: 30px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    z-index: 10002;
    max-width: 500px;
    width: 90%;
}

.pwa-manual-content h3 {
    margin: 0 0 15px 0;
    color: #1f2937;
}

.pwa-manual-content p {
    margin: 0 0 15px 0;
    color: #6b7280;
}

.pwa-manual-content ul {
    margin: 0 0 20px 0;
    padding-left: 20px;
}

.pwa-manual-content li {
    margin-bottom: 8px;
    color: #374151;
}

.pwa-close-instructions {
    background: #3b82f6;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 6px;
    cursor: pointer;
    width: 100%;
}

@keyframes slideDown {
    from {
        transform: translate(-50%, -100%);
        opacity: 0;
    }
    to {
        transform: translate(-50%, 0);
        opacity: 1;
    }
}

@media (max-width: 640px) {
    .pwa-install-content {
        flex-direction: column;
        text-align: center;
    }
    
    .pwa-install-buttons {
        width: 100%;
        justify-content: center;
    }
}
`;

// Inject styles
const styleSheet = document.createElement('style');
styleSheet.textContent = pwaStyles;
document.head.appendChild(styleSheet);

// Create global PWA installer instance
window.pwaInstaller = new PWAInstaller();

// Export for use in other scripts
window.PWAInstaller = PWAInstaller;