const USERS_KEY = "wealthwisep_users";
const CURRENT_USER_KEY = "wealthwisep_currentUser";

function getUsers() {
    const usersText = localStorage.getItem(USERS_KEY);
    if (!usersText) {
        return [];
    }
    return JSON.parse(usersText);
}

function saveUsers(users) {
    const usersText = JSON.stringify(users);
    localStorage.setItem(USERS_KEY, usersText);
}

function getCurrentUser() {
    const currentUserText = localStorage.getItem(CURRENT_USER_KEY);
    if (!currentUserText) {
        return null;
    }
    return JSON.parse(currentUserText);
}

function updateUser(updatedUser) {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    const users = getUsers();
    const index = users.findIndex((u) => u.email === updatedUser.email);
    if (index !== -1) {
        users[index] = updatedUser;
        saveUsers(users);
    }
}
