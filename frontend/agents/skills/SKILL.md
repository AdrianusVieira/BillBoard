# Skill: Build Frontend Feature

When building any new feature for Billboard, always follow this order:

## Step 1 — Read first
1. Read agents/harness/conventions.md
2. Read agents/skills/component_guide.md
3. Check agents/harness/progress.md to understand what already exists

## Step 2 — Create the folder structure
features/
└── your-feature/
├── components/
├── hooks/
├── store.js
└── index.js

## Step 3 — Build in this order
1. `store.js` — define the Zustand store first
2. `hooks/` — data fetching and business logic
3. `components/` — UI components last, they consume the hook
4. `index.js` — export everything cleanly

## Step 4 — Wire it up
1. Add the API calls to `services/api.js`
2. Import the feature in `App.jsx`

## Step 5 — Update the harness
1. Add built components to `harness/progress.md`
2. Update `harness/context.json` with last_session and features_built

## Rules
- Never skip the store before building components
- Never call fetch inside a component
- Always check if a shadcn/ui component exists before building custom ones
- Always use absolute imports via @/