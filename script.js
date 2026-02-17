const API_URL = '/api'; // Relative path for flexibility

// State
let currentUser = JSON.parse(localStorage.getItem('user'));
let token = localStorage.getItem('token');

document.addEventListener('DOMContentLoaded', () => {
    injectNavigation();

    // Page specific initializing
    if (window.location.pathname.includes('listings.html')) loadListings();
    if (window.location.pathname.includes('dashboard.html')) loadDashboard();
    if (window.location.pathname.includes('company.html')) loadCompanyDashboard();

    // Re-check auth updates after navigation injection
    setTimeout(checkAuth, 100);

    // Initialize Scroll Animations
    initScrollReveal();

    // Initialize 3D Tilt
    initTiltEffect();

    // Initialize Custom Cursor
    initCustomCursor();

    // Initialize Bouncing Logo
    initLogoBounce();
});

// --- UI & Animations ---

function initCustomCursor() {
    const cursorDot = document.createElement('div');
    const cursorOutline = document.createElement('div');
    cursorDot.className = 'cursor-dot';
    cursorOutline.className = 'cursor-outline';
    document.documentElement.appendChild(cursorDot);
    document.documentElement.appendChild(cursorOutline);

    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Instant Dot Movement
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;

        // Magnetic Button Effect
        const hovered = document.elementFromPoint(mouseX, mouseY);
        const isHoverable = hovered?.closest('a, button, .btn, input, select, textarea, .role-box, .contact-item, .social-links a');

        if (isHoverable) {
            cursorOutline.style.transform = `translate(-50%, -50%) scale(1.5)`;
            cursorOutline.style.backgroundColor = 'rgba(212, 255, 51, 0.1)';
            cursorOutline.style.borderColor = 'transparent';
        } else {
            cursorOutline.style.transform = `translate(-50%, -50%) scale(1)`;
            cursorOutline.style.backgroundColor = 'transparent';
            cursorOutline.style.borderColor = 'var(--primary-lime)';
        }
    });

    // Smooth Outline Movement
    function animateCursor() {
        outlineX += (mouseX - outlineX) * 0.15; // Smooth trail
        outlineY += (mouseY - outlineY) * 0.15;

        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;

        requestAnimationFrame(animateCursor);
    }
    animateCursor();
}

class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\\/[]{}—=+*^?#________';
        this.update = this.update.bind(this);
    }
    setText(newText) {
        const oldText = this.el.innerText;
        const length = Math.max(oldText.length, newText.length);
        const promise = new Promise((resolve) => this.resolve = resolve);
        this.queue = [];
        for (let i = 0; i < length; i++) {
            const from = oldText[i] || '';
            const to = newText[i] || '';
            const start = Math.floor(Math.random() * 40);
            const end = start + Math.floor(Math.random() * 40);
            this.queue.push({ from, to, start, end });
        }
        cancelAnimationFrame(this.frameRequest);
        this.frame = 0;
        this.update();
        return promise;
    }
    update() {
        let output = '';
        let complete = 0;
        for (let i = 0, n = this.queue.length; i < n; i++) {
            let { from, to, start, end, char } = this.queue[i];
            if (this.frame >= end) {
                complete++;
                output += to;
            } else if (this.frame >= start) {
                if (!char || Math.random() < 0.28) {
                    char = this.randomChar();
                    this.queue[i].char = char;
                }
                output += `<span class="dud">${char}</span>`;
            } else {
                output += from;
            }
        }
        this.el.innerHTML = output;
        if (complete === this.queue.length) {
            this.resolve();
        } else {
            this.frameRequest = requestAnimationFrame(this.update);
            this.frame++;
        }
    }
    randomChar() {
        return this.chars[Math.floor(Math.random() * this.chars.length)];
    }
}

function initTextScramble() {
    const phrases = [
        'VERIFIED INTERNSHIPS',
        'REAL EXPERIENCE',
        'NO CAP CAREERS',
        'FUTURE IS YOURS'
    ];

    const el = document.querySelector('.hero h1 span');
    if (el) {
        const fx = new TextScramble(el);
        let counter = 0;
        const next = () => {
            fx.setText(phrases[counter]).then(() => {
                setTimeout(next, 2500);
            });
            counter = (counter + 1) % phrases.length;
        };
        next();
    }

    // Hover Scramble for Nav Links
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('mouseenter', () => {
            if (!link.dataset.original) link.dataset.original = link.innerText;
            const fx = new TextScramble(link);
            fx.setText(link.dataset.original);
        });
    });
}

function initRippleEffect() {
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            let x = e.clientX - e.target.getBoundingClientRect().left;
            let y = e.clientY - e.target.getBoundingClientRect().top;

            let ripple = document.createElement('span');
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.className = 'ripple';

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

function initTiltEffect() {
    const cards = document.querySelectorAll('.animate-left, .animate-right, .animate-scale, .job-card-large');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
        });
    });
}

function initScrollReveal() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('scroll-active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Target elements to animate
    const targets = document.querySelectorAll('.scroll-hidden');
    targets.forEach(target => observer.observe(target));

    initTextScramble();
}

// --- Authentication ---

function checkAuth() {
    updateNavForAuth();
    updateHomeForAuth(); // Add this call

    const protectedPages = ['dashboard.html', 'company.html'];
    const isProtected = protectedPages.some(page => window.location.pathname.includes(page));

    if (isProtected && !token) {
        showMessageModal('ACCESS DENIED', 'You must be logged in to view this page.', () => {
            window.location.href = 'index.html';
        });
        return;
    }

    // For admin, allow access to all
    if (currentUser && currentUser.role === 'admin') return;
}

