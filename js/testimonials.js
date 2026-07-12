/**
 * Testimonials page specific JavaScript
 */
document.addEventListener('DOMContentLoaded', function() {
    // --- CONSTANTS ---
    const testimonialForm = document.getElementById('leaveTestimonialForm');
    const submitTestimonialBtn = document.getElementById('submitTestimonialBtn');
    const testimonialFormMessage = document.getElementById('testimonialFormMessage');
    const backToTopBtn = document.getElementById('backToTop');
    const ratingInputs = document.querySelectorAll('.rating-input input');

    // --- INITIALIZATIONS ---
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // --- TESTIMONIAL FORM SUBMISSION ---
    if (testimonialForm) {
        testimonialForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Update button state
            const originalText = submitTestimonialBtn.innerHTML;
            submitTestimonialBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Submitting...';
            submitTestimonialBtn.disabled = true;
            
            try {
                const response = await fetch(testimonialForm.action, {
                    method: 'POST',
                    body: new FormData(testimonialForm),
                    headers: { 'Accept': 'application/json' }
                });
                
                if (response.ok) {
                    // Success message
                    testimonialFormMessage.className = 'alert alert-success';
                    testimonialFormMessage.innerHTML = `
                        <div class="d-flex align-items-center">
                            <i class="bi bi-check-circle-fill text-success fs-4 me-3"></i>
                            <div>
                                <h5 class="mb-1">Thank You for Your Testimonial!</h5>
                                <p class="mb-0">Your feedback has been submitted successfully and will be reviewed shortly.</p>
                            </div>
                        </div>
                    `;
                    testimonialForm.reset();
                    
                    // Reset rating stars
                    ratingInputs.forEach(input => {
                        input.checked = false;
                    });
                    
                    // Track form submission
                    if (typeof gtag !== 'undefined' && localStorage.getItem('cookiesAccepted') === 'true') {
                        gtag('event', 'testimonial_submission', {
                            'event_category': 'engagement',
                            'event_label': document.getElementById('service').value
                        });
                    }
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                // Error message
                testimonialFormMessage.className = 'alert alert-danger';
                testimonialFormMessage.innerHTML = `
                    <div class="d-flex align-items-center">
                        <i class="bi bi-exclamation-triangle-fill text-danger fs-4 me-3"></i>
                        <div>
                            <h5 class="mb-1">Oops! Something went wrong.</h5>
                            <p class="mb-0">Please try again or contact me directly at petereluwade55@gmail.com</p>
                        </div>
                    </div>
                `;
            } finally {
                // Reset button state and show message
                submitTestimonialBtn.innerHTML = originalText;
                submitTestimonialBtn.disabled = false;
                testimonialFormMessage.style.display = 'block';
                
                // Scroll to the message
                testimonialFormMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Hide message after 10 seconds if it's a success message
                if (testimonialFormMessage.classList.contains('alert-success')) {
                    setTimeout(() => {
                        testimonialFormMessage.style.display = 'none';
                    }, 10000);
                }
            }
        });
    }

    // --- RATING STARS INTERACTION ---
    // Add visual feedback when hovering over rating stars
    if (ratingInputs.length > 0) {
        const ratingLabels = document.querySelectorAll('.rating-input label');
        
        ratingLabels.forEach(label => {
            label.addEventListener('mouseover', function() {
                // Reset all stars
                ratingLabels.forEach(l => l.classList.remove('hovered'));
                
                // Add hovered class to current and previous stars
                let currentLabel = this;
                while (currentLabel) {
                    currentLabel.classList.add('hovered');
                    currentLabel = currentLabel.previousElementSibling;
                    if (currentLabel && currentLabel.tagName !== 'LABEL') {
                        currentLabel = currentLabel.previousElementSibling;
                    }
                }
            });
        });
        
        document.querySelector('.rating-input').addEventListener('mouseleave', function() {
            ratingLabels.forEach(label => label.classList.remove('hovered'));
        });
    }

    // --- TESTIMONIAL CARD ANIMATIONS ---
    // Add hover effect to testimonial cards
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.1)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
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

    // --- STATS COUNTER ANIMATION ---
    // Animate the stats numbers when they come into view
    const statNumbers = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target;
                const finalValue = parseInt(statNumber.textContent);
                let startValue = 0;
                
                // Handle special case for decimal values (like ratings)
                if (statNumber.textContent.includes('.')) {
                    animateDecimalValue(statNumber, 0, parseFloat(statNumber.textContent), 1500);
                } else {
                    const duration = 2000;
                    const increment = Math.ceil(finalValue / (duration / 16));
                    
                    const timer = setInterval(() => {
                        startValue += increment;
                        if (startValue > finalValue) {
                            statNumber.textContent = finalValue;
                            clearInterval(timer);
                        } else {
                            statNumber.textContent = startValue;
                        }
                    }, 16);
                }
                
                observer.unobserve(statNumber);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(number => {
        observer.observe(number);
    });

    // Helper function to animate decimal values
    function animateDecimalValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentValue = start + progress * (end - start);
            element.textContent = currentValue.toFixed(1);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // --- FORM FIELD VALIDATION ---
    // Add custom validation styles
    const formInputs = document.querySelectorAll('.form-control, .form-select');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.checkValidity()) {
                this.classList.add('is-valid');
                this.classList.remove('is-invalid');
            } else if (this.value !== '') {
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
            }
        });
    });

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

