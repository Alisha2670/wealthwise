document.addEventListener("DOMContentLoaded", () => {
    initApp();
});

// App bootstrapper: enforces route protection and initializes global layout components
function initApp() {
    checkAuth();
    setupGlobalUI();
}

// Route guard: prevents unauthenticated access to private views and redirects active users from landing
function checkAuth() {
    const user = getCurrentUser();
    const currentPath = window.location.pathname;
    const isPublicPage =
        currentPath.endsWith("index.html") || currentPath === "/";

    if (!user && !isPublicPage) {
        window.location.href = "index.html";
    } else if (user && isPublicPage) {
        window.location.href = "dashboard.html";
    }
}

// Manage mobile sidebar drawer toggling and trigger profile badge synchronization
function setupGlobalUI() {
    const sidebar = document.querySelector(".sidebar");
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const closeSidebarBtn = document.getElementById("close-sidebar-btn");

    if (!sidebar) {
        renderUserProfile();
        return;
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener("click", (e) => {
            e.preventDefault();
            e.stopPropagation();
            sidebar.classList.add("active");
        });
    }

    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener("click", () => {
            sidebar.classList.remove("active");
        });
    }

    renderUserProfile();
}

// Compute user initials and populate avatar, name, and email elements across navigation
function renderUserProfile() {
    const user = getCurrentUser();
    if (!user) return;

    const nameEls = document.querySelectorAll(".user-name");
    const emailEls = document.querySelectorAll(".user-email");
    const avatarEls = document.querySelectorAll(".user-avatar, .avatar-preview");
    const initials = user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

    nameEls.forEach((el) => (el.textContent = user.name));
    emailEls.forEach((el) => (el.textContent = user.email));
    avatarEls.forEach((el) => {
        el.textContent = initials;
        if (el.classList.contains("user-avatar")) {
            el.style.cursor = "pointer";
            el.addEventListener(
                "click",
                () => (window.location.href = "settings.html")
            );
        }
    });
}
