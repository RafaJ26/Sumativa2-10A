// Chrome Extension Popup Script for MedManager

document.addEventListener('DOMContentLoaded', function() {
    const installBtn = document.getElementById('installPWA');
    const installStatus = document.getElementById('installStatus');
    
    // Check PWA installation status
    checkPWAStatus();
    
    // Install PWA button
    installBtn.addEventListener('click', async function() {
        try {
            // Open the PWA page in a new tab to trigger installation
            chrome.tabs.create({ url: 'http://localhost:8000' }, function(tab) {
                // Wait a bit then show instructions
                setTimeout(() => {
                    showStatus('Para instalar: Menú de Chrome (3 puntos) → "Install app"', 'not-installed');
                }, 1000);
            });
        } catch (error) {
            showStatus('Error: ' + error.message, 'error');
        }
    });
    
    function checkPWAStatus() {
        // Check if running in standalone mode
        if (window.matchMedia('(display-mode: standalone)').matches) {
            showStatus('✅ MedManager ya está instalada', 'installed');
            installBtn.style.display = 'none';
        } else {
            // Check if PWA can be installed
            if ('serviceWorker' in navigator) {
                showStatus('📱 MedManager lista para instalar', 'not-installed');
            } else {
                showStatus('⚠️ Service Worker no soportado', 'error');
            }
        }
    }
    
    function showStatus(message, type) {
        installStatus.textContent = message;
        installStatus.className = 'status ' + type;
        installStatus.style.display = 'block';
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            installStatus.style.display = 'none';
        }, 5000);
    }
    
    // Add click handlers for quick actions
    document.getElementById('viewMedications').addEventListener('click', function(e) {
        e.preventDefault();
        chrome.tabs.create({ url: this.href });
    });
    
    document.getElementById('addMedication').addEventListener('click', function(e) {
        e.preventDefault();
        chrome.tabs.create({ url: this.href });
    });
    
    document.getElementById('viewInventory').addEventListener('click', function(e) {
        e.preventDefault();
        chrome.tabs.create({ url: this.href });
    });
    
    document.getElementById('testPWA').addEventListener('click', function(e) {
        e.preventDefault();
        chrome.tabs.create({ url: this.href });
    });
});