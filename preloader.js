// Preloader Integration Script for Tech Talk Solution
// This script handles the preloader functionality across all pages

(function() {
    'use strict';
    
    // Configuration
    const PRELOADER_CONFIG = {
        enabled: true, // Preloader enabled for deployment
        minLoadTime: 2000, // Minimum loading time in milliseconds
        maxLoadTime: 4000,  // Maximum loading time in milliseconds
        preloaderUrl: 'preloader.html',
        excludePages: [] // Pages to exclude from preloader
    };
    
    // Check if preloader should be shown
    function shouldShowPreloader() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const isExcluded = PRELOADER_CONFIG.excludePages.includes(currentPage);
        const isPreloaderPage = currentPage.includes('preloader.html');
        
        // Always show preloader (removed session check)
        return PRELOADER_CONFIG.enabled && !isExcluded && !isPreloaderPage;
    }
    
    // Show preloader overlay
    function showPreloaderOverlay() {
        // Create preloader overlay
        const overlay = document.createElement('div');
        overlay.id = 'preloader-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 1;
            transition: opacity 0.8s ease-out;
        `;
        
        // Create preloader content
        const content = document.createElement('div');
        content.style.cssText = `
            text-align: center;
            color: white;
        `;
        
        content.innerHTML = `
            <div style="
                width: 120px;
                height: 120px;
                margin: 0 auto 30px;
                position: relative;
                animation: logoFloat 3s ease-in-out infinite;
            ">
                <img src="logo.svg" 
                     alt="Tech Talk Solution" 
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
                     style="
                         width: 100%;
                         height: 100%;
                         object-fit: contain;
                         filter: drop-shadow(0 10px 20px rgba(0,0,0,0.3));
                         animation: logoRotate 4s linear infinite;
                     ">
                <div style="
                    display: none;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 15px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 24px;
                    font-weight: bold;
                ">TTS</div>
            </div>
            <div style="
                font-size: 24px;
                font-weight: bold;
                margin-bottom: 30px;
                text-shadow: 0 2px 10px rgba(0,0,0,0.3);
                animation: textPulse 2s ease-in-out infinite;
            ">Tech Talk Solution</div>
            <div style="
                width: 300px;
                height: 6px;
                background: rgba(255,255,255,0.2);
                border-radius: 10px;
                margin: 0 auto 20px;
                overflow: hidden;
                position: relative;
            ">
                <div id="inline-progress" style="
                    height: 100%;
                    background: linear-gradient(90deg, #00d4ff, #090979);
                    border-radius: 10px;
                    width: 0%;
                    transition: width 0.3s ease;
                    position: relative;
                "></div>
            </div>
            <div id="inline-percentage" style="
                font-size: 18px;
                font-weight: 600;
                text-shadow: 0 2px 5px rgba(0,0,0,0.3);
            ">0%</div>
        `;
        
        // Add animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes logoFloat {
                0%, 100% { transform: translateY(0px); }
                50% { transform: translateY(-20px); }
            }
            @keyframes logoRotate {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            @keyframes textPulse {
                0%, 100% { opacity: 1; transform: scale(1); }
                50% { opacity: 0.8; transform: scale(1.05); }
            }
        `;
        
        document.head.appendChild(style);
        overlay.appendChild(content);
        document.body.appendChild(overlay);
        
        return overlay;
    }
    
    // Animate progress
    function animateProgress(progressElement, percentageElement, duration) {
        return new Promise((resolve) => {
            let progress = 0;
            const increment = 100 / (duration / 50);
            
            const interval = setInterval(() => {
                progress += Math.random() * increment + 0.5;
                if (progress > 100) progress = 100;
                
                progressElement.style.width = progress + '%';
                percentageElement.textContent = Math.floor(progress) + '%';
                
                if (progress >= 100) {
                    clearInterval(interval);
                    resolve();
                }
            }, 50);
        });
    }
    
    // Hide preloader
    function hidePreloader(overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 800);
    }
    
    // Initialize preloader
    function initPreloader() {
        if (!shouldShowPreloader()) {
            return;
        }
        
        // Removed session storage marking to allow preloader on every visit
        
        // Show preloader overlay
        const overlay = showPreloaderOverlay();
        const progressElement = document.getElementById('inline-progress');
        const percentageElement = document.getElementById('inline-percentage');
        
        // Calculate loading duration
        const loadDuration = Math.random() * 
            (PRELOADER_CONFIG.maxLoadTime - PRELOADER_CONFIG.minLoadTime) + 
            PRELOADER_CONFIG.minLoadTime;
        
        // Wait for DOM to be ready
        const domReady = new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
        
        // Wait for all resources to load
        const resourcesReady = new Promise((resolve) => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', resolve);
            }
        });
        
        // Start progress animation
        setTimeout(() => {
            animateProgress(progressElement, percentageElement, loadDuration)
                .then(() => {
                    return Promise.all([domReady, resourcesReady]);
                })
                .then(() => {
                    setTimeout(() => {
                        hidePreloader(overlay);
                    }, 500);
                });
        }, 300);
    }
    
    // Add navigation interceptor for internal links
    function addNavigationInterceptor() {
        document.addEventListener('click', function(e) {
            const link = e.target.closest('a');
            if (!link) return;
            
            const href = link.getAttribute('href');
            if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto:')) {
                return;
            }
            
            // Check if it's an internal page
            const internalPages = ['index.html', 'services.html', 'about-us.html', 'contact.html', 'why-choose-us.html', 'Growth.html'];
            const isInternalPage = internalPages.some(page => href.includes(page));
            
            if (isInternalPage) {
                e.preventDefault();
                
                // Navigate to preloader with target page (no session management needed)
                const targetPage = href;
                window.location.href = `preloader.html?page=${encodeURIComponent(targetPage)}`;
            }
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initPreloader();
            addNavigationInterceptor();
        });
    } else {
        initPreloader();
        addNavigationInterceptor();
    }
    
})();

// Navigation event listener (session management removed)
window.addEventListener('beforeunload', function() {
    // No session management needed - preloader will show on every page
});