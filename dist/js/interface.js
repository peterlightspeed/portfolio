
// =====================================================================
// PROFESSIONAL LOADING SCREEN - Simplified and Reliable
// =====================================================================
class ProfessionalLoader {
    constructor() {
        this.loadingScreen = document.getElementById('loadingScreen');
        this.progressFill = document.querySelector('.progress-fill');
        this.progressPercentage = document.querySelector('.progress-percentage');
        this.loadingText = document.querySelector('.loading-text');
        
        this.progress = 0;
        this.startTime = Date.now();
        this.duration = 1000; // Complete in 1 second
        
        this.messages = [
            'Initializing...',
            'Loading assets...',
            'Preparing interface...',
            'Almost ready...',
            'Welcome!'
        ];
        
        // Check if elements exist
        if (!this.loadingScreen) {
            return;
        }
        
        this.init();
    }
    
    init() {
        // Prevent scrolling during loading
        document.body.style.overflow = 'hidden';
        
        // Start smooth animation
        this.animate();
    }
    
    animate() {
        const elapsed = Date.now() - this.startTime;
        
        // Calculate progress as percentage of duration (0-100)
        this.progress = Math.min((elapsed / this.duration) * 100, 100);
        
        // Update UI
        this.updateProgress();
        
        // Continue animation until complete
        if (this.progress < 100) {
            requestAnimationFrame(() => this.animate());
        } else {
            // Finished - hide loading screen immediately
            setTimeout(() => this.hideLoading(), 200);
        }
    }
    
    updateProgress() {
        const roundedProgress = Math.round(this.progress);
        
        // Update progress bar
        if (this.progressFill) {
            this.progressFill.style.width = roundedProgress + '%';
        }
        
        // Update percentage text
        if (this.progressPercentage) {
            this.progressPercentage.textContent = roundedProgress + '%';
        }
        
        // Update loading message based on progress
        if (this.loadingText) {
            let messageIndex;
            if (roundedProgress < 25) {
                messageIndex = 0; // Initializing...
            } else if (roundedProgress < 50) {
                messageIndex = 1; // Loading assets...
            } else if (roundedProgress < 75) {
                messageIndex = 2; // Preparing interface...
            } else if (roundedProgress < 95) {
                messageIndex = 3; // Almost ready...
            } else {
                messageIndex = 4; // Welcome!
            }
            this.loadingText.textContent = this.messages[messageIndex];
        }
    }
    
    hideLoading() {
        if (this.loadingScreen) {
            this.loadingScreen.classList.add('fade-out');
            
            // Re-enable scrolling
            document.body.style.overflow = 'auto';
            
            // Remove loading screen from DOM after fade-out
            setTimeout(() => {
                if (this.loadingScreen && this.loadingScreen.parentNode) {
                    this.loadingScreen.parentNode.removeChild(this.loadingScreen);
                }
            }, 600);
        }
    }
}

// Initialize loading screen when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ProfessionalLoader();
    });
} else {
    // DOM already loaded
    new ProfessionalLoader();
}

// Preload logo image
const preloadLogo = () => {
    const logoImg = new Image();
    logoImg.src = 'images/logos/peter-logo.png';
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preloadLogo);
} else {
    preloadLogo();
}
