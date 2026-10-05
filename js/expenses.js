document.addEventListener("DOMContentLoaded", () => {
    if (!window.location.pathname.includes("expenses.html")) return;
    loadExpensesData();
    setupFilters();
});

function loadExpensesData() {
    const user = getCurrentUser();
    if (!user) return;
    applyFilters();
}

function renderExpensesTable(expenses) {
    const tableBody = document.querySelector(".data-table tbody");
    if (!tableBody) return;

    tableBody.innerHTML = "";

    if (expenses.length === 0) {
        tableBody.innerHTML =
            '<tr><td colspan="6" style="text-align:center; padding:20px; color: var(--color-text-muted);">No expense records found. Add one!</td></tr>';
        return;
    }

    const sorted = expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

    sorted.forEach((exp) => {
        const dateStr = formatDate(exp.date);
        const amountStr = "-" + formatCurrency(exp.amount);
        const htmlRow = `
            <tr>
                <td>${dateStr}</td>
                <td>
                    <div class="font-medium text-main">${exp.title}</div>
                    <div class="text-xs text-muted">User Entered</div>
                </td>
                <td>${exp.category || "General"}</td>
                <td><i class="fa-solid fa-money-bill"></i> Cash / Manual</td>
                <td style="text-align: right; font-weight: 600; color: var(--color-danger);">${amountStr}</td>
                <td style="text-align: center;">
                    <button class="action-btn" onclick="deleteExpenseTransaction('${exp.id}')" style="display:inline-flex; width:32px; height:32px; margin: 0 auto;"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
        tableBody.insertAdjacentHTML("beforeend", htmlRow);
    });
}

window.deleteExpenseTransaction = function (id) {
    if (confirm("Are you sure you want to delete this expense record?")) {
        const user = getCurrentUser();
        if (!user) return;
        user.transactions = user.transactions.filter((tx) => tx.id !== id);
        updateUser(user);
        loadExpensesData();
    }
};

function setupFilters() {
    const sourceFilter = document.getElementById("filter-source");
    const timeFilter = document.getElementById("filter-time");
    if (!sourceFilter || !timeFilter) return;

    sourceFilter.addEventListener("change", applyFilters);
    timeFilter.addEventListener("change", applyFilters);
}

function applyFilters() {
    const user = getCurrentUser();
    if (!user) return;

    const sourceFilterEl = document.getElementById("filter-source");
    const timeFilterEl = document.getElementById("filter-time");
    const sourceValue = sourceFilterEl ? sourceFilterEl.value : "All Categories";
    const timeValue = timeFilterEl ? timeFilterEl.value : "All Time";

    let filtered = user.transactions.filter((tx) => tx.type === "expense");

    if (sourceValue !== "All Categories") {
        filtered = filtered.filter(
            (tx) => (tx.category || "General") === sourceValue
        );
    }

    const today = new Date();

    if (timeValue !== "All Time") {
        filtered = filtered.filter((tx) => {
            const txDate = new Date(tx.date);
            if (timeValue === "This Month") {
                return (
                    txDate.getMonth() === today.getMonth() &&
                    txDate.getFullYear() === today.getFullYear()
                );
            }
            if (timeValue === "Last Month") {
                const lastMonth = today.getMonth() === 0 ? 11 : today.getMonth() - 1;
                const yearShift =
                    today.getMonth() === 0
                        ? today.getFullYear() - 1
                        : today.getFullYear();
                return (
                    txDate.getMonth() === lastMonth && txDate.getFullYear() === yearShift
                );
            }
            if (timeValue === "This Year") {
                return txDate.getFullYear() === today.getFullYear();
            }
            return true;
        });
    }

    let dynamicTotal = 0;
    filtered.forEach((exp) => (dynamicTotal += exp.amount));

    let dynamicHighest = "No Spending";
    if (filtered.length > 0) {
        const categoryMap = {};
        filtered.forEach((exp) => {
            const cat = exp.category || "General";
            categoryMap[cat] = (categoryMap[cat] || 0) + exp.amount;
        });
        let maxAmt = 0;
        for (const [cat, amt] of Object.entries(categoryMap)) {
            if (amt > maxAmt) {
                maxAmt = amt;
                dynamicHighest = cat;
            }
        }
    }

    const totalEl = document.getElementById("expense-total");
    const catEl = document.getElementById("expense-highest-category");

    if (totalEl) totalEl.textContent = formatCurrency(dynamicTotal);
    if (catEl) catEl.textContent = dynamicHighest;

    renderExpensesTable(filtered);
}
