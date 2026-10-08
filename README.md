# WealthWise — Personal Finance Dashboard

> **Track Smart. Spend Wise. Grow Wealth.**  
> A lightweight, responsive, and privacy-first personal finance platform built with pure **HTML5, CSS3, and Vanilla JavaScript**.

---

## 📋 Project Proposal

### 1. Project Description
**WealthWise** is a lightweight, client-side personal finance web application designed to empower individuals to take full control over their financial health. Traditional finance platforms often require server registrations, subscription fees, or compromise user privacy through third-party data tracking. WealthWise solves these challenges by providing an offline-first, client-side management hub where users can monitor cash flow, plan category budgets, organize financial tasks, and gain visual insights into their spending habits—completely private and running directly within the browser.

### 2. Goals & Objectives
* **Privacy-First Personal Accounting**: Guarantee 100% data confidentiality by persisting all records locally on the user's device via HTML5 Web Storage without external databases or tracking telemetry.
* **Complete CRUD Lifecycle**: Implement full Create, Read, Update, and Delete operations across all key financial entities (transactions, budget allocations, actionable tasks, and user profiles).
* **Zero External JS Dependencies**: Prove that modern, enterprise-grade web applications with interactive dashboards, dynamic charts, and background data processing can be constructed entirely using native web fundamentals (HTML5, CSS3, Vanilla ES6+ JS).
* **Asynchronous Multithreaded Processing**: Utilize HTML5 Web Workers to delegate data processing (such as CSV compilation) to background threads, guaranteeing smooth 60 FPS UI performance.
* **Universal Accessibility & Responsiveness**: Provide an intuitive, responsive interface optimized across mobile handsets, tablets, and desktop workstations.

### 3. Specifications

#### Functional Specifications
* **Authentication & Profile Scoping**: Client-side sign-up and sign-in ensuring distinct transaction, budget, and task records for every registered account.
* **Inflow & Outflow Tracking**: Real-time logging of incomes and expenses with categories, dates, and amounts, accompanied by dynamic filtering.
* **Budget Limits & Threshold Alerts**: Customizable monthly category allowances with dynamic status badges: *On Track* (< 80%), *Warning* (80%–99%), and *Over Budget* (≥ 100%).
* **Interactive Calendar**: 7-column calendar projection visualizing upcoming payment deadlines, income dates, and bill reminders.
* **Actionable Checklist**: Financial task manager with status toggles (pending/completed) and priority tags (`Bills`, `Goals`, `General`).
* **RFC-4180 CSV Data Export**: Multithreaded background export of transaction ledgers to CSV format for external analysis in Excel or Google Sheets.

#### Technical Specifications
* **Markup**: Semantic HTML5 (`<header>`, `<nav>`, `<aside>`, `<main>`, `<section>`, `<form>`, `<dialog>`).
* **Styling**: CSS3 Design Tokens (CSS Variables), modern **CSS Grid** and **Flexbox**, keyframe animations, and glassmorphic blur effects (`backdrop-filter`).
* **Scripting**: Vanilla JavaScript (ES6+ modular logic, event delegation, dynamic DOM rendering).
* **Storage Engine**: HTML5 `localStorage` API for reliable data persistence across sessions.
* **Background Threading**: HTML5 **Web Workers API** (`DedicatedWorkerGlobalScope`) via dynamic `Blob` URLs for non-blocking file compilation.
* **Compatibility**: Standardized for all modern evergreen browsers (Chrome, Edge, Firefox, Safari) with zero build tools or compilers required.

### 4. UI/UX Design & Architecture
* **Design Philosophy**: Clean, dark/light theme-adaptive user interface with modern glassmorphism, ergonomic card layouts, high-contrast typography, and intuitive color-coded status indicators (emerald green for inflows/success, crimson red for outflows/over-budget, amber for warnings).
* **Information Architecture**:
  * **Landing Page (`index.html`)**: Product introduction, feature highlights, and call-to-actions.
  * **Auth Flow (`login.html`, `signup.html`)**: Streamlined onboarding and session initialization.
  * **Core Hub (`dashboard.html`)**: Instant KPI balance metrics, quick transaction entry modal, and recent feeds.
  * **Management Views (`income.html`, `expenses.html`, `budget.html`, `calendar.html`, `todo.html`, `analytics.html`, `settings.html`)**: Dedicated sub-pages for granular tracking, interactive calendar planning, and profile management.

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

### 📥 One-Click CSV Data Export (Powered by HTML5 Web Workers)
* **Asynchronous Web Worker Engine**: Export compilation and RFC-4180 string formatting run in a dedicated background thread via the **HTML5 Web Workers API**, preventing UI freeze or main-thread latency even with large transaction histories.
* **In-Memory Dynamic Worker Generation**: Spawned dynamically using `Blob` and `URL.createObjectURL`, ensuring zero external script files or CORS restrictions.
* **Resilient Main-Thread Fallback**: Seamless fallback to standard main-thread compilation if Web Workers are restricted by browser security policies.
* **Spreadsheet Ready**: Generates standard `.csv` files ready to import directly into Microsoft Excel, Google Sheets, or Apple Numbers.

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
* **HTML5 Web Workers API**: Background multithreading for asynchronous, non-blocking CSV export generation.
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
    ├── export.js       # RFC-4180 CSV export generator using HTML5 Web Workers
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
