// Storage keys for persisting user accounts and active session in HTML5 localStorage
const USERS_KEY = "wealthwisep_users";
const CURRENT_USER_KEY = "wealthwisep_currentUser";

// Retrieve and parse all registered user accounts from localStorage
function getUsers() {
    const usersText = localStorage.getItem(USERS_KEY);
    if (!usersText) {
        return [];
    }
    return JSON.parse(usersText);
}

// Serialize and persist the complete array of registered accounts
function saveUsers(users) {
    const usersText = JSON.stringify(users);
    localStorage.setItem(USERS_KEY, usersText);
}

// Retrieve the currently active user session object
function getCurrentUser() {
    const currentUserText = localStorage.getItem(CURRENT_USER_KEY);
    if (!currentUserText) {
        return null;
    }
    return JSON.parse(currentUserText);
}

// Synchronize changes to active session and update the corresponding record in main storage
function updateUser(updatedUser) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    const users = getUsers();
    const index = users.findIndex((u) => u.email === updatedUser.email);
    if (index !== -1) {
        users[index] = updatedUser;
        saveUsers(users);
    }
}
