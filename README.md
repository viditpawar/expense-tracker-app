<div align="center">
  <h1>Expense Tracker App</h1>
  <p>
    <strong>A modern expense dashboard to track, analyze, and manage your daily spending.</strong>
  </p>

  <p>
    <img src="https://img.shields.io/badge/status-active-success" alt="Status Active" />
    <img src="https://img.shields.io/badge/Next.js-16-black" alt="Next.js 16" />
    <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" alt="TypeScript 5" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
  </p>

  <p>
    <a href="#features">Features</a> |
    <a href="#tech-stack">Tech Stack</a> |
    <a href="#getting-started">Getting Started</a> |
    <a href="#available-scripts">Scripts</a> |
    <a href="#deployment">Deployment</a>
  </p>
</div>

---

## Features

- Add, edit, and delete expenses
- Categorize expenses (Food, Travel, Bills, Shopping, Health, Other)
- Filter expense history by category
- View key stats: total, filtered total, average, and highest expense
- Visualize monthly spending trends with Recharts
- Persist data in browser `localStorage`
- Clear all expenses with confirmation

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Recharts

## Live Demo

`https://YOUR-VERCEL-URL.vercel.app`

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### 1. Clone repository

```bash
git clone https://github.com/viditpawar/expense-tracker-app.git
cd expense-tracker-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run locally

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Available Scripts

```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run start  # Start production server
npm run lint   # Run ESLint
```

## Project Structure

```text
.
|-- app/
|   |-- layout.tsx
|   `-- page.tsx
|-- public/
|-- package.json
`-- README.md
```

## Deployment

1. Push your code to GitHub.
2. Import the repository into Vercel.
3. Vercel auto-detects Next.js settings.
4. Deploy.
