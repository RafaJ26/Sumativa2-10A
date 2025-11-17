<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#3b82f6">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="MedManager">
    
    <title>Sistema de Gestión de Medicamentos</title>
    
    <!-- Manifest -->
    <link rel="manifest" href="/manifest.json">
    
    <!-- Icons -->
    <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-32x32.png">
    <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-16x16.png">
    <link rel="apple-touch-icon" href="/icons/icon-152x152.png">
    
    <!-- Splash screens for iOS -->
    <link rel="apple-touch-startup-image" href="/icons/splash-iphone.png" media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)">
    <link rel="apple-touch-startup-image" href="/icons/splash-iphone-plus.png" media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)">
    <link rel="apple-touch-startup-image" href="/icons/splash-iphone-x.png" media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)">
    <link rel="apple-touch-startup-image" href="/icons/splash-ipad.png" media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)">
    <link rel="apple-touch-startup-image" href="/icons/splash-ipad-pro.png" media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)">
    
    @vite(['resources/css/app.css', 'resources/js/app.js'])
    
    <style>
        /* App Shell Styles */
        .app-shell {
            display: flex;
            flex-direction: column;
            min-height: 100vh;
        }
        
        .app-header {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
            color: white;
            padding: 1rem;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .app-nav {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .app-title {
            font-size: 1.5rem;
            font-weight: bold;
            margin: 0;
        }
        
        .app-main {
            flex: 1;
            padding: 1rem;
            max-width: 1200px;
            margin: 0 auto;
            width: 100%;
        }
        
        .app-footer {
            background: #f8fafc;
            padding: 1rem;
            text-align: center;
            border-top: 1px solid #e2e8f0;
        }
        
        .loading {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 200px;
            font-size: 1.2rem;
            color: #6b7280;
        }
        
        .offline-indicator {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ef4444;
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            display: none;
            z-index: 1000;
        }
        
        .offline-indicator.show {
            display: block;
        }
        
        .install-prompt {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: white;
            padding: 1rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            display: none;
            z-index: 1000;
            max-width: 300px;
        }
        
        .install-prompt.show {
            display: block;
        }
        
        .medication-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1rem;
            margin-top: 2rem;
        }
        
        .medication-card {
            background: white;
            border-radius: 0.5rem;
            padding: 1.5rem;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            border: 1px solid #e5e7eb;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .medication-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .medication-name {
            font-size: 1.25rem;
            font-weight: 600;
            color: #1f2937;
            margin-bottom: 0.5rem;
        }
        
        .medication-details {
            color: #6b7280;
            font-size: 0.875rem;
            margin-bottom: 1rem;
        }
        
        .medication-actions {
            display: flex;
            gap: 0.5rem;
        }
        
        .btn {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 0.375rem;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            transition: background-color 0.2s;
        }
        
        .btn-primary {
            background: #3b82f6;
            color: white;
        }
        
        .btn-primary:hover {
            background: #2563eb;
        }
        
        .btn-secondary {
            background: #f3f4f6;
            color: #374151;
        }
        
        .btn-secondary:hover {
            background: #e5e7eb;
        }
        
        .btn-danger {
            background: #ef4444;
            color: white;
        }
        
        .btn-danger:hover {
            background: #dc2626;
        }
        
        .add-medication-btn {
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            background: #10b981;
            color: white;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s, background-color 0.2s;
        }
        
        .add-medication-btn:hover {
            transform: scale(1.1);
            background: #059669;
        }
        
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
        }
        
        .modal.show {
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .modal-content {
            background: white;
            padding: 2rem;
            border-radius: 0.5rem;
            max-width: 500px;
            width: 90%;
            max-height: 90vh;
            overflow-y: auto;
        }
        
        .form-group {
            margin-bottom: 1rem;
        }
        
        .form-label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: #374151;
        }
        
        .form-input {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 0.375rem;
            font-size: 1rem;
        }
        
        .form-input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .form-textarea {
            resize: vertical;
            min-height: 100px;
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.5rem;
        }
        
        .modal-title {
            font-size: 1.5rem;
            font-weight: 600;
            color: #1f2937;
        }
        
        .close {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #6b7280;
        }
        
        .close:hover {
            color: #374151;
        }
        
        .search-container {
            margin-bottom: 2rem;
        }
        
        .search-input {
            width: 100%;
            padding: 0.75rem 1rem;
            border: 1px solid #d1d5db;
            border-radius: 0.375rem;
            font-size: 1rem;
        }
        
        .search-input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        @media (max-width: 768px) {
            .app-main {
                padding: 0.5rem;
            }
            
            .medication-grid {
                grid-template-columns: 1fr;
            }
            
            .add-medication-btn {
                bottom: 1rem;
                right: 1rem;
            }
            
            .modal-content {
                padding: 1rem;
            }
        }
    </style>
