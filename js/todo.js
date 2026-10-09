let activeCategory = "All";

document.addEventListener("DOMContentLoaded", () => {
    if (!window.location.pathname.includes("todo.html")) return;
    loadTasks();
    setupAddTask();
    setupFilters();
});

// Load financial tasks, filter by active category, and render pending vs completed sections
function loadTasks() {
    const user = getCurrentUser();
    if (!user) return;

    const container = document.querySelector(".animate-slide-up.delay-200");
    if (!container) return;

    container.innerHTML = "";
    let tasks = user.tasks || [];

    if (activeCategory !== "All") {
        tasks = tasks.filter((t) => t.category === activeCategory);
    }

    if (tasks.length === 0) {
        container.innerHTML = `<div style="text-align: center; color: var(--color-text-muted); padding: 40px;">No ${activeCategory === "All" ? "" : activeCategory + " "}tasks on your agenda. Enjoy your free time!</div>`;
        return;
    }

    const pendingTasks = tasks.filter((t) => t.completed === false);
    const completedTasks = tasks.filter((t) => t.completed === true);

    if (pendingTasks.length > 0) {
        container.insertAdjacentHTML(
            "beforeend",
            `<h3 class="todo-section-title"><i class="fa-solid fa-list-check text-primary"></i> Pending Tasks</h3>`
        );
        const listDiv = document.createElement("div");
        listDiv.className = "todo-list";
        pendingTasks.forEach((t) => {
            listDiv.insertAdjacentHTML("beforeend", buildTaskHTML(t));
        });
        container.appendChild(listDiv);
    }

    if (completedTasks.length > 0) {
        container.insertAdjacentHTML(
            "beforeend",
            `<h3 class="todo-section-title" style="margin-top:24px;"><i class="fa-solid fa-check-double text-success"></i> Completed</h3>`
        );
        const listDiv = document.createElement("div");
        listDiv.className = "todo-list";
        completedTasks.forEach((t) => {
            listDiv.insertAdjacentHTML("beforeend", buildTaskHTML(t));
        });
        container.appendChild(listDiv);
    }

    setupCheckboxes();
}

// Construct HTML template for individual task card with completion styling and priority tags
function buildTaskHTML(task) {
    const checkedClass = task.completed ? "checked" : "";
    const checkIcon = task.completed
        ? '<i class="fa-solid fa-check" style="font-size: 12px;"></i>'
        : "";
    const titleClass = task.completed ? "completed" : "";

    let tagHTML = "";
    if (task.category && task.category !== "General") {
        let tagColor = "var(--color-primary)";
        if (task.category === "Bills") tagColor = "var(--color-danger)";
        if (task.category === "Goals") tagColor = "var(--color-success)";
        tagHTML = `<span class="todo-tag" style="background:${tagColor}15; color:${tagColor}; border:1px solid ${tagColor}30;">${task.category}</span>`;
    }

    return `
        <div class="todo-item" data-id="${task.id}">
            <div class="todo-checkbox ${checkedClass}">${checkIcon}</div>
            <div class="todo-content">
                <div class="todo-title ${titleClass}">${task.title}</div>
                <div class="todo-meta">
                    <span><i class="fa-regular fa-clock"></i> ${formatDate(task.date)}</span>
                    ${tagHTML}
                </div>
            </div>
            <button class="action-btn delete-task-btn" style="width:32px; height:32px;"><i class="fa-solid fa-trash"></i></button>
        </div>
    `;
}

// Handle task submission and append new task to user's agenda with timestamp
function setupAddTask() {
    const addBtn = document.querySelector(".add-task-row .btn-primary");
    const inputEl = document.querySelector(".add-task-input");
    if (!addBtn || !inputEl) return;

    addBtn.addEventListener("click", () => {
        const title = inputEl.value;
        if (!title || title.trim() === "") return;

        const newTask = {
            id: generateId(),
            title: title.trim(),
            completed: false,
            date: new Date().toISOString(),
            category: activeCategory === "All" ? "General" : activeCategory
        };

        const user = getCurrentUser();
        if (!user.tasks) user.tasks = [];
        user.tasks.push(newTask);
        updateUser(user);
        inputEl.value = "";
        loadTasks();
    });
}

// Bind click handlers to toggle task completion state and delete tasks from checklist
function setupCheckboxes() {
    const checkboxes = document.querySelectorAll(".todo-checkbox");
    checkboxes.forEach((box) => {
        box.addEventListener("click", function () {
            const parentItem = this.closest(".todo-item");
            const taskId = parentItem.getAttribute("data-id");
            const user = getCurrentUser();
            const targetTask = user.tasks.find((t) => t.id === taskId);
            if (targetTask) {
                targetTask.completed = !targetTask.completed;
                updateUser(user);
                loadTasks();
            }
        });
    });

    const deleteBtns = document.querySelectorAll(".delete-task-btn");
    deleteBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
            const parentItem = this.closest(".todo-item");
            const taskId = parentItem.getAttribute("data-id");
            const user = getCurrentUser();
            user.tasks = user.tasks.filter((t) => t.id !== taskId);
            updateUser(user);
            loadTasks();
        });
    });
}

// Filter tasks dynamically by All Tasks, Bills, or Goals
function setupFilters() {
    const filterBtns = document.querySelectorAll(".filter-category-btn");
    filterBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
            filterBtns.forEach((b) => {
                b.style.background = "transparent";
                b.style.borderColor = "var(--color-border)";
                b.style.color = "var(--color-text)";
                b.style.borderStyle = "dashed";
            });
            this.style.background = "var(--color-bg-body)";
            this.style.borderColor = "var(--color-primary)";
            this.style.color = "var(--color-primary)";
            this.style.borderStyle = "solid";
            activeCategory = this.getAttribute("data-category");
            loadTasks();
        });
    });
}
