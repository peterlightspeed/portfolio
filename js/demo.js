const projects = [
    {
        id: 'portfolio',
        title: 'Personal Portfolio Website',
        description: 'A responsive portfolio website showcasing my skills, projects, and services as a virtual assistant.',
        tech: 'bootstrap,html, css, javascript, usebasin, formspree',
        url: 'https://peterlightspeed.github.io/portfolio/index.html',
        status: 'live',
        image: 'https://i.imgur.com/YhCPbz5.png'
    },
    {
        id: 'form',
        title: 'Formspree Contact Form',
        description: 'A professional contact form built with HTML, CSS, and Bootstrap, integrated with Formspree',
        tech: 'formspree, HTML, CSS, javascript',
        url: 'https://peterlightspeed.github.io/formspree/', 
        status: 'demo',
        image: 'https://i.imgur.com/YpEEkNu.png'
    },
    {
        id: 'web3',
        title: 'Dynamic Hero Page',
        description: 'An engaging hero page with interactive animations and a strong call-to-action',
        tech: 'JavaScript, HTML, CSS',
        url: 'https://peterlightspeed.github.io/website3/',
        status: 'live',
        image: 'https://i.imgur.com/bXmX09r.png'
    },
    {
        id: 'blog',
        title: 'PLS WorldNews',
        description: 'SEO-Optimized Blog',
        tech: 'Blogger, Html',
        url: 'https://plsworldnews.com',
        status: 'live',
        image: 'https://i.imgur.com/ynpID4a.png'
    },
    {
        id: 'restaurant',
        title: 'Reustart Restaurant Web',
        description: 'A sleek and modern website for a restaurant, featuring online menus, reservation forms, and a gallery.',
        tech: 'HTML, CSS, JavaScript, Bootstrap',
        url: '',
        status: 'coming-soon',
        image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&h=300&fit=crop&crop=center'
    },
    {
        id: 'hospital',
        title: 'Lightspeed hospital template',
        description: 'Modern hospital template',
        tech: 'HTML5, CSS3, JavaScript',
        url: 'https://peterlightspeed.github.io/lightspeed-hospital-template/', 
        status: 'demo',
        image: 'https://peterlightspeed.github.io/portfolio/images/projects/lightspeed-hospital.png'
    },
    {
        id: 'basketball',
        title: 'Freedom Reign Basketball academy',
        description: 'Responsive Basketball academy website',
        tech: 'HTML, CSS, Bootstrap',
        url: 'https://peterlightspeed.github.io/freedomreign/', 
        status: 'live',
        image: 'https://i.imgur.com/sEc0qgE.png'
    }
];

let currentProject = null;

// Initialize demo page
document.addEventListener('DOMContentLoaded', function() {
    loadProjects();
    setupEventListeners();
    
    // Check if there's a project parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('project');
    if (projectId) {
        const project = projects.find(p => p.id === projectId);
        if (project) {
            selectProject(project);
        }
    }
});

// Load projects into the selector
function loadProjects() {
    const projectsList = document.getElementById('projectsList');
    
    projects.forEach(project => {
        const projectCard = createProjectCard(project);
        projectsList.appendChild(projectCard);
    });
}

// Create project card element
function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.onclick = () => selectProject(project);
    
    const statusClass = project.status === 'live' ? 'live' : 
                       project.status === 'demo' ? 'demo' : 'coming-soon';
    
    const statusText = project.status === 'live' ? 'LIVE' : 
                      project.status === 'demo' ? 'DEMO' : 'SOON';
    
    card.innerHTML = `
        <div class="project-status ${statusClass}">${statusText}</div>
        <div class="project-title">${project.title}</div>
        <div class="project-description">${project.description}</div>
        <div class="project-tech">
            <i class="bi bi-code-slash me-1"></i>${project.tech}
        </div>
    `;
    
    card.dataset.projectId = project.id;
    
    return card;
}

