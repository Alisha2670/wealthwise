document.addEventListener("DOMContentLoaded", () => {
    const dashboardContainer = document.querySelector(".dashboard-container");
    if (!dashboardContainer) return;
    loadDashboardData();
    setupTransactionModal();
    setupDashboardTasks();
});

// Compute real-time KPI metrics (Balance, Income, Expenses) and refresh dashboard feeds
function loadDashboardData() {
    const user = getCurrentUser();
    if (!user) return;

    const greetingEl = document.querySelector(".page-header p");
    if (greetingEl) {
        greetingEl.textContent = `Welcome back, ${user.name}! Here's your financial summary.`;
    }

    let totalIncome = 0;
    let totalExpenses = 0;
// Aggregate total inflows and outflows from user's transaction ledger
    if (user.transactions && user.transactions.length > 0) {
        user.transactions.forEach((tx) => {
            if (tx.type === "income") totalIncome += tx.amount;
            if (tx.type === "expense") totalExpenses += tx.amount;
        });
    }

    const totalBalance = totalIncome - totalExpenses;
    const metricCards = document.querySelectorAll(".metric-value");

    if (metricCards.length >= 3) {
        metricCards[0].textContent = formatCurrency(totalBalance);
        metricCards[1].textContent = formatCurrency(totalIncome);
        metricCards[2].textContent = formatCurrency(totalExpenses);
    }

    renderRecentTransactions(user.transactions);
    renderCashFlowChart(user.transactions);
}

// Sort transaction records newest-first and render the 4 most recent activity feed items
function renderRecentTransactions(transactions) {
    const listEl = document.querySelector(".transaction-list");
    if (!listEl) return;

    listEl.innerHTML = "";

    if (!transactions || transactions.length === 0) {
        listEl.innerHTML =
            '<div style="padding: 20px; text-align: center; color: var(--color-text-muted);">No recent transactions found.</div>';
        return;
    }

    const recent = transactions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 4);

    recent.forEach((tx) => {
        const isIncome = tx.type === "income";
        const amountClass = isIncome ? "positive" : "";
        const symbol = isIncome ? "+" : "-";
        const formattedAmount = symbol + formatCurrency(Math.abs(tx.amount));
        const formattedDate = formatDate(tx.date);

        const html = `
            <div class="transaction-item">
                <div class="tx-left">
                    <div class="tx-icon" ${isIncome ? 'style="color: var(--color-success); border-color: rgba(0,217,36,0.3); background: rgba(0,217,36,0.05);"' : ""}>
                        <i class="fa-solid fa-${isIncome ? "building-columns" : "cart-shopping"}"></i>
                    </div>
                    <div class="tx-details">
                        <h4>${tx.title}</h4>
                        <p>${formattedDate} • ${tx.category || "General"}</p>
                    </div>
                </div>
                <div class="tx-right">
                    <div class="tx-amount ${amountClass}">${formattedAmount}</div>
                    <div class="tx-status">Completed</div>
                </div>
            </div>
        `;

        listEl.insertAdjacentHTML("beforeend", html);
    });
}

// Build a rolling 5-month comparison projection and scale bar heights relative to peak income
function renderCashFlowChart(transactions) {
    const chart = document.getElementById("cashflow-chart");
    const labels = document.getElementById("cashflow-labels");
    if (!chart || !labels) return;

    chart.innerHTML = "";
    labels.innerHTML = "";

    const today = new Date();
    const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ];

    const monthBuckets = [];

    for (let i = 4; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        monthBuckets.push({
            year: d.getFullYear(),
            month: d.getMonth(),
            label: monthNames[d.getMonth()],
            totalIncome: 0,
            totalExpense: 0
        });
    }

    if (transactions && transactions.length > 0) {
        transactions.forEach((tx) => {
            const txDate = new Date(tx.date);
            const txYear = txDate.getFullYear();
            const txMonth = txDate.getMonth();

            const bucket = monthBuckets.find(
                (b) => b.year === txYear && b.month === txMonth
            );
            if (bucket) {
                if (tx.type === "income") bucket.totalIncome += tx.amount;
                if (tx.type === "expense") bucket.totalExpense += tx.amount;
            }
        });
    }

    const maxIncome = Math.max(...monthBuckets.map((b) => b.totalIncome), 1000);

    monthBuckets.forEach((bucket) => {
        const heightPct = (bucket.totalIncome / maxIncome) * 100;
        const bar = document.createElement("div");
        bar.className = "chart-bar";
        bar.style.height = `${heightPct}%`;
        bar.title = formatCurrency(bucket.totalIncome);

        if (
            bucket.month === today.getMonth() &&
            bucket.year === today.getFullYear()
        ) {
            bar.classList.add("active");
        }

        chart.appendChild(bar);

        const label = document.createElement("span");
        label.textContent = bucket.label;
        labels.appendChild(label);
    });
}