</head>
<body>
    <div class="app-shell">
        <header class="app-header">
            <nav class="app-nav">
                <h1 class="app-title">💊 MedManager</h1>
                <div>
                    <button onclick="showSearchModal()" class="btn btn-secondary">🔍</button>
                    <button onclick="syncData()" class="btn btn-secondary">🔄</button>
                </div>
            </nav>
        </header>
        
        <main class="app-main">
            <div class="search-container">
                <input type="text" id="searchInput" placeholder="Buscar medicamentos..." class="search-input" onkeyup="searchMedications()">
            </div>
            
            <div id="medicationsContainer" class="medication-grid">
                <div class="loading">Cargando medicamentos...</div>
            </div>
        </main>
        
        <footer class="app-footer">
            <p>&copy; 2024 MedManager - Sistema de Gestión de Medicamentos</p>
        </footer>
        
        <button class="add-medication-btn" onclick="showAddModal()">+</button>
    </div>
    
    <!-- Offline Indicator -->
    <div id="offlineIndicator" class="offline-indicator">
        🔴 Sin conexión - Trabajando en modo offline
    </div>
    
    <!-- Install Prompt -->
    <div id="installPrompt" class="install-prompt">
        <p>¿Quieres instalar MedManager para usarlo sin conexión?</p>
        <button onclick="installApp()" class="btn btn-primary">Instalar</button>
        <button onclick="dismissInstallPrompt()" class="btn btn-secondary">Más tarde</button>
    </div>
    
    <!-- Add Medication Modal -->
    <div id="addModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">Agregar Medicamento</h2>
                <button class="close" onclick="hideAddModal()">&times;</button>
            </div>
            <form id="addMedicationForm" onsubmit="addMedication(event)">
                <div class="form-group">
                    <label class="form-label">Nombre del Medicamento</label>
                    <input type="text" id="medicationName" required class="form-input">
                </div>
                <div class="form-group">
                    <label class="form-label">Descripción</label>
                    <textarea id="medicationDescription" class="form-input form-textarea"></textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Cantidad</label>
                    <input type="number" id="medicationQuantity" required min="0" class="form-input">
                </div>
                <div class="form-group">
                    <label class="form-label">Precio</label>
                    <input type="number" id="medicationPrice" step="0.01" min="0" class="form-input">
                </div>
                <div class="form-group">
                    <label class="form-label">Fecha de Expiración</label>
                    <input type="date" id="medicationExpiry" class="form-input">
                </div>
                <div class="form-group">
                    <button type="submit" class="btn btn-primary">Guardar Medicamento</button>
                    <button type="button" onclick="hideAddModal()" class="btn btn-secondary">Cancelar</button>
                </div>
            </form>
        </div>
    </div>
    
    <!-- Search Modal -->
    <div id="searchModal" class="modal">
        <div class="modal-content">
            <div class="modal-header">
                <h2 class="modal-title">Buscar Medicamento</h2>
                <button class="close" onclick="hideSearchModal()">&times;</button>
            </div>
            <input type="text" id="modalSearchInput" placeholder="Buscar por nombre o descripción..." class="search-input" onkeyup="modalSearch()">
            <div id="modalSearchResults" style="margin-top: 1rem;"></div>
        </div>
    </div>
    
    <script>
        let medications = [];
        let db;
        let deferredPrompt;
        
        // Initialize PWA
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('ServiceWorker registrado correctamente:', registration.scope);
                    })
                    .catch(error => {
                        console.log('ServiceWorker falló:', error);
                    });
            });
        }
        
        // Initialize IndexedDB
        function initDB() {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open('medmanager-db', 1);
                
                request.onerror = () => {
                    console.error('Error al abrir la base de datos');
                    reject(request.error);
                };
                
                request.onsuccess = () => {
                    db = request.result;
                    console.log('Base de datos abierta exitosamente');
                    resolve(db);
                };
                
                request.onupgradeneeded = (event) => {
                    db = event.target.result;
                    
                    // Create medications store
                    if (!db.objectStoreNames.contains('medications')) {
                        const medicationStore = db.createObjectStore('medications', { keyPath: 'id', autoIncrement: true });
                        medicationStore.createIndex('name', 'name', { unique: false });
                        medicationStore.createIndex('expiry', 'expiry', { unique: false });
                    }
                    
                    // Create sync store
                    if (!db.objectStoreNames.contains('sync-medications')) {
                        db.createObjectStore('sync-medications', { keyPath: 'id', autoIncrement: true });
                    }
                };
            });
        }
        
        // Load medications
        async function loadMedications() {
            try {
                if (!db) await initDB();
                
                const transaction = db.transaction(['medications'], 'readonly');
                const store = transaction.objectStore('medications');
                const request = store.getAll();
                
                request.onsuccess = () => {
                    medications = request.result;
                    displayMedications();
                };
                
                request.onerror = () => {
                    console.error('Error al cargar medicamentos');
                    document.getElementById('medicationsContainer').innerHTML = '<div class="loading">Error al cargar medicamentos</div>';
                };
            } catch (error) {
                console.error('Error:', error);
                document.getElementById('medicationsContainer').innerHTML = '<div class="loading">Error al cargar medicamentos</div>';
            }
        }
        
        // Display medications
        function displayMedications(meds = medications) {
            const container = document.getElementById('medicationsContainer');
            
            if (meds.length === 0) {
                container.innerHTML = '<div class="loading">No hay medicamentos registrados. ¡Agrega el primero!</div>';
                return;
            }
            
            container.innerHTML = meds.map(med => `
                <div class="medication-card">
                    <div class="medication-name">${med.name}</div>
                    <div class="medication-details">
                        <p><strong>Descripción:</strong> ${med.description || 'Sin descripción'}</p>
                        <p><strong>Cantidad:</strong> ${med.quantity || '0'}</p>
                        <p><strong>Precio:</strong> $${med.price || '0.00'}</p>
                        ${med.expiry ? `<p><strong>Expira:</strong> ${new Date(med.expiry).toLocaleDateString()}</p>` : ''}
                    </div>
                    <div class="medication-actions">
                        <button onclick="editMedication('${med.id}')" class="btn btn-primary">Editar</button>
                        <button onclick="deleteMedication('${med.id}')" class="btn btn-danger">Eliminar</button>
                    </div>
                </div>
            `).join('');
        }
        
        // Search medications
        function searchMedications() {
            const searchTerm = document.getElementById('searchInput').value.toLowerCase();
            const filtered = medications.filter(med => 
                med.name.toLowerCase().includes(searchTerm) ||
                (med.description && med.description.toLowerCase().includes(searchTerm))
            );
            displayMedications(filtered);
        }
        
        // Modal search
        function modalSearch() {
            const searchTerm = document.getElementById('modalSearchInput').value.toLowerCase();
            const filtered = medications.filter(med => 
                med.name.toLowerCase().includes(searchTerm) ||
                (med.description && med.description.toLowerCase().includes(searchTerm))
            );
            
            const resultsContainer = document.getElementById('modalSearchResults');
            if (filtered.length === 0) {
                resultsContainer.innerHTML = '<p>No se encontraron medicamentos.</p>';
            } else {
                resultsContainer.innerHTML = filtered.map(med => `
                    <div class="medication-card" style="margin-bottom: 1rem;">
                        <div class="medication-name">${med.name}</div>
                        <div class="medication-details">
                            <p><strong>Cantidad:</strong> ${med.quantity}</p>
                            <p><strong>Precio:</strong> $${med.price || '0.00'}</p>
                        </div>
                        <div class="medication-actions">
                            <button onclick="editMedication(${med.id})" class="btn btn-primary">Editar</button>
                            <button onclick="deleteMedication(${med.id})" class="btn btn-danger">Eliminar</button>
                        </div>
                    </div>
                `).join('');
            }
        }
        
        // Add medication
        async function addMedication(event) {
            event.preventDefault();
            
            const medication = {
                name: document.getElementById('medicationName').value,
                description: document.getElementById('medicationDescription').value,
                quantity: parseInt(document.getElementById('medicationQuantity').value),
                price: parseFloat(document.getElementById('medicationPrice').value) || 0,
                expiry: document.getElementById('medicationExpiry').value,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            try {
                const transaction = db.transaction(['medications', 'sync-medications'], 'readwrite');
                const medicationStore = transaction.objectStore('medications');
                const syncStore = transaction.objectStore('sync-medications');
                
                const addRequest = medicationStore.add(medication);
                
                addRequest.onsuccess = () => {
                    // Add to sync queue if offline
                    if (!navigator.onLine) {
                        syncStore.add({ ...medication, action: 'add' });
                    }
                    
                    hideAddModal();
                    loadMedications();
                    
                    // Show success message
                    showNotification('Medicamento agregado exitosamente');
                };
                
                addRequest.onerror = () => {
                    console.error('Error al agregar medicamento');
                    showNotification('Error al agregar medicamento', 'error');
                };
            } catch (error) {
                console.error('Error:', error);
                showNotification('Error al agregar medicamento', 'error');
            }
        }
        
        // Edit medication
        function editMedication(id) {
            const medication = medications.find(med => med.id === id);
            if (!medication) return;
            
            // Fill form with existing data
            document.getElementById('medicationName').value = medication.name;
            document.getElementById('medicationDescription').value = medication.description || '';
            document.getElementById('medicationQuantity').value = medication.quantity;
            document.getElementById('medicationPrice').value = medication.price || 0;
            document.getElementById('medicationExpiry').value = medication.expiry || '';
            
            // Change form to update mode
            const form = document.getElementById('addMedicationForm');
            form.onsubmit = (event) => updateMedication(event, id);
            
            showAddModal();
        }
        
        // Update medication
        async function updateMedication(event, id) {
            event.preventDefault();
            
            const medication = {
                id: id,
                name: document.getElementById('medicationName').value,
                description: document.getElementById('medicationDescription').value,
                quantity: parseInt(document.getElementById('medicationQuantity').value),
                price: parseFloat(document.getElementById('medicationPrice').value) || 0,
                expiry: document.getElementById('medicationExpiry').value,
                createdAt: medications.find(med => med.id === id).createdAt,
                updatedAt: new Date().toISOString()
            };
            
            try {
                const transaction = db.transaction(['medications', 'sync-medications'], 'readwrite');
                const medicationStore = transaction.objectStore('medications');
                const syncStore = transaction.objectStore('sync-medications');
                
                const updateRequest = medicationStore.put(medication);
                
                updateRequest.onsuccess = () => {
                    // Add to sync queue if offline
                    if (!navigator.onLine) {
                        syncStore.add({ ...medication, action: 'update' });
                    }
                    
                    hideAddModal();
                    loadMedications();
                    showNotification('Medicamento actualizado exitosamente');
                    
                    // Reset form to add mode
                    document.getElementById('addMedicationForm').reset();
                    document.getElementById('addMedicationForm').onsubmit = addMedication;
                };
                
                updateRequest.onerror = () => {
                    console.error('Error al actualizar medicamento');
                    showNotification('Error al actualizar medicamento', 'error');
                };
            } catch (error) {
                console.error('Error:', error);
                showNotification('Error al actualizar medicamento', 'error');
            }
        }
        
        // Delete medication
        async function deleteMedication(id) {
            if (!confirm('¿Estás seguro de que quieres eliminar este medicamento?')) {
                return;
            }
            
            try {
                const transaction = db.transaction(['medications', 'sync-medications'], 'readwrite');
                const medicationStore = transaction.objectStore('medications');
                const syncStore = transaction.objectStore('sync-medications');
                
                const deleteRequest = medicationStore.delete(id);
                
                deleteRequest.onsuccess = () => {
                    // Add to sync queue if offline
                    if (!navigator.onLine) {
                        syncStore.add({ id: id, action: 'delete' });
                    }
                    
                    loadMedications();
                    showNotification('Medicamento eliminado exitosamente');
                };
                
                deleteRequest.onerror = () => {
                    console.error('Error al eliminar medicamento');
                    showNotification('Error al eliminar medicamento', 'error');
                };
            } catch (error) {
                console.error('Error:', error);
                showNotification('Error al eliminar medicamento', 'error');
            }
        }
        
        // Sync data
        async function syncData() {
            if (!navigator.onLine) {
                showNotification('No hay conexión a internet', 'error');
                return;
            }
            
            try {
                const transaction = db.transaction(['sync-medications'], 'readonly');
                const syncStore = transaction.objectStore('sync-medications');
                const request = syncStore.getAll();
                
                request.onsuccess = async () => {
                    const syncItems = request.result;
                    
                    if (syncItems.length === 0) {
                        showNotification('No hay datos para sincronizar');
                        return;
                    }
                    
                    // Simulate sync process
                    showNotification('Sincronizando datos...');
                    
                    // Clear sync queue after successful sync
                    const clearTransaction = db.transaction(['sync-medications'], 'readwrite');
                    const clearStore = clearTransaction.objectStore('sync-medications');
                    await clearStore.clear();
                    
                    showNotification('Datos sincronizados exitosamente');
                    loadMedications();
                };
            } catch (error) {
                console.error('Error al sincronizar:', error);
                showNotification('Error al sincronizar datos', 'error');
            }
        }
        
        // Modal functions
        function showAddModal() {
            document.getElementById('addModal').classList.add('show');
        }
        
        function hideAddModal() {
            document.getElementById('addModal').classList.remove('show');
            document.getElementById('addMedicationForm').reset();
        }
        
        function showSearchModal() {
            document.getElementById('searchModal').classList.add('show');
            document.getElementById('modalSearchInput').focus();
        }
        
        function hideSearchModal() {
            document.getElementById('searchModal').classList.remove('show');
            document.getElementById('modalSearchInput').value = '';
            document.getElementById('modalSearchResults').innerHTML = '';
        }
        
        // Notification function
        function showNotification(message, type = 'success') {
            // Simple notification - in a real app, you'd use a proper notification system
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${type === 'success' ? '#10b981' : '#ef4444'};
                color: white;
                padding: 1rem;
                border-radius: 0.5rem;
                z-index: 1001;
                max-width: 300px;
            `;
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }
        
        // Online/offline detection
        window.addEventListener('online', () => {
            document.getElementById('offlineIndicator').classList.remove('show');
            showNotification('Conexión restaurada');
            syncData();
        });
        
        window.addEventListener('offline', () => {
            document.getElementById('offlineIndicator').classList.add('show');
            showNotification('Trabajando en modo offline', 'error');
        });
        
        // Install prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            document.getElementById('installPrompt').classList.add('show');
        });
        
        async function installApp() {
            if (!deferredPrompt) {
                showNotification('La instalación no está disponible', 'error');
                return;
            }
            
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                showNotification('Aplicación instalada exitosamente');
            } else {
                showNotification('Instalación cancelada', 'error');
            }
            
            deferredPrompt = null;
            document.getElementById('installPrompt').classList.remove('show');
        }
        
        function dismissInstallPrompt() {
            document.getElementById('installPrompt').classList.remove('show');
        }
        
        // Initialize app
        document.addEventListener('DOMContentLoaded', () => {
            initDB().then(() => {
                loadMedications();
                
                // Check if offline
                if (!navigator.onLine) {
                    document.getElementById('offlineIndicator').classList.add('show');
                }
            });
        });
        
        // Close modals on outside click
        window.onclick = function(event) {
            if (event.target.classList.contains('modal')) {
                event.target.classList.remove('show');
            }
        }
    </script>
    
    <!-- Navigation -->
    <div style="text-align: center; margin: 20px 0;">
        <a href="/" class="btn btn-secondary">🏠 Volver al Inicio</a>
        <a href="/pwa-test" class="btn btn-info">🧪 Probar PWA</a>
    </div>
</body>
</html>