// Select and load project
function selectProject(project) {
    if (project.status === 'coming-soon') {
        showComingSoon(project);
        return;
    }
    
    currentProject = project;
    
    // Update active state
    document.querySelectorAll('.project-card').forEach(card => {
        card.classList.remove('active');
    });
    
    const activeCard = document.querySelector(`[data-project-id="${project.id}"]`);
    if (activeCard) {
        activeCard.classList.add('active');
    }
    
    // Update URL
    document.getElementById('currentUrl').value = project.url;
    
    // Show loading
    showLoading();
    
    // Hide no project message
    document.getElementById('noProject').style.display = 'none';
    
    // Load project in iframe
    const iframe = document.getElementById('demoFrame');
    iframe.src = project.url;
    
    // Update page title
    document.title = `${project.title} Demo - Peter Eluwade`;
    
    // Update URL without reload
    const newUrl = new URL(window.location);
    newUrl.searchParams.set('project', project.id);
    window.history.pushState({}, '', newUrl);
    
    // Track demo view
    if (typeof gtag !== 'undefined') {
        gtag('event', 'demo_view', {
            'event_category': 'engagement',
            'event_label': project.title
        });
    }
}

// Show loading overlay
function showLoading() {
    document.getElementById('loadingOverlay').style.display = 'flex';
}

// Hide loading overlay
function hideLoading() {
    document.getElementById('loadingOverlay').style.display = 'none';
}

// Setup event listeners
function setupEventListeners() {
    const iframe = document.getElementById('demoFrame');
    
    // Hide loading when iframe loads
    iframe.addEventListener('load', function() {
        hideLoading();
    });
    
    // Handle iframe errors
    iframe.addEventListener('error', function() {
        hideLoading();
        showError('Failed to load project demo');
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            exitFullscreen();
        } else if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
            e.preventDefault();
            refreshDemo();
        }
    });
}

// Refresh current demo
function refreshDemo() {
    if (currentProject) {
        showLoading();
        const iframe = document.getElementById('demoFrame');
        iframe.src = iframe.src; // Reload iframe
    }
}

// Open demo in new tab
function openInNewTab() {
    if (currentProject) {
        window.open(currentProject.url, '_blank');
        
        // Track external view
        if (typeof gtag !== 'undefined') {
            gtag('event', 'external_demo_view', {
                'event_category': 'engagement',
                'event_label': currentProject.title
            });
        }
    }
}

// Toggle fullscreen mode
function toggleFullscreen() {
    const demoViewer = document.querySelector('.demo-viewer');
    
    if (!document.fullscreenElement) {
        demoViewer.requestFullscreen().catch(err => {
            console.log('Error attempting to enable fullscreen:', err);
        });
    } else {
        document.exitFullscreen();
    }
}

// Exit fullscreen
function exitFullscreen() {
    if (document.fullscreenElement) {
        document.exitFullscreen();
    }
}

// Show coming soon message
function showComingSoon(project) {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">
                        <i class="bi bi-clock-history me-2"></i>Coming Soon
                    </h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body text-center">
                    <div class="mb-3">
                        <i class="bi bi-tools" style="font-size: 48px; color: #ffc107;"></i>
                    </div>
                    <h4>${project.title}</h4>
                    <p class="text-muted">${project.description}</p>
                    <p><strong>Tech Stack:</strong> ${project.tech}</p>
                    <div class="alert alert-info">
                        <i class="bi bi-info-circle me-2"></i>
                        This project is currently under development. Check back soon!
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <a href="contact.html" class="btn btn-primary">
                        <i class="bi bi-envelope me-2"></i>Get Notified
                    </a>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
    
    // Remove modal from DOM when hidden
    modal.addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(modal);
    });
}

// Show error message
function showError(message) {
    const iframe = document.getElementById('demoFrame');
    iframe.src = 'data:text/html,<html><body style="font-family:Arial;padding:50px;text-align:center;color:#666;"><h2>Demo Unavailable</h2><p>' + message + '</p><p>Please try again later or <a href="contact.html">contact me</a> if the issue persists.</p></body></html>';
}

// Utility function to get project by ID
function getProjectById(id) {
    return projects.find(project => project.id === id);
}

// Export functions for global access
window.demoFunctions = {
    selectProject,
    refreshDemo,
    openInNewTab,
    toggleFullscreen,
    getProjectById
};