// Initialize modal controls and validate new transaction entries with auto-recalculation
function setupTransactionModal() {
    const addBtn = document.getElementById("add-tx-btn");
    const overlay = document.getElementById("tx-modal-overlay");
    const closeBtn = document.getElementById("close-tx-modal");
    const txForm = document.getElementById("add-tx-form");
    if (!addBtn || !overlay || !closeBtn || !txForm) return;

    addBtn.addEventListener("click", () => {
        overlay.classList.add("active");
        const today = new Date();
        const yyyy = today.getFullYear();
        const mm = String(today.getMonth() + 1).padStart(2, "0");
        const dd = String(today.getDate()).padStart(2, "0");
        document.getElementById("tx-date").value = `${yyyy}-${mm}-${dd}`;
    });

    closeBtn.addEventListener("click", () => {
        overlay.classList.remove("active");
        txForm.reset();
    });

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            overlay.classList.remove("active");
            txForm.reset();
        }
    });

    txForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = document.getElementById("tx-title").value.trim();
        const amount = parseFloat(document.getElementById("tx-amount").value);
        const type = document.getElementById("tx-type").value;
        const date = document.getElementById("tx-date").value;
        const category = document.getElementById("tx-category").value;

        const user = getCurrentUser();
        if (!user) return;

        const newTransaction = {
            id: generateId(),
            title: title,
            amount: amount,
            type: type,
            date: date,
            category: category
        };

        user.transactions.push(newTransaction);
        updateUser(user);

        overlay.classList.remove("active");
        txForm.reset();
        loadDashboardData();
    });
}

// Handle quick task creation and bind click events to toggle task completion status
function setupDashboardTasks() {
    const taskForm = document.getElementById("dash-task-form");
    if (!taskForm) return;

    const user = getCurrentUser();
    if (user) {
        if (!user.tasks) user.tasks = [];
        renderDashboardTasks(user);
    }

    taskForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = document.getElementById("dash-new-task");
        if (!input || !input.value.trim()) return;

        const activeUser = getCurrentUser();
        if (!activeUser) return;

        const newTask = {
            id: generateId(),
            title: input.value.trim(),
            completed: false,
            date: new Date().toISOString(),
            category: "General"
        };

        activeUser.tasks.push(newTask);
        updateUser(activeUser);
        input.value = "";
        renderDashboardTasks(activeUser);
    });

    const taskList = document.getElementById("dash-task-list");
    taskList.addEventListener("click", (e) => {
        const checkbox = e.target.closest(".todo-checkbox");
        if (!checkbox) return;

        const taskId = checkbox.getAttribute("data-id");
        const activeUser = getCurrentUser();
        if (!activeUser) return;

        const taskObj = activeUser.tasks.find((t) => t.id === taskId);
        if (taskObj) {
            taskObj.completed = !taskObj.completed;
            updateUser(activeUser);
            renderDashboardTasks(activeUser);
        }
    });
}

// Render top 5 priority tasks, prioritizing pending items over completed ones
function renderDashboardTasks(user) {
    const listEl = document.getElementById("dash-task-list");
    if (!listEl) return;

    listEl.innerHTML = "";
    const tasks = user.tasks || [];

    if (tasks.length === 0) {
        listEl.innerHTML =
            '<div style="padding: 20px; text-align: center; color: var(--color-text-muted);">No priority tasks yet. You\'re all caught up!</div>';
        return;
    }

    const sortedTasks = [...tasks].sort((a, b) => {
        if (a.completed === b.completed) {
            return new Date(b.date) - new Date(a.date);
        }
        return a.completed ? 1 : -1;
    });

    const topTasks = sortedTasks.slice(0, 5);

    topTasks.forEach((task) => {
        const isCompleted = task.completed;
        const iconHTML = isCompleted
            ? '<i class="fa-solid fa-check" style="font-size: 10px;"></i>'
            : "";
        const titleClass = isCompleted ? "todo-title completed" : "todo-title";
        const checkboxClass = isCompleted
            ? "todo-checkbox checked"
            : "todo-checkbox";

        const html = `
            <div class="todo-item" style="padding: 8px 12px; margin-bottom: 0;">
                <div class="${checkboxClass}" data-id="${task.id}">
                    ${iconHTML}
                </div>
                <div class="todo-content">
                    <div class="${titleClass}" style="margin-bottom: 0; font-size: 13px;">${task.title}</div>
                </div>
            </div>
        `;
        listEl.insertAdjacentHTML("beforeend", html);
    });
}
