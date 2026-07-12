/**
 * CV page specific JavaScript
 */
document.addEventListener('DOMContentLoaded', function() {
    // --- CONSTANTS ---
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');
    const backToTopBtn = document.getElementById('backToTop');
    const downloadLinks = document.querySelectorAll('a[download]');
    const downloadTrackingModal = document.getElementById('downloadTrackingModal');
    const downloadTrackingForm = document.getElementById('downloadTrackingForm');
    const submitTrackingBtn = document.getElementById('submitTrackingBtn');
    const downloadTypeInput = document.getElementById('downloadType');

    // --- INITIALIZATIONS ---
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // --- CONTACT FORM SUBMISSION ---
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Update button state
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Sending...';
            submitBtn.disabled = true;
            
            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: { 'Accept': 'application/json' }
                });
                
                if (response.ok) {
                    // Success message
                    formMessage.className = 'alert alert-success';
                    formMessage.innerHTML = `
                        <div class="d-flex align-items-center">
                            <i class="bi bi-check-circle-fill text-success fs-4 me-3"></i>
                            <div>
                                <h5 class="mb-1">Message Sent Successfully!</h5>
                                <p class="mb-0">Thank you for reaching out. I'll get back to you as soon as possible.</p>
                            </div>
                        </div>
                    `;
                    contactForm.reset();
                    
                    // Track form submission
                    if (typeof gtag !== 'undefined' && localStorage.getItem('cookiesAccepted') === 'true') {
                        gtag('event', 'cv_inquiry_submission', {
                            'event_category': 'engagement',
                            'event_label': document.getElementById('subject').value
                        });
                    }
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                // Error message
                formMessage.className = 'alert alert-danger';
                formMessage.innerHTML = `
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
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                formMessage.style.display = 'block';
                
                // Scroll to the message
                formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // Hide message after 10 seconds if it's a success message
                if (formMessage.classList.contains('alert-success')) {
                    setTimeout(() => {
                        formMessage.style.display = 'none';
                    }, 10000);
                }
            }
        });
    }

    // --- DOWNLOAD TRACKING ---
    // Handle download links
    if (downloadLinks.length > 0 && downloadTrackingModal) {
        let currentDownloadLink = null;
        const downloadModal = new bootstrap.Modal(downloadTrackingModal);
        
        downloadLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                // Only show modal if cookies are accepted (for privacy)
                if (localStorage.getItem('cookiesAccepted') === 'true') {
                    e.preventDefault();
                    currentDownloadLink = this.href;
                    
                    // Set download type in the form
                    const fileName = currentDownloadLink.split('/').pop();
                    downloadTypeInput.value = fileName;
                    
                    // Show the modal
                    downloadModal.show();
                } else {
                    // If cookies not accepted, just track the event without personal data
                    if (typeof gtag !== 'undefined') {
                        gtag('event', 'cv_download', {
                            'event_category': 'download',
                            'event_label': this.href.split('/').pop()
                        });
                    }
                }
            });
        });
        
        // Handle tracking form submission
        if (submitTrackingBtn && downloadTrackingForm) {
            submitTrackingBtn.addEventListener('click', async function() {
                // Submit the form if there's data
                const name = document.getElementById('trackingName').value;
                const email = document.getElementById('trackingEmail').value;
                const company = document.getElementById('trackingCompany').value;
                
                if (name || email || company) {
                    try {
                        await fetch(downloadTrackingForm.action, {
                            method: 'POST',
                            body: new FormData(downloadTrackingForm),
                            headers: { 'Accept': 'application/json' }
                        });
                    } catch (error) {
                        console.error('Error submitting tracking form:', error);
                    }
                }
                
                // Track the download event
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'cv_download', {
                        'event_category': 'download',
                        'event_label': downloadTypeInput.value,
                        'value': name ? 1 : 0
                    });
                }
                
                // Close the modal and trigger the download
                downloadModal.hide();
                if (currentDownloadLink) {
                    window.location.href = currentDownloadLink;
                }
            });
        }
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
