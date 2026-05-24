# Billboard — Backend

Python REST API for the Billboard app. Built with FastAPI, SQLModel and SQLite.

---

## Requirements

- Python 3.11+
- [uv](https://astral.sh/uv)

---

## Setup

```bash
cd backend
uv sync
```

Create a `.env` file:

```
ANTHROPIC_API_KEY=your-key-here
```

---

## Running

```bash
uv run uvicorn main:app --reload
```

API available at `http://localhost:8000`.
Interactive docs at `http://localhost:8000/docs`.

---

## Structure

```
backend/
├── main.py            ← FastAPI app entry point
├── models.py          ← Bill and Group data models
├── database.py        ← DB connection and session setup
├── routers/
│   ├── bills.py       ← Bill endpoints (CRUD)
│   └── groups.py      ← Group endpoints (CRUD)
└── agents/
    ├── bill_guy.py    ← Main agent entry point
    ├── agent.md       ← Main agent instructions
    ├── subagents/
    │   ├── db_reader.py      ← Queries the database
    │   ├── db_reader.md      ← DB reader instructions
    │   ├── code_reader.py    ← Reads repo files
    │   └── code_reader.md    ← Code reader instructions
    ├── harness/
    │   ├── progress.md       ← What's done and what's next
    │   ├── conventions.md    ← Coding decisions and patterns
    │   └── context.json      ← Structured state between sessions
    ├── skills/
    │   └── query_bills/
    │       ├── SKILL.md      ← Instructions for querying bills
    │       └── example.sql   ← Reference queries
    └── hooks/
        ├── pre_tool_use.py   ← Blocks dangerous operations
        └── post_tool_use.py  ← Logs actions after execution
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

**Group payload:**
```json
{
  "name": "Ville Sofia",
  "description": "Bills related to Ville Sofia property"
}
```

### Bills

| Method | Endpoint | Description |
|---|---|---|
| GET | `/bills/` | List all bills |
| POST | `/bills/` | Create a bill |
| PUT | `/bills/{id}` | Update a bill |
| DELETE | `/bills/{id}` | Delete a bill |

**Bill payload:**
```json
{
  "name": "[VilleSofia] Fatura CEMIG",
  "value": 126.05,
  "group_id": 1,
  "term": "2026-05-25",
  "ref": "Maio 2026",
  "paid": false
}
```

---

## Bill Guy

Bill Guy is a Claude-powered agent that answers natural language questions about the codebase and bill data.

```bash
uv run python agents/bill_guy.py
```

Example questions:
- "Which bills are unpaid?"
- "How much do I owe this month?"
- "What does BillCreate do?"
- "Which bills are overdue?"

Requires `ANTHROPIC_API_KEY` in `.env`.