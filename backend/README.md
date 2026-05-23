# Billboard

A personal bill and expense tracking application. Manage bills across different property or cost groups, track due dates, and mark payments. Powered by a Python backend with a Claude-powered agent called **Bill Guy** that can answer natural language questions about your bills and codebase.

---

## Running the backend

```bash
cd backend
uv run uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`.

---

## Repo structure

```
billboard/
├── backend/
│   ├── main.py            ← FastAPI app entry point
│   ├── models.py          ← Bill and Group data models
│   ├── database.py        ← DB connection and session setup
│   ├── routers/
│   │   ├── bills.py       ← Bill endpoints (CRUD)
│   │   └── groups.py      ← Group endpoints (CRUD)
│   └── agents/
│       └── bill_guy.py    ← Claude-powered bill assistant
├── frontend/
│   └── (React + Vite app)
└── README.md
```

---

## API endpoints

### Groups
| Method | Endpoint | Description |
|---|---|---|
| GET | `/groups/` | List all groups |
| POST | `/groups/` | Create a group |
| PUT | `/groups/{id}` | Update a group |
| DELETE | `/groups/{id}` | Delete a group |

### Bills
| Method | Endpoint | Description |
|---|---|---|
| GET | `/bills/` | List all bills |
| POST | `/bills/` | Create a bill |
| PUT | `/bills/{id}` | Update a bill |
| DELETE | `/bills/{id}` | Delete a bill |

---

## Bill Guy — the agent

Bill Guy is a Claude-powered agent that lives in `backend/agents/bill_guy.py`. He can answer natural language questions about the project by using three tools:

- `read_file` — reads any file in the repo to answer code questions
- `query_db` — queries the database to answer data questions
- `get_glossary` — returns the project glossary for context on domain terms

Example questions Bill Guy can answer:
- "What endpoints do I have?"
- "Which bills are unpaid?"
- "What does BillCreate do?"
- "How much do I owe this month?"

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
| Dashboard | The main screen of the app — displays bills with filters and summary stats. |
| Total bills | Count of bills visible given the active filters. |
| Total value | Sum of bill values visible given the active filters. |

---

## Stack

| Layer | Tools |
|---|---|
| Backend | Python 3.11, FastAPI, SQLModel, SQLite, uv |
| Frontend | React, Vite |
| Agent | Anthropic SDK (Claude) |