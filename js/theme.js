document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    setupThemeToggles();
});

// Read saved theme preference from storage and apply dark/light data attribute to document root
function initTheme() {
    const savedTheme = localStorage.getItem("wealthwisep_theme");
    if (savedTheme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        updateTogglesUI(true);
    } else {
        document.documentElement.setAttribute("data-theme", "light");
        updateTogglesUI(false);
    }
}

// Bind click and change events to navbar theme buttons and settings toggle switch
function setupThemeToggles() {
    const moonBtns = document.querySelectorAll(
        ".action-btn .fa-moon, .action-btn .fa-sun"
    );
    moonBtns.forEach((icon) => {
        const btn = icon.closest(".action-btn");
        if (btn) {
            btn.addEventListener("click", toggleTheme);
        }
    });

    const settingsToggles = document.querySelectorAll(".settings-toggle-row");
    settingsToggles.forEach((row) => {
        const title = row.querySelector("h4");
        if (title && title.textContent === "Dark Mode") {
            const checkbox = row.querySelector('input[type="checkbox"]');
            if (checkbox) {
                checkbox.addEventListener("change", toggleTheme);
            }
        }
    });
}

// Switch theme state between light and dark, persist to localStorage, and update UI icons
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    if (currentTheme === "dark") {
        document.documentElement.setAttribute("data-theme", "light");
        localStorage.setItem("wealthwisep_theme", "light");
        updateTogglesUI(false);
    } else {
        document.documentElement.setAttribute("data-theme", "dark");
        localStorage.setItem("wealthwisep_theme", "dark");
        updateTogglesUI(true);
    }
}

// Synchronize moon/sun FontAwesome icons and checkbox states with active theme
function updateTogglesUI(isDark) {
    const icons = document.querySelectorAll(
        ".action-btn .fa-moon, .action-btn .fa-sun"
    );
    icons.forEach((icon) => {
        if (isDark) {
            icon.classList.remove("fa-moon");
            icon.classList.add("fa-sun");
        } else {
            icon.classList.remove("fa-sun");
            icon.classList.add("fa-moon");
        }
    });

    const settingsToggles = document.querySelectorAll(".settings-toggle-row");
    settingsToggles.forEach((row) => {
        const title = row.querySelector("h4");
        if (title && title.textContent === "Dark Mode") {
            const checkbox = row.querySelector('input[type="checkbox"]');
            if (checkbox) {
                checkbox.checked = isDark;
            }
        }
    });
}
