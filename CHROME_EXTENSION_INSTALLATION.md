# 🔧 GUÍA DE INSTALACIÓN - CHROME EXTENSION MEDMANAGER

## 📋 Resumen de la Extensión

He creado una **Chrome Extension** completa que replica la funcionalidad del ícono de Google Classroom. Esta extensión:

- ✅ Aparece en el toolbar de Chrome (parte superior derecha)
- ✅ Proporciona acceso directo a MedManager
- ✅ Incluye funciones adicionales (descarga de datos)
- ✅ Funciona como alternativa al ícono de instalación PWA nativo

---

## 📁 Archivos de la Extensión

```
chrome-extension/
├── manifest.json          # Configuración principal
├── popup.html             # Menú emergente
├── popup.js               # Lógica del popup
├── background.js          # Servicio de fondo
├── content.js             # Script de contenido
├── content.css            # Estilos del contenido
└── icons/                 # Iconos SVG
    ├── icon-16x16.svg
    ├── icon-32x32.svg
    ├── icon-48x48.svg
    └── icon-128x128.svg
```

---

## 🚀 Pasos de Instalación

### PASO 1: Preparar Chrome
1. Abrir Google Chrome
2. Escribir en la barra de direcciones: `chrome://extensions/`
3. **Activar** el interruptor "Modo desarrollador" (esquina superior derecha)

### PASO 2: Cargar la Extensión
1. Click en el botón **"Cargar descomprimida"** (Load unpacked)
2. Navegar hasta la carpeta: `Y:\Documentos Uni\Cuatrimestre 10\Aplicaciones Web Progresivas\2do_Parcial_Restaurant2\chrome-extension`
3. **Seleccionar** la carpeta `chrome-extension` y click **"Seleccionar carpeta"**

### PASO 3: Verificar Instalación
✅ **ÉXITO:** La extensión MedManager aparecerá en la lista
✅ **Ícono:** Aparecerá en el toolbar de Chrome (parte superior derecha)
✅ **Funcional:** Click en el ícono para probar el menú

---

## 🎯 Funcionalidades de la Extensión

### 1. Ícono en Toolbar
- **Ubicación:** Parte superior derecha de Chrome
- **Apariencia:** Ícono de medicina/cruz médica
- **Acceso:** Siempre visible mientras navegas

### 2. Menú Emergente (Popup)
Al hacer click en el ícono, aparece un menú con:
- 📋 **Ver Medicamentos** - Acceso directo a la app
- ➕ **Agregar Medicamento** - Formulario rápido
- 📊 **Reportes** - Estadísticas y reportes
- 💾 **Descargar Datos** - Exportar medicamentos
- 🔄 **Sincronizar** - Sincronizar datos offline
- ⚙️ **Configuración** - Ajustes de la app

### 3. Script de Contenido
- **Detección automática** de páginas MedManager
- **Botón flotante** para descargar datos (como Google Classroom)
- **Integración seamless** con la interfaz existente

---

## 🔧 Código de la Extensión

### manifest.json
```json
{
  "manifest_version": 3,
  "name": "MedManager PWA Assistant",
  "version": "1.0.0",
  "description": "Asistente para MedManager - Gestión de medicamentos",
  "permissions": ["activeTab"],
  "host_permissions": ["http://localhost:8000/*"],
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": ["http://localhost:8000/*"],
      "js": ["content.js"],
      "css": ["content.css"]
    }
  ],
  "action": {
    "default_popup": "popup.html",
    "default_title": "MedManager",
    "default_icon": {
      "16": "icons/icon-16x16.svg",
      "32": "icons/icon-32x32.svg",
      "48": "icons/icon-48x48.svg",
      "128": "icons/icon-128x128.svg"
    }
  },
  "icons": {
    "16": "icons/icon-16x16.svg",
    "32": "icons/icon-32x32.svg",
    "48": "icons/icon-48x48.svg",
    "128": "icons/icon-128x128.svg"
  }
}
```

### Funciones Principales

#### 1. Acceso Directo a Medicamentos
```javascript
// popup.js
function openMedications() {
  chrome.tabs.create({ url: 'http://localhost:8000/medications' });
}
```

