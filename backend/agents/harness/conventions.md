# Conventions

## Coding patterns
- Models are split into Base, table, and Create classes (e.g. BillBase, Bill, BillCreate)
- Routers use Depends(get_session) for database access
- All endpoints return SQLModel objects or { "message": "..." } for deletes
- Only SELECT queries are allowed from agents

## Naming
- Files use snake_case
- Routes use plural nouns (e.g. /bills/, /groups/)
- Models use PascalCase

## Decisions made
- SQLite for local development, can be swapped to Postgres later
- BillCreate and GroupCreate schemas separate from table models to handle type conversion
- CORS allowed for http://localhost:5173 (Vite dev server)