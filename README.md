# GradeMaster (Simple Edition)

A lighter-weight build of the GradeMaster academic calculator platform — same full
feature set (11 calculators, dashboard, history, charts, PDF/Excel export, dark/light
theme, Appwrite auth) but using **plain CSS** instead of Tailwind, and a small set of
consolidated component files instead of a large UI-primitive library. Easier to read
top-to-bottom and copy-paste by hand.

## Tech stack
React 19 · TypeScript (strict) · Vite · Plain CSS (CSS variables, no framework) ·
Framer Motion · Chart.js · Zustand (persisted) · Appwrite (Auth + Database) ·
jsPDF + jspdf-autotable · SheetJS (xlsx) · Lucide icons

## Run it

```bash
npm install
npm run dev
```

`.env` already contains your Appwrite endpoint + project ID.

## Appwrite setup
Same as the full edition:
1. Enable **Email/Password** auth in your Appwrite project.
2. Create a database with ID `grademaster_db`.
3. Create a `profiles` collection with attributes: `userId`, `name`, `email`,
   `institutionType`, `institutionName`, `courseOrClass`, `createdAt` (all String,
   except make sure IDs/collection match your `.env`).

## Structure

```
src/
  components/   Navbar, Footer, Hero, Button, FormFields, ResultDisplay,
                Calculators (all 11), Charts, AnimatedBackground, Toast
  pages/        HomePage, CalculatorsPage, DashboardPage, HistoryPage,
                SettingsPage, AboutPage, ContactPage, GpaGuidePage, AuthPage
  store/        useStore.ts — theme + academic state + history + auth (Zustand)
  lib/          calculations.ts (math engine), appwrite.ts, exportUtils.ts
  types/        Shared TypeScript types
  App.tsx       Simple page-state navigation (no router dependency)
  index.css     All styling — plain CSS with variables for light/dark theme
```

## Scripts
```bash
npm run dev         # start dev server
npm run build        # typecheck + production build
npm run typecheck    # strict TypeScript check only
npm run lint          # oxlint (zero-config)
npm run preview       # preview the production build
```
