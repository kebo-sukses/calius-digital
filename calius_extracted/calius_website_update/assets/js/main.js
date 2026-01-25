/* ============================================
   CALIUS DIGITAL - Main JavaScript
   High-Performance Frontend Functionality
   ============================================ */

(function() {
  'use strict';

  // ============================================
  // Global Variables
  // ============================================
  
  const state = {
    currentLanguage: localStorage.getItem('language') || 'en',
    cart: JSON.parse(localStorage.getItem('cart')) || [],
    settings: null,
    templates: null
  };

  // ============================================
  // Initialization
  // ============================================
  
  document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
  });

  async function initializeApp() {
    try {
      // Load settings
      await loadSettings();
      
      // Initialize components
      initializeNavigation();
      initializeScrollEffects();
      initializeLazyLoading();
      initializeCart();
      initializeForms();
      initializeSearch();
      
      // Site is English-only; language features removed
      
      console.log('Calius Digital initialized successfully');
    } catch (error) {
      console.error('Initialization error:', error);
    }
  }

  // ============================================
  // Settings Management
  // ============================================
  
  async function loadSettings() {
    try {
      const response = await fetch('/data/settings.json');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      
      // Validate JSON before parsing
      if (!text || text.trim().length === 0) {
        throw new Error('Empty response from settings.json');
      }
      
      state.settings = JSON.parse(text);
      return state.settings;
    } catch (error) {
      console.error('Error loading settings:', error);
      // Use default settings as fallback
      state.settings = {
        site: {
          name: 'Calius Digital',
          defaultLanguage: 'en',
          currency: 'USD'
        }
      };
      return state.settings;
    }
  }

  // ============================================
  // Navigation
  // ============================================
  
  function initializeNavigation() {
    const header = document.querySelector('.header');
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect
    let lastScroll = 0;
    window.addEventListener('scroll', function() {
      const currentScroll = window.pageYOffset;
      
      if (currentScroll > 100) {
        header?.classList.add('scrolled');
      } else {
        header?.classList.remove('scrolled');
      }
      
      lastScroll = currentScroll;
    });

    // Mobile menu toggle
    const mobileOverlay = document.querySelector('.mobile-overlay');
    mobileToggle?.addEventListener('click', function() {
      const isOpen = navMenu?.classList.toggle('active');
      this.classList.toggle('active');
      this.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (navMenu) navMenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      document.body.classList.toggle('menu-open');
      mobileOverlay?.classList.toggle('active');
    });

    // Close mobile menu on link click
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        navMenu?.classList.remove('active');
        mobileToggle?.classList.remove('active');
        mobileToggle?.setAttribute('aria-expanded', 'false');
        if (navMenu) navMenu.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('menu-open');
        mobileOverlay?.classList.remove('active');
      });
    });

    // Close mobile menu when tapping overlay
    mobileOverlay?.addEventListener('click', function() {
      navMenu?.classList.remove('active');
      mobileToggle?.classList.remove('active');
      mobileToggle?.setAttribute('aria-expanded', 'false');
      if (navMenu) navMenu.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('menu-open');
      this.classList.remove('active');
    });

    // Active link highlighting
    highlightActiveLink();
  }

  function highlightActiveLink() {
      const maxRetries = 10;
      let attempts = 0;

      function tryHighlight() {
        const currentPath = window.location.pathname.replace(/\/$/, '');
        const navLinks = document.querySelectorAll('.nav-link');

        if (!navLinks || navLinks.length === 0) {
          attempts++;
          if (attempts <= maxRetries) {
            // retry after a short delay — useful when header is injected asynchronously
            return setTimeout(tryHighlight, 80);
          }
          return;
        }

        navLinks.forEach(link => {
          const href = (link.getAttribute('href') || '').replace(/\/$/, '');
          if (href === currentPath || (currentPath === '' && (href === '/' || href === '/index.html'))) {
            link.classList.add('active');
          }
        });
      }

      tryHighlight();
  }

  // Language features removed — site is English-only

  // ============================================
  // Scroll Effects
  // ============================================
  
  function initializeScrollEffects() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#') {
          e.preventDefault();
          const target = document.querySelector(href);
          if (target) {
            target.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            });
          }
        }
      });
    });

    // Scroll reveal animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.card, .section').forEach(el => {
      observer.observe(el);
    });
  }

  // ============================================
  // Lazy Loading
  // ============================================
  
  function initializeLazyLoading() {
    if ('loading' in HTMLImageElement.prototype) {
      // Native lazy loading
      const images = document.querySelectorAll('img[loading="lazy"]');
      images.forEach(img => {
        img.src = img.dataset.src || img.src;
      });
    } else {
      // Fallback for browsers that don't support native lazy loading
      const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      });

      document.querySelectorAll('img.lazy').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }

  // ============================================
  // Shopping Cart
  // ============================================
  
  function initializeCart() {
    updateCartUI();
    
    // Add to cart buttons
    document.querySelectorAll('.add-to-cart').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        const templateId = this.dataset.templateId;
        addToCart(templateId);
      });
    });
  }

  function addToCart(templateId) {
    // Check if already in cart
    if (state.cart.find(item => item.id === templateId)) {
      showNotification('Item already in cart', 'warning');
      return;
    }
    
    // Add to cart
    state.cart.push({
      id: templateId,
      quantity: 1,
      addedAt: new Date().toISOString()
    });
    
    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(state.cart));
    
    // Update UI
    updateCartUI();
    showNotification('Added to cart successfully', 'success');
  }

  function removeFromCart(templateId) {
    state.cart = state.cart.filter(item => item.id !== templateId);
    localStorage.setItem('cart', JSON.stringify(state.cart));
    updateCartUI();
    showNotification('Removed from cart', 'info');
  }

  function updateCartUI() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
      cartCount.textContent = state.cart.length;
      cartCount.style.display = state.cart.length > 0 ? 'block' : 'none';
    }
  }

  // ============================================
  // Forms
  // ============================================
  
  function initializeForms() {
    // Newsletter form
    const newsletterForm = document.querySelector('#newsletter-form');
    if (newsletterForm) {
      newsletterForm.addEventListener('submit', handleNewsletterForm);
    }
  }

  async function handleNewsletterForm(e) {
    e.preventDefault();
    
    const email = e.target.querySelector('input[type="email"]').value;
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      showNotification('Successfully subscribed to newsletter!', 'success');
      e.target.reset();
    } catch (error) {
      console.error('Newsletter subscription error:', error);
      showNotification('Failed to subscribe. Please try again.', 'error');
    }
  }

  // ============================================
  // Search
  // ============================================
  
  function initializeSearch() {
    const searchInput = document.querySelector('.search-input');
    const searchResults = document.querySelector('.search-results');
    
    if (searchInput) {
      let searchTimeout;
      
      searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        const query = this.value.trim();
        
        if (query.length < 2) {
          if (searchResults) searchResults.innerHTML = '';
          return;
        }
        
        searchTimeout = setTimeout(() => {
          performSearch(query);
        }, 300);
      });
    }
  }

  async function performSearch(query) {
    try {
      // Load templates and blog data
      const [templates, blog] = await Promise.all([
        fetch('/data/templates.json').then(r => r.json()),
        fetch('/data/blog.json').then(r => r.json())
      ]);
      
      // Search in templates
      const templateResults = templates.templates.filter(t => 
        t.name[state.currentLanguage].toLowerCase().includes(query.toLowerCase()) ||
        t.description[state.currentLanguage].toLowerCase().includes(query.toLowerCase())
      );
      
      // Search in blog posts
      const blogResults = blog.posts.filter(p =>
        p.title[state.currentLanguage].toLowerCase().includes(query.toLowerCase()) ||
        p.excerpt[state.currentLanguage].toLowerCase().includes(query.toLowerCase())
      );
      
      displaySearchResults(templateResults, blogResults);
    } catch (error) {
      console.error('Search error:', error);
    }
  }

  function displaySearchResults(templates, posts) {
    const searchResults = document.querySelector('.search-results');
    if (!searchResults) return;
    
    let html = '<div class="search-results-container">';
    
    if (templates.length > 0) {
      html += '<h4>Templates</h4><ul>';
      templates.slice(0, 5).forEach(t => {
        html += `<li><a href="/templates?id=${t.id}">${t.name[state.currentLanguage]}</a></li>`;
      });
      html += '</ul>';
    }
    
    if (posts.length > 0) {
      html += '<h4>Blog Posts</h4><ul>';
      posts.slice(0, 5).forEach(p => {
        html += `<li><a href="/blog/${p.slug}">${p.title[state.currentLanguage]}</a></li>`;
      });
      html += '</ul>';
    }
    
    if (templates.length === 0 && posts.length === 0) {
      html += '<p>No results found</p>';
    }
    
    html += '</div>';
    searchResults.innerHTML = html;
  }

  // ============================================
  // Notifications
  // ============================================
  
  function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  // ============================================
  // Utility Functions
  // ============================================
  
  function formatPrice(price, currency = 'USD') {
    return new Intl.NumberFormat(state.currentLanguage === 'id' ? 'id-ID' : 'en-US', {
      style: 'currency',
      currency: currency
    }).format(price);
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(state.currentLanguage === 'id' ? 'id-ID' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }

  // ============================================
  // Export to global scope
  // ============================================
  
  window.CaliusDigital = {
    state,
    switchLanguage,
    addToCart,
    removeFromCart,
    showNotification,
    formatPrice,
    formatDate
  };

})();
