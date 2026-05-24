# Billboard

A personal bill and expense tracking application. Manage bills across different property or cost groups, track due dates, and mark payments. Powered by a Python backend and a React frontend, with a Claude-powered agent called **Bill Guy** that can answer natural language questions about your bills and codebase.

---

## Project structure

```
billboard/
├── backend/       ← Python API (FastAPI + PostgreSQL)
├── frontend/      ← React app (Vite + TypeScript + Tailwind)
├── start.sh       ← starts both servers with one command
└── README.md
```

---

## Running the project

The easiest way is to use the start script from the repo root:

```bash
./start.sh
```

This starts both the backend and frontend, and opens the browser automatically.

---

Or run them manually in two separate terminals:

**Terminal 1 — Backend:**
```bash
cd backend
uv run uvicorn main:app --reload
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:5173`.
The API will be available at `http://localhost:8000`.

---

## Stack

| Layer | Tools |
|---|---|
| Backend | Python 3.11, FastAPI, SQLModel, PostgreSQL (Supabase), uv |
| Frontend | React, TypeScript, Vite, Tailwind, shadcn/ui, Zustand, TanStack Query |
| Agent | Anthropic SDK (Claude) |

---

## Glossary

| Term | Definition |
|---|---|
| Bill | A single financial obligation — something owed or paid. Belongs to a Group. |
| Group | A way to organize bills by context or origin (e.g. a property or cost center). |
| Value | The monetary amount of a bill, in Brazilian Reais (R$). |
| Term | The due date of a bill. Optional. |
| Referente a | A free-text note describing what period or item the bill refers to. Optional. |
| Paid / Unpaid | The payment status of a bill. |
| Dashboard | The main screen — displays bills with filters and summary stats. |
| Total bills | Count of bills visible given the active filters. |
| Total value | Sum of bill values visible given the active filters. |

---

## Future integrations
- Google Calendar API — sync bill due dates as calendar events
- Bill Guy runtime agent — Claude-powered assistant via Anthropic API