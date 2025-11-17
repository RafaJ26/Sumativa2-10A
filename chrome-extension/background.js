// Background service worker for MedManager Chrome Extension

chrome.runtime.onInstalled.addListener(() => {
    console.log('MedManager PWA Helper extension installed');
});

// Listen for messages from content scripts or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'checkPWAStatus') {
        // Check if the current tab is the MedManager PWA
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            const currentTab = tabs[0];
            if (currentTab && currentTab.url && currentTab.url.includes('localhost:8000')) {
                sendResponse({isMedManager: true});
            } else {
                sendResponse({isMedManager: false});
            }
        });
        return true; // Keep the message channel open for async response
    }
});

// Optional: Add context menu for quick actions
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'medmanager-add-medication',
        title: 'Agregar Medicamento',
        contexts: ['all'],
        documentUrlPatterns: ['http://localhost:8000/*']
    });
    
    chrome.contextMenus.create({
        id: 'medmanager-view-inventory',
        title: 'Ver Inventario',
        contexts: ['all'],
        documentUrlPatterns: ['http://localhost:8000/*']
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'medmanager-add-medication') {
        chrome.tabs.create({ url: 'http://localhost:8000/medicamentos/agregar' });
    } else if (info.menuItemId === 'medmanager-view-inventory') {
        chrome.tabs.create({ url: 'http://localhost:8000/inventario' });
    }
});