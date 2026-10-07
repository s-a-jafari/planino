<div align="center">

# 🚀 Planino

**A Modern, Distraction-Free Agile Workspace & Interactive Kanban Suite**

[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-Fast_Bundler-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<<<<<<< HEAD
[Explore Live Demo](https://planino.vercel.app) · [Report Bug](https://github.com/s-a-jafari/planino/issues) · [Request Feature](https://github.com/s-a-jafari/planino/issues)
=======
[![CI Pipeline](https://github.com/s-a-jafari/planino/actions/workflows/ci.yml/badge.svg)](https://github.com/s-a-jafari/planino/actions)

[Explore Live Demo](https://planino.vercel.app) · [Report Bug](https://github.com/your-username/planino/issues) · [Request Feature](https://github.com/your-username/planino/issues)
>>>>>>> aadef5f (ci: add automated build verification workflow)

</div>

---

## 💡 Overview

**Planino** is an executive-grade productivity web application engineered for focused task management and project workflow orchestration. Inspired by the sleek ergonomics of modern developer tools like **Linear** and **Raycast**, it balances deep inspection capabilities with minimalist visual design and zero-bloat browser-native APIs.

Designed from the ground up with high performance, accessibility, and zero external runtime bloat in mind.

---

## ✨ Key Features & Engineering Highlights

* 📋 **Native HTML5 Kanban Board:** Native drag-and-drop mechanics organizing initiatives across `To Do`, `In Progress`, and `Completed` columns with zero external drag libraries.
* 🔍 **Deep Project Inspection Modal:** Linear-inspired two-pane modal providing real-time title/description inline editing, nested task checklists, priority reassignment, and tag management.
* 🎹 **Procedural Synthesizer Feedback (Web Audio API):** Generates chime micro-interactions and completion chords dynamically via real-time `AudioContext` frequency oscillators—**0 KB audio assets**, zero network roundtrips.
* 🎉 **Pure Canvas Confetti Engine:** Lightweight, math-driven particle physics simulation rendered on an HTML5 `<canvas>` element without third-party dependencies.
* ⌘ **Raycast-Style Command Palette:** Global keyboard orchestration (`/` or `Alt + K`) allowing users to query projects or trigger workspace commands instantly.
* ↩️ **Global Non-Destructive Undo (`Ctrl + Z`):** Accidental project deletions are cached with rapid-restore toast triggers and keyboard undo listeners.
* ⏱️ **Integrated Pomodoro Deep Work Mode:** Floating timer linked to active projects with automated milestone alerts.
* 🧘 **Distraction-Free Zen Mode:** Instantly removes metrics and collapses side utilities to expand the workspace into a pure focus canvas.
* 📊 **Smart Query Engine & Real-Time Stats:** Multi-facet sorting (Date, Priority, Progress), tag filters, urgent ribbons, and an append-only audit trail.
* 💾 **Data Portability:** LocalStorage persistence with full JSON export and import capabilities.

---

## 🛠️ Architecture & Tech Stack

| Layer | Technology | Key Responsibility |
| :--- | :--- | :--- |
| **Frontend Framework** | React 19 | Functional components, state isolation, declarative rendering |
| **Styling** | Tailwind CSS | Responsive utility system, dark/light theme tokens |
| **State Management** | React Context API + Custom Hooks | Centralized workspace state, optimistic updates |
| **Native Web APIs** | Web Audio API + Canvas API | Procedural sound synthesis & particle effects |
| **Build & Tooling** | Vite | Ultra-fast Hot Module Replacement (HMR) and optimized rollup bundle |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Description |
| :--- | :--- |
| `N` | Open Create Project dialog |
| `/` or `Alt + K` | Toggle Command Palette / Search |
| `Ctrl + Z` | Undo last project deletion |
| `?` | Open Keyboard Shortcuts cheatsheet |
| `Esc` | Close active modal, dialog, or dropdown menu |

---

## 🗺️ Project Roadmap

- [x] **v1.0 - Client MVP:** Pure React 19 + Tailwind CSS architecture with full Kanban drag-and-drop, inline checklist editing, and Web Audio integration.
- [ ] **v1.1 - Backend Architecture:** Node.js / Express microservice integration.
- [ ] **v1.2 - Authentication & Security:** JWT-based user authentication, role management, and session rotation.
- [ ] **v1.3 - Relational Persistence:** PostgreSQL schema design with migrations and full relational data model.
- [ ] **v2.0 - Containerization & DevOps:** Multi-stage `Dockerfile` and `docker-compose.yml` orchestrating Frontend, Backend, and PostgreSQL services.

---

## 📁 Directory Structure

```text
planino/
├── public/              # Static assets (Favicons, public logos)
├── src/
│   ├── assets/          # Project assets & media
│   ├── context/         # Centralized state (ProjectContext.jsx)
│   ├── utils/           # FX engines (Audio synthesizer, Canvas confetti)
│   ├── App.jsx          # Root application container & layout
│   ├── ProjectItem.jsx  # Kanban project card component
│   ├── ProjectDetailModal.jsx # Comprehensive project inspection view
│   ├── SearchModal.jsx  # Raycast-style command palette
│   └── main.jsx         # Application entry point
├── index.html           # HTML5 template
├── tailwind.config.js   # Tailwind design tokens
└── package.json         # Project manifests & dependencies
```

---

## 🚀 Getting Started

### Prerequisites

* Node.js (version 18.0 or higher)
* npm, pnpm, or yarn

### Installation & Local Setup

1. **Clone the repository:**
```bash
git clone https://github.com/s-a-jafari/planino.git
cd planino
```


2. **Install project dependencies:**
```bash
npm install
```


3. **Start the local development server:**
```bash
npm run dev
```


4. **Build production bundle:**
```bash
npm run build
```



---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for further details.
