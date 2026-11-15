// Active Navigation Link on Scroll
const sections = document.querySelectorAll('section, .main');
const navLinks = document.querySelectorAll('.menu ul li a');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });

    // Scroll-to-Top Button Visibility
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    if (scrollTopBtn) {
        if (window.scrollY > 350) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    }
});

// Smooth Scroll to Top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Search Functionality
function handleSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    const query = searchInput.value.trim().toLowerCase();
    if (!query) return;

    const sectionMap = {
        'home': 'home',
        'main': 'home',
        'about': 'about',
        'me': 'about',
        'bio': 'about',
        'experience': 'about',
        'intern': 'about',
        'service': 'service',
        'services': 'service',
        'web': 'service',
        'ai': 'service',
        'ml': 'service',
        'nlp': 'service',
        'design': 'design',
        'project': 'design',
        'projects': 'design',
        'portal': 'design',
        'contact': 'contact',
        'email': 'contact',
        'github': 'contact',
        'linkedin': 'contact'
    };

    let targetId = sectionMap[query];

    if (!targetId) {
        sections.forEach(sec => {
            if (sec.innerText.toLowerCase().includes(query)) {
                targetId = sec.getAttribute('id');
            }
        });
    }

    if (targetId) {
        const targetEl = document.getElementById(targetId);
        if (targetEl) {
            targetEl.scrollIntoView({ behavior: 'smooth' });
            targetEl.classList.add('highlight-section');
            setTimeout(() => targetEl.classList.remove('highlight-section'), 1500);
        }
    } else {
        alert(`No section matched "${query}". Try searching for: about, service, design, or contact.`);
    }
}

// Contact Form Notifications & Toast System (Cyan-and-Dark Theme)
function hideFormAlert() {
    const alertEl = document.getElementById('contactFormAlert');
    if (alertEl) {
        alertEl.style.display = 'none';
        alertEl.className = 'contact-form-alert';
        alertEl.textContent = '';
    }
}

function showFormAlert(message, type = 'success') {
    // 1. Inline Banner above the Send Message button
    let alertEl = document.getElementById('contactFormAlert');
    if (!alertEl) {
        const form = document.getElementById('contactForm') || document.querySelector('.contact-form-card form');
        if (form) {
            alertEl = document.createElement('div');
            alertEl.id = 'contactFormAlert';
            alertEl.className = 'contact-form-alert';
            const btn = form.querySelector('.contact-btn');
            if (btn) {
                form.insertBefore(alertEl, btn);
            } else {
                form.appendChild(alertEl);
            }
        }
    }
    if (alertEl) {
        alertEl.textContent = message;
        alertEl.className = `contact-form-alert ${type}`;
        alertEl.style.display = 'block';
    }

    // 2. Floating Toast Notification at top-right
    let toast = document.getElementById('contactToast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'contactToast';
        toast.className = 'contact-toast';
        document.body.appendChild(toast);
    }

    const iconSymbol = type === 'success' ? '✓' : '✕';
    toast.className = `contact-toast ${type}`;
    toast.innerHTML = `<span style="font-size:20px; font-weight:bold; margin-right:8px; line-height:1;">${iconSymbol}</span><span>${message}</span>`;
    
    // Animate visibility
    requestAnimationFrame(() => {
        toast.classList.add('visible');
    });

    if (window.contactToastTimer) {
        clearTimeout(window.contactToastTimer);
    }
    window.contactToastTimer = setTimeout(() => {
        if (toast) {
            toast.classList.remove('visible');
        }
    }, 6000);
}

