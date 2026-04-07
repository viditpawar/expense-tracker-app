# Expense Tracker App

A modern, responsive expense tracking dashboard built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Add, edit, and delete expenses
- Categorize expenses (Food, Travel, Bills, Shopping, Health, Other)
- Filter expense history by category
- See total spend, filtered total, average spend, and highest expense
- View monthly spending trends with a bar chart
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

### 1. Clone the repository

```bash
git clone https://github.com/viditpawar/expense-tracker-app.git
cd expense-tracker-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Available Scripts

```bash
npm run dev    # Start local development server
npm run build  # Create production build
npm run start  # Run production server
npm run lint   # Run ESLint
```

## Project Structure

```text
.
|-- app/
|   |-- page.tsx         # Main expense tracker UI
|   `-- layout.tsx       # App layout
|-- public/              # Static assets
|-- package.json
`-- README.md
```

## Deployment

This project is ready to deploy on Vercel.

1. Push your code to GitHub.
2. Import the repo into Vercel.
3. Set framework preset to Next.js (auto-detected).
4. Deploy.
