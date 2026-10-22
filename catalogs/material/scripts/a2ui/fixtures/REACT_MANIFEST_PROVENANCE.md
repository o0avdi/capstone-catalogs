# Storybook React Components Manifest Fixtures

This directory contains actual official Storybook 10.6.0 generated Components Manifest fixtures (`/manifests/components.json`), captured from isolated research builds on October 20, 2026.

## Manifest Provenance and Environment

| Attribute | Verified Value |
|---|---|
| Storybook Version | 10.6.0 (`@storybook/react-vite`) |
| Framework | React 19.2.0 / 19.3.0 |
| Manifest Schema Version | `v: 0` |
| Feature Flag | `features: { componentsManifest: true }` |
| Tool / Builder | Storybook CLI build (`storybook build --disable-telemetry`) |
| External Clones Pinned | Intro: `5cad2aa3f096ddd24fe24c62842e4e1d1a3958dd`<br>Shadbook: `53833334d5b3decc2ce6bb5e8bfdccc14790492e` |
| Local Component | `catalogs/material/src/shadcn/components/ui/button.tsx` |

## Fixture Inventory

### 1. `storybook-react-manifest.fixture.json` (54.8 KB)
Generated from the isolated harness build with TypeScript docgen and corrected TS project inclusion (`storybook-capstone-included`):
- `example-button`: Intro Storybook template Button with 5 source props (`primary`, `backgroundColor`, `size`, `label`, `onClick`).
- `components-button`: Shadbook Button with 3 manifest props (`variant`, `size`, `asChild`). Demonstrates CVA nullable unions.
- `research-capstonebutton`: Our React Aria Button (`src/shadcn/components/ui/button.tsx`) with 42 filtered manifest props under `reactDocgenTypescript.props`.
- `research-statewrapper`: Story without `meta.component`. Demonstrates the official `No component found` error (`MISSING_META_COMPONENT`).

### 2. `storybook-react-manifest-ts-error.fixture.json` (21.5 KB)
Generated from the isolated harness build before the capstone component was added to tsconfig `include` (`storybook-capstone`):
- `research-capstonebutton`: Demonstrates the official `react-docgen-typescript found no component docs` error (`INCOMPLETE_TS_MEMBERSHIP`).
- `research-statewrapper`: Demonstrates `No component found`.

### 3. `storybook-react-manifest-reactdocgen.fixture.json` (18.4 KB)
Generated from the isolated harness build using standard `react-docgen` (`RESEARCH_DOCGEN=default`, `storybook-default`):
- `example-button`: Demonstrates `reactDocgen` output shape with `tsType` structures (`boolean`, `string`, `union`, `signature`).
- `components-button`: Demonstrates `reactDocgen` yielding only 1 prop (`asChild`) due to inability to resolve external CVA types without TypeScript docgen.
- `research-statewrapper`: Demonstrates `No component found`.
