# Progress

## Done

- [x] Vite + React project initialized
- [x] Tailwind configured
- [x] shadcn/ui dependencies installed
- [x] path alias @ configured
- [x] Feature-driven folder structure created
- [x] Bill Guy agent files created

## Next

- [ ] Write SKILL.md and component_guide.md
- [ ] Build services/api.js
- [ ] Build groups feature
- [ ] Build bills feature
- [ ] Wire everything in App.jsx

## Components built

_Updated by Bill Guy after each session._
_Updated by Bill Guy after each session._

- [x] Make modals opaque with white background and shadow (BillForm & Settings) — 2026-05-24
- [x] Convert BillForm and Settings modals to shadcn-style accessible Dialog components (theme-aware) — 2026-05-24

- [x] Add hover/focus/clickable states to buttons and clickable components (BillCard, BillForm, BillFilters, BillsPage, GroupSettings) — 2026-05-25

## Decisions made

- shadcn/ui for reusable components
- Zustand for state management, one store per feature
- Feature-driven folder structure
- Loading and error states handled inside hooks
- Absolute imports via @/
