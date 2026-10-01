document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    setupThemeToggles();
});

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
