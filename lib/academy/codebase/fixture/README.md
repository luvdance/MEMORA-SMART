# Kobo Market

An online market for small traders: customers browse products, sign in,
fill a cart and pay with Paystack.

## Stack

- Frontend: React 18, built with Vite (`src/`)
- API: Node.js with no framework (`server/`)
- Data: a JSON file created by `npm run seed` (`data/kobo.json`)
- Payments: Paystack (`server/payments/paystack.js`)

## Run it locally

1. `npm install`
2. `cp .env.example .env` and set `SESSION_SECRET`
3. `npm run seed`
4. `npm start` (API on http://localhost:4000)
5. In a second terminal, `npm run dev` (app on http://localhost:5173)

Demo login: bola@kobo.test / market-day-2026

## Scripts

| Script          | Does                            |
| --------------- | ------------------------------- |
| `npm run dev`   | Vite dev server with hot reload |
| `npm start`     | The API                         |
| `npm test`      | Unit tests (node:test)          |
| `npm run lint`  | ESLint                          |
| `npm run build` | Production build into `dist/`   |