function updateHomeForAuth() {
    const heroStudentBtn = document.getElementById('hero-student-btn');
    const heroCompanyBtn = document.getElementById('hero-company-btn');
    const homeCtaBtn = document.getElementById('home-cta-btn');

    if (currentUser) {
        if (currentUser.role === 'company') {
            if (heroStudentBtn) heroStudentBtn.style.display = 'none';

            if (heroCompanyBtn) {
                heroCompanyBtn.style.display = 'inline-block';
                heroCompanyBtn.innerText = 'GO TO DASHBOARD';
                heroCompanyBtn.href = 'company.html';
            }

            if (homeCtaBtn) {
                homeCtaBtn.innerText = 'POST A JOB'; // More relevant action
                homeCtaBtn.href = 'company.html';
            }
        } else if (currentUser.role === 'student') {
            // Student: Show only "EXPLORE" button
            if (heroStudentBtn) {
                heroStudentBtn.style.display = 'inline-block';
                heroStudentBtn.innerText = 'EXPLORE';
                heroStudentBtn.href = 'listings.html';
            }

            if (heroCompanyBtn) {
                heroCompanyBtn.style.display = 'none';
            }

            if (homeCtaBtn) {
                homeCtaBtn.innerText = 'BROWSE INTERNSHIPS';
                homeCtaBtn.href = 'listings.html';
            }
        } else if (currentUser.role === 'admin') {
            // Admin: Show only "VIEW COMPANIES" button
            if (heroStudentBtn) {
                heroStudentBtn.style.display = 'none';
            }

            if (heroCompanyBtn) {
                heroCompanyBtn.style.display = 'inline-block';
                heroCompanyBtn.innerText = 'VIEW COMPANIES';
                heroCompanyBtn.href = 'company.html';
            }

            if (homeCtaBtn) {
                homeCtaBtn.innerText = 'MANAGE PLATFORM';
                homeCtaBtn.href = 'company.html';
            }
        }
    } else {
        // Guest: Reset defaults
        if (heroStudentBtn) {
            heroStudentBtn.style.display = 'inline-block';
            heroStudentBtn.innerText = 'FOR STUDENTS';
            heroStudentBtn.href = 'dashboard.html'; // Or listings.html, sticking to original flow
        }
        if (heroCompanyBtn) {
            heroCompanyBtn.style.display = 'inline-block';
            heroCompanyBtn.innerText = 'FOR COMPANIES';
            heroCompanyBtn.href = 'company.html';
        }
        if (homeCtaBtn) {
            homeCtaBtn.innerText = 'BROWSE INTERNSHIPS';
            homeCtaBtn.href = 'listings.html';
        }
    }
}

function updateNavForAuth() {
    const navLinks = document.getElementById('navLinks');
    if (!navLinks) return;

    // Elements
    const navListings = document.getElementById('nav-listings');
    const navDashboard = document.getElementById('nav-dashboard');
    const existingCompanyLink = document.getElementById('nav-company-link');

    // Reset - Remove dynamic company link if exists
    if (existingCompanyLink) existingCompanyLink.remove();

    // Reset - Show standard links by default
    if (navListings) navListings.style.display = 'block';
    if (navDashboard) navDashboard.style.display = 'block';

    const oldLogin = navLinks.querySelector('.auth-link');
    if (oldLogin) oldLogin.remove();

    const li = document.createElement('li');
    li.className = 'auth-link';

    if (currentUser) {
        li.innerHTML = `<a href="#" onclick="logout()">Logout (${currentUser.name})</a>`;

        // Hide Listings for ALL logged-in users (Student & Company)
        if (navListings) navListings.style.display = 'none';

        // Role-Based Hiding/Showing
        if (currentUser.role === 'company') {
            // Company: Hide Dashboard too (Company has its own dashboard link)
            if (navDashboard) navDashboard.style.display = 'none';

            // Add Company Link
            const jobsLi = document.createElement('li');
            jobsLi.id = 'nav-company-link';
            jobsLi.innerHTML = '<a href="company.html">Company Dashboard</a>';
            navLinks.insertBefore(jobsLi, document.querySelector('li:nth-child(4)')); // Insert after Home(1)
        } else if (currentUser.role === 'admin') {
            // Admin: Hide Dashboard, Show Company Link
            if (navDashboard) navDashboard.style.display = 'none';

            const jobsLi = document.createElement('li');
            jobsLi.id = 'nav-company-link';
            jobsLi.innerHTML = '<a href="company.html">Admin Dashboard</a>';
            navLinks.insertBefore(jobsLi, document.querySelector('li:nth-child(4)'));
        }
        // Student: Default (Listings hidden by general rule above, Dashboard visible)

    } else {
        li.innerHTML = `<a href="#" onclick="openAuthModal('login')">Login / Sign Up</a>`;
    }
    navLinks.appendChild(li);
}

// --- Logout Logic ---

function logout() {
    const modal = document.getElementById('logoutModal');
    if (modal) {
        modal.classList.add('active');
    } else {
        // Fallback if modal missing for some reason
        showMessageModal('LOGOUT', "Are you sure you want to Logout?", performLogout);
    }
}

