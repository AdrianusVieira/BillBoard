# Frontend Conventions

## Component style
- Always use arrow functions: `const Component = () => {}`
- One component per file
- File name matches component name: `BillCard.tsx`
- Always use default export at the bottom

## Imports
- Always use absolute imports via `@/`
- Order: React → third party → internal features → internal components → styles

## Static texts
- All static strings live in a `TEXTS` object outside the component
- Never hardcode strings inside JSX

## Folder structure per feature
features/
└── bills/
├── components/    ← UI components for this feature
├── hooks/         ← query hooks and screen hooks
└── index.ts       ← public exports for this feature

## Hooks
- Two types of hooks per feature:
  - `useFeatureQuery.ts` — TanStack Query, talks to the service, handles caching
  - `useFeatureScreen.ts` — screen hook, owns state and logic, feeds the component
- Screen hooks never expose setters — only handlers and values
- Handlers are always prefixed with `handle`
- Properties returned are in alphabetical order

## Screen hook structure
```ts
return {
  // values first, alphabetical
  description,
  editing,
  error,
  groups,
  loading,
  name,
  // handlers after, alphabetical
  handleCancel,
  handleChangeDescription,
  handleChangeName,
  handleEdit,
  handleRemove,
  handleSubmit,
}
```

## Component structure
- Static texts in a `TEXTS` object at the top
- Sub-render functions for sections: `showLoading`, `showError`, `showGroups`, `showForm`
- A `shouldRenderContent` boolean to control main content visibility
- Sub-render functions use arrow shorthand: `const showForm = () => (...)`

## Zustand stores
- One store per feature
- Store naming: `useBillStore`, `useGroupStore`
- Only store data that needs to be shared across components
- Local UI state (open/close modal) stays in the component with useState

## API calls
- All fetch calls live in `services/[feature].service.ts`
- Shared fetch config in `services/http.ts`
- Hooks call the service, never fetch directly

## shadcn/ui
- Always check `@/components/ui` before building a custom component
- Never modify shadcn components directly — wrap them instead

## Styling
- Use Tailwind utility classes
- No inline styles
- No separate CSS files per component

## TypeScript
- Interfaces live in `src/shared/types/`
- Naming: `IGroup`, `IGroupPayload`, `IBill`, `IBillPayload`
- Examples are `.md` files in `agents/skills/examples/`