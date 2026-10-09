document.addEventListener("DOMContentLoaded", () => {
    if (!window.location.pathname.includes("income.html")) return;
    loadIncomeData();
    setupFilters();
});

// Load and apply active source and time filters to income ledger
function loadIncomeData() {
    const user = getCurrentUser();
    if (!user) return;
    applyFilters();
}

// Populate the income ledger table with cleared earnings and delete action buttons
function renderIncomeTable(incomes) {
    const tableBody = document.querySelector(".data-table tbody");
    if (!tableBody) return;

    tableBody.innerHTML = "";

    if (incomes.length === 0) {
        tableBody.innerHTML =
            '<tr><td colspan="6" style="text-align:center; padding:20px; color: var(--color-text-muted);">No income records found. Add one above!</td></tr>';
        return;
    }

    const sorted = incomes.sort((a, b) => new Date(b.date) - new Date(a.date));

    sorted.forEach((inc) => {
        const dateStr = formatDate(inc.date);
        const amountStr = "+" + formatCurrency(inc.amount);
        const htmlRow = `
            <tr>
                <td>${dateStr}</td>
                <td>
                    <div class="font-medium text-main">${inc.title}</div>
                    <div class="text-xs text-muted">User Entered</div>
                </td>
                <td>${inc.category || "General"}</td>
                <td><span class="status-pill status-success">Cleared</span></td>
                <td style="text-align: right; font-weight: 600; color: var(--color-success);">${amountStr}</td>
                <td style="text-align: center;">
                    <button class="action-btn" onclick="deleteIncomeTransaction('${inc.id}')" style="display:inline-flex; width:32px; height:32px; margin: 0 auto;"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>
        `;
        tableBody.insertAdjacentHTML("beforeend", htmlRow);
    });
}

// Prompt confirmation, delete income record by ID, and auto-recalculate summary metrics
window.deleteIncomeTransaction = function (id) {
    if (confirm("Are you sure you want to delete this income record?")) {
        const user = getCurrentUser();
        if (!user) return;
        user.transactions = user.transactions.filter((tx) => tx.id !== id);
        updateUser(user);
        loadIncomeData();
    }
};

function setupFilters() {
    const sourceFilter = document.getElementById("filter-source");
    const timeFilter = document.getElementById("filter-time");
    if (!sourceFilter || !timeFilter) return;

    sourceFilter.addEventListener("change", applyFilters);
    timeFilter.addEventListener("change", applyFilters);
}

// Filter inflows by category and date range (Month, Year, All Time) and compute dynamic totals
function applyFilters() {
    const user = getCurrentUser();
    if (!user) return;

    const sourceFilterEl = document.getElementById("filter-source");
    const timeFilterEl = document.getElementById("filter-time");
    const sourceValue = sourceFilterEl ? sourceFilterEl.value : "All Sources";
    const timeValue = timeFilterEl ? timeFilterEl.value : "All Time";

    let filteredIncomes = user.transactions.filter((tx) => tx.type === "income");

    if (sourceValue !== "All Sources") {
        filteredIncomes = filteredIncomes.filter(
            (tx) => (tx.category || "General") === sourceValue
        );
    }

    const today = new Date();

    if (timeValue !== "All Time") {
        filteredIncomes = filteredIncomes.filter((tx) => {
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
    filteredIncomes.forEach((inc) => (dynamicTotal += inc.amount));

    let dynamicHighest = "No Income";
    if (filteredIncomes.length > 0) {
        const categoryMap = {};
        filteredIncomes.forEach((inc) => {
            const cat = inc.category || "General";
            categoryMap[cat] = (categoryMap[cat] || 0) + inc.amount;
        });
        let maxAmt = 0;
        for (const [cat, amt] of Object.entries(categoryMap)) {
            if (amt > maxAmt) {
                maxAmt = amt;
                dynamicHighest = cat;
            }
        }
    }

    const totalEl = document.getElementById("total-income-value");
    const catEl = document.getElementById("income-highest-category");

    if (totalEl) totalEl.textContent = formatCurrency(dynamicTotal);
    if (catEl) catEl.textContent = dynamicHighest;

    renderIncomeTable(filteredIncomes);
}