function confirmLogout() {
    const modal = document.getElementById('logoutModal');
    if (modal) modal.classList.remove('active');

    // Show Thank You Message (Custom Toast/Alert style)
    const toast = document.createElement('div');
    toast.style.position = 'fixed';
    toast.style.top = '20px';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.background = 'var(--primary-lime)';
    toast.style.color = '#000';
    toast.style.padding = '15px 30px';
    toast.style.borderRadius = '5px';
    toast.style.fontWeight = 'bold';
    toast.style.zIndex = '3000';
    toast.style.boxShadow = '0 5px 15px rgba(0,0,0,0.5)';
    toast.innerText = 'THANK YOU, VISIT AGAIN';
    document.body.appendChild(toast);

    setTimeout(() => {
        performLogout();
    }, 1500);
}

function closeLogoutModal() {
    const modal = document.getElementById('logoutModal');
    if (modal) modal.classList.remove('active');
}

function performLogout() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = 'index.html';
}

// --- Modal Logic ---

function openAuthModal(mode = 'login') {
    const modal = document.getElementById('authModal');
    if (modal) {
        modal.classList.add('active');
        switchAuthTab(mode);
    }
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    if (modal) modal.classList.remove('active');
}

// Close modal on outside click
window.onclick = function (event) {
    const modal = document.getElementById('authModal');
    if (event.target == modal) {
        closeAuthModal();
    }
}

function switchAuthTab(mode) {
    // Update Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

    // Update Forms
    document.querySelectorAll('.auth-form').forEach(form => form.classList.remove('active'));

    if (mode === 'login') {
        document.querySelectorAll('.tab-btn')[0].classList.add('active');
        document.getElementById('loginForm').classList.add('active');
    } else {
        document.querySelectorAll('.tab-btn')[1].classList.add('active');
        document.getElementById('registerForm').classList.add('active');
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();

        if (res.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            currentUser = data;
            token = data.token;

            closeAuthModal();
            updateNavForAuth();

            showMessageModal('WELCOME', `Welcome back, ${data.name}!`, () => {
                if (data.role === 'student') window.location.href = 'dashboard.html';
                else if (data.role === 'company') window.location.href = 'company.html';
                else if (data.role === 'admin') window.location.href = 'company.html';
            });
        } else {
            showMessageModal('LOGIN FAILED', data.message || 'Login failed');
        }
    } catch (err) {
        console.error(err);
        alert('Connection failed. Is the server running?');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    // Get selected role
    let role = 'student';
    const roleRadios = document.getElementsByName('role');
    for (let i = 0; i < roleRadios.length; i++) {
        if (roleRadios[i].checked) {
            role = roleRadios[i].value;
            break;
        }
    }

    try {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role })
        });
        const data = await res.json();

        if (res.ok) {
            showMessageModal('SUCCESS', 'Registration Successful! Logging you in...', () => {
                // Auto login after register
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data));
                currentUser = data;
                token = data.token;

                closeAuthModal();
                updateNavForAuth();

                if (data.role === 'student') window.location.href = 'dashboard.html';
                else if (data.role === 'company') window.location.href = 'company.html';
            });
        } else {
            showMessageModal('REGISTRATION FAILED', data.message || 'Registration failed');
        }
    } catch (err) {
        console.error(err);
        showMessageModal('ERROR', 'Connection failed. Is the server running?');
    }
}

// --- Student Listings ---
// --- Student Listings ---
let allInternships = [];

async function loadListings() {
    const container = document.querySelector('.job-list');
    if (!container) return;
    container.innerHTML = '<p>Loading internships...</p>';

    try {
        const res = await fetch(`${API_URL}/student/internships`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const jobs = await res.json();
        allInternships = jobs; // Cache for filtering

        if (!res.ok) throw new Error('Failed to fetch');

        // Initialize Filter Listeners
        document.querySelectorAll('.job-filter').forEach(cb => {
            cb.addEventListener('change', renderFilteredJobs);
        });
        const resetBtn = document.getElementById('resetFiltersBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                document.querySelectorAll('.job-filter').forEach(cb => cb.checked = false);
                renderFilteredJobs();
            });
        }

        renderFilteredJobs();

    } catch (err) {
        container.innerHTML = '<p>Could not load jobs. Is the server running?</p>';
    }
}

