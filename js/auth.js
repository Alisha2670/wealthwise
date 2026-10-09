document.addEventListener("DOMContentLoaded", () => {
    setupAuthForms();
    setupLogoutButton();
});
// Attach submit listeners to authentication forms and route to login or signup handler
function setupAuthForms() {
    const authForm = document.querySelector(".auth-form");
    if (!authForm) return;

    authForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const isSignup = window.location.pathname.includes("signup.html");
        if (isSignup) {
            handleSignup();
        } else {
            handleLogin();
        }
    });
}

// Validate registration input, enforce unique email constraint, and initialize empty ledger
function handleSignup() {
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    if (!nameInput) return;

    const newUser = {
        id: generateId(),
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        password: passwordInput.value,
        currency: "INR",
        transactions: [],
        budgets: [],
        tasks: []
    };

    const users = getUsers();
    const emailExists = users.some((u) => u.email === newUser.email);
    if (emailExists) {
        alert("An account with this email already exists!");
        return;
    }

    users.push(newUser);
    saveUsers(users);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    window.location.href = "dashboard.html";
}

// Authenticate user credentials against stored accounts and initialize active session
function handleLogin() {
    const emailValue = document.getElementById("email").value.trim();
    const passwordValue = document.getElementById("password").value;
    const users = getUsers();
    const validUser = users.find(
        (u) => u.email === emailValue && u.password === passwordValue
    );

    if (validUser) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(validUser));
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid email or password. Please try again.");
    }
}

// Terminate active user session by clearing storage and redirecting to landing page
function setupLogoutButton() {
    const logoutBtn = document.getElementById("logout-btn");
    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        localStorage.removeItem(CURRENT_USER_KEY);
        window.location.href = "index.html";
    });
}
