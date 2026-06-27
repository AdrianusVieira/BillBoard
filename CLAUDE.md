# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Billboard — a personal bill/expense tracker. Manage bills organized by groups, track due dates, mark payments. Currency is Brazilian Reais (R$). A Claude-powered agent ("Bill Guy") answers natural-language questions about bills.

## Commands

### Run everything
```bash
./start.sh
```

### Backend (Python/FastAPI)
```bash
cd backend
uv run uvicorn main:app --reload        # dev server on :8000
```
Requires `DATABASE_URL` in `backend/.env` (PostgreSQL via Supabase).

### Frontend (React/Vite)
```bash
cd frontend
npm run dev       # dev server on :5173
npm run build     # production build
npm run lint      # ESLint
```

No test suites exist yet in either backend or frontend.

## Architecture

### Backend (`backend/`)

FastAPI app with SQLModel ORM against PostgreSQL (Supabase-hosted).

- `main.py` — app entry, CORS, router registration, lifespan startup jobs
- `models.py` — three domain models: `Bill`, `Group`, `Recurrent` (each with Base/Create variants; Recurrent also has an Update variant)
- `database.py` — engine from `DATABASE_URL` env var, session generator
- `routers/` — CRUD endpoints: `bills.py` (`/bills`), `groups.py` (`/groups`), `recurrent.py` (`/recurrent`), `jobs.py` (`/jobs`)
- `jobs.py` — startup jobs: `generate_recurrent_bills` (creates next bill instance when latest term has passed) and `cleanup_old_bills` (deletes bills older than 6 months). Both run at app startup via lifespan.
- `agents/` — Claude-powered "Bill Guy" agent with subagents (`code_reader`, `db_reader`) and hooks (`pre_tool_use`, `post_tool_use`)

**Key domain relationships:** A `Bill` optionally belongs to a `Group` (via `group_id` FK) and optionally links to a `Recurrent` (via `recurrent_id` FK). Deleting a Recurrent decouples its linked bills (sets `recurrent_id = None`) rather than cascading deletes.

### Frontend (`frontend/`)

React 19 + TypeScript + Vite. Styling: Tailwind CSS v4 + shadcn/ui (Radix primitives). State: Zustand for groups store, TanStack Query for server state.

- `src/services/` — API layer using a thin `http.ts` fetch wrapper against `localhost:8000`
- `src/features/bills/` — main feature: `BillsPage` orchestrated by `useBillsScreen` hook (filtering, sorting, CRUD). Query hook in `useBillsQuery`.
- `src/features/groups/` — group management with Zustand store (`store.ts`) and query hook
- `src/features/recurrent/` — recurrent bill config with query hook
- `src/shared/interfaces/` — TypeScript interfaces (`IBill`, `IGroup`, `IRecurrent`, and their payload variants)
- Path alias: `@/` maps to `./src/`

**Data flow:** Components → screen hooks (`useBillsScreen`) → query hooks (`useBillsQuery`) → service functions → `http.ts` → backend API. Client-side filtering/sorting happens in screen hooks.
