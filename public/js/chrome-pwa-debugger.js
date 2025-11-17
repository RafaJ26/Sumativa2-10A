// Enhanced PWA Installation Debugger - Chrome Address Bar Icon
// This script helps debug why the Chrome address bar install icon doesn't appear

(function() {
    'use strict';
    
    console.log('🔍 CHROME PWA ADDRESS BAR ICON DEBUGGER');
    console.log('==========================================');
    
    // Check Chrome version
    const chromeVersion = getChromeVersion();
    console.log(`📱 Chrome Version: ${chromeVersion}`);
    
    function getChromeVersion() {
        const raw = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
        return raw ? parseInt(raw[2], 10) : false;
    }
    
    // Check if PWA is already installed
    function checkInstallationStatus() {
        if (window.matchMedia('(display-mode: standalone)').matches) {
            console.log('✅ APP IS RUNNING IN STANDALONE MODE (Already Installed)');
            return true;
        }
        
        // Check if app is installed using getInstalledRelatedApps (if available)
        if ('getInstalledRelatedApps' in navigator) {
            navigator.getInstalledRelatedApps().then(apps => {
                console.log('📋 Installed related apps:', apps);
                if (apps.length > 0) {
                    console.log('✅ PWA appears to be already installed');
                    return true;
                }
            }).catch(err => {
                console.log('ℹ️ getInstalledRelatedApps not available:', err);
            });
        }
        
        return false;
    }
    
    // Comprehensive PWA criteria check
    function checkPWACriteria() {
        console.log('\n🔍 CHECKING CHROME PWA CRITERIA FOR ADDRESS BAR ICON');
        console.log('=====================================================');
        
        const criteria = {
            https: false,
            manifest: false,
            serviceWorker: false,
            fetchHandler: false,
            icons: false,
            displayMode: false,
            name: false,
            startUrl: false,
            userInteraction: false
        };
        
        // 1. HTTPS check
        if (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
            criteria.https = true;
            console.log('✅ HTTPS/Localhost: PASS');
        } else {
            console.log('❌ HTTPS/Localhost: FAIL - Address bar icon won\'t appear');
        }
        
        // 2. Manifest check
        const manifestLink = document.querySelector('link[rel="manifest"]');
        if (manifestLink) {
            criteria.manifest = true;
            console.log('✅ Manifest link: PASS');
            
            // Fetch and validate manifest
            fetch(manifestLink.href)
                .then(response => response.json())
                .then(manifest => {
                    console.log('\n📋 MANIFEST VALIDATION:');
                    
                    // Check name/short_name
                    if (manifest.name || manifest.short_name) {
                        criteria.name = true;
                        console.log('✅ Name/Short name: PASS');
                    } else {
                        console.log('❌ Name/Short name: FAIL');
                    }
                    
                    // Check display mode
                    const validDisplayModes = ['standalone', 'fullscreen', 'minimal-ui'];
                    if (manifest.display && validDisplayModes.includes(manifest.display)) {
                        criteria.displayMode = true;
                        console.log('✅ Display mode: PASS (' + manifest.display + ')');
                    } else {
                        console.log('❌ Display mode: FAIL - Must be standalone, fullscreen, or minimal-ui');
                    }
                    
                    // Check start_url
                    if (manifest.start_url) {
                        criteria.startUrl = true;
                        console.log('✅ Start URL: PASS (' + manifest.start_url + ')');
                    } else {
                        console.log('❌ Start URL: FAIL');
                    }
                    
                    // Check icons (192x192 and 512x512 required)
                    if (manifest.icons && Array.isArray(manifest.icons)) {
                        const has192 = manifest.icons.some(icon => 
                            icon.sizes && icon.sizes.includes('192'));
                        const has512 = manifest.icons.some(icon => 
                            icon.sizes && icon.sizes.includes('512'));
                        
                        if (has192 && has512) {
                            criteria.icons = true;
                            console.log('✅ Icons: PASS (192x192 and 512x512 present)');
                        } else {
                            console.log('❌ Icons: FAIL - Need both 192x192 and 512x512');
                        }
                    } else {
                        console.log('❌ Icons: FAIL - No icons array found');
                    }
                    
                    // Check prefer_related_applications
                    if (manifest.prefer_related_applications !== true) {
                        console.log('✅ prefer_related_applications: PASS (not true)');
                    } else {
                        console.log('❌ prefer_related_applications: FAIL (must not be true)');
                    }
                    
                    checkFinalCriteria(criteria);
                })
                .catch(err => {
                    console.log('❌ Manifest fetch error:', err);
                    checkFinalCriteria(criteria);
                });
        } else {
            console.log('❌ Manifest link: FAIL');
            checkFinalCriteria(criteria);
        }
        
        // 3. Service Worker check
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistration().then(registration => {
                if (registration) {
                    criteria.serviceWorker = true;
                    console.log('✅ Service Worker: PASS');
                    
                    // Check for fetch handler
                    if (registration.active) {
                        // Check if SW has fetch event listener
                        console.log('🔍 Checking for fetch handler in Service Worker...');
                        
                        // This is a complex check - we'll assume it has fetch handler if it's active
                        // In reality, Chrome checks the actual SW code
                        criteria.fetchHandler = true;
                        console.log('✅ Fetch handler: ASSUMED PASS (Chrome internal check)');
                    }
                } else {
                    console.log('❌ Service Worker: FAIL - Not registered');
                }
                
                checkFinalCriteria(criteria);
            }).catch(err => {
                console.log('❌ Service Worker check error:', err);
                checkFinalCriteria(criteria);
            });
        } else {
            console.log('❌ Service Worker: FAIL - Not supported');
            checkFinalCriteria(criteria);
        }
        
        // 4. User interaction check
        document.addEventListener('click', function() {
            if (!criteria.userInteraction) {
                criteria.userInteraction = true;
                console.log('👆 User interaction detected');
                checkFinalCriteria(criteria);
            }
        }, { once: true });
        
        return criteria;
    }
    
    function checkFinalCriteria(criteria) {
        const allPassed = Object.values(criteria).every(value => value === true);
        const installed = checkInstallationStatus();
        
        console.log('\n🏁 FINAL ANALYSIS:');
        console.log('==================');
        
        if (installed) {
            console.log('🎯 ADDRESS BAR ICON BEHAVIOR (Chrome 134+):');
            console.log('   If PWA is already installed → Shows "Open in app" button');
            console.log('   If PWA is not installed → Shows install icon in menu (3 dots)');
            console.log('   Address bar install icon only appears for NEW installations in older Chrome versions');
        }
        
        console.log('\n📊 CRITERIA STATUS:');
        Object.entries(criteria).forEach(([key, value]) => {
            console.log(`${value ? '✅' : '❌'} ${key}: ${value}`);
        });
        
        if (allPassed && !installed) {
            console.log('\n🎉 ALL CRITERIA MET!');
            console.log('💡 The install icon should appear in:');
            console.log('   - Chrome menu (3 dots) → "Install app"');
            console.log('   - May appear as "+" icon in address bar (older Chrome)');
            console.log('   - Will show "Open in app" if already installed (Chrome 134+)');
        } else if (!allPassed) {
            console.log('\n⚠️  MISSING CRITERIA - Install icon won\'t appear');
            const failed = Object.entries(criteria)
                .filter(([_, value]) => value === false)
                .map(([key, _]) => key);
            console.log('   Failed:', failed.join(', '));
        }
        
        // Chrome version specific behavior
        console.log('\n🔧 CHROME VERSION BEHAVIOR:');
        if (chromeVersion >= 134) {
            console.log('   Chrome 134+ → "Open in app" button (if installed)');
            console.log('   No address bar install icon for new installations');
        } else if (chromeVersion >= 76) {
            console.log('   Chrome 76-133 → "+" install icon in address bar');
        } else {
            console.log('   Chrome < 76 → No address bar install icon');
        }
    }
    
    // Additional debugging for Chrome's internal checks
    console.log('\n🔍 CHROME INTERNAL CHECKS:');
    console.log('   Chrome may have additional internal criteria');
    console.log('   including engagement metrics and site quality scores');
    
    // Start the analysis
    checkPWACriteria();
    
    // Monitor for beforeinstallprompt
    window.addEventListener('beforeinstallprompt', (e) => {
        console.log('\n🎯 beforeinstallprompt event fired!');
        console.log('   This means Chrome considers the PWA installable');
        console.log('   Install UI should be available in menu or address bar');
    });
    
    // Monitor for appinstalled
    window.addEventListener('appinstalled', () => {
        console.log('\n📱 App was installed successfully!');
        console.log('   Next visit should show "Open in app" button');
    });
    
})();