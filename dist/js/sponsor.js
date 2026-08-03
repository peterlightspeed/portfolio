/**
 * Sponsor page specific JavaScript
 */
document.addEventListener('DOMContentLoaded', function() {
    // --- CONSTANTS ---
    const donationBtns = document.querySelectorAll('.donation-btn');
    const customAmountInput = document.querySelector('.custom-amount-input');
    const customAmountField = document.getElementById('customAmount');
    const subscriptionTiers = document.querySelectorAll('input[name="subscription"]');
    const tierBenefits = document.getElementById('tierBenefits');
    const backToTopBtn = document.getElementById('backToTop');

    // --- INITIALIZATIONS ---
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize clipboard.js for copy functionality
    const clipboard = new ClipboardJS('.copy-btn');
    
    clipboard.on('success', function(e) {
        const copyAlert = document.querySelector('.copy-alert');
        copyAlert.style.display = 'block';
        
        setTimeout(function() {
            copyAlert.style.display = 'none';
        }, 3000);
        
        e.clearSelection();
    });

    // --- DONATION BUTTONS ---
    // Handle donation button clicks
    if (donationBtns.length > 0) {
        donationBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                donationBtns.forEach(b => b.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Show/hide custom amount input
                if (this.dataset.amount === 'custom') {
                    customAmountInput.style.display = 'block';
                    customAmountField.focus();
                } else {
                    customAmountInput.style.display = 'none';
                    
                    // Track donation amount selection
                    if (typeof gtag !== 'undefined' && localStorage.getItem('cookiesAccepted') === 'true') {
                        gtag('event', 'donation_amount_selected', {
                            'event_category': 'engagement',
                            'event_label': 'One-time Donation',
                            'value': parseInt(this.dataset.amount)
                        });
                    }
                }
            });
        });
    }

    // --- SUBSCRIPTION TIERS ---
    // Handle subscription tier changes
    if (subscriptionTiers.length > 0 && tierBenefits) {
        subscriptionTiers.forEach(tier => {
            tier.addEventListener('change', function() {
                updateTierBenefits(this.value);
                
                // Track tier selection
                if (typeof gtag !== 'undefined' && localStorage.getItem('cookiesAccepted') === 'true') {
                    gtag('event', 'subscription_tier_selected', {
                        'event_category': 'engagement',
                        'event_label': 'Monthly Support',
                        'value': parseInt(this.value)
                    });
                }
            });
        });
        
        // Initialize with default tier
        const defaultTier = document.querySelector('input[name="subscription"]:checked');
        if (defaultTier) {
            updateTierBenefits(defaultTier.value);
        }
    }
    
    // Function to update tier benefits based on selected tier
    function updateTierBenefits(tierValue) {
        let benefitsList = '';
        
        // Basic tier benefits (always included)
        benefitsList += '<li><i class="bi bi-check-circle-fill text-success me-2"></i>Name in supporters list</li>';
        benefitsList += '<li><i class="bi bi-check-circle-fill text-success me-2"></i>Monthly newsletter</li>';
        benefitsList += '<li><i class="bi bi-check-circle-fill text-success me-2"></i>Early access to tutorials</li>';
        
        // Additional benefits based on tier
        if (tierValue >= 15) {
            benefitsList += '<li><i class="bi bi-check-circle-fill text-success me-2"></i>Priority support</li>';
            benefitsList += '<li><i class="bi bi-check-circle-fill text-success me-2"></i>Access to exclusive content</li>';
        }
        
        if (tierValue >= 30) {
            benefitsList += '<li><i class="bi bi-check-circle-fill text-success me-2"></i>Monthly 30-min consultation</li>';
            benefitsList += '<li><i class="bi bi-check-circle-fill text-success me-2"></i>Custom project discounts</li>';
        }
        
        tierBenefits.innerHTML = benefitsList;
    }

    // --- PAYMENT BUTTON TRACKING ---
    // Track payment button clicks
    document.querySelectorAll('.payment-methods a').forEach(button => {
        button.addEventListener('click', function() {
            const paymentMethod = this.textContent.trim();
            const cardType = this.closest('.sponsorship-card').querySelector('h3').textContent.trim();
            
            if (typeof gtag !== 'undefined' && localStorage.getItem('cookiesAccepted') === 'true') {
                gtag('event', 'payment_button_click', {
                    'event_category': 'conversion',
                    'event_label': paymentMethod,
                    'value': cardType
                });
            }
        });
    });

    // --- GOAL PROGRESS ANIMATIONS ---
    // Animate progress bars when they come into view
    const progressBars = document.querySelectorAll('.goal-progress .progress-bar');
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
