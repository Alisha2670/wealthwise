# WealthWise — Personal Finance Dashboard

> **Track Smart. Spend Wise. Grow Wealth.**  
> A lightweight, responsive, and privacy-first personal finance platform built with pure **HTML5, CSS3, and Vanilla JavaScript**.

---

## 📌 Project Overview

**WealthWise** is a client-side personal finance web application designed to help individuals monitor cash flow, plan category budgets, organize financial tasks, and gain visual insights into their spending habits. 

Running 100% in the browser with **HTML5 Web Storage (`localStorage`)**, WealthWise requires no server setup, collects no tracking data, and works completely offline.

---

## ✨ Core Features

### 📊 Real-Time Financial Dashboard
* **Instant KPI Metrics**: Live-computed Total Balance, Total Income, and Total Expenses.
* **Cash Flow Bar Visuals**: Quick visual comparison of monthly inflows and outflows.
* **Quick Transaction Modal**: Add income and expense entries on the fly with date, category, and amount validation.
* **Recent Activity Feed**: Real-time list of latest transactions with color-coded status badges.

### 💰 Budget Planner & Thresholds
* **Category Allowances**: Define monthly spending limits for Housing, Food & Dining, Utilities, Entertainment, Healthcare, and more.
* **Dynamic Progress Indicators**: Visual progress bars updating in real time as expenses are logged.
* **Threshold Status Badges**:
  * 🟢 **On Track** (`< 80%`)
  * 🟡 **Warning** (`80% – 99%`)
  * 🔴 **Over Budget** (`100%+`)

### 📈 Visual Analytics & Insights
* **Conic-Gradient Donut Chart**: Pure CSS/JS category spending distribution (built without any charting libraries).
* **Top Spending Merchants**: Aggregated breakdown of where most money is spent.
* **Net Cash Flow Summary**: Clear visibility into monthly financial growth.

### 📅 Interactive Financial Calendar
* **7-Column Grid View**: Custom-built month projection showing income dates, bill deadlines, and financial tasks.
* **Event Dot Markers**: Color-coded badges for Income (Green), Bills (Red), and Financial Goals (Blue).
* **Month Navigation**: Seamless previous/next month switching with automatic day-of-week alignment.

### ✅ Finance Tasks
* **Actionable Checklist**: Keep track of pending bills, tax filings, and savings goals.
* **Priority Tags**: Label tasks as `Goals`, `Bills`, or custom categories.

### 📥 One-Click CSV Data Export
* **Instant Download**: Export your complete transaction history into an RFC-4180 compliant `.csv` file.
* **Spreadsheet Ready**: Open directly in Microsoft Excel, Google Sheets, or Apple Numbers.

### 🌓 Dark / Light Theme
* **One-Click Toggle**: Switch between clean Light mode and sleek Dark mode (`#0a0c10` / `#12151c`).
* **Persistent Preference**: Theme state is saved in `localStorage` and remembered on every page refresh.

### 🔒 Secure Client-Side Auth
* **Isolated User Profiles**: Support for account creation and sign-in with email and password validation.
* **Scoped Storage**: Each registered user gets isolated transaction, budget, and task records.

---

## 🛠️ Technology Stack

* **HTML5**: Semantic document structure (`<header>`, `<nav>`, `<aside>`, `<main>`, `<section>`, `<form>`).
* **CSS3**: Modern layouts using **CSS Grid** and **Flexbox**, CSS custom variables (design tokens), smooth keyframe animations, and glassmorphic blur effects (`backdrop-filter`).
* **Vanilla JavaScript (ES6+)**: Pure JS for state management, DOM manipulation, date math, chart calculation, and CSV generation.
* **Storage Engine**: HTML5 `localStorage` API for reliable, offline data persistence.
* **Zero External JS Libraries**: No React, jQuery, Bootstrap JS, or Chart.js. Everything is built from scratch.

---

## 🔄 CRUD Operations

WealthWise delivers complete **Create, Read, Update, and Delete** operations across the entire application:

| Feature | Create (C) | Read (R) | Update (U) | Delete (D) |
| :--- | :--- | :--- | :--- | :--- |
| **Transactions** | Add new Income or Expense | View lists, recent feeds & tables | Filter by date, type & search | Delete records with instant auto-recalculation |
| **Budgets** | Set category spending limits | View spent amount & progress bar | Recalculate remaining balances | Remove budget categories |
| **Tasks** | Add tasks with due date & tag | Filter by All, Pending, Completed | Check off / toggle completion state | Delete tasks from checklist |
| **User Profile** | Sign up new account | View profile & avatar initials | Change password in Settings | Sign out & clear active session |

---

## 📱 Responsive Layout

WealthWise is crafted with a mobile-first philosophy and custom media queries:

* **Desktop (`> 1024px`)**: Fixed 260px sidebar navigation, multi-column dashboard grid, full 7-column calendar.
* **Tablet (`768px – 1024px`)**: Collapsible sidebar drawer, 2-column metric cards, responsive tables.
* **Mobile (`< 768px`)**: Hamburger slide-out navigation menu, single-column card stack, full-width touch controls.

---

## 📂 Project Structure

```
WealthWisep/
├── index.html          # Modern product landing page
├── login.html          # User authentication login
├── signup.html         # New user registration
├── dashboard.html      # Main finance dashboard & metrics
├── analytics.html      # Donut chart & expense reports
├── income.html         # Income streams management
├── expenses.html       # Expense tracking & filtering
├── budget.html         # Monthly budget planner & limits
├── calendar.html       # Interactive financial calendar
├── todo.html           # Financial tasks checklist
├── settings.html       # User profile & password settings
│
├── css/
│   ├── variables.css   # Color palette, dark theme & design tokens
│   ├── animations.css  # Keyframe animations (fadeIn, slideUp, float)
│   ├── style.css       # Global reset & typography
│   ├── components.css  # Buttons, cards, modals & task controls
│   ├── dashboard.css   # Sidebar, topbar, cards & chart layouts
│   ├── pages.css       # Tables, pills, badges & progress bars
│   ├── responsive.css  # Tablet & mobile media queries
│   └── auth.css        # Glassmorphic auth card styles
│
└── js/
    ├── helpers.js      # Currency (₹), date formatters & sanitizers
    ├── storage.js      # LocalStorage layer for users, txs & budgets
    ├── theme.js        # Dark / Light mode controller & persistence
    ├── auth.js         # Authentication, registration & session guard
    ├── app.js          # App bootstrapper & mobile sidebar toggle
    ├── export.js       # RFC-4180 CSV export generator
    ├── dashboard.js    # KPI mathematics & transaction entry modal
    ├── analytics.js    # Conic-gradient chart math & top merchants
    ├── income.js       # Inflow transaction table & filtering
    ├── expenses.js     # Outflow transaction table & filtering
    ├── budget.js       # Budget progress calculation & threshold alerts
    ├── calendar.js     # 7-column calendar generator & event mapper
    ├── todo.js         # Task manager, filter tabs & status toggles
    └── settings.js     # Password update & profile display
```

---

## 🚀 Getting Started

No build steps, compilers, or dependencies are required.

### Run with VS Code Live Server
1. Open the project folder in **Visual Studio Code**.
2. Right-click **`index.html`** and select **"Open with Live Server"**.
3. The site will launch automatically at `http://127.0.0.1:5500/index.html`.

### Run Directly in Any Browser
Double-click `index.html` to open it in Chrome, Firefox, Safari, or Edge. All features, styles, and local storage work immediately.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
