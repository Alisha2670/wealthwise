document.addEventListener("DOMContentLoaded", () => {
    if (!window.location.pathname.includes("budget.html")) return;
    loadBudgetData();
    setupCreateBudgetButton();
});

function loadBudgetData() {
    const user = getCurrentUser();
    if (!user) return;
    if (!user.budgets) user.budgets = [];
    if (!user.transactions) user.transactions = [];

    let totalBudgetLimit = 0;
    user.budgets.forEach((b) => (totalBudgetLimit += b.limit));

    let totalSpent = 0;
    const today = new Date();
    const expenses = user.transactions.filter((tx) => {
        if (tx.type !== "expense") return false;
        const txDate = new Date(tx.date);
        return (
            txDate.getMonth() === today.getMonth() &&
            txDate.getFullYear() === today.getFullYear()
        );
    });

    expenses.forEach((exp) => (totalSpent += exp.amount));

    const remaining = totalBudgetLimit - totalSpent;
    const metricCards = document.querySelectorAll(".metric-value");

    if (metricCards.length >= 3) {
        metricCards[0].textContent = formatCurrency(totalBudgetLimit);
        metricCards[1].textContent = formatCurrency(totalSpent);
        metricCards[2].textContent = formatCurrency(remaining);
    }

    renderBudgets(user.budgets, expenses);
}

function renderBudgets(budgets, expenses) {
    const gridContainer = document.querySelector(".grid.grid-cols-3");
    if (!gridContainer) return;

    gridContainer.innerHTML = "";

    if (budgets.length === 0) {
        gridContainer.innerHTML =
            '<div style="grid-column: span 3; text-align:center; padding:40px; color: var(--color-text-muted);">No budgets created yet. Start planning!</div>';
        return;
    }

    budgets.forEach((budget) => {
        let spentInCategory = 0;
        expenses.forEach((exp) => {
            if (
                exp.category &&
                exp.category.toLowerCase() === budget.category.toLowerCase()
            ) {
                spentInCategory += exp.amount;
            }
        });

        let percentUsed =
            budget.limit > 0 ? (spentInCategory / budget.limit) * 100 : 0;
        if (percentUsed > 100) percentUsed = 100;

        let barColor = "bg-success";
        let statusPill = `<span class="status-pill status-success" style="font-size:9px; padding:2px 8px; margin-top:4px;">On Track</span>`;
        let iconColor = "icon-primary";

        if (percentUsed >= 80 && percentUsed < 100) {
            barColor = "bg-warning";
            statusPill = `<span class="status-pill status-warning" style="font-size:9px; padding:2px 8px; margin-top:4px;">Near Limit</span>`;
            iconColor = "icon-warning";
        } else if (percentUsed >= 100) {
            barColor = "bg-danger";
            statusPill = `<span class="status-pill status-danger" style="font-size:9px; padding:2px 8px; margin-top:4px;">Over Budget</span>`;
            iconColor = "icon-danger";
        }

        const cardHtml = `
            <div class="card">
                <div class="flex justify-between items-center mb-4">
                    <div class="flex items-center gap-3">
                        <div class="metric-icon ${iconColor}" style="width:36px; height:36px; font-size:1rem;">
                            <i class="fa-solid fa-layer-group"></i>
                        </div>
                        <div>
                            <h4 style="margin:0; font-size:var(--font-size-sm); color:var(--color-secondary);">${budget.category}</h4>
                            ${statusPill}
                        </div>
                    </div>
                    <button class="action-btn edit-budget-btn" data-id="${budget.id}" style="width:32px; height:32px;"><i class="fa-solid fa-pen"></i></button>
                </div>
                <div class="progress-container">
                    <div class="progress-bar ${barColor}" style="width: ${percentUsed}%;"></div>
                </div>
                <div class="budget-stats">
                    <span style="${percentUsed >= 100 ? "color:var(--color-danger);" : ""}">Spent: ${formatCurrency(spentInCategory)}</span>
                    <span class="font-medium" style="color:var(--color-secondary);">Total: ${formatCurrency(budget.limit)}</span>
                </div>
            </div>
        `;
        gridContainer.insertAdjacentHTML("beforeend", cardHtml);
    });
}

function setupCreateBudgetButton() {
    const addBtn = document.querySelector(".page-header .btn-primary");
    const modal = document.getElementById("budget-modal");
    const closeBtn = document.getElementById("close-budget-btn");
    const form = document.getElementById("budget-form");
    const modalTitle = document.getElementById("budget-modal-title");
    const editIdInput = document.getElementById("edit-budget-id");
    const deleteBtn = document.getElementById("delete-budget-btn");
    if (!addBtn || !modal || !form) return;

    addBtn.addEventListener("click", (e) => {
        e.preventDefault();
        form.reset();
        editIdInput.value = "";
        modalTitle.textContent = "Create Budget";
        deleteBtn.style.display = "none";
        modal.style.display = "flex";
    });

    closeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        modal.style.display = "none";
    });

    document.querySelector(".grid.grid-cols-3").addEventListener("click", (e) => {
        const editBtn = e.target.closest(".edit-budget-btn");
        if (!editBtn) return;
        e.preventDefault();

        const user = getCurrentUser();
        const budgetId = editBtn.getAttribute("data-id");
        const budget = user.budgets.find((b) => b.id === budgetId);

        if (budget) {
            editIdInput.value = budget.id;
            document.getElementById("budget-category").value = budget.category;
            document.getElementById("budget-limit").value = budget.limit;
            modalTitle.textContent = "Edit Budget";
            deleteBtn.style.display = "block";
            modal.style.display = "flex";
        }
    });

    deleteBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const idToDelete = editIdInput.value;
        if (!idToDelete) return;

        if (confirm("Are you sure you want to completely delete this budget?")) {
            const user = getCurrentUser();
            user.budgets = user.budgets.filter((b) => b.id !== idToDelete);
            updateUser(user);
            loadBudgetData();
            modal.style.display = "none";
        }
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const category = document.getElementById("budget-category").value;
        const limitStr = document.getElementById("budget-limit").value;
        const limit = parseFloat(limitStr);
        const editingId = editIdInput.value;

        if (!category || isNaN(limit) || limit <= 0) {
            alert("Please enter valid data.");
            return;
        }

        const user = getCurrentUser();
        if (!user) return;
        if (!user.budgets) user.budgets = [];

        if (editingId) {
            const index = user.budgets.findIndex((b) => b.id === editingId);
            if (index !== -1) {
                if (
                    user.budgets[index].category.toLowerCase() !== category.toLowerCase()
                ) {
                    const exists = user.budgets.some(
                        (b) =>
                            b.id !== editingId &&
                            b.category.toLowerCase() === category.toLowerCase()
                    );
                    if (exists) {
                        alert("You already have a budget for this category!");
                        return;
                    }
                }
                user.budgets[index].category = category;
                user.budgets[index].limit = limit;
                updateUser(user);
            }
        } else {
            const exists = user.budgets.some(
                (b) => b.category.toLowerCase() === category.toLowerCase()
            );
            if (exists) {
                alert("You already have a budget for this category!");
                return;
            }
            const newBudget = {
                id: generateId(),
                category: category,
                limit: limit,
                createdAt: new Date().toISOString()
            };
            user.budgets.push(newBudget);
            updateUser(user);
        }

        loadBudgetData();
        modal.style.display = "none";
        form.reset();
    });
}
