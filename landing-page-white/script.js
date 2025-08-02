// JavaScript for the minimalist white/gray landing page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive features
    initScrollAnimations();
    initSmoothScrolling();
    initNavigationEffects();
    initProgressAnimations();
    initParallaxEffects();
    initFormInteractions();
    
    console.log('IkidPro Minimalist Landing Page - Initialized');
});

// Scroll-triggered animations using Intersection Observer
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Add staggered animation for child elements
                const children = entry.target.querySelectorAll('.animate-on-scroll');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animated');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Observe all elements with animation classes
    document.querySelectorAll('.animate-on-scroll, .feature-card, .section-entrance').forEach(el => {
        observer.observe(el);
    });
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const offsetTop = target.offsetTop - 80; // Account for fixed nav
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update URL without triggering scroll
                history.pushState(null, null, this.getAttribute('href'));
            }
        });
    });
}

// Navigation background and active state management
function initNavigationEffects() {
    const nav = document.querySelector('nav');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');
    
    // Navigation background on scroll
    function updateNavBackground() {
        if (window.scrollY > 50) {
            nav.classList.add('bg-white/95', 'shadow-sm');
            nav.classList.remove('bg-white/90');
        } else {
            nav.classList.add('bg-white/90');
            nav.classList.remove('bg-white/95', 'shadow-sm');
        }
    }
    
    // Active navigation link highlighting
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('text-primary');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('text-primary');
                    }
                });
            }
        });
    }
    
    window.addEventListener('scroll', () => {
        updateNavBackground();
        updateActiveNavLink();
    });
    
    // Initialize on load
    updateNavBackground();
    updateActiveNavLink();
}

// Animate progress bars when they come into view
function initProgressAnimations() {
    const progressBars = document.querySelectorAll('.h-2 > div');
    
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.style.width;
                
                // Reset and animate
                progressBar.style.width = '0%';
                progressBar.classList.add('progress-bar');
                
                setTimeout(() => {
                    progressBar.style.width = width;
                }, 200);
                
                progressObserver.unobserve(progressBar);
            }
        });
    }, { threshold: 0.5 });
    
    progressBars.forEach(bar => {
        progressObserver.observe(bar);
    });
}

// Subtle parallax effects for enhanced depth
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.animate-float-gentle');
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        parallaxElements.forEach(element => {
            element.style.transform = `translateY(${rate * 0.1}px)`;
        });
    }
    
    // Throttled scroll listener for performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateParallax();
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Form interactions and validation
function initFormInteractions() {
    const buttons = document.querySelectorAll('a[href*="register"], a[href*="demo"]');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Add click animation
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Track user interaction (analytics placeholder)
            trackUserInteraction(this.textContent.trim(), this.href);
        });
    });
}

// Analytics and user interaction tracking
function trackUserInteraction(action, target) {
    // Placeholder for analytics tracking
    console.log(`User Interaction: ${action} - ${target}`);
    
    // Example: Google Analytics or custom analytics
    // gtag('event', 'click', {
    //     event_category: 'Landing Page',
    //     event_label: action,
    //     value: target
    // });
}

// Utility function for element visibility detection
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Real-time dashboard simulation
function initDashboardSimulation() {
    const dashboardValues = document.querySelectorAll('.text-2xl');
    
    setInterval(() => {
        dashboardValues.forEach(value => {
            if (value.textContent.includes('°F')) {
                // Simulate temperature fluctuation
                const baseTemp = 98.2;
                const variation = (Math.random() - 0.5) * 0.6;
                const newTemp = (baseTemp + variation).toFixed(1);
                value.textContent = `${newTemp}°F`;
            }
            
            if (value.textContent.includes('h')) {
                // Simulate sleep time updates
                const hours = Math.floor(Math.random() * 2) + 7;
                const minutes = Math.floor(Math.random() * 60);
                value.textContent = `${hours}.${minutes < 10 ? '0' : ''}${Math.floor(minutes/10)}h`;
            }
        });
    }, 5000); // Update every 5 seconds
}

// Initialize real-time simulation after page load
window.addEventListener('load', () => {
    setTimeout(initDashboardSimulation, 2000);
});

// Mobile menu toggle (if needed for responsive design)
function initMobileMenu() {
    const mobileMenuButton = document.querySelector('[data-mobile-menu]');
    const mobileMenu = document.querySelector('[data-mobile-menu-content]');
    
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            
            // Animate button icon
            const icon = mobileMenuButton.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-times');
            }
        });
    }
}

// Keyboard navigation enhancement
document.addEventListener('keydown', function(e) {
    // ESC key to close any open modals or menus
    if (e.key === 'Escape') {
        const mobileMenu = document.querySelector('[data-mobile-menu-content]');
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }
    }
    
    // Arrow key navigation for sections
    if (e.key === 'ArrowDown' && e.ctrlKey) {
        e.preventDefault();
        scrollToNextSection();
    }
    
    if (e.key === 'ArrowUp' && e.ctrlKey) {
        e.preventDefault();
        scrollToPreviousSection();
    }
});

function scrollToNextSection() {
    const sections = Array.from(document.querySelectorAll('section[id]'));
    const currentPos = window.scrollY + 100;
    
    for (let i = 0; i < sections.length; i++) {
        if (sections[i].offsetTop > currentPos) {
            sections[i].scrollIntoView({ behavior: 'smooth' });
            break;
        }
    }
}

function scrollToPreviousSection() {
    const sections = Array.from(document.querySelectorAll('section[id]')).reverse();
    const currentPos = window.scrollY + 100;
    
    for (let i = 0; i < sections.length; i++) {
        if (sections[i].offsetTop < currentPos - 50) {
            sections[i].scrollIntoView({ behavior: 'smooth' });
            break;
        }
    }
}

// Performance monitoring
function initPerformanceMonitoring() {
    // Monitor page load performance
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.getEntriesByType('navigation')[0];
            console.log('Page Load Performance:', {
                domContentLoaded: perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart,
                loadComplete: perfData.loadEventEnd - perfData.loadEventStart,
                totalTime: perfData.loadEventEnd - perfData.fetchStart
            });
        }, 0);
    });
}

// Initialize performance monitoring
initPerformanceMonitoring();

// Error handling and fallbacks
window.addEventListener('error', function(e) {
    console.warn('Landing page error:', e.error);
    // Graceful degradation - ensure basic functionality
});

// Preload critical resources
function preloadCriticalResources() {
    const criticalLinks = [
        '../index.html#/login',
        '../index.html#/register'
    ];
    
    criticalLinks.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = href;
        document.head.appendChild(link);
    });
}

// Initialize resource preloading
setTimeout(preloadCriticalResources, 1000);

// Export functions for potential external use
window.IkidProLanding = {
    trackUserInteraction,
    initScrollAnimations,
    initSmoothScrolling
};