#### 2. Descarga de Datos (Como Google Classroom)
```javascript
// content.js
function addDownloadButton() {
  const downloadBtn = document.createElement('button');
  downloadBtn.innerHTML = '💾 Descargar';
  downloadBtn.className = 'medmanager-download-btn';
  downloadBtn.addEventListener('click', downloadMedications);
  
  // Estilo similar a Google Classroom
  downloadBtn.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #1a73e8;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    z-index: 1000;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  `;
  
  document.body.appendChild(downloadBtn);
}
```

#### 3. Exportar Datos
```javascript
function downloadMedications() {
  const medications = JSON.parse(localStorage.getItem('medications') || '[]');
  const dataStr = JSON.stringify(medications, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `medicamentos_${new Date().toISOString().split('T')[0]}.json`;
  link.click();
  
  URL.revokeObjectURL(url);
}
```

---

## 🧪 Pruebas de Funcionamiento

### Prueba 1: Ícono en Toolbar
1. **Abrir** Chrome
2. **Buscar** el ícono MedManager en el toolbar
3. **Verificar** que sea visible y tenga el diseño correcto

### Prueba 2: Menú Emergente
1. **Click** en el ícono de la extensión
2. **Verificar** que aparezca el menú con 6 opciones
3. **Probar** cada botón para asegurar funcionalidad

### Prueba 3: Script de Contenido
1. **Navegar** a http://localhost:8000
2. **Verificar** que aparezca el botón flotante de descarga
3. **Click** en el botón para probar descarga de datos

### Prueba 4: Integración con PWA
1. **Verificar** que la extensión detecte cuando estás en MedManager
2. **Probar** acceso directo desde el menú emergente
3. **Confirmar** sincronización con datos offline

---

## 🛠️ Solución de Problemas

### ❌ La extensión no aparece en el toolbar
**Causa:** Error en manifest.json o iconos faltantes
**Solución:** Verificar que todos los archivos estén presentes y el JSON sea válido

### ❌ El menú no funciona
**Causa:** Errores en popup.js
**Solución:** Abrir Chrome DevTools → Extensions → Inspect views: popup.html

### ❌ El botón de descarga no aparece
**Causa:** Content script no se está ejecutando
**Solución:** Verificar que la URL en matches coincida con localhost:8000

### ❌ No se pueden descargar datos
**Causa:** localStorage vacío o formato incorrecto
**Solución:** Verificar que los datos existan en localStorage bajo la key 'medications'

---

## 🎯 Ventajas de esta Solución

### vs. Instalación PWA Nativa
- ✅ **Inmediata:** No requiere esperar el evento beforeinstallprompt
- ✅ **Visible:** Siempre visible en el toolbar de Chrome
- ✅ **Confiable:** No depende de requisitos de Service Worker
- ✅ **Extra:** Funciones adicionales (exportar datos, acceso rápido)

### vs. Google Classroom
- ✅ **Misma ubicación:** Toolbar superior derecha
- ✅ **Funcionalidad similar:** Menú emergente con acciones
- ✅ **Botón flotante:** Descarga directa desde la página
- ✅ **Integración perfecta:** Diseño adaptado a MedManager

---

## 📊 Resultado Esperado

Después de la instalación:

1. **Ícono MedManager** aparece en el toolbar de Chrome
2. **Menú emergente** funciona con todas las opciones
3. **Botón flotante** aparece en páginas de MedManager
4. **Exportación de datos** funciona correctamente
5. **Acceso directo** a todas las funciones de la app

**🎉 ÉXITO:** Ahora tienes una experiencia similar a Google Classroom pero para MedManager, con instalación inmediata y funciones extra!

---

## 📞 Soporte

Si encuentras problemas durante la instalación:

1. **Verificar** que Chrome esté actualizado
2. **Comprobar** que todos los archivos estén presentes
3. **Revisar** la consola de errores (F12 → Console)
4. **Recargar** la extensión en chrome://extensions/

**Nota:** Esta extensión es una solución alternativa al ícono de instalación PWA nativo que no aparecía en Chrome desktop.