function renderFilteredJobs() {
    const container = document.querySelector('.job-list');

    // Get active filters
    const domains = Array.from(document.querySelectorAll('.job-filter[data-type="domain"]:checked')).map(cb => cb.value);
    const durations = Array.from(document.querySelectorAll('.job-filter[data-type="duration"]:checked')).map(cb => cb.value);
    const stipends = Array.from(document.querySelectorAll('.job-filter[data-type="stipend"]:checked')).map(cb => cb.value);

    // Filter Logic
    const filtered = allInternships.filter(job => {
        // Domain Filter (Basic keyword matching on Title or Skills)
        let domainMatch = true;
        if (domains.length > 0) {
            domainMatch = domains.some(d => {
                const term = d.toLowerCase();
                if (term === 'web') return job.title.toLowerCase().includes('frontend') || job.title.toLowerCase().includes('backend') || job.title.toLowerCase().includes('react') || job.title.toLowerCase().includes('node');
                return job.title.toLowerCase().includes(term);
            });
        }

        // Duration Filter
        let durationMatch = true;
        if (durations.length > 0) {
            durationMatch = durations.some(d => {
                // job.duration is like "6 Months"
                const months = parseInt(job.duration) || 0;
                if (d === '1-3') return months >= 1 && months <= 3;
                if (d === '3-6') return months >= 3 && months <= 6;
                if (d === '6+') return months >= 6;
                return false;
            });
        }

        // Stipend Filter
        let stipendMatch = true;
        if (stipends.length > 0) {
            stipendMatch = stipends.some(s => {
                if (s === 'Paid') return job.stipend === 'Paid';
                if (s === 'Unpaid') return job.stipend !== 'Paid';
                return false;
            });
        }

        return domainMatch && durationMatch && stipendMatch;
    });

    // Render
    if (filtered.length === 0) {
        container.innerHTML = '<p>No internships found matching filters.</p>';
    } else {
        container.innerHTML = filtered.map((job, index) => `
            <div class="job-card-large scroll-hidden animate-scale" style="transition-delay: ${index * 0.15}s;">
                <div style="display: flex; flex: 1;">
                    <div class="company-logo"><i class="fas fa-briefcase"></i></div>
                    <div class="job-info">
                        ${job.verified ? `<span class="verified-badge">VERIFIED</span>` : ''}
                        <h3>${job.title}</h3>
                        <div class="job-meta">
                            <span><i class="fas fa-building"></i> ${job.company.name}</span>
                            <span><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                            <span><i class="fas fa-dollar-sign"></i> ${job.stipend}</span>
                        </div>
                        <div style="margin-top: 10px;">
                            ${job.skillsRequired.map(s => `<span class="skill-tag">${s}</span>`).join('')}
                        </div>
                    </div>
                </div>
                <button class="btn btn-primary" onclick="apply('${job._id}')">Apply Now</button>
            </div>
        `).join('');
    }

    const header = document.querySelector('.section-header p');
    if (header) header.innerText = `Found ${filtered.length} verified opportunities.`;

    // Re-init observer for dynamic elements
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('scroll-active'); });
    }, observerOptions);
    document.querySelectorAll('.scroll-hidden').forEach(el => observer.observe(el));
}


async function apply(id) {
    if (!token) return showLoginModal();
    if (!confirm('Apply for this internship?')) return;
    try {
        const res = await fetch(`${API_URL}/student/apply/${id}`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        alert(data.message || 'Application status: ' + res.statusText);
    } catch (err) {
        alert('Application failed');
    }
}

// --- Student Dashboard ---
async function loadDashboard() {
    if (!currentUser) return;
    document.querySelector('.profile-header h3').innerText = currentUser.name;

    // Load Profile Data into Sidebar
    try {
        const res = await fetch(`${API_URL}/student/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const profile = await res.json();

        if (profile) {
            document.querySelector('.profile-header p').innerText = profile.education || 'Student';
            const skillsContainer = document.querySelector('.skills-list');
            if (skillsContainer && profile.skills) {
                skillsContainer.innerHTML = profile.skills.map(s => `<span class="skill-tag">${s}</span>`).join('');
            }
            const interestsContainer = document.querySelector('.profile-card div:nth-of-type(3) p');
            if (interestsContainer && profile.interests) {
                interestsContainer.innerText = profile.interests.join(', ');
            }
        }
    } catch (err) { console.error('Error loading profile', err); }

    const appContainer = document.querySelectorAll('.dashboard-section')[0];
    if (!appContainer) return;

    try {
        const res = await fetch(`${API_URL}/student/applications`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const apps = await res.json();
        const header = appContainer.querySelector('h2');
        appContainer.innerHTML = '';
        appContainer.appendChild(header || document.createElement('h2'));

        if (apps.length === 0) appContainer.innerHTML += '<p>No applications yet.</p>';

        apps.forEach((app, index) => {
            const statusColor = app.status === 'Accepted' ? 'status-accepted' : app.status === 'Rejected' ? 'status-rejected' : 'status-pending';
            const div = document.createElement('div');
            div.className = 'job-card scroll-hidden animate-scale';
            div.style.transitionDelay = `${index * 0.1}s`;
            div.innerHTML = `
                <div>
                    <h4 style="margin-bottom: 5px;">${app.internship.title}</h4>
                    <p style="font-size: 0.9rem;">${app.internship.company?.name} &bull; ${new Date(app.appliedAt).toLocaleDateString()}</p>
                </div>
                <span class="status-badge ${statusColor}">${app.status}</span>
            `;
            appContainer.appendChild(div);
        });

        // Brief delay to allow DOM paint before observing
        setTimeout(() => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('scroll-active'); });
            }, { threshold: 0.1 });
            document.querySelectorAll('.scroll-hidden').forEach(el => observer.observe(el));
        }, 100);

    } catch (err) { console.log('Error loading dashboard data', err); }
}

// --- Edit Profile Logic ---

function openEditProfileModal() {
    const modal = document.getElementById('editProfileModal');
    if (modal) modal.classList.add('active');

    // Pre-fill data (fetch again to be sure)
    fetch(`${API_URL}/student/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(res => res.json())
        .then(profile => {
            document.getElementById('editEducation').value = profile.education || '';
            document.getElementById('editSkills').value = profile.skills ? profile.skills.join(', ') : '';
            document.getElementById('editInterests').value = profile.interests ? profile.interests.join(', ') : '';
            document.getElementById('editResume').value = profile.resumeUrl || '';
        })
        .catch(err => console.error(err));
}

function closeEditProfileModal() {
    const modal = document.getElementById('editProfileModal');
    if (modal) modal.classList.remove('active');
}

async function handleProfileUpdate(e) {
    e.preventDefault();

    const education = document.getElementById('editEducation').value;
    const skills = document.getElementById('editSkills').value.split(',').map(s => s.trim()).filter(s => s);
    const interests = document.getElementById('editInterests').value.split(',').map(s => s.trim()).filter(s => s);
    const resumeUrl = document.getElementById('editResume').value;

    try {
        const res = await fetch(`${API_URL}/student/profile`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ education, skills, interests, resumeUrl })
        });

        if (res.ok) {
            alert('Profile Updated Successfully!');
            closeEditProfileModal();
            loadDashboard(); // Refresh UI
        } else {
            const data = await res.json();
            alert(data.message || 'Failed to update profile');
        }
    } catch (err) {
        console.error(err);
        alert('Server Error');
    }
}

