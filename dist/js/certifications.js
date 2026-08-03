/**
 * Certifications page specific JavaScript
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

    // --- CERTIFICATION CARD ANIMATIONS ---
    // Add hover effect to certification cards
    const certificationCards = document.querySelectorAll('.certification-card');
    certificationCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });

    // --- TIMELINE ANIMATIONS ---
    // Add hover effect to timeline items
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        const panel = item.querySelector('.timeline-panel');
        const badge = item.querySelector('.timeline-badge');
        
        item.addEventListener('mouseenter', function() {
            if (panel) {
                panel.style.transform = 'translateY(-5px)';
                panel.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.1)';
            }
            if (badge) {
                badge.style.transform = window.innerWidth > 991 ? 'translateX(-50%) scale(1.2)' : 'scale(1.2)';
            }
        });
        
        item.addEventListener('mouseleave', function() {
            if (panel) {
                panel.style.transform = '';
                panel.style.boxShadow = '';
            }
            if (badge) {
                badge.style.transform = window.innerWidth > 991 ? 'translateX(-50%)' : '';
            }
        });
    });

    // --- CERTIFICATE MODAL TRACKING ---
    // Track certificate views
    document.querySelectorAll('[data-bs-target^="#certModal"]').forEach(button => {
        button.addEventListener('click', function() {
            const certName = this.closest('.certification-card').querySelector('h3').textContent;
            if (typeof gtag !== 'undefined' && localStorage.getItem('cookiesAccepted') === 'true') {
                gtag('event', 'certificate_view', {
                    'event_category': 'engagement',
                    'event_label': certName
                });
            }
        });
    });

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

    // --- SMOOTH SCROLL FOR ANCHOR LINKS ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId !== '#' && document.querySelector(targetId)) {
                e.preventDefault();
                document.querySelector(targetId).scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
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
