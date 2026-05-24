# Billboard — Frontend

React application for the Billboard app. Built with TypeScript, Vite, Tailwind, shadcn/ui, Zustand and TanStack Query.

---

## Requirements

- Node.js 18+
- npm

---

## Setup

```bash
cd frontend
npm install
```

---

## Running

```bash
npm run dev
```

App available at `http://localhost:5173`.

> The backend must be running at `http://localhost:8000` for the app to work.

---

## Structure

```
frontend/
├── src/
│   ├── features/
│   │   ├── bills/
│   │   │   ├── components/
│   │   │   │   ├── BillCard.tsx       ← Single bill card
│   │   │   │   ├── BillFilters.tsx    ← Search, date and status filters
│   │   │   │   ├── BillForm.tsx       ← Add / edit bill modal
│   │   │   │   ├── BillList.tsx       ← List of bill cards
│   │   │   │   ├── BillStats.tsx      ← Total bills and total value
│   │   │   │   └── BillsPage.tsx      ← Main bills screen
│   │   │   ├── hooks/
│   │   │   │   ├── useBillsQuery.ts   ← TanStack Query for bills API
│   │   │   │   └── useBillsScreen.ts  ← Screen hook for BillsPage
│   │   │   └── index.ts               ← Public exports
│   │   └── groups/
│   │       ├── components/
│   │       │   └── GroupSettings.tsx  ← Settings panel for groups
│   │       ├── hooks/
│   │       │   ├── useGroupsQuery.ts        ← TanStack Query for groups API
│   │       │   └── useGroupSettingsScreen.ts ← Screen hook for GroupSettings
│   │       └── index.ts               ← Public exports
│   ├── services/
│   │   ├── http.ts                    ← Base fetch config
│   │   ├── bills.service.ts           ← Bills API calls
│   │   └── groups.service.ts          ← Groups API calls
│   ├── shared/
│   │   └── types/
│   │       ├── IBill.ts
│   │       ├── IBillPayload.ts
│   │       ├── IGroup.ts
│   │       ├── IGroupPayload.ts
│   │       └── EStatusFilter.ts
│   ├── lib/
│   │   └── utils.ts                   ← Tailwind merge utility
│   ├── components/
│   │   └── ui/                        ← shadcn/ui components
│   ├── App.tsx
│   └── main.tsx
└── agents/
    ├── bill_guy.md                    ← Bill Guy instructions for Copilot
    ├── harness/
    │   ├── progress.md                ← What's built and what's next
    │   ├── conventions.md             ← Frontend coding conventions
    │   └── context.json               ← Structured state between sessions
    └── skills/
        ├── SKILL.md                   ← How to build a feature
        ├── component_guide.md         ← Component, hook and store patterns
        └── examples/
            ├── feature.example.md
            └── store.example.md
```

---

## Conventions

All frontend conventions are documented in `agents/harness/conventions.md`. Key points:

- Feature-driven folder structure
- Arrow function components: `const Component = () => {}`
- Absolute imports via `@/`
- Static texts in a `TEXTS` object outside the component
- Two hooks per feature: query hook (TanStack Query) and screen hook
- Screen hooks never expose setters — only handlers and values
- One Zustand store per feature
- shadcn/ui components before building custom ones

---

## Bill Guy (Copilot mode)

The `agents/` folder contains Bill Guy — a set of instruction files that give Copilot context to build components consistently. Before asking Copilot to build anything, point it to the relevant files:

```
Read agents/bill_guy.md and agents/harness/conventions.md,
then build a [component name] following those conventions.
```