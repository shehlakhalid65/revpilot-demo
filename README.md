# RevPilot: Commission & Payout Management

A dashboard for sales and brokerage teams. It tracks trades, calculates rep commissions,
runs monthly payouts and produces exportable reports.

> **Demo build.** It runs fully in the browser on generated sample data. No backend or sign-up is needed.
> Changes you make are kept in memory and reset on refresh.

## Features

- **Dashboard**: KPI cards, a 12-month commission trend, product mix and top performers
- **Sales reps**: search, filter, sort, add or edit reps, toggle active status, set tiered commission rates
- **Trades**: record trades with commission auto-calculated from the rep's rate; filter, delete, CSV export
- **Payouts**: per-period payouts with admin fee, status filters, "mark paid", totals row, CSV export
- **Pay periods**: open/close monthly periods with trade and commission rollups
- **Reports**: commission by rep (with region filter) and by month (buy vs sell), charts plus tables
- **Team**: workspace members and roles
- Responsive layout with a collapsible sidebar on mobile

## Tech stack

React 18 · TypeScript · Vite · Ant Design 5 · Recharts · React Router · Day.js

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build in dist/
```

Sign in with the pre-filled demo credentials, or click **Continue as demo user**.

## Deploy

The app is static, so it deploys to Vercel or Netlify with no configuration
(`vercel.json` and `public/_redirects` handle client-side routing).
Build command `npm run build`, output directory `dist`.
