/**
 * Front-End Development Roadmap
 * Professional Single-Page Application
 * ES6+ JavaScript
 */
const git = document.getElementById("git");
git.onclick = function (e) {
    e.preventDefault();
    window.open(
        "https://github.com/ismail6ashraf/",
        "blank",
        "width=800,height=500,left=200,top=100");
}
const linked = document.getElementById("linked");
linked.addEventListener("click", function (e) {
    e.preventDefault();
    window.open(
        "https://www.linkedin.com/in/ismail-khraish-483465384/",
        "blank",
        "width=800,height=500,left=200,top=100");
});
// Global variables
let roadmapData = null;

// ========================================
// Tab Navigation System
// ========================================
class TabNavigation {
    constructor() {
        this.tabButtons = document.querySelectorAll('.tab-btn');
        this.tabContents = document.querySelectorAll('.tab-content');
        this.init();
    }

    init() {
        this.tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                this.switchTab(targetTab);
            });
        });

        // Handle browser back/forward buttons
        window.addEventListener('popstate', () => {
            const hash = window.location.hash.slice(1) || 'home';
            this.switchTab(hash, false);
        });

        // Initialize from URL hash
        const initialTab = window.location.hash.slice(1) || 'home';
        this.switchTab(initialTab, false);
    }

    switchTab(tabId, updateHistory = true) {
        // Update URL
        if (updateHistory) {
            window.location.hash = tabId;
        }

        // Update tab buttons
        this.tabButtons.forEach(button => {
            const isActive = button.getAttribute('data-tab') === tabId;
            button.classList.toggle('active', isActive);
        });

        // Update tab content
        this.tabContents.forEach(content => {
            const isActive = content.id === tabId;
            content.classList.toggle('active', isActive);
        });

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// ========================================
// Roadmap Data Loader
// ========================================
class RoadmapLoader {
    constructor() {
        this.container = document.getElementById('roadmap-container');
    }

    async load() {
        try {
            const response = await fetch('roadmap.json');
            if (!response.ok) throw new Error('Failed to fetch roadmap data');

            roadmapData = await response.json();
            this.render(roadmapData.specializations);
            Modal.init();
        } catch (error) {
            console.error('Error loading roadmap:', error);
            this.container.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>Failed to load roadmap data. Please refresh the page.</p>
                </div>
            `;
        }
    }

    render(specializations) {
        this.container.innerHTML = '';

        specializations.forEach((spec, index) => {
            const card = this.createSpecializationCard(spec, index);
            this.container.appendChild(card);
        });
    }

    createSpecializationCard(specialization, index) {
        const card = document.createElement('div');
        card.className = 'specialization-card';
        card.style.animationDelay = `${index * 0.1}s`;

        // Get icon based on specialization name
        const icon = this.getIcon(specialization.name);

        card.innerHTML = `
            <div class="specialization-header">
                <h2><i class="${icon}"></i> ${specialization.name}</h2>
            </div>
            <div class="specialization-content">
                <p class="specialization-description">${specialization.description}</p>
                <h3 class="courses-title">Recommended Courses</h3>
                <ul class="courses-list">
                    ${specialization.courses.map(course => `
                        <li class="course-item" data-course='${JSON.stringify(course).replace(/'/g, "&#39;")}'>
                            <div class="course-name">${course.name}</div>
                            <div class="course-description-preview">${course.description}</div>
                        </li>
                    `).join('')}
                </ul>
            </div>
        `;

        // Add click events to course items
        card.querySelectorAll('.course-item').forEach(item => {
            item.addEventListener('click', () => {
                const courseData = JSON.parse(item.getAttribute('data-course'));
                Modal.show(courseData);
            });
        });

        return card;
    }

    getIcon(name) {
        const icons = {
            'HTML': 'fab fa-html5',
            'CSS': 'fab fa-css3-alt',
            'JavaScript': 'fab fa-js',
            'React': 'fab fa-react',
            'Vue.js': 'fab fa-vuejs',
            'Tools and Workflow': 'fas fa-tools'
        };
        return icons[name] || 'fas fa-code';
    }
}

// ========================================
// Modal System
// ========================================
class Modal {
    static init() {
        this.modal = document.getElementById('course-modal');
        this.detailsContainer = document.getElementById('course-details');
        this.closeButton = this.modal.querySelector('.modal-close');
        this.overlay = this.modal.querySelector('.modal-overlay');

        // Close event listeners
        this.closeButton.addEventListener('click', () => this.hide());
        this.overlay.addEventListener('click', () => this.hide());

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.hide();
            }
        });
    }

    static show(course) {
        const videoHTML = course.videoUrl ? `
            <div class="course-video">
                <h3>Course Video</h3>
                <a href="${course.videoUrl}" target="_blank" class="video-link">
                    <i class="fab fa-youtube"></i>
                    Watch Course Video
                </a>
            </div>
        ` : '';

        const lecturesHTML = course.lectures && course.lectures.length > 0 ? `
            <h3>Course Lectures</h3>
            <ul class="lectures-list">
                ${course.lectures.map(lecture => `<li>${lecture}</li>`).join('')}
            </ul>
        ` : '';

        this.detailsContainer.innerHTML = `
            <h2>${course.name}</h2>
            <p class="course-detail-description">${course.description}</p>
            ${videoHTML}
            ${lecturesHTML}
        `;

        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    static hide() {
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ========================================
// Login Form Handler
// ========================================
class LoginForm {
    static init() {
        const form = document.getElementById('login-form');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit(form);
        });
    }

    static handleSubmit(form) {
        const email = form.querySelector('#email').value;
        const password = form.querySelector('#password').value;
        const remember = form.querySelector('input[name="remember"]')?.checked || false;

        // Simulate login (replace with actual authentication)
        console.log('Login attempt:', { email, remember });

        // Show success message
        const button = form.querySelector('.btn-primary');
        const originalText = button.innerHTML;

        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing in...';
        button.disabled = true;

        setTimeout(() => {
            button.innerHTML = '<i class="fas fa-check"></i> Success!';
            button.style.background = 'linear-gradient(135deg, #10B981 0%, #059669 100%)';

            setTimeout(() => {
                button.innerHTML = originalText;
                button.style.background = '';
                button.disabled = false;
                form.reset();
            }, 2000);
        }, 1500);
    }
}

// ========================================
// Animations & Effects
// ========================================
class Animations {
    static init() {
        // Add scroll reveal animation
        this.addScrollReveal();

        // Add hover sound effect (optional)
        this.addHoverEffects();
    }

    static addScrollReveal() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.specialization-card, .about-card, .feature-card').forEach(el => {
            observer.observe(el);
        });
    }

    static addHoverEffects() {
        // Add subtle particle effect on cards
        document.querySelectorAll('.specialization-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);
            });
        });
    }
}

// ========================================
// Utility Functions
// ========================================
const Utils = {
    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Format date
    formatDate(date) {
        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    },

    // Local storage helpers
    storage: {
        set(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                console.warn('LocalStorage not available');
            }
        },
        get(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                return defaultValue;
            }
        },
        remove(key) {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                console.warn('LocalStorage not available');
            }
        }
    }
};

// ========================================
// Initialize Application
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    new TabNavigation();
    new RoadmapLoader().load();
    LoginForm.init();
    Animations.init();

    // Add loading animation
    document.body.classList.add('loaded');

    console.log('%c🚀 Front-End Development Roadmap', 'color: #4F46E5; font-size: 20px; font-weight: bold;');
    console.log('%cBuilt with modern ES6+ JavaScript', 'color: #10B981;');
});

// Export for debugging in console
window.App = {
    roadmapData,
    TabNavigation,
    RoadmapLoader,
    Modal,
    Utils
};
