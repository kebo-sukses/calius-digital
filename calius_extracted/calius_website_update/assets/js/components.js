/**
 * Component Loader
 * Loads header and footer components dynamically
 */

(function() {
    'use strict';

    /**
     * Load a component from a file
     * @param {string} componentPath - Path to the component file
     * @param {string} targetSelector - CSS selector for the target element
     * @returns {Promise}
     */
    async function loadComponent(componentPath, targetSelector) {
        try {
            const response = await fetch(componentPath);
            
            if (!response.ok) {
                throw new Error(`Failed to load component: ${componentPath}`);
            }
            
            const html = await response.text();
            const targetElement = document.querySelector(targetSelector);
            
            if (targetElement) {
                targetElement.innerHTML = html;
                return true;
            } else {
                console.warn(`Target element not found: ${targetSelector}`);
                return false;
            }
        } catch (error) {
            console.error('Error loading component:', error);
            return false;
        }
    }

    /**
     * Set active navigation link based on current page
     */
    function setActiveNavigation() {
        // Get current page name from URL
        const path = window.location.pathname;
        let currentPage = 'index'; // default to home
        
        if (path === '/' || path === '/index.html' || path.endsWith('/')) {
            currentPage = 'index';
        } else {
            // Extract page name from path (e.g., /about.html -> about)
            const match = path.match(/\/([^\/]+)\.html$/);
            if (match) {
                currentPage = match[1];
            }
        }
        
        // Remove all active classes
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            
            // Add active class to matching page
            const linkPage = link.getAttribute('data-page');
            if (linkPage === currentPage) {
                link.classList.add('active');
            }
        });
    }

    /**
     * Initialize components
     */
    async function initComponents() {
        // Load header
        const headerLoaded = await loadComponent('/components/header.html', '#header-placeholder');
        
        // Load footer
        const footerLoaded = await loadComponent('/components/footer.html', '#footer-placeholder');
        
        // Set active navigation after header is loaded
        if (headerLoaded) {
            setActiveNavigation();
            
            // Language switcher removed (site is English-only)
            
            // Re-initialize mobile menu if main.js is loaded
            if (typeof window.initMobileMenu === 'function') {
                window.initMobileMenu();
            }
        }
        
        // Dispatch custom event when components are loaded
        document.dispatchEvent(new CustomEvent('componentsLoaded', {
            detail: {
                headerLoaded,
                footerLoaded
            }
        }));
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initComponents);
    } else {
        initComponents();
    }

    // Export functions for external use
    window.ComponentLoader = {
        loadComponent,
        setActiveNavigation,
        initComponents
    };

})();
