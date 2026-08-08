/**
 * Contact page specific JavaScript
 */

// ============================================================
// CONFIG - update this after deploying the Cloudflare Worker
// (see WORKER_DEPLOYMENT.md for the full setup steps)
// ============================================================
const CONTACT_WORKER_URL = 'https://peter-contact-worker.peter-contact.workers.dev';

document.addEventListener('DOMContentLoaded', function() {
    // --- CONSTANTS ---
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');
    const formMessage = document.getElementById('formMessage');
    const backToTopBtn = document.getElementById('backToTop');
    const serviceSelect = document.getElementById('projectType');
    const projectType = document.getElementById('projectType');
    const logoStatus = document.getElementById('logoStatus');

    // --- INITIALIZATIONS ---
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // --- URL PARAMETER HANDLING ---
    // Check if there's a service parameter in the URL and select that service
    function setServiceFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const serviceParam = urlParams.get('service');
        
        if (serviceParam && serviceSelect) {
            const options = Array.from(serviceSelect.options);
            const matchingOption = options.find(option => 
                option.text.toLowerCase() === serviceParam.toLowerCase() ||
                option.value.toLowerCase() === serviceParam.toLowerCase()
            );
            
            if (matchingOption) {
                serviceSelect.value = matchingOption.value;
            } else {
                const partialMatch = options.find(option => 
                    option.text.toLowerCase().includes(serviceParam.toLowerCase()) ||
                    option.value.toLowerCase().includes(serviceParam.toLowerCase())
                );
                
                if (partialMatch) {
                    serviceSelect.value = partialMatch.value;
                }
            }
        }
    }
    
    setServiceFromURL();

    // --- SHOW/HIDE LOGO UPLOAD BASED ON SELECTION ---
    if (logoStatus) {
        logoStatus.addEventListener('change', function() {
            const logoUploadSection = document.querySelector('#logoUpload').closest('.mb-3');
            if (this.value === 'I have a logo') {
                logoUploadSection.style.display = 'block';
                document.getElementById('logoUpload').required = true;
            } else {
                logoUploadSection.style.display = 'none';
                document.getElementById('logoUpload').required = false;
            }
        });
    }

    // --- FILE SIZE VALIDATION (per-file and combined total) ---
    const MAX_FILE_SIZE = 5 * 1024 * 1024;   // 5MB per file
    const MAX_TOTAL_SIZE = 10 * 1024 * 1024; // 10MB combined, matches the Worker's limit
    const fileInputs = document.querySelectorAll('input[type="file"]');

    function getTotalUploadSize() {
        let total = 0;
        fileInputs.forEach(input => {
            Array.from(input.files || []).forEach(file => { total += file.size; });
        });
        return total;
    }

    fileInputs.forEach(input => {
        input.addEventListener('change', function() {
            const files = Array.from(this.files);

            files.forEach(file => {
                if (file.size > MAX_FILE_SIZE) {
                    alert(`File "${file.name}" is too large. Maximum size is 5MB per file.`);
                    this.value = '';
                }
            });

            if (getTotalUploadSize() > MAX_TOTAL_SIZE) {
                alert('Total attachments exceed 10MB. Please remove a file or use a smaller one.');
                this.value = '';
            }
        });
    });

    // --- CONTACT FORM SUBMISSION (single handler - sends to the Cloudflare Worker) ---
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            if (getTotalUploadSize() > MAX_TOTAL_SIZE) {
                showMessage('error', 'Total attachments exceed 10MB. Please remove a file or use a smaller one.');
                return;
            }

            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Sending...';
            submitBtn.disabled = true;

            try {
                const formData = new FormData(contactForm);
                formData.append('submission_time', new Date().toISOString());

                const response = await fetch(CONTACT_WORKER_URL, {
                    method: 'POST',
                    body: formData
                });

                const result = await response.json().catch(() => ({}));

                if (response.ok && result.success !== false) {
                    showMessage('success',
                        '<div class="d-flex align-items-center">' +
                        '<i class="bi bi-check-circle-fill text-success fs-4 me-3"></i>' +
                        '<div><h5 class="mb-1">Message Sent Successfully!</h5>' +
                        '<p class="mb-0">Thank you for reaching out. I\'ll get back to you as soon as possible.</p></div>' +
                        '</div>'
                    );
                    contactForm.reset();

                    if (typeof gtag !== 'undefined' && localStorage.getItem('cookiesAccepted') === 'true') {
                        gtag('event', 'form_submission', {
                            'event_category': 'contact',
                            'event_label': serviceSelect ? serviceSelect.value : ''
                        });
                    }
                } else {
                    throw new Error(result.error || 'Network response was not ok');
                }
            } catch (error) {
                // A CORS or network-level failure (the browser throws a
                // generic TypeError for these) can happen even after the
                // server already received and processed the request — the
                // failure is in the browser reading the response, not in
                // whether the message arrived. Word this case differently
                // so a genuinely-sent message doesn't look like total failure.
                const likelySentAnyway = error instanceof TypeError;
                showMessage('error',
                    '<div class="d-flex align-items-center">' +
                    '<i class="bi bi-exclamation-triangle-fill text-danger fs-4 me-3"></i>' +
                    '<div><h5 class="mb-1">' + (likelySentAnyway ? 'Hmm, that\'s unusual.' : 'Oops! Something went wrong.') + '</h5>' +
                    '<p class="mb-0">' + (likelySentAnyway
                        ? 'Your message may have actually gone through — this looks like a connection hiccup on the confirmation, not a failed send. If you don\'t hear back within a day or two, please follow up directly at '
                        : 'Please try again, or reach me directly at ') +
                    'petereluwade55@gmail.com or WhatsApp +234 810 882 1809.</p></div>' +
                    '</div>'
                );
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }

    function showMessage(type, html) {
        formMessage.className = `alert alert-${type === 'success' ? 'success' : 'danger'}`;
        formMessage.innerHTML = html;
        formMessage.style.display = 'block';
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

        if (type === 'success') {
            setTimeout(() => { formMessage.style.display = 'none'; }, 10000);
        }
    }

    // --- SOCIAL MEDIA TRACKING ---
    document.querySelectorAll('.social-grid-item').forEach(link => {
        link.addEventListener('click', function() {
            const platform = this.querySelector('span').textContent;
            if (typeof gtag !== 'undefined' && localStorage.getItem('cookiesAccepted') === 'true') {
                gtag('event', 'social_click', {
                    'event_category': 'engagement',
                    'event_label': platform
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

    // --- FORM FIELD VALIDATION ---
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
