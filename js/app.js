// Main App Controller

// State
let currentPage = 'dashboard';
let currentUser = null;

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    initLogin();
    initSidebar();
    initNavigation();
    initTopbar();
    setCurrentDate();
});

// Login system
function initLogin() {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const role = document.getElementById('loginRole').value;
        login(email, password, role);
    });
}

function demoLogin(role) {
    // Auto-fill and submit for demo
    const user = AppData.users.find(u => u.role === role);
    if (user) {
        document.getElementById('loginEmail').value = user.email;
        document.getElementById('loginPassword').value = 'demo123';
        document.getElementById('loginRole').value = role;
        login(user.email, 'demo123', role);
    }
}

function login(email, password, role) {
    const user = AppData.users.find(u => u.role === role);
    if (user) {
        currentUser = user;
        AppData.currentUser = user;
        // Store in localStorage
        localStorage.setItem('poseidon_user', JSON.stringify(user));
        showApp();
        showToast('مرحباً ' + user.name, 'success');
    }
}

function logout() {
    currentUser = null;
    AppData.currentUser = null;
    localStorage.removeItem('poseidon_user');
    document.getElementById('app').classList.add('hidden');
    document.getElementById('loginScreen').classList.remove('hidden');
}

function showApp() {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    updateUserUI();
    filterNavigation();
    navigateTo('dashboard');
}

function updateUserUI() {
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userRole').textContent = getRoleLabel(currentUser.role);
    document.getElementById('userAvatar').textContent = currentUser.name.charAt(0);
}

// Sidebar
function initSidebar() {
    document.getElementById('menuToggle').addEventListener('click', function() {
        document.getElementById('sidebar').classList.toggle('open');
    });
    document.getElementById('sidebarToggle').addEventListener('click', function() {
        document.getElementById('sidebar').classList.remove('open');
    });
    // Close sidebar on outside click (mobile)
    document.addEventListener('click', function(e) {
        const sidebar = document.getElementById('sidebar');
        const menuToggle = document.getElementById('menuToggle');
        if (window.innerWidth <= 992 && sidebar.classList.contains('open') && 
            !sidebar.contains(e.target) && e.target !== menuToggle) {
            sidebar.classList.remove('open');
        }
    });
}

// Navigation
function initNavigation() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.dataset.page;
            navigateTo(page);
        });
    });
}

function filterNavigation() {
    const role = currentUser.role;
    document.querySelectorAll('.nav-link').forEach(link => {
        const roles = link.dataset.roles;
        if (roles && !roles.split(',').includes(role)) {
            link.style.display = 'none';
        } else {
            link.style.display = '';
        }
    });
    // Also hide nav sections that have no visible links
    document.querySelectorAll('.nav-section').forEach(section => {
        const visibleLinks = section.querySelectorAll('.nav-link[style=""], .nav-link:not([style])');
        const hiddenLinks = section.querySelectorAll('.nav-link[style*="display: none"]');
        // Check if all links in section are hidden
        const allLinks = section.querySelectorAll('.nav-link');
        let allHidden = true;
        allLinks.forEach(l => {
            if (l.style.display !== 'none') allHidden = false;
        });
        if (allHidden && section.querySelector('.nav-section-title')) {
            section.style.display = 'none';
        }
    });
}

function navigateTo(page) {
    currentPage = page;
    // Update active nav
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    const activeLink = document.querySelector(`.nav-link[data-page="${page}"]`);
    if (activeLink) activeLink.classList.add('active');
    
    // Show/hide pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    const pageEl = document.getElementById('page-' + page);
    if (pageEl) pageEl.classList.add('active');
    
    // Update page title
    const titles = {
        dashboard: 'لوحة التحكم',
        bookings: 'الحجوزات',
        import: 'استيراد Excel',
        trips: 'الرحلات',
        transfers: 'شيتات النقل',
        manifest: 'المانيفست',
        tracking: 'التتبع المباشر',
        driver: 'شيتي',
        audit: 'سجل التدقيق',
        settings: 'الإعدادات'
    };
    document.getElementById('pageTitle').textContent = titles[page] || page;
    
    // Initialize page data
    if (typeof window['init_' + page] === 'function') {
        window['init_' + page]();
    }
    
    // Close sidebar on mobile
    if (window.innerWidth <= 992) {
        document.getElementById('sidebar').classList.remove('open');
    }
}

// Topbar
function initTopbar() {
    document.getElementById('notificationBell').addEventListener('click', function(e) {
        e.stopPropagation();
        document.getElementById('notificationPanel').classList.toggle('hidden');
        renderNotifications();
    });
    document.addEventListener('click', function(e) {
        if (!e.target.closest('#notificationPanel') && !e.target.closest('#notificationBell')) {
            document.getElementById('notificationPanel').classList.add('hidden');
        }
    });
}

function setCurrentDate() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDate').textContent = now.toLocaleDateString('ar-EG', options);
}

// Notifications
function renderNotifications() {
    const list = document.getElementById('notificationList');
    const notifications = AppData.notifications || [];
    list.innerHTML = notifications.map(n => `
        <div class="notification-item ${n.read ? '' : 'unread'}">
            <div class="notification-icon">${n.icon}</div>
            <div class="notification-content">
                <p>${n.message}</p>
                <span class="notification-time">${getRelativeTime(n.time)}</span>
            </div>
        </div>
    `).join('');
    document.getElementById('notificationCount').textContent = notifications.filter(n => !n.read).length;
}

function clearNotifications() {
    AppData.notifications = [];
    renderNotifications();
}

// Check for stored login
(function checkStoredLogin() {
    const stored = localStorage.getItem('poseidon_user');
    if (stored) {
        try {
            currentUser = JSON.parse(stored);
            AppData.currentUser = currentUser;
            showApp();
        } catch(e) {
            localStorage.removeItem('poseidon_user');
        }
    }
})();
