/**
 * Services page specific JavaScript
 */
document.addEventListener('DOMContentLoaded', function() {
    // --- CONSTANTS ---
    const serviceCards = document.querySelectorAll('.service-card');
    const backToTopBtn = document.getElementById('backToTop');

    // --- INITIALIZATIONS ---
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // --- SERVICE CARD INTERACTIONS ---
    // Add hover effects and click tracking to service cards
    serviceCards.forEach(card => {
        // Track service card clicks for analytics
        const serviceLink = card.querySelector('a');
        if (serviceLink) {
            serviceLink.addEventListener('click', function() {
                const serviceName = card.querySelector('h3').textContent;
                if (typeof gtag !== 'undefined' && localStorage.getItem('cookiesAccepted') === 'true') {
                    gtag('event', 'service_interest', {
                        'event_category': 'services',
                        'event_label': serviceName
                    });
                }
            });
        }
    });

    // --- ACCORDION INTERACTIONS ---
    // Track FAQ interactions for analytics
    document.querySelectorAll('.accordion-button').forEach(button => {
        button.addEventListener('click', function() {
            const faqQuestion = this.textContent.trim();
            if (typeof gtag !== 'undefined' && localStorage.getItem('cookiesAccepted') === 'true') {
                gtag('event', 'faq_click', {
                    'event_category': 'engagement',
                    'event_label': faqQuestion
                });
            }
        });
    });

    // --- SCROLL EFFECTS ---
    // Check for URL hash and scroll to the corresponding service section
    function scrollToService() {
        const hash = window.location.hash;
        if (hash) {
            const targetElement = document.querySelector(hash);
            if (targetElement) {
                setTimeout(() => {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }, 300);
            }
        }
    }
    
    // Execute on page load
    scrollToService();
    
    // Execute when hash changes
    window.addEventListener('hashchange', scrollToService);

    // --- BACK TO TOP BUTTON ---
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- URL PARAMETER HANDLING ---
    // Check if there's a service parameter in the URL and highlight that service
    function highlightServiceFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const serviceParam = urlParams.get('service');
        
        if (serviceParam) {
            // Convert the parameter to a format that matches our IDs
            const serviceId = serviceParam.toLowerCase().replace(/\s+/g, '-');
            const serviceElement = document.getElementById(serviceId);
            
            if (serviceElement) {
                // Add a highlight class to the service card
                const serviceCard = serviceElement.querySelector('.service-card');
                if (serviceCard) {
                    serviceCard.classList.add('highlight-service');
                    
                    // Scroll to the service
                    setTimeout(() => {
                        serviceElement.scrollIntoView({ 
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }, 500);
                }
            }
        }
    }
    
    // Execute on page load
    highlightServiceFromURL();
});

// --- GLOBAL FUNCTIONS ---
// Cookie consent functions
function acceptCookies() {
    localStorage.setItem('cookiesAccepted', 'true');
    document.getElementById('cookieConsent').classList.remove('show');
    if (typeof gtag !== 'undefined') {
        gtag('config', 'G-9NKNYWDH33');
    }
}

function declineCookies() {
    localStorage.setItem('cookiesAccepted', 'false');
    document.getElementById('cookieConsent').classList.remove('show');
    window['ga-disable-G-9NKNYWDH33'] = true;
}