// Secure Contact Form Submission with EmailJS
function sendContactEmail(event) {
    if (event) event.preventDefault();

    const form = document.getElementById('contactForm') || (event ? event.target : null);
    const submitBtn = form ? form.querySelector('.contact-btn') : document.querySelector('.contact-btn');
    
    const nameEl = document.getElementById('contactName');
    const emailEl = document.getElementById('contactEmail');
    const subjectEl = document.getElementById('contactSubject');
    const messageEl = document.getElementById('contactMessage');

    const name = nameEl ? nameEl.value.trim() : '';
    const email = emailEl ? emailEl.value.trim() : '';
    const subject = subjectEl ? subjectEl.value : '';
    const message = messageEl ? messageEl.value.trim() : '';

    // Validate all fields
    if (!name || !email || !subject || !message) {
        showFormAlert('Please fill in all fields before submitting.', 'error');
        return;
    }

    // Disable button to prevent duplicate submissions
    if (submitBtn) {
        submitBtn.disabled = true;
        if (!submitBtn.dataset.originalText) {
            submitBtn.dataset.originalText = submitBtn.textContent;
        }
        submitBtn.textContent = 'Sending...';
    }

    hideFormAlert();

    // Send email via EmailJS using the form element
    emailjs.sendForm('service_nbvavys', 'template_cwht9ka', form)
        .then(function(response) {
            console.log('EmailJS success:', response);

            // 1. Reset and clear all form fields only after confirmed success
            try {
                if (form) form.reset();
                if (nameEl) nameEl.value = '';
                if (emailEl) emailEl.value = '';
                if (subjectEl) subjectEl.selectedIndex = 0;
                if (messageEl) messageEl.value = '';
            } catch (resetErr) {
                console.error('Reset error:', resetErr);
            }

            // 2. Display success notification matching the cyan-and-dark theme
            showFormAlert('Message sent successfully! Thank you for contacting me.', 'success');
        })
        .catch(function(error) {
            console.error('EmailJS error:', error);
            let errMsg = 'Failed to send your message. Please try again later.';
            if (error && error.text) {
                errMsg += ` (${error.text})`;
            }
            // Preserve entered data on failure, show error notification
            showFormAlert(errMsg, 'error');
        })
        .finally(function() {
            // Restore button state
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = submitBtn.dataset.originalText || 'Send Message';
                delete submitBtn.dataset.originalText;
            }
        });
}

// Realistic Interactive Authentication System
function togglePasswordVisibility(inputId, iconId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById(iconId);
    if (!input || !icon) return;

    if (input.type === 'password') {
        input.type = 'text';
        icon.setAttribute('name', 'eye-off-outline');
    } else {
        input.type = 'password';
        icon.setAttribute('name', 'eye-outline');
    }
}

function switchAuthView(view) {
    const loginView = document.getElementById('loginView');
    const signupView = document.getElementById('signupView');
    const loggedInView = document.getElementById('loggedInView');
    const authAlert = document.getElementById('authAlert');
    const signupAlert = document.getElementById('signupAlert');

    if (authAlert) {
        authAlert.style.display = 'none';
        authAlert.className = 'auth-alert';
    }
    if (signupAlert) {
        signupAlert.style.display = 'none';
        signupAlert.className = 'auth-alert';
    }

    if (loggedInView) loggedInView.classList.add('hidden-form');

    if (view === 'signup') {
        if (loginView) loginView.classList.add('hidden-form');
        if (signupView) signupView.classList.remove('hidden-form');
    } else {
        if (signupView) signupView.classList.add('hidden-form');
        if (loginView) loginView.classList.remove('hidden-form');
    }
}

function showAuthAlert(message, type, targetId = 'authAlert') {
    const alertEl = document.getElementById(targetId);
    if (!alertEl) return;
    alertEl.textContent = message;
    alertEl.className = `auth-alert ${type}`;
    alertEl.style.display = 'block';
}

function handleAuthSubmit(event, mode) {
    event.preventDefault();

    if (mode === 'login') {
        const email = document.getElementById('loginEmail').value.trim();
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;
        const submitBtn = document.getElementById('loginSubmitBtn');

        if (!email || !password) {
            showAuthAlert('Please fill in both email and password.', 'error', 'authAlert');
            return;
        }

        if (password.length < 6) {
            showAuthAlert('Password must be at least 6 characters long.', 'error', 'authAlert');
            return;
        }

        // Show realistic loading state
        submitBtn.disabled = true;
        submitBtn.textContent = 'Verifying...';
        showAuthAlert('Authenticating with portal...', 'info', 'authAlert');

        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Login';

            const displayName = email.split('@')[0];
            const userData = { email, name: displayName, timestamp: Date.now() };

            if (rememberMe) {
                localStorage.setItem('portalUser', JSON.stringify(userData));
            } else {
                sessionStorage.setItem('portalUser', JSON.stringify(userData));
            }

            showAuthAlert('Login Successful! Welcome back.', 'success', 'authAlert');

            setTimeout(() => {
                showLoggedInView(userData);
            }, 700);
        }, 900);

    } else if (mode === 'signup') {
        const name = document.getElementById('signupName').value.trim();
        const email = document.getElementById('signupEmail').value.trim();
        const password = document.getElementById('signupPassword').value;
        const submitBtn = document.getElementById('signupSubmitBtn');

        if (!name || !email || !password) {
            showAuthAlert('Please fill in all registration fields.', 'error', 'signupAlert');
            return;
        }

        if (password.length < 6) {
            showAuthAlert('Password must be at least 6 characters long.', 'error', 'signupAlert');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating Account...';
        showAuthAlert('Registering your account...', 'info', 'signupAlert');

        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Sign Up';

            const userData = { email, name, timestamp: Date.now() };
            localStorage.setItem('portalUser', JSON.stringify(userData));

            showAuthAlert('Account created successfully! Welcome 🎉', 'success', 'signupAlert');

            setTimeout(() => {
                showLoggedInView(userData);
            }, 700);
        }, 1000);
    }
}