// --- Company Dashboard ---
async function loadCompanyDashboard() {
    if (!currentUser) return;

    // --- ADMIN VIEW ---
    if (currentUser.role === 'admin') {
        const header = document.querySelector('.section-header');
        if (header) {
            header.innerHTML = `
                <div>
                    <h2>ADMIN DASHBOARD</h2>
                    <p style="margin: 0; font-family: var(--font-mono);">MANAGE COMPANY VERIFICATIONS.</p>
                </div>
            `;
        }

        // Hide Company Stats
        const statsGrid = document.querySelector('.dashboard-stats-grid');
        if (statsGrid) statsGrid.style.display = 'none';

        // Hide Verified Badge & Company Buttons
        const verifiedBadge = document.querySelector('.verified-badge');
        if (verifiedBadge) verifiedBadge.style.display = 'none';

        const editProfileBtn = document.querySelector('button[onclick="openCompanyProfileModal()"]');
        if (editProfileBtn) editProfileBtn.style.display = 'none';

        const postJobBtn = document.querySelector('.section-header .btn-primary');
        if (postJobBtn) postJobBtn.style.display = 'none';

        // Update Section Title
        const sectionTitle = document.querySelector('.dashboard-section h3');
        if (sectionTitle) sectionTitle.innerText = 'PENDING VERIFICATIONS & COMPANIES';

        const container = document.querySelector('.dashboard-table tbody');
        if (!container) return;
        container.innerHTML = '<tr><td colspan="5" style="text-align:center;">Loading companies...</td></tr>';

        // Update Table Headers
        const thead = document.querySelector('.dashboard-table thead tr');
        if (thead) {
            thead.innerHTML = `
                <th>COMPANY</th>
                <th>EMAIL</th>
                <th>WEBSITE</th>
                <th>STATUS</th>
                <th>ACTION</th>
            `;
        }

        try {
            const res = await fetch(`${API_URL}/admin/companies`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const companies = await res.json();

            if (companies.length === 0) {
                container.innerHTML = '<tr><td colspan="5" style="text-align:center;">No companies found.</td></tr>';
                return;
            }

            container.innerHTML = companies.map(comp => `
                <tr>
                    <td style="display: flex; align-items: center; gap: 10px;">
                        <div class="company-logo" style="width: 30px; height: 30px; font-size: 0.8rem;"><i class="fas fa-building"></i></div>
                        <div>
                            <div style="font-weight: bold;">${comp.companyName}</div>
                            <div style="font-size: 0.8rem; color: #888;">${comp.location || 'N/A'}</div>
                        </div>
                    </td>
                    <td>${comp.user?.email || 'N/A'}</td>
                    <td>${comp.website ? `<a href="${comp.website}" target="_blank" style="color: var(--cyan);">Visit</a>` : 'N/A'}</td>
                    <td>
                        ${comp.verified
                    ? `<span style="color: var(--primary-lime); font-weight: 600;"><i class="fas fa-check-circle"></i> Verified</span>`
                    : `<span style="color: var(--hot-pink); font-weight: 600;"><i class="fas fa-clock"></i> Pending</span>`}
                    </td>
                    <td>
                    <td>
                        ${!comp.verified
                    ? `<button class="btn btn-primary" onclick='openVerificationModal(${JSON.stringify(comp).replace(/'/g, "&#39;")})' style="padding: 5px 10px; font-size: 0.8rem;">VERIFY</button>`
                    : `<button class="btn btn-outline" disabled style="padding: 5px 10px; font-size: 0.8rem; opacity: 0.5;">VERIFIED</button>`}
                    </td>
                </tr>
            `).join('');

        } catch (err) {
            console.error(err);
            container.innerHTML = '<tr><td colspan="5" style="text-align:center; color: var(--hot-pink);">Error loading companies.</td></tr>';
        }
        return;
    }

    // --- COMPANY VIEW (Default) ---
    try {
        // Fetch Profile for Verification Status
        const resProfile = await fetch(`${API_URL}/company/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const profile = await resProfile.json();

        // Handle Badge Visibility
        const verifiedBadge = document.querySelector('.verified-badge');
        if (verifiedBadge) {
            verifiedBadge.style.display = profile.verified ? 'inline-block' : 'none';
        }

        // Fetch Applications
        const resApps = await fetch(`${API_URL}/company/applications`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const apps = await resApps.json();

        // Fetch Internships for "Active Listings" count
        const resJobs = await fetch(`${API_URL}/company/internships`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const jobs = await resJobs.json();

        // Update Stats
        const activeListingsCount = jobs.length || 0;
        const newApplicantsCount = apps.filter(app => app.status === 'Pending').length || 0;
        const closingSoonCount = 0; // Placeholder for now, logic requires 'deadline' field in schema

        const statListings = document.getElementById('stat-active-listings');
        const statApplicants = document.getElementById('stat-new-applicants');
        const statClosing = document.getElementById('stat-closing-soon');

        if (statClosing) statClosing.innerText = closingSoonCount;

        // Populate Recent Applications Table
        const container = document.querySelector('.dashboard-table tbody');
        if (container && apps.length > 0) {
            container.innerHTML = apps.slice(0, 5).map(app => `
                <tr>
                    <td style="display: flex; align-items: center; gap: 10px;">
                        <div class="user-avatar"><i class="fas fa-user"></i></div>
                        ${app.student?.name || 'Student'}
                    </td>
                    <td>${app.internship?.title || 'Internship'}</td>
                    <td>${new Date(app.appliedAt).toLocaleDateString()}</td>
                    <td><span style="color: var(--primary-lime); font-weight: 600;">--%</span></td>
                    <td>
                        <button class="btn btn-outline" onclick="viewApplication('${app._id}')" style="padding: 5px 10px; font-size: 0.8rem;">VIEW</button>
                    </td>
                </tr>
            `).join('');
        } else if (container) {
            container.innerHTML = '<tr><td colspan="5" style="text-align:center;">No applications yet.</td></tr>';
        }

        // Job Posting Logic (Company Only)
        const btn = document.querySelector('.section-header .btn-primary');
        if (btn) {
            btn.style.display = 'inline-block'; // Ensure visible for company
            btn.onclick = async () => {
                const title = prompt("Job Title:");
                if (!title) return;
                const jobBody = {
                    title, description: 'Description placeholder', skillsRequired: ['General'],
                    duration: '3 Months', stipend: 'Paid', location: 'Remote'
                };
                try {
                    await fetch(`${API_URL}/company/internship`, {
                        method: 'POST',
                        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                        body: JSON.stringify(jobBody)
                    });
                    showMessageModal('SUCCESS', 'Job Posted', loadCompanyDashboard);
                } catch (e) {
                    console.error(e);
                    showMessageModal('ERROR', 'Failed to post job');
                }
            };
        }

    } catch (err) {
        console.error('Error loading company dashboard', err);
    }
}

async function verifyCompany(id) {
    // Confirmation handled by the modal UI now
    try {
        const res = await fetch(`${API_URL}/admin/verify-company/${id}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
            showMessageModal('VERIFIED', 'Company Verified Successfully!', loadCompanyDashboard);
        } else {
            showMessageModal('ERROR', data.message || 'Verification failed');
        }
    } catch (err) {
        console.error(err);
        showMessageModal('ERROR', 'Server Error');
    }
}

// --- Application Modal Logic ---

function openApplicationModal(app) {
    const modal = document.getElementById('applicationModal');
    if (!modal) return;

    const content = document.getElementById('appModalContent');
    const actions = document.getElementById('appModalActions');

    // Safety check for profile
    const profile = app.studentProfile || {};

    content.innerHTML = `
        <p><strong>Candidate:</strong> ${app.student.name}</p>
        <p><strong>Email:</strong> ${app.student.email}</p>
        <p><strong>Role:</strong> ${app.internship.title}</p>
        <hr style="margin: 10px 0; border: 0; border-top: 1px solid #333;">
        <p><strong>Education:</strong> ${profile.education || 'N/A'}</p>
        <p><strong>Skills:</strong> ${profile.skills && profile.skills.length ? profile.skills.join(', ') : 'None listed'}</p>
        <p><strong>Interests:</strong> ${profile.interests && profile.interests.length ? profile.interests.join(', ') : 'None listed'}</p>
        ${profile.resumeUrl ? `<p><strong>Resume:</strong> <a href="${profile.resumeUrl}" target="_blank" style="color: var(--primary-lime);">View Resume</a></p>` : ''}
        <p><strong>Match Score:</strong> <span style="color: var(--primary-lime);">95%</span> (Simulated)</p>
    `;

    // Action Buttons
    if (app.status === 'Pending') {
        actions.innerHTML = `
            <button class="btn btn-primary" style="flex: 1;" onclick="updateApp('${app._id}', 'Accepted')">Accept</button>
            <button class="btn btn-secondary" style="flex: 1; background: #dc3545;" onclick="updateApp('${app._id}', 'Rejected')">Reject</button>
        `;
    } else {
        actions.innerHTML = `<p style="width: 100%; text-align: center;">Application is <strong>${app.status}</strong></p>`;
    }

    modal.classList.add('active');
}

function closeApplicationModal() {
    const modal = document.getElementById('applicationModal');
    if (modal) modal.classList.remove('active');
}

// --- Company Profile Edit Logic ---

function openCompanyProfileModal() {
    const modal = document.getElementById('companyProfileModal');
    if (modal) modal.classList.add('active');

    // Fetch current profile
    fetch(`${API_URL}/company/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
    })
        .then(res => res.json())
        .then(profile => {
            if (profile) {
                document.getElementById('compName').value = profile.companyName || '';
                document.getElementById('compDesc').value = profile.description || '';
                document.getElementById('compWebsite').value = profile.website || '';
                document.getElementById('compLocation').value = profile.location || '';
                if (profile.documents) {
                    const docStr = profile.documents.map(d => `${d.title} | ${d.url}`).join('\n');
                    document.getElementById('compDocs').value = docStr;
                } else {
                    document.getElementById('compDocs').value = '';
                }
            }
        })
        .catch(err => console.error(err));
}

function closeCompanyProfileModal() {
    const modal = document.getElementById('companyProfileModal');
    if (modal) modal.classList.remove('active');
}

async function handleCompanyProfileUpdate(e) {
    e.preventDefault();

    const companyName = document.getElementById('compName').value;
    const description = document.getElementById('compDesc').value;
    const website = document.getElementById('compWebsite').value;
    const location = document.getElementById('compLocation').value;
    const docsText = document.getElementById('compDocs').value;

    const documents = docsText.split('\n').filter(line => line.trim()).map(line => {
        const parts = line.split('|');
        return {
            title: parts[0].trim(),
            url: parts[1] ? parts[1].trim() : '#'
        };
    });

    try {
        const res = await fetch(`${API_URL}/company/profile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ companyName, description, website, location, documents })
        });

        if (res.ok) {
            showMessageModal('SUCCESS', 'Company Profile Updated!', closeCompanyProfileModal);
        } else {
            showMessageModal('UPDATE FAILED', 'Failed to update profile');
        }
    } catch (err) {
        console.error(err);
        showMessageModal('ERROR', 'Server Error');
    }
}

async function updateApp(id, status) {
    await fetch(`${API_URL}/company/application/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
    });
    loadCompanyDashboard();
}

function injectNavigation() {
    const currentPath = window.location.pathname;
    const headerHTML = `
        <div class="container">
            <nav class="navbar">
                <a href="index.html" class="logo">
                    <i class="fas fa-network-wired"></i>
                    Intern<span>Connect</span>
                </a>
                <ul class="nav-links" id="navLinks">
                    <li><a href="index.html">Home</a></li>
                    <li id="nav-listings"><a href="listings.html">Internships</a></li>
                    <li id="nav-dashboard"><a href="dashboard.html">Dashboard</a></li>
                    <li><a href="scam-protection.html">Safety</a></li>
                    <li><a href="about.html">About</a></li>
                    <li><a href="contact.html">Contact</a></li>
                </ul>
                <button class="mobile-menu-btn" id="mobileMenuBtn">
                    <i class="fas fa-bars"></i>
                </button>
            </nav>
        </div>
    `;

    const footerHTML = `
        <div class="container">
            <div class="footer-content">
                <div class="footer-col">
                    <h3>InternConnect</h3>
                    <p>Verified internships for students.</p>
                </div>
                <div class="footer-col">
                    <h3>Quick Links</h3>
                    <ul class="footer-links">
                        <li><a href="listings.html">Internships</a></li>
                        <li><a href="dashboard.html">Login</a></li>
                    </ul>
                </div>
                <div class="footer-col">
                    <h3>Contact</h3>
                    <ul class="footer-links">
                        <li>support@internconnect.com</li>
                    </ul>
                </div>
            </div>
            <div class="copyright">
                <p>&copy; 2024 InternConnect. All rights reserved.</p>
            </div>
        </div>

        <!-- Logout Modal Injected -->
        <div class="modal-overlay" id="logoutModal">
            <div class="modal-content tilt-card" style="text-align: center; max-width: 350px;">
                <h3 style="color: var(--hot-pink); margin-bottom: 20px;">LOGOUT</h3>
                <p style="margin-bottom: 30px;">Are you sure you want to log out?</p>
                <div style="display: flex; gap: 15px; justify-content: center;">
                    <button class="btn btn-secondary" onclick="confirmLogout()">YES, LOGOUT</button>
                    <button class="btn btn-outline" onclick="closeLogoutModal()">CANCEL</button>
                </div>
            </div>
        </div>

        <!-- Message Modal Injected -->
        <div class="modal-overlay" id="messageModal" style="z-index: 2000;">
            <div class="modal-content tilt-card" style="text-align: center; max-width: 350px;">
                <h3 id="msgModalTitle" style="color: var(--primary-lime); margin-bottom: 20px;">MESSAGE</h3>
                <p id="msgModalText" style="margin-bottom: 30px; font-size: 1.1rem;">Message goes here</p>
                <button class="btn btn-primary" onclick="closeMessageModal()" style="width: 100%;">OK</button>
            </div>
        </div>
    `;

    const h = document.querySelector('header');
    if (h) h.innerHTML = headerHTML;
    const f = document.querySelector('footer');
    if (f) f.innerHTML = footerHTML;

    const menuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.getElementById('navLinks');
    if (menuBtn && navLinks) {
        menuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }
}

function initLogoBounce() {
    // Wait for nav injection
    setTimeout(() => {
        const logo = document.querySelector('.logo');
        if (!logo) return;

        const icon = logo.querySelector('i');
        if (!icon) return;

        let isBouncing = false;
        let animationId;
        let clone;
        let x, y, dx, dy;
        const speed = 3;

        logo.addEventListener('mouseenter', () => {
            if (isBouncing) return;
            isBouncing = true;

            // Create clone of ONLY the icon
            const rect = icon.getBoundingClientRect();
            clone = icon.cloneNode(true);

            // Style clone
            clone.style.position = 'fixed';
            clone.style.left = `${rect.left}px`;
            clone.style.top = `${rect.top}px`;
            clone.style.width = `${rect.width}px`;
            clone.style.height = `${rect.height}px`;
            clone.style.zIndex = '10000';
            clone.style.margin = '0';
            clone.style.pointerEvents = 'none'; // Let clicks pass through (or handle stop globally)
            clone.classList.add('bouncing-logo');

            // Match current color
            const computedStyle = window.getComputedStyle(icon);
            clone.style.color = computedStyle.color;
            clone.style.fontSize = computedStyle.fontSize;
            clone.style.display = 'flex';
            clone.style.alignItems = 'center';
            clone.style.justifyContent = 'center';

            document.body.appendChild(clone);

            // Hide original icon ONLY
            icon.style.opacity = '0';

            // Initial Velocity
            x = rect.left;
            y = rect.top;
            dx = (Math.random() - 0.5) * speed * 2 || speed;
            dy = (Math.random() - 0.5) * speed * 2 || speed;

            animate();

            // Auto-stop after 5 seconds
            setTimeout(stopBounce, 5000);
        });

        function animate() {
            if (!isBouncing) return;

            const rect = clone.getBoundingClientRect();
            const winW = window.innerWidth;
            const winH = window.innerHeight;

            // Bounce check
            if (x + rect.width >= winW || x <= 0) {
                dx = -dx;
                changeColor();
            }
            if (y + rect.height >= winH || y <= 0) {
                dy = -dy;
                changeColor();
            }

            x += dx;
            y += dy;

            clone.style.left = `${x}px`;
            clone.style.top = `${y}px`;

            animationId = requestAnimationFrame(animate);
        }

        function changeColor() {
            // Random Neon Colors
            const colors = ['#D4FF33', '#9D4EDD', '#FF0099', '#00F0FF', '#FFFFFF'];
            const color = colors[Math.floor(Math.random() * colors.length)];
            clone.style.color = color;
        }

        // Global listeners to stop bounce
        const stopHandler = (e) => {
            if (!isBouncing) return;
            if (e.type === 'keydown' && e.key === 'Escape') {
                stopBounce();
            } else if (e.type === 'click') {
                stopBounce();
            }
        };

        document.addEventListener('keydown', stopHandler);
        document.addEventListener('click', stopHandler);

        function stopBounce() {
            if (!isBouncing) return;
            isBouncing = false;
            cancelAnimationFrame(animationId);

            // Animate back to original position (ICON position)
            const originalRect = icon.getBoundingClientRect();

            clone.style.transition = 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            clone.style.left = `${originalRect.left}px`;
            clone.style.top = `${originalRect.top}px`;
            clone.style.color = ''; // Reset color

            // Clean up after animation
            setTimeout(() => {
                if (clone && clone.parentNode) clone.remove();
                icon.style.opacity = '1'; // Show original icon
                document.removeEventListener('keydown', stopHandler);
                document.removeEventListener('click', stopHandler);
            }, 500);
        }
    });
}

// --- Verification Modal Logic ---
function openVerificationModal(company) {
    const modal = document.getElementById('verificationModal');
    if (!modal) return;

    const content = document.getElementById('verificationContent');
    const verifyBtn = document.getElementById('verifyActionBtn');

    let docsHtml = '<p style="color: #888;">No documents provided.</p>';
    if (company.documents && company.documents.length > 0) {
        docsHtml = '<ul style="list-style: none; padding: 0;">';
        company.documents.forEach(doc => {
            docsHtml += `
                <li style="margin-bottom: 10px; padding: 10px; background: rgba(255,255,255,0.05); border-radius: 5px; display: flex; justify-content: space-between; align-items: center;">
                    <span><i class="fas fa-file-alt" style="margin-right: 10px; color: var(--cyan);"></i> ${doc.title}</span>
                    <a href="${doc.url}" target="_blank" class="btn btn-outline" style="padding: 5px 10px; font-size: 0.8rem;">OPEN</a>
                </li>
            `;
        });
        docsHtml += '</ul>';
    }

    content.innerHTML = `
        <div style="text-align: left;">
            <h4 style="border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 15px;">${company.companyName}</h4>
            <p><strong>Email:</strong> ${company.user?.email || 'N/A'}</p>
            <p><strong>Website:</strong> ${company.website ? `<a href="${company.website}" target="_blank" style="color: var(--primary-lime);">${company.website}</a>` : 'N/A'}</p>
            <p><strong>Location:</strong> ${company.location || 'N/A'}</p>
            <p><strong>Description:</strong> ${company.description || 'N/A'}</p>
            
            <h5 style="margin-top: 20px; margin-bottom: 10px; color: var(--cyan);">Submitted Documents</h5>
            ${docsHtml}
        </div>
    `;

    verifyBtn.onclick = () => {
        verifyCompany(company._id);
        closeVerificationModal();
    };
    modal.classList.add('active');
}


function closeVerificationModal() {
    const modal = document.getElementById('verificationModal');
    if (modal) modal.classList.remove('active');
}

// --- Message Modal Logic ---
let messageModalCallback = null;

function showMessageModal(title, message, callback) {
    const modal = document.getElementById('messageModal');
    if (modal) {
        document.getElementById('msgModalTitle').innerText = title;
        document.getElementById('msgModalText').innerText = message;
        messageModalCallback = callback;
        modal.classList.add('active');
    } else {
        // Fallback
        alert(message);
        if (callback) callback();
    }
}

function closeMessageModal() {
    const modal = document.getElementById('messageModal');
    if (modal) modal.classList.remove('active');
    if (messageModalCallback) {
        messageModalCallback();
        messageModalCallback = null;
    }
}
