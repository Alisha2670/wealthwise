let activeMonth = new Date().getMonth();
let activeYear = new Date().getFullYear();

document.addEventListener("DOMContentLoaded", () => {
    if (!window.location.pathname.includes("calendar.html")) return;
    renderCalendar();
    setupCalendarNavigation();
});

// Attach navigation listeners for Previous Month, Next Month, and Today controls
function setupCalendarNavigation() {
    const prevBtn = document.querySelectorAll(".calendar-nav-btn")[0];
    const todayBtn = document.querySelector(".calendar-controls .btn-secondary");
    const nextBtn = document.querySelectorAll(".calendar-nav-btn")[1];
    if (!prevBtn || !nextBtn || !todayBtn) return;

    prevBtn.addEventListener("click", () => {
        activeMonth--;
        if (activeMonth < 0) {
            activeMonth = 11;
            activeYear--;
        }
        renderCalendar();
    });

    nextBtn.addEventListener("click", () => {
        activeMonth++;
        if (activeMonth > 11) {
            activeMonth = 0;
            activeYear++;
        }
        renderCalendar();
    });

    todayBtn.addEventListener("click", () => {
        activeMonth = new Date().getMonth();
        activeYear = new Date().getFullYear();
        renderCalendar();
    });
}

// Construct 7-column calendar grid aligning 1st of month with day-of-week and padding adjacent days
function renderCalendar() {
    const user = getCurrentUser();
    if (!user) return;

    const today = new Date();
    const currentDate = today.getDate();
    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    const titleEl = document.querySelector(".calendar-title");
    if (titleEl) {
        titleEl.innerHTML = `${monthNames[activeMonth]} ${activeYear}`;
    }

    const firstDay = new Date(activeYear, activeMonth, 1).getDay();
    const daysInMonth = new Date(activeYear, activeMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(activeYear, activeMonth, 0).getDate();
    const gridEl = document.querySelector(".calendar-grid");
    if (!gridEl) return;

    const headersHTML = `
        <div class="calendar-header-day">Sun</div>
        <div class="calendar-header-day">Mon</div>
        <div class="calendar-header-day">Tue</div>
        <div class="calendar-header-day">Wed</div>
        <div class="calendar-header-day">Thu</div>
        <div class="calendar-header-day">Fri</div>
        <div class="calendar-header-day">Sat</div>
    `;
    gridEl.innerHTML = headersHTML;

    for (let i = firstDay - 1; i >= 0; i--) {
        const pastDate = daysInPrevMonth - i;
        gridEl.insertAdjacentHTML(
            "beforeend",
            `<div class="calendar-cell muted"><div class="date-number">${pastDate}</div></div>`
        );
    }

    const dailyEvents = {};
// Map monthly inflows (green +) and outflows (red -) onto their corresponding calendar days
    if (user.transactions) {
        user.transactions.forEach((tx) => {
            const d = new Date(tx.date);
            if (d.getMonth() === activeMonth && d.getFullYear() === activeYear) {
                const day = d.getDate();
                if (!dailyEvents[day]) dailyEvents[day] = [];
                tx._renderClass = tx.type === "income" ? "event-income" : "event-bill";
                tx._renderPrefix = tx.type === "income" ? "+" : "-";
                dailyEvents[day].push(tx);
            }
        });
    }
// Map completed financial goals and tasks (blue ✓) onto calendar projection
    if (user.tasks) {
        user.tasks.forEach((task) => {
            if (task.completed === true) {
                const d = new Date(task.date);
                if (d.getMonth() === activeMonth && d.getFullYear() === activeYear) {
                    const day = d.getDate();
                    if (!dailyEvents[day]) dailyEvents[day] = [];
                    dailyEvents[day].push({
                        title: task.title,
                        _renderClass: "event-goal",
                        _renderPrefix: "✓ "
                    });
                }
            }
        });
    }

    for (let i = 1; i <= daysInMonth; i++) {
        let classes = "calendar-cell";
        if (
            i === currentDate &&
            activeMonth === today.getMonth() &&
            activeYear === today.getFullYear()
        ) {
            classes += " today";
        }

        let eventsHTML = "";
        if (dailyEvents[i]) {
            dailyEvents[i].forEach((event) => {
                const amountHTML =
                    event.amount !== undefined ? formatCurrency(event.amount) + " " : "";
                eventsHTML += `<div class="calendar-event ${event._renderClass}">${event._renderPrefix}${amountHTML}${event.title}</div>`;
            });
        }

        gridEl.insertAdjacentHTML(
            "beforeend",
            `<div class="${classes}"><div class="date-number">${i}</div>${eventsHTML}</div>`
        );
    }

    const totalCells = firstDay + daysInMonth;
    const remainingCells = (7 - (totalCells % 7)) % 7;
    for (let i = 1; i <= remainingCells; i++) {
        gridEl.insertAdjacentHTML(
            "beforeend",
            `<div class="calendar-cell muted"><div class="date-number">${i}</div></div>`
        );
    }
}
