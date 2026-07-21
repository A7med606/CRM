
# 🔱 Poseidon CRM

<div align="center">

**نظام إدارة الحجوزات والنقل | Booking & Transport Management System**

[![Netlify Status](https://img.shields.io/badge/deployed%20on-Netlify-brightgreen)](https://poseidon-crm.netlify.app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)]()
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)]()
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)]()
[![RTL](https://img.shields.io/badge/Direction-RTL-blue)]()

</div>

---

**Live Demo:** (https://a7med606.github.io/CRM/)
---

## ✨ Features

### Booking Management
- ✅ Full CRUD operations for bookings with inline status updates
- ✅ Advanced multi-field filtering (status, trip, date)
- ✅ Bulk selection with batch actions
- ✅ Pagination with configurable page sizes
- ✅ Real-time search across all booking fields

### Trip Management
- ✅ Create, edit, and manage transport trips
- ✅ Trip status tracking (active, completed, cancelled)
- ✅ Date-based filtering and scheduling
- ✅ Card-based grid layout for visual overview

### Excel Import
- ✅ Drag & drop file upload (.xlsx, .csv)
- ✅ Live data preview before import
- ✅ Automatic validation with error highlighting
- ✅ Import history with rollback capability

### Transfer Sheets
- ✅ Auto-generate transfer sheets from approved bookings
- ✅ Driver assignment and scheduling
- ✅ Status tracking per transfer sheet
- ✅ Passenger manifest generation

### Live Tracking (Kanban Board)
- ✅ Visual Kanban board for booking pipeline
- ✅ Drag & drop status transitions
- ✅ Column-based workflow: New → Pending → Approved → In Transit → Completed
- ✅ Real-time counters per status

### Driver Portal
- ✅ Dedicated driver dashboard view
- ✅ Personal trip and passenger statistics
- ✅ Transfer sheet access per driver

### Audit Log
- ✅ Comprehensive activity logging for all entities
- ✅ Filter by entity type, action, and date
- ✅ Export audit trails to CSV
- ✅ IP address tracking

### Settings & Integrations
- ✅ WhatsApp Business API configuration
- ✅ Auto-approval rules with configurable thresholds
- ✅ AES-256 encryption key management with rotation
- ✅ Audit retention policies
- ✅ Import validation settings

### General
- ✅ Fully responsive design (mobile, tablet, desktop)
- ✅ Arabic RTL layout with Cairo font
- ✅ Role-based access control (4 roles)
- ✅ Toast notifications system
- ✅ Global search
- ✅ Dark-ready component architecture

---

## 📸 Screenshots

<!-- Add your screenshots below -->

| Dashboard | Bookings | Tracking |
|-----------|----------|----------|
| ![Dashboard](assets/screenshots/dashboard.png) | ![Bookings](assets/screenshots/bookings.png) | ![Tracking](assets/screenshots/tracking.png) |

| Import | Settings | Driver |
|--------|----------|--------|
| ![Import](assets/screenshots/import.png) | ![Settings](assets/screenshots/settings.png) | ![Driver](assets/screenshots/driver.png) |

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Markup** | HTML5 |
| **Styling** | CSS3 (Custom Properties, Grid, Flexbox) |
| **Logic** | Vanilla JavaScript (ES6+) |
| **Typography** | [Cairo Font](https://fonts.google.com/specimen/Cairo) (Google Fonts) |
| **Icons** | Emoji-based UI (zero dependencies) |
| **Hosting** | [Netlify](https://www.netlify.com/) |
| **Data** | LocalStorage (client-side persistence) |
| **Security** | AES-256 encryption, CSP headers |

> **Zero dependencies** — no frameworks, no build tools, no node_modules. Pure vanilla stack.

---

## 🚀 Quick Start

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A local web server (optional, for ES modules)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/poseidon-crm.git

# Navigate to the project directory
cd poseidon-crm

# Open in browser (using any local server)
# Option A: VS Code Live Server
# Option B: Python
python -m http.server 8000

# Option C: Node.js
npx serve .
```

Then open `http://localhost:8000` in your browser.

### Demo Accounts

Use the demo login buttons on the sign-in screen:

| Role | Description |
|------|-------------|
| **Administrator** | Full system access |
| **Tourism Agency** | Booking and import management |
| **Transport Company** | Transfer sheets and manifest |
| **Driver** | Personal transfer sheets only |

---

## 👥 Role-Based Access Control

The system supports **4 distinct roles**, each with scoped access:

```
Administrator ───── Full access to all modules
    │
    ├── Tourism Agency ────── Bookings, Import, Tracking
    │
    ├── Transport Company ─── Transfers, Manifest
    │
    └── Driver ────────────── Personal sheets only
```

| Module | Admin | Agency | Transport | Driver |
|--------|:-----:|:------:|:---------:|:------:|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Bookings | ✅ | ✅ | — | — |
| Excel Import | ✅ | ✅ | — | — |
| Trips | ✅ | — | — | — |
| Live Tracking | ✅ | ✅ | — | — |
| Transfer Sheets | ✅ | — | ✅ | — |
| Manifest | ✅ | — | ✅ | — |
| Driver Portal | — | — | — | ✅ |
| Audit Log | ✅ | — | — | — |
| Settings | ✅ | — | — | — |

---

## 📁 Project Structure

```
poseidon-crm/
├── index.html                  # Main entry point (SPA)
├── netlify.toml                # Netlify deployment config
├── _redirects                  # Netlify redirect rules
├── .gitignore                  # Git ignore rules
├── README.md                   # Project documentation
│
├── css/
│   ├── main.css                # Core styles & CSS variables
│   ├── dashboard.css           # Dashboard & chart styles
│   ├── components.css          # Reusable UI components
│   └── responsive.css          # Media queries & mobile styles
│
├── js/
│   ├── app.js                  # Core app logic & routing
│   ├── data.js                 # Sample data & mock database
│   ├── utils.js                # Utility functions & helpers
│   ├── dashboard.js            # Dashboard module
│   ├── bookings.js             # Bookings CRUD operations
│   ├── import.js               # Excel import & validation
│   ├── trips.js                # Trip management
│   ├── transfers.js            # Transfer sheet generation
│   ├── manifest.js             # Manifest document builder
│   ├── tracking.js             # Kanban board tracking
│   ├── driver.js               # Driver portal module
│   ├── audit.js                # Audit log module
│   └── settings.js             # Settings management
│
├── pages/                      # Reserved for future pages
└── assets/                     # Static assets (images, icons)
```

---

## 🌐 Deployment on Netlify

### Step 1: Initialize Git

```bash
cd poseidon-crm
git init
git add .
git commit -m "Initial commit: Poseidon CRM"
```

### Step 2: Push to GitHub

```bash
# Create a new repository on GitHub, then:
git remote add origin https://github.com/your-username/poseidon-crm.git
git branch -M main
git push -u origin main
```

### Step 3: Connect to Netlify

1. Go to [app.netlify.com](https://app.netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Select **GitHub** and authorize access
4. Choose your `poseidon-crm` repository
5. Configure build settings:

| Setting | Value |
|---------|-------|
| **Branch** | `main` |
| **Build command** | *(leave empty — static site)* |
| **Publish directory** | `.` |

6. Click **"Deploy site"**

### Step 4: Custom Domain (Optional)

1. Go to **Site settings** → **Domain management**
2. Add your custom domain
3. Enable HTTPS

> The included `netlify.toml` handles security headers and redirects automatically.

---

## 📄 Available Pages / Modules

| # | Page | File | Description (AR) |
|---|------|------|-------------------|
| 1 | Dashboard | `dashboard.js` | لوحة التحكم - نظرة عامة على الإحصائيات |
| 2 | Bookings | `bookings.js` | الحجوزات - إدارة وتحديث الحجوزات |
| 3 | Excel Import | `import.js` | استيراد Excel - رفع وتحليل ملفات البيانات |
| 4 | Trips | `trips.js` | الرحلات - إدارة رحلات النقل |
| 5 | Live Tracking | `tracking.js` | التتبع المباشر - لوحة كانبان للحالة |
| 6 | Transfer Sheets | `transfers.js` | شيتات النقل - توزيع الركاب على السائقين |
| 7 | Manifest | `manifest.js` | المانيفست - مستند النقل الرسمي القابل للطباعة |
| 8 | Driver Portal | `driver.js` | بوابة السائق - واجهة السائق المخصصة |
| 9 | Audit Log | `audit.js` | سجل التدقيق - تتبع جميع العمليات |
| 10 | Settings | `settings.js` | الإعدادات - تكوين النظام والتكاملات |

---

## 📜 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2026 Poseidon CRM

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Credits

- **Cairo Font** — [Google Fonts](https://fonts.google.com/specimen/Cairo) — Arabic typography
- **Netlify** — [netlify.com](https://www.netlify.com/) — Hosting & deployment
- **Emoji Icons** — Native emoji for zero-dependency iconography

---

<div align="center">

**Built with care for the Arabic transport industry** 🚛

🔱

</div>
