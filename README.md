# Backend - Invoice Task

This folder contains the Express backend (SQLite) for the invoice demo.

Prerequisites
- Node.js (v16+)
- Docker (optional, recommended for deployment)

Quick start (dev)
```bash
cd backend
npm install
npm start
```
The server starts on port `5000` by default (or `process.env.PORT`).

API (JSON)
- GET /invoices
- POST /invoices
  - body: `{ "amount": 100, "customer": "Acme", "due_date": "2026-01-10", "description": "Web work" }`
- GET /invoices/:id
- PUT /invoices/:id
  - body: any of `{ amount, status, customer, due_date, description }`
- DELETE /invoices/:id
- POST /payments
  - body: `{ "invoiceId": "<id>", "card": { "number": "4242424242424242", "name": "Name", "expiry": "12/25", "cvc": "123" } }`
  - The server validates basic card formats and stores only masked card info (`last4`, `name`, `expiry`).

Database
- SQLite file: `backend/data.db` (created automatically on first run).
- `backend/src/db.js` bootstraps tables and will add missing columns (`customer`, `due_date`, `description`) if present.

Docker
- Build image:
  ```bash
  docker build -t invoice-backend ./backend
  ```
- Run (exposes port 5000):
  ```bash
  docker run -p 5000:5000 -v $(pwd)/backend/data.db:/app/data.db invoice-backend
  ```
- Or use the repository root `docker-compose.yml` to bring frontend + backend up together:
  ```bash
  docker compose up -d --build
  ```

Notes
- This project uses `better-sqlite3` (native module). If building inside Docker fails, ensure build tools are available (e.g., `build-essential` / `make` / `python`) or use the provided Dockerfile which typically works on common hosts.
- Security: This is a demo only. Do not send real card numbers to the demo backend in production. Integrate a PCI-compliant payment provider for real apps.

Troubleshooting
- Port in use: set `PORT` env var or stop the process that occupies `5000`.
- Reset DB: delete `backend/data.db` and restart — the schema will recreate.
