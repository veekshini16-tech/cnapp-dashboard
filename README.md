# CNAPP Dashboard (Frontend Trainee Assignment)

React + Vite + Zustand. The dashboard is built dynamically from `src/data/dashboard.json`
(categories -> widgets).

## Run locally
1. Install Node.js 18+ (https://nodejs.org)
2. `cd cnapp-dashboard`
3. `npm install`
4. `npm run dev` and open http://localhost:5173
5. Production build: `npm run build` then `npm run preview`

## Features
- Categories (CSPM, CWPP, Registry Scan, Ticket) each hold multiple widgets, loaded from JSON.
- **+ Add Widget** (header or per-category card) opens a drawer: tick/untick widgets per category tab,
  or create a new widget (name + text) which is added to the selected category on Confirm.
- Cross icon on each widget removes it from its category (it can be re-added from the drawer).
- Search inside the drawer looks across all widgets in all categories; the top search bar filters the dashboard.
- State lives in a Zustand store (`src/store.js`) and persists to localStorage; the reset button restores the JSON defaults.
