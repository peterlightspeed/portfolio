// Active nav-item highlighting now happens at build time (see
// templates/partials/nav.hbs + the {{activeIf}} helper) — no client-side
// duplication needed here anymore.

// Back to top button (single shared implementation — used to be copy-pasted
// into about.js, certifications.js, projects.js, etc.)
document.addEventListener('DOMContentLoaded', function() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });
    backToTopBtn.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// Social Media Sidebar Functionality
document.addEventListener('DOMContentLoaded', function() {
    const socialToggle = document.getElementById('socialToggle');
    const socialSidebar = document.querySelector('.social-sidebar');
    const closeSidebar = document.getElementById('closeSidebar');
    
    if (socialToggle && socialSidebar) {
        // Make the toggle keyboard-accessible (it's a <div>, not a native <button>)
        socialToggle.setAttribute('role', 'button');
        socialToggle.setAttribute('tabindex', '0');
        socialToggle.setAttribute('aria-label', 'Open social media links');
        socialToggle.setAttribute('aria-expanded', 'false');

        function openSidebar() {
            socialSidebar.classList.add('active');
            socialSidebar.classList.add('interacted');
            socialToggle.setAttribute('aria-expanded', 'true');
        }

        // Open sidebar
        socialToggle.addEventListener('click', openSidebar);
        socialToggle.addEventListener('keydown', function(event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                openSidebar();
            }
        });
        
        // Close sidebar
        if (closeSidebar) {
            closeSidebar.addEventListener('click', function() {
                socialSidebar.classList.remove('active');
                socialToggle.setAttribute('aria-expanded', 'false');
            });
        }
        
        // Close sidebar when clicking outside
        document.addEventListener('click', function(event) {
            if (!socialSidebar.contains(event.target) && socialSidebar.classList.contains('active')) {
                socialSidebar.classList.remove('active');
                socialToggle.setAttribute('aria-expanded', 'false');
            }
        });
        
        // Close sidebar on escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && socialSidebar.classList.contains('active')) {
                socialSidebar.classList.remove('active');
            }
        });
        
        // Track social media clicks (optional analytics)
        const socialLinks = document.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Hook point for real analytics (e.g. gtag/plausible) if added later.
            });
        });
    }
});

// ============================================================
// TAKE A BREAK REMINDER
// ============================================================
// A friendly, one-time-per-session nudge if someone has had the site open
// for a while. Purely a wellness courtesy — dismissible, never nags twice
// in the same session, and never blocks anything on the page.
(function initBreakReminder() {
    const BREAK_AFTER_MS = 20 * 60 * 1000; // 20 minutes
    const SESSION_KEY = 'pl-break-reminder-shown';

    if (sessionStorage.getItem(SESSION_KEY)) return;

    function showBreakToast() {
        if (sessionStorage.getItem(SESSION_KEY)) return;
        sessionStorage.setItem(SESSION_KEY, 'true');

        const toast = document.createElement('div');
        toast.className = 'pl-toast';
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        toast.innerHTML =
            '<div class="pl-toast-icon"><i class="bi bi-cup-hot"></i></div>' +
            '<div class="pl-toast-body">' +
            '<strong>Still here?</strong>' +
            '<p>You have had this open for a while — maybe stretch, grab some water, or rest your eyes for a moment.</p>' +
            '</div>' +
            '<button type="button" class="pl-toast-close" aria-label="Dismiss">&times;</button>';

        document.body.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('pl-toast-show'));

        function dismiss() {
            toast.classList.remove('pl-toast-show');
            setTimeout(() => toast.remove(), 300);
        }

        toast.querySelector('.pl-toast-close').addEventListener('click', dismiss);
        setTimeout(dismiss, 15000);
    }

    setTimeout(showBreakToast, BREAK_AFTER_MS);
})();
