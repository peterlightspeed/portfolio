/**
 * Projects page specific JavaScript
 */
document.addEventListener('DOMContentLoaded', function() {
    // --- CONSTANTS ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');
    const noResults = document.getElementById('noResults');
    const projectSearch = document.getElementById('projectSearch');
    const clearSearch = document.getElementById('clearSearch');
    const searchFeedback = document.getElementById('searchFeedback');
    const backToTopBtn = document.getElementById('backToTop');

    // --- INITIALIZATIONS ---
    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // --- HELPER FUNCTIONS ---
    // Helper function to escape special characters in regex for search highlighting
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // Function to remove search highlights from a project item
    function removeHighlights(item) {
        const highlightedElements = item.querySelectorAll('.search-highlight');
        highlightedElements.forEach(el => {
            const parent = el.parentNode;
            if (parent) {
                parent.textContent = parent.textContent;
            }
        });
        
        const techBadges = item.querySelectorAll('.tech-badge');
        techBadges.forEach(badge => {
            badge.classList.remove('bg-warning', 'text-dark');
        });
    }

    // Function to highlight matching text within a project item
    function highlightMatches(item, searchTerm) {
        removeHighlights(item);
        
        const elementsToHighlight = [
            item.querySelector('.card-title'),
            item.querySelector('.card-description')
        ];
        
        elementsToHighlight.forEach(element => {
            if (!element) return;
            const text = element.textContent;
            const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
            if (text.toLowerCase().includes(searchTerm)) {
                element.innerHTML = text.replace(regex, '<span class="search-highlight">$1</span>');
            }
        });
        
        const techBadges = item.querySelectorAll('.tech-badge');
        techBadges.forEach(badge => {
            if (badge.textContent.toLowerCase().includes(searchTerm)) {
                badge.classList.add('bg-warning', 'text-dark');
            }
        });
    }

    // --- CORE FUNCTIONALITY ---
    // Search functionality
    if (projectSearch) {
        projectSearch.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            let matchCount = 0;
            
            // Reset filter buttons to "All"
            filterBtns.forEach(btn => btn.classList.remove('active'));
            document.querySelector('.filter-btn[data-filter="all"]').classList.add('active');
            
            projectItems.forEach(item => {
                const title = item.querySelector('.card-title').textContent.toLowerCase();
                const description = item.querySelector('.card-description').textContent.toLowerCase();
                const techBadges = Array.from(item.querySelectorAll('.tech-badge')).map(badge => badge.textContent.toLowerCase());
                const projectType = item.querySelector('.project-badge').textContent.toLowerCase();
                const searchableText = `${title} ${description} ${techBadges.join(' ')} ${projectType}`;
                
                if (searchTerm === '' || searchableText.includes(searchTerm)) {
                    item.classList.remove('hide');
                    item.style.display = '';
                    matchCount++;
                    if (searchTerm !== '') {
                        highlightMatches(item, searchTerm);
                        item.classList.add('search-pulse');
                        setTimeout(() => item.classList.remove('search-pulse'), 500);
                    } else {
                        removeHighlights(item);
                    }
                } else {
                    item.classList.add('hide');
                    setTimeout(() => { item.style.display = 'none'; }, 500);
                    removeHighlights(item);
                }
            });
            
            // Update feedback messages
            if (searchTerm === '') {
                searchFeedback.textContent = '';
                noResults.classList.add('d-none');
                noResults.classList.remove('show');
            } else if (matchCount === 0) {
                searchFeedback.textContent = 'No projects found matching your search.';
                noResults.classList.remove('d-none');
                setTimeout(() => noResults.classList.add('show'), 100);
            } else {
                searchFeedback.textContent = `Found ${matchCount} project${matchCount !== 1 ? 's' : ''}.`;
                noResults.classList.add('d-none');
                noResults.classList.remove('show');
            }
        });

        // Clear search button
        clearSearch.addEventListener('click', function() {
            projectSearch.value = '';
            const event = new Event('input', { bubbles: true, cancelable: true });
            projectSearch.dispatchEvent(event);
            projectSearch.focus();
        });
    }

    // Project filtering functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            let visibleCount = 0;
            
            // Clear search when a filter is clicked
            if (projectSearch && projectSearch.value) {
                projectSearch.value = '';
                searchFeedback.textContent = '';
            }
            
            projectItems.forEach(item => {
                removeHighlights(item);
                const categories = item.getAttribute('data-category').split(' ');
                
                if (filterValue === 'all' || categories.includes(filterValue)) {
                    item.classList.remove('hide');
                    item.style.display = '';
                    visibleCount++;
                } else {
                    item.classList.add('hide');
                    setTimeout(() => { item.style.display = 'none'; }, 500);
                }
            });
            
            if (visibleCount === 0) {
                if (noResults) {
                    noResults.classList.remove('d-none');
                    setTimeout(() => noResults.classList.add('show'), 100);
                }
            } else if (noResults) {
                noResults.classList.add('d-none');
                noResults.classList.remove('show');
            }
        });
    });

    // --- UI & UX ENHANCEMENTS ---
    // Project card hover effects
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            const img = this.querySelector('.card-img-top');
            if (img) img.style.transform = 'scale(1.05)';
        });
        card.addEventListener('mouseleave', function() {
            const img = this.querySelector('.card-img-top');
            if (img) img.style.transform = 'scale(1)';
        });
    });

    // Process cards animation
    document.querySelectorAll('.process-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.process-icon i');
            if (icon) {
                icon.style.transform = 'scale(1.2)';
                setTimeout(() => { icon.style.transform = 'scale(1)'; }, 300);
            }
        });
    });

    // Back to top button functionality
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

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.getAttribute('data-bs-toggle') === 'modal' || this.getAttribute('href') === '#') return;
            e.preventDefault();
            const targetElement = document.querySelector(this.getAttribute('href'));
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Adjust for fixed header
                    behavior: 'smooth'
                });
                history.pushState(null, null, this.getAttribute('href'));
            }
        });
    });

    // --- FORM & ANALYTICS ---
    // Newsletter form handling

    // Analytics tracking for project views
    document.querySelectorAll('.project-card a, .modal-body a').forEach(link => {
        link.addEventListener('click', function() {
            const projectTitle = this.closest('.card, .modal-content').querySelector('.card-title, .modal-title').textContent;
            if (typeof gtag !== 'undefined' && localStorage.getItem('cookiesAccepted') === 'true') {
                gtag('event', 'project_view', { 'event_category': 'portfolio', 'event_label': projectTitle });
            }
        });
    });

    // Analytics tracking for modal views
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('shown.bs.modal', function() {
            const modalTitle = this.querySelector('.modal-title').textContent;
            if (typeof gtag !== 'undefined' && localStorage.getItem('cookiesAccepted') === 'true') {
                gtag('event', 'project_details_view', { 'event_category': 'portfolio', 'event_label': modalTitle });
            }
        });
    });

    // --- COOKIE CONSENT ---
    function checkCookieConsent() {
        if (localStorage.getItem('cookiesAccepted') === null) {
            setTimeout(() => {
                const cookieConsent = document.getElementById('cookieConsent');
                if (cookieConsent) cookieConsent.classList.add('show');
            }, 1000);
        }
    }
    checkCookieConsent();
});

// Global functions for cookie consent banner
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
