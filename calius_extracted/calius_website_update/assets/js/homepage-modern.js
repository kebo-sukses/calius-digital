/* eslint-env browser */

// ========== HOMEPAGE MODERN INTERACTIONS ==========

// Default Scroll (No Smooth Scroll)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            // Calculate offset for fixed navbar
            const navHeight = document.querySelector('.glass-nav').offsetHeight;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
            
            // Use native scroll - instant, no animation
            window.scrollTo({
                top: targetPosition,
                behavior: 'auto'
            });
        }
    });
});

// Navigation Scroll Effect
const nav = document.querySelector('.glass-nav');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Animate Elements on Scroll (Intersection Observer)
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe all animated elements
document.querySelectorAll('.stat-item, .proof-card, .bento-card, .testimonial-card').forEach(el => {
    observer.observe(el);
});

// Stats Counter Animation
function animateValue(element, start, end, duration) {
    // Validate input
    if (!element || isNaN(end)) {
        console.warn('Invalid element or end value for animation');
        return;
    }
    
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        const currentValue = Math.floor(progress * (end - start) + start);
        
        // Handle different formats
        if (element.dataset.suffix === 'k+') {
            element.textContent = (currentValue / 1000).toFixed(1) + 'K+';
        } else if (element.dataset.suffix === 'h') {
            element.textContent = (currentValue / 10).toFixed(1) + 'h';
        } else if (element.dataset.suffix === '+') {
            element.textContent = currentValue + '+';
        } else if (element.dataset.suffix === '%') {
            element.textContent = currentValue + '%';
        } else {
            element.textContent = currentValue;
        }
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            entry.target.classList.add('counted');
            
            const statValues = entry.target.querySelectorAll('.stat-value');
            statValues.forEach(stat => {
                const endValue = parseInt(stat.dataset.value);
                if (!isNaN(endValue)) {
                    animateValue(stat, 0, endValue, 2000);
                } else {
                    console.warn('No data-value attribute found on stat element:', stat);
                }
            });
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.quick-stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Progress Bar Animation
const progressObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            const progressFill = entry.target.querySelector('.progress-fill');
            if (progressFill) {
                const targetWidth = progressFill.dataset.width || '92%';
                progressFill.style.width = targetWidth;
            }
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.dashboard-progress').forEach(progress => {
    progressObserver.observe(progress);
});

// Button Ripple Effect
document.querySelectorAll('.animate-btn, .btn-hero-primary, .btn-product-primary, .btn-cta-primary').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        this.appendChild(ripple);
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Mobile Menu Toggle
const menuToggle = document.createElement('button');
menuToggle.className = 'menu-toggle';
menuToggle.innerHTML = '☰';
menuToggle.style.cssText = `
    display: none;
    background: none;
    border: none;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
`;

// Insert menu toggle after brand logo
const brandLogo = document.querySelector('.brand');
if (brandLogo && window.innerWidth <= 768) {
    brandLogo.parentNode.insertBefore(menuToggle, brandLogo.nextSibling);
}

menuToggle.addEventListener('click', () => {
    const navMenu = document.querySelector('.nav-menu');
    navMenu.classList.toggle('mobile-active');
});

// Lazy Load Images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Parallax Effect DISABLED - Causes scroll issues
// window.addEventListener('scroll', () => {
//     const scrolled = window.pageYOffset;
//     const parallax = document.querySelector('.hero-section');
//     if (parallax) {
//         parallax.style.transform = `translateY(${scrolled * 0.5}px)`;
//     }
// });

// Testimonial Auto-Rotate (optional)
let currentTestimonial = 0;
const testimonials = document.querySelectorAll('.testimonial-card');
if (testimonials.length > 0) {
    setInterval(() => {
        testimonials[currentTestimonial].style.opacity = '0.5';
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        testimonials[currentTestimonial].style.opacity = '1';
    }, 5000);
}

// Console Easter Egg
console.log('%c🚀 Calius Digital', 'font-size: 20px; font-weight: bold; color: #06D6A0;');
console.log('%cPowered by Gemini 2.5 Flash & High-End Encryption', 'font-size: 12px; color: #FF6B35;');
console.log('%c💡 Looking for a developer? Contact us!', 'font-size: 10px; color: #6C757D;');

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log(`⚡ Page loaded in ${pageLoadTime}ms`);
        }, 0);
    });
}
