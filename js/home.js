/**
 * Home page specific JavaScript
 */
document.addEventListener('DOMContentLoaded', function() {
    // Get back to top button
    const backToTopBtn = document.getElementById('backToTop');
    
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
    
    // Service preview cards hover effect
    const serviceCards = document.querySelectorAll('.service-preview-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.service-icon i');
            if (icon) {
                icon.classList.add('animated', 'bounce');
                setTimeout(() => {
                    icon.classList.remove('animated', 'bounce');
                }, 1000);
            }
        });
    });
    
    // Project cards hover effect
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const img = this.querySelector('.card-img-top');
            if (img) {
                img.style.transform = 'scale(1.05)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const img = this.querySelector('.card-img-top');
            if (img) {
                img.style.transform = 'scale(1)';
            }
        });
    });
    
    // Testimonial carousel auto-play with pause on hover
    const testimonialCarousel = document.getElementById('testimonialCarousel');
    if (testimonialCarousel) {
        const carousel = new bootstrap.Carousel(testimonialCarousel, {
            interval: 6000,
            pause: 'hover'
        });
        
        testimonialCarousel.addEventListener('mouseenter', function() {
            carousel.pause();
        });
        
        testimonialCarousel.addEventListener('mouseleave', function() {
            carousel.cycle();
        });
    }
    
    // Animate stats when they come into view
    const stats = document.querySelectorAll('.stat-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated', 'pulse');
                setTimeout(() => {
                    entry.target.classList.remove('animated', 'pulse');
                }, 1000);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => {
        observer.observe(stat);
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
});
