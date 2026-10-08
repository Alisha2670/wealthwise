document.addEventListener("DOMContentLoaded", () => {
    const isSettingsPage = window.location.pathname.includes("settings.html");
    if (!isSettingsPage) return;
    loadProfileData();
    setupPasswordButton();
    setupSignOut();
    setupTabs();
});

function loadProfileData() {
    const user = getCurrentUser();
    if (!user) return;
    const inputs = document.querySelectorAll(
        ".settings-form-group .form-control"
    );
    if (inputs.length >= 3) {
        const nameParts = (user.name || "").split(" ");
        const firstName = nameParts[0] || "";
        const lastName = nameParts.slice(1).join(" ") || "";
        inputs[0].value = firstName;
        inputs[1].value = lastName;
        inputs[2].value = user.email || "";
    }
}

function setupPasswordButton() {
    const savePasswordBtn = document.getElementById("save-password-btn");
    if (!savePasswordBtn) return;

    savePasswordBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const newPass = document.getElementById("input-new-password").value;
        const confirmPass = document.getElementById("input-confirm-password").value;
        if (!newPass || !confirmPass) {
            alert("Please fill out both password fields!");
            return;
        }
        if (newPass !== confirmPass) {
            alert("Passwords do not match!");
            return;
        }
        const user = getCurrentUser();
        user.password = newPass;
        updateUser(user);
        alert("Password successfully changed!");
        document.getElementById("input-new-password").value = "";
        document.getElementById("input-confirm-password").value = "";
    });
}

function setupSignOut() {
    const signOutBtn = document.querySelector(".settings-nav-item.text-danger");
    if (!signOutBtn) return;

    signOutBtn.addEventListener("click", () => {
        localStorage.removeItem("wealthwisep_currentUser");
        window.location.href = "index.html";
    });
}

function setupTabs() {
    const navItems = document.querySelectorAll(
        ".settings-nav-item:not(.text-danger)"
    );
    const sectionProfile = document.getElementById("section-profile");
    const sectionPassword = document.getElementById("section-password");
    if (navItems.length < 2 || !sectionProfile || !sectionPassword) return;

    navItems[0].addEventListener("click", () => {
        navItems[0].classList.add("active");
        navItems[1].classList.remove("active");
        sectionProfile.style.display = "block";
        sectionPassword.style.display = "none";
    });

    navItems[1].addEventListener("click", () => {
        navItems[1].classList.add("active");
        navItems[0].classList.remove("active");
        sectionPassword.style.display = "block";
        sectionProfile.style.display = "none";
    });
}
