# Christal Lyu Portfolio

React + Vite single-page app scaffold for Christal Lyu's portfolio.

## Current Scope

- Persistent left sidebar app shell
- React Router-based navigation
- Placeholder pages for home, about, and project routes
- Minimal layout styling only

## Routes

- `/` — Home / Design
- `/about` — About
- `/projects/wildlight` — Wildlight
- `/projects/blue-guardian` — Blue Guardian
- `/projects/nus-iss` — NUS-ISS
- `/resume` — placeholder route for future external resume handling

## Project Structure

```text
src/
├── App.jsx
├── main.jsx
├── layouts/
│   └── AppShell.jsx
├── components/
│   └── Sidebar.jsx
├── pages/
│   ├── Home.jsx
│   ├── About.jsx
│   └── projects/
│       ├── Wildlight.jsx
│       ├── BlueGuardian.jsx
│       └── NusIss.jsx
└── styles/
    └── global.css
```

## Local Development

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
```