function showLoggedInView(userData) {
    const loginView = document.getElementById('loginView');
    const signupView = document.getElementById('signupView');
    const loggedInView = document.getElementById('loggedInView');
    const userNameEl = document.getElementById('loggedInUserName');
    const userEmailEl = document.getElementById('loggedInUserEmail');

    if (loginView) loginView.classList.add('hidden-form');
    if (signupView) signupView.classList.add('hidden-form');

    if (userNameEl) userNameEl.textContent = `Welcome, ${userData.name}!`;
    if (userEmailEl) userEmailEl.textContent = userData.email;
    if (loggedInView) loggedInView.classList.remove('hidden-form');
}

function handleLogout() {
    localStorage.removeItem('portalUser');
    sessionStorage.removeItem('portalUser');

    const loggedInView = document.getElementById('loggedInView');
    if (loggedInView) loggedInView.classList.add('hidden-form');

    switchAuthView('login');
    showAuthAlert('You have been safely signed out.', 'info', 'authAlert');
    setTimeout(() => {
        const authAlert = document.getElementById('authAlert');
        if (authAlert) authAlert.style.display = 'none';
    }, 2500);
}

function handleForgotPassword() {
    const email = document.getElementById('loginEmail').value.trim();
    if (email) {
        showAuthAlert(`Password reset instructions sent to: ${email}`, 'success');
    } else {
        const inputEmail = prompt('Enter your registered email address for password reset:');
        if (inputEmail && inputEmail.trim()) {
            showAuthAlert(`Password reset link sent to: ${inputEmail.trim()}`, 'success');
        }
    }
}

function checkExistingAuthSession() {
    const saved = localStorage.getItem('portalUser') || sessionStorage.getItem('portalUser');
    if (saved) {
        try {
            const userData = JSON.parse(saved);
            if (userData && userData.email) {
                showLoggedInView(userData);
            }
        } catch (e) {
            console.error('Session parse error:', e);
        }
    }
}

// Mobile Hamburger Navigation Toggle
function toggleMobileNav() {
    const navMenu = document.getElementById('navMenu');
    const hamburgerIcon = document.getElementById('hamburgerIcon');
    if (!navMenu) return;

    navMenu.classList.toggle('active');
    if (navMenu.classList.contains('active')) {
        if (hamburgerIcon) hamburgerIcon.setAttribute('name', 'close-outline');
    } else {
        if (hamburgerIcon) hamburgerIcon.setAttribute('name', 'menu-outline');
    }
}

// Event Listeners on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    checkExistingAuthSession();

    // Close mobile nav when clicking any nav link
    document.querySelectorAll('.menu ul li a').forEach(link => {
        link.addEventListener('click', () => {
            const navMenu = document.getElementById('navMenu');
            const hamburgerIcon = document.getElementById('hamburgerIcon');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                if (hamburgerIcon) hamburgerIcon.setAttribute('name', 'menu-outline');
            }
        });
    });

    // Sticky Header Scroll effect
    const headerNav = document.getElementById('headerNav');
    window.addEventListener('scroll', () => {
        if (headerNav) {
            if (window.scrollY > 40) {
                headerNav.classList.add('scrolled');
            } else {
                headerNav.classList.remove('scrolled');
            }
        }
    });

    // Search input Enter key trigger
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
            }
        });
    }
});


