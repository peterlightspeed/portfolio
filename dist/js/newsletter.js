// Shared newsletter signup handler
// Used across all pages that include the newsletter form (about, certifications,
// contact, cv, projects, services, sponsor, testimonials).
// Consolidated from 8 near-identical copies during the July 2026 code audit.

document.addEventListener('DOMContentLoaded', function () {
    const newsletterForm = document.getElementById('newsletterForm');
    const newsletterBtn = document.getElementById('newsletterBtn');
    const newsletterMessage = document.getElementById('newsletterMessage');

    if (!newsletterForm || !newsletterBtn || !newsletterMessage) {
        return;
    }

    newsletterForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const originalText = newsletterBtn.innerHTML;
        newsletterBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Subscribing...';
        newsletterBtn.disabled = true;

        try {
            const response = await fetch(newsletterForm.action, {
                method: 'POST',
                body: new FormData(newsletterForm),
                headers: { 'Accept': 'application/json' }
            });
            if (response.ok) {
                newsletterMessage.className = 'alert alert-success mt-2';
                newsletterMessage.innerHTML = '<i class="bi bi-check-circle me-2"></i><strong>Success!</strong> Thank you for subscribing!';
                newsletterForm.reset();
            } else {
                throw new Error('Network response was not ok');
            }
        } catch (error) {
            newsletterMessage.className = 'alert alert-danger mt-2';
            newsletterMessage.innerHTML = '<i class="bi bi-exclamation-triangle me-2"></i><strong>Oops!</strong> Something went wrong. Please try again.';
        } finally {
            newsletterMessage.style.display = 'block';
            newsletterBtn.innerHTML = originalText;
            newsletterBtn.disabled = false;
            setTimeout(() => { newsletterMessage.style.display = 'none'; }, 5000);
        }
    });
});
