// Content script to add download functionality to MedManager

(function() {
    'use strict';
    
    console.log('MedManager Extension: Content script loaded');
    
    // Check if we're on the MedManager site
    if (!window.location.href.includes('localhost:8000')) {
        return;
    }
    
    // Function to add download icon to address bar area
    function addDownloadIcon() {
        // Create download button
        const downloadBtn = document.createElement('button');
        downloadBtn.id = 'medmanager-download-btn';
        downloadBtn.innerHTML = '⬇️';
        downloadBtn.title = 'Descargar datos de MedManager';
        downloadBtn.style.cssText = `
            position: fixed;
            top: 12px;
            right: 200px;
            z-index: 10000;
            background: #3498db;
            color: white;
            border: none;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            font-size: 16px;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        `;
        
        // Hover effects
        downloadBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
        });
        
        downloadBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
        });
        
        // Click handler
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleDownload();
        });
        
        document.body.appendChild(downloadBtn);
        console.log('MedManager Extension: Download icon added');
    }
    
    // Handle download functionality
    function handleDownload() {
        try {
            // Get data from localStorage/IndexedDB
            const medications = JSON.parse(localStorage.getItem('medications') || '[]');
            const inventory = JSON.parse(localStorage.getItem('inventory') || '{}');
            
            const exportData = {
                timestamp: new Date().toISOString(),
                medications: medications,
                inventory: inventory,
                exportDate: new Date().toLocaleDateString('es-ES'),
                exportTime: new Date().toLocaleTimeString('es-ES')
            };
            
            // Create JSON file
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            
            // Create download link
            const link = document.createElement('a');
            link.href = url;
            link.download = `medmanager-data-${new Date().toISOString().split('T')[0]}.json`;
            link.style.display = 'none';
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Cleanup
            setTimeout(() => URL.revokeObjectURL(url), 100);
            
            // Show success message
            showNotification('✅ Datos descargados exitosamente', 'success');
            
        } catch (error) {
            console.error('Download error:', error);
            showNotification('❌ Error al descargar datos', 'error');
        }
    }
    
    // Show notification
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
            color: white;
            padding: 12px 16px;
            border-radius: 6px;
            font-size: 14px;
            z-index: 10001;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
    
    // Alternative: Add to address bar area (more like Google Classroom)
    function addToAddressBar() {
        // Try to find the address bar area (this is experimental)
        const addressBarArea = document.querySelector('body');
        
        // Create a floating button that mimics address bar icons
        const addressBarBtn = document.createElement('div');
        addressBarBtn.id = 'medmanager-address-bar-btn';
        addressBarBtn.innerHTML = `
            <div style="
                position: fixed;
                top: 8px;
                right: 150px;
                z-index: 9999;
                background: rgba(255, 255, 255, 0.9);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(0, 0, 0, 0.1);
                border-radius: 8px;
                padding: 6px 10px;
                font-size: 14px;
                cursor: pointer;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                gap: 6px;
                color: #333;
                font-weight: 500;
            " title="Descargar datos de MedManager">
                <span>⬇️</span>
                <span style="font-size: 12px;">Descargar</span>
            </div>
        `;
        
        addressBarBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            handleDownload();
        });
        
        document.body.appendChild(addressBarBtn);
        console.log('MedManager Extension: Address bar download button added');
    }
    
    // Initialize
    function init() {
        // Wait for page to load
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }
        
        // Add both versions
        setTimeout(() => {
            addDownloadIcon();
            addToAddressBar();
        }, 1000);
        
        console.log('MedManager Extension: Content script initialized');
    }
    
    // Start initialization
    init();
    
})();