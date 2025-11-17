// Desktop Installation Test for Chrome
// This script specifically tests Chrome's desktop PWA installation requirements

class DesktopInstallTester {
    constructor() {
        this.installPrompt = null;
        this.testResults = [];
        this.init();
    }

    async init() {
        console.log('[Desktop Install Test] Iniciando pruebas de instalación desktop...');
        
        // Wait for page load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.runTests());
        } else {
            this.runTests();
        }
    }

    async runTests() {
        console.log('[Desktop Install Test] Ejecutando pruebas...');
        
        // Test 1: HTTPS or localhost
        await this.testHttps();
        
        // Test 2: Service Worker Registration
        await this.testServiceWorker();
        
        // Test 3: Manifest.json
        await this.testManifest();
        
        // Test 4: User Interaction
        await this.testUserInteraction();
        
        // Test 5: Install Prompt Event
        await this.testInstallPrompt();
        
        // Test 6: Chrome-specific Requirements
        await this.testChromeRequirements();
        
        this.displayResults();
    }

    async testHttps() {
        const isHttps = window.location.protocol === 'https:' || 
                       window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1';
        
        this.addResult('HTTPS/Localhost', isHttps, 
            isHttps ? '✅ Ambiente seguro para PWA' : '❌ Se requiere HTTPS o localhost para instalación');
    }

    async testServiceWorker() {
        if (!('serviceWorker' in navigator)) {
            this.addResult('Service Worker', false, '❌ Service Worker no soportado');
            return;
        }

        try {
            const registration = await navigator.serviceWorker.getRegistration();
            const hasActiveSW = registration && registration.active;
            const isControlling = navigator.serviceWorker.controller !== null;
            
            this.addResult('Service Worker Activo', hasActiveSW, 
                hasActiveSW ? '✅ Service Worker registrado y activo' : '❌ Service Worker no activo');
            
            this.addResult('Service Worker Controlando', isControlling,
                isControlling ? '✅ Service Worker controlando la página' : '❌ Service Worker no controlando (necesita reload)');
                
            if (hasActiveSW && !isControlling) {
                console.log('[Desktop Install Test] Service Worker activo pero no controlando - sugiriendo reload');
                this.suggestReload();
            }
        } catch (error) {
            this.addResult('Service Worker', false, `❌ Error: ${error.message}`);
        }
    }

    async testManifest() {
        try {
            const response = await fetch('/manifest.json');
            const manifest = await response.json();
            
            const requiredFields = ['name', 'short_name', 'start_url', 'display', 'icons'];
            const missingFields = requiredFields.filter(field => !manifest[field]);
            
            const hasIcons = manifest.icons && manifest.icons.length > 0;
            const hasMinIconSize = hasIcons && manifest.icons.some(icon => 
                parseInt(icon.sizes?.split('x')[0]) >= 144
            );
            
            this.addResult('Manifest.json', missingFields.length === 0, 
                missingFields.length === 0 ? '✅ Manifest completo' : `❌ Campos faltantes: ${missingFields.join(', ')}`);
            
            this.addResult('Iconos PWA', hasMinIconSize,
                hasMinIconSize ? '✅ Iconos de tamaño adecuado (≥144px)' : '❌ Se requiere icono ≥144px para instalación');
                
            // Check display mode
            const validDisplayModes = ['standalone', 'fullscreen', 'minimal-ui'];
            const hasValidDisplay = validDisplayModes.includes(manifest.display);
            
            this.addResult('Modo Display', hasValidDisplay,
                hasValidDisplay ? `✅ Modo display: ${manifest.display}` : '❌ Se requiere display: standalone/fullscreen/minimal-ui');
                
        } catch (error) {
            this.addResult('Manifest.json', false, `❌ Error cargando manifest: ${error.message}`);
        }
    }

    async testUserInteraction() {
        // Chrome requires user interaction for installation
        const hasButton = document.querySelector('#installButton, .install-button, [data-install]');
        
        this.addResult('Botón de Instalación', !!hasButton,
            hasButton ? '✅ Botón de instalación detectado' : '⚠️ No se detectó botón de instalación (se requiere interacción de usuario)');
        
        if (!hasButton) {
            this.createInstallButton();
        }
    }

    async testInstallPrompt() {
        // Set up beforeinstallprompt listener
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('[Desktop Install Test] Evento beforeinstallprompt detectado!');
            e.preventDefault();
            this.installPrompt = e;
            
            this.addResult('Evento Install', true, '✅ Evento beforeinstallprompt detectado');
            this.updateInstallButton(true);
        });

        // Check if we already have an install prompt
        if (this.installPrompt) {
            this.addResult('Install Prompt', true, '✅ Install prompt disponible');
        } else {
            this.addResult('Install Prompt', false, '⏳ Esperando evento beforeinstallprompt...');
        }
    }

    async testChromeRequirements() {
        // Check if we're in Chrome
        const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
        
        this.addResult('Navegador Chrome', isChrome, 
            isChrome ? '✅ Usando Chrome' : '⚠️ No es Chrome - algunas funciones pueden variar');
        
        if (isChrome) {
            // Check Chrome version
            const chromeVersion = navigator.userAgent.match(/Chrome\/(\d+)/);
            const version = chromeVersion ? parseInt(chromeVersion[1]) : 0;
            const minVersion = 68; // Minimum for reliable PWA installation
            
            this.addResult('Versión Chrome', version >= minVersion,
                version >= minVersion ? `✅ Chrome ${version} (compatible)` : `❌ Chrome ${version} (requiere ≥${minVersion})`);
        }

        // Check if PWA is already installed
        if ('getInstalledRelatedApps' in navigator) {
            try {
                const relatedApps = await navigator.getInstalledRelatedApps();
                const isInstalled = relatedApps.some(app => app.id === 'medmanager-pwa');
                
                this.addResult('PWA Instalado', !isInstalled,
                    isInstalled ? 'ℹ️ PWA ya está instalado' : '✅ PWA no instalado (disponible para instalación)');
            } catch (error) {
                console.log('[Desktop Install Test] No se pudo verificar estado de instalación:', error);
            }
        }
    }

    addResult(test, passed, message) {
        this.testResults.push({
            test,
            passed,
            message,
            timestamp: new Date().toLocaleTimeString()
        });
        console.log(`[Desktop Install Test] ${message}`);
    }

    createInstallButton() {
        // Create install button if it doesn't exist
        const button = document.createElement('button');
        button.id = 'desktop-install-button';
        button.className = 'desktop-install-btn';
        button.innerHTML = '📲 Instalar App Desktop';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: #4CAF50;
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 16px;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
        `;
        
        button.addEventListener('click', () => this.handleInstall());
        document.body.appendChild(button);
        
        console.log('[Desktop Install Test] Botón de instalación creado');
    }

    updateInstallButton(enabled) {
        const button = document.querySelector('#desktop-install-button');
        if (button) {
            button.disabled = !enabled;
            button.style.opacity = enabled ? '1' : '0.5';
            button.style.cursor = enabled ? 'pointer' : 'not-allowed';
            
            if (enabled) {
                button.innerHTML = '📲 Instalar App Desktop (Lista!)';
                button.style.background = '#2196F3';
            }
        }
    }

    async handleInstall() {
        if (!this.installPrompt) {
            console.log('[Desktop Install Test] No hay prompt de instalación disponible');
            alert('❌ No se detectó el evento de instalación. Asegúrate de que el Service Worker esté activo y controlando la página.');
            return;
        }

        try {
            console.log('[Desktop Install Test] Mostrando prompt de instalación...');
            const result = await this.installPrompt.prompt();
            console.log('[Desktop Install Test] Resultado de instalación:', result.outcome);
            
            if (result.outcome === 'accepted') {
                console.log('✅ Usuario aceptó instalación');
                alert('✅ App instalada exitosamente!');
            } else {
                console.log('❌ Usuario rechazó instalación');
                alert('❌ Instalación cancelada por el usuario');
            }
            
            this.installPrompt = null;
            this.updateInstallButton(false);
        } catch (error) {
            console.error('[Desktop Install Test] Error durante instalación:', error);
            alert(`❌ Error durante instalación: ${error.message}`);
        }
    }

    suggestReload() {
        const reloadBtn = document.createElement('button');
        reloadBtn.innerHTML = '🔄 Recargar para activar Service Worker';
        reloadBtn.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            z-index: 10001;
            background: #FF9800;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 6px;
            font-size: 14px;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        `;
        
        reloadBtn.addEventListener('click', () => {
            console.log('[Desktop Install Test] Recargando página para activar Service Worker...');
            window.location.reload();
        });
        
        document.body.appendChild(reloadBtn);
        console.log('[Desktop Install Test] Botón de recarga sugerido');
    }

    displayResults() {
        // Create results display
        const resultsDiv = document.createElement('div');
        resultsDiv.id = 'desktop-install-results';
        resultsDiv.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 10000;
            background: white;
            border: 2px solid #333;
            border-radius: 8px;
            padding: 15px;
            max-width: 400px;
            max-height: 300px;
            overflow-y: auto;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            font-family: monospace;
            font-size: 12px;
        `;
        
        let html = '<h3 style="margin: 0 0 10px 0; font-size: 14px;">🔍 Estado de Instalación Desktop</h3>';
        
        this.testResults.forEach(result => {
            const status = result.passed === true ? '✅' : 
                          result.passed === false ? '❌' : '⚠️';
            html += `<div style="margin: 5px 0; padding: 3px; border-left: 3px solid ${result.passed ? '#4CAF50' : '#F44336'};">
                ${status} <strong>${result.test}:</strong> ${result.message}
            </div>`;
        });
        
        html += '<div style="margin-top: 10px; font-size: 10px; color: #666;">';
        html += '💡 Consejo: Si el Service Worker está activo pero no controlando, recarga la página.</div>';
        
        resultsDiv.innerHTML = html;
        document.body.appendChild(resultsDiv);
        
        console.log('[Desktop Install Test] Resultados mostrados en pantalla');
        
        // Auto-hide after 10 seconds
        setTimeout(() => {
            if (resultsDiv.parentNode) {
                resultsDiv.style.opacity = '0.8';
                resultsDiv.style.transform = 'translateY(10px)';
            }
        }, 10000);
    }
}

// Initialize the tester
console.log('[Desktop Install Test] Cargando tester de instalación desktop...');
const desktopTester = new DesktopInstallTester();

// Export for global access
window.desktopInstallTester = desktopTester;