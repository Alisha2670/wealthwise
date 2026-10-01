function formatCurrency(amount) {
    if (isNaN(amount) || amount === null) {
        amount = 0;
    }
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR"
    }).format(amount);
}

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

function generateId() {
    return Math.random().toString(36).substring(2, 9);
}
