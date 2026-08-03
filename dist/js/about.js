/**
 * About page specific JavaScript
 */
document.addEventListener('DOMContentLoaded', function() {
    // --- CONSTANTS ---
    const backToTopBtn = document.getElementById('backToTop');

    // --- INITIALIZATIONS ---
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // --- SKILL ANIMATIONS ---
    // Animate progress bars when they come into view
    const progressBars = document.querySelectorAll('.progress-bar');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.style.width;
                progressBar.style.width = '0%';
                setTimeout(() => {
                    progressBar.style.transition = 'width 1s ease-in-out';
                    progressBar.style.width = width;
                }, 200);
                observer.unobserve(progressBar);
            }
        });
    }, { threshold: 0.5 });

    progressBars.forEach(bar => {
        observer.observe(bar);
    });

    // --- TIMELINE ANIMATIONS ---
    // Add hover effect to timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.querySelector('.timeline-panel').style.transform = 'translateY(-5px)';
            this.querySelector('.timeline-panel').style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.querySelector('.timeline-panel').style.transform = 'translateY(0)';
            this.querySelector('.timeline-panel').style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.05)';
        });
    });

    // --- TESTIMONIAL CAROUSEL ---
    // Initialize the testimonial carousel with custom settings
    const testimonialCarousel = document.getElementById('testimonialCarousel');
    if (testimonialCarousel) {
        const carousel = new bootstrap.Carousel(testimonialCarousel, {
            interval: 5000,
            wrap: true,
            touch: true
        });
        
        // Track testimonial views for analytics
        testimonialCarousel.addEventListener('slide.bs.carousel', function(event) {
            const testimonialName = event.relatedTarget.querySelector('.testimonial-name').textContent;
            if (typeof gtag !== 'undefined' && localStorage.getItem('cookiesAccepted') === 'true') {
                gtag('event', 'testimonial_view', {
                    'event_category': 'engagement',
                    'event_label': testimonialName
                });
            }
        });
    }

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

    // --- PROFILE IMAGE ANIMATION ---
    // Add subtle animation to profile image
    const profileImage = document.querySelector('.profile-image');
    if (profileImage) {
        profileImage.addEventListener('mouseover', function() {
            this.style.transform = 'scale(1.05) rotate(3deg)';
        });
        
        profileImage.addEventListener('mouseout', function() {
            this.style.transform = 'scale(1)';
        });
    }

    // --- TOOL ITEMS INTERACTION ---
    // Add click tracking for tool items
    const toolItems = document.querySelectorAll('.tool-item');
    toolItems.forEach(tool => {
        tool.addEventListener('click', function() {
            const toolName = this.getAttribute('title') || this.getAttribute('data-bs-original-title');
            if (typeof gtag !== 'undefined' && localStorage.getItem('cookiesAccepted') === 'true') {
                gtag('event', 'tool_click', {
                    'event_category': 'engagement',
                    'event_label': toolName
                });
            }
        });
    });
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
