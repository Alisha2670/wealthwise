// Format numeric values to Indian Rupee (INR ₹) standard using native Intl API
function formatCurrency(amount) {
    if (isNaN(amount) || amount === null) {
        amount = 0;
    }
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR"
    }).format(amount);
}
// Convert standard date strings into human-readable format (e.g., 'Oct 15, 2026')

function formatDate(dateString) {
    if (!dateString) {
        return "N/A";
    }
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-IN", {
        month: "short",
        day: "numeric",
        year: "numeric"
    }).format(date);
}
// Generate a unique pseudo-random alphanumeric ID for transactions, budgets, and tasks
function generateId() {
    return Math.random().toString(36).substring(2, 9);
}
