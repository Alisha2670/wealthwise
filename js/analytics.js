document.addEventListener("DOMContentLoaded", () => {
    const isAnalyticsPage = window.location.pathname.includes("analytics.html");
    if (!isAnalyticsPage) return;
    loadAnalyticsData();
});

function loadAnalyticsData() {
    const user = getCurrentUser();
    if (!user) return;

    const transactions = Array.isArray(user.transactions) ? user.transactions : [];

    renderDonutChart(transactions);
    renderTopMerchants(transactions);
    renderCurrentMonthOverview(transactions);
}

function renderDonutChart(transactions) {
    const expenses = (transactions || []).filter((tx) => tx && tx.type === "expense");

    let totalSpent = 0;
    const categoryTotals = {};

    expenses.forEach((exp) => {
        const amt = Number(exp.amount) || 0;
        const cat = (exp.category && exp.category.trim()) || "Other";
        totalSpent += amt;
        categoryTotals[cat] = (categoryTotals[cat] || 0) + amt;
    });

    const donutHoleValue = document.querySelector(".donut-hole .metric-value");
    const donutEl = document.querySelector(".donut-chart");
    const legendContainer = document.querySelector(".legend-list");

    if (donutHoleValue) {
        donutHoleValue.textContent = formatCurrency(totalSpent);
    }

    if (totalSpent <= 0) {
        if (donutEl) {
            donutEl.style.background = "var(--color-border)";
        }
        if (legendContainer) {
            legendContainer.innerHTML = `
                <div style="text-align: center; color: var(--color-text-muted); font-size: var(--font-size-sm); padding: 16px 0;">
                    No expense records found yet.
                </div>
            `;
        }
        return;
    }

    const sortedCategories = Object.entries(categoryTotals).sort(
        (a, b) => b[1] - a[1]
    );

    const colors = [
        "var(--color-primary)",
        "var(--color-warning)",
        "var(--color-danger)",
        "#8b5cf6",
        "#0ea5e9",
        "#10b981",
        "#f59e0b"
    ];

    let conicString = "";
    let currentDegree = 0;

    if (legendContainer) {
        legendContainer.innerHTML = "";
    }

    sortedCategories.forEach((cat, index) => {
        const name = cat[0];
        const amount = cat[1];
        const percentage = (amount / totalSpent) * 100;
        const startPoint = currentDegree;
        const endPoint = currentDegree + percentage;
        const color = colors[index % colors.length];

        conicString += `${color} ${startPoint.toFixed(1)}% ${endPoint.toFixed(1)}%, `;
        currentDegree = endPoint;

        if (legendContainer) {
            const legendHtml = `
                <div class="legend-item">
                    <div><span class="legend-color" style="background: ${color};"></span> ${name}</div>
                    <span class="font-medium text-main">${Math.round(percentage)}% (${formatCurrency(amount)})</span>
                </div>
            `;
            legendContainer.insertAdjacentHTML("beforeend", legendHtml);
        }
    });

    conicString = conicString.slice(0, -2);

    if (donutEl) {
        donutEl.style.background = `conic-gradient(${conicString})`;
    }
}

function renderTopMerchants(transactions) {
    const expenses = (transactions || []).filter((tx) => tx && tx.type === "expense");
    let totalSpent = 0;
    const merchants = {};

    expenses.forEach((exp) => {
        const amt = Number(exp.amount) || 0;
        const name = (exp.title && exp.title.trim()) || "Unknown Merchant";
        totalSpent += amt;
        merchants[name] = (merchants[name] || 0) + amt;
    });

    const sorted = Object.entries(merchants)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);

    const container = document.querySelector(
        ".grid.grid-cols-2 .card:nth-child(2) .flex-col"
    );
    if (!container) return;

    container.innerHTML = "";

    if (sorted.length === 0 || totalSpent <= 0) {
        container.innerHTML = `
            <div class="text-muted text-center py-4" style="font-size: var(--font-size-sm);">
                No merchant data found yet.
            </div>
        `;
        return;
    }

    const colors = [
        "var(--color-primary)",
        "var(--color-warning)",
        "#0ea5e9",
        "#8b5cf6",
        "#64748b"
    ];

    sorted.forEach((merchant, index) => {
        const name = merchant[0];
        const amount = merchant[1];
        let percent = (amount / totalSpent) * 100;
        if (percent > 100) percent = 100;
        const color = colors[index % colors.length];

        const html = `
            <div>
                <div class="flex justify-between items-center text-sm mb-2">
                    <div class="flex items-center gap-3">
                        <i class="fa-solid fa-store text-muted" style="width: 20px; text-align: center;"></i>
                        <span class="font-medium text-main">${name}</span>
                    </div>
                    <span class="font-medium text-main">${formatCurrency(amount)}</span>
                </div>
                <div class="progress-container" style="margin: 0; background: var(--color-bg-body);">
                    <div class="progress-bar" style="width: ${percent.toFixed(1)}%; background: ${color};"></div>
                </div>
            </div>
        `;
        container.insertAdjacentHTML("beforeend", html);
    });
}

function renderCurrentMonthOverview(transactions) {
    let currentIncome = 0;
    let currentExpense = 0;
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const txList = transactions || [];

    txList.forEach((tx) => {
        if (!tx || !tx.date) return;
        const txDate = new Date(tx.date);
        if (isNaN(txDate.getTime())) return;

        if (
            txDate.getMonth() === currentMonth &&
            txDate.getFullYear() === currentYear
        ) {
            const amt = Number(tx.amount) || 0;
            if (tx.type === "income") currentIncome += amt;
            if (tx.type === "expense") currentExpense += amt;
        }
    });

    const incomeLabel = document.getElementById("analytics-income-label");
    const expenseLabel = document.getElementById("analytics-expense-label");
    if (incomeLabel) incomeLabel.textContent = formatCurrency(currentIncome);
    if (expenseLabel) expenseLabel.textContent = formatCurrency(currentExpense);

    const maxVal = Math.max(currentIncome, currentExpense, 100);
    const incomePct = (currentIncome / maxVal) * 100;
    const expensePct = (currentExpense / maxVal) * 100;

    const incomeBar = document.getElementById("analytics-income-bar");
    const expenseBar = document.getElementById("analytics-expense-bar");

    setTimeout(() => {
        if (incomeBar) incomeBar.style.width = `${incomePct.toFixed(1)}%`;
        if (expenseBar) expenseBar.style.width = `${expensePct.toFixed(1)}%`;
    }, 50);
}