# Frontend Conventions

## Component style
- Always use arrow functions: `const Component = () => {}`
- One component per file
- File name matches component name: `BillCard.jsx`
- Always use default export at the bottom

## Imports
- Always use absolute imports via `@/`
- Order: React → third party → internal features → internal components → styles

## Folder structure per feature