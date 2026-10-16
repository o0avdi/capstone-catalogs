# Universal A2UI exporter

## Product contract

The CLI has one discovery and selection experience for Angular Material and React/Shadcn Storybook sources. It does not equate “a TSX file exists” with “a safe renderer exists.” Static discovery groups story variants, connects known registrations, records direct source files when they can be resolved, and reports output support before writing anything.

Run from `catalogs/material`:

```sh
npm run a2ui:discover
npm run a2ui
```

The interactive checklist uses arrow keys, Enter/Space to toggle, `A` to select or clear all, and `Q` to cancel. Move to the final row and press Enter to continue or export.

For automation:

```sh
npm run a2ui -- export \
  --components MaterialButton,ShadcnButton \
  --outputs json,zip \
  --out ./a2ui-export
```

Selectors may be canonical generated names, explicit registration names, or full discovery IDs. Unknown and ambiguous selections fail rather than disappearing.

## Outputs

JSON output writes:

```text
catalog.json       Draft 2020-12 A2UI custom catalog
messages.json      deterministic v0.9 example message arrays
components.json    normalized discovery records and source provenance
diagnostics.json   readiness, renderer support and limitations
```

ZIP output is self-contained source, not a compiled binary:

```text
a2ui-export.zip
├── catalog.json
├── messages.json
├── components.json
├── diagnostics.json
├── manifest.json
├── components/
│   └── <selected component>/
│       ├── original story
│       └── direct component source, when resolved
└── renderers/
    ├── angular/   registered Material components, when selected
    └── react/     selected Shadcn catalog components, when selected
```

Each renderer includes its own README, package manifest and lockfile. Dependencies are installed after extraction; `node_modules` is never archived. A mixed ZIP deliberately keeps Angular and React runtimes separate rather than pretending they share one component implementation.

Selecting `zip` for a `needs-configuration` candidate fails with its component name. JSON-only output remains available so the extracted contract can be reviewed before an adapter is authored.

## Discovery rules

- Scan local `.stories.ts`, `.stories.tsx`, `.stories.js`, and `.stories.jsx` files below `src`.
- Read declarative CSF title, args, argTypes and exported story names through the TypeScript parser without importing or executing the file.
- Classify titles beginning with `Material/` as Angular Material and `Shadcn/` as Shadcn.
- Match explicit registrations by normalized project-relative story path.
- Resolve the current Shadcn layout convention `src/shadcn/components/ui/<story-name>.tsx` when present.
- Give every candidate a stable project-relative discovery ID and a valid generated A2UI component name.

Story controls and examples are evidence, not authoritative runtime semantics. Complex callbacks, providers, projected content, state ownership and framework behavior still require an adapter or the bounded Shadcn catalog-demo renderer.

## Validation

```sh
npm run build-storybook
npm run test:a2ui
```

The tests cover source discovery without a Storybook index, mixed-framework selection, catalog/messages, CLI flag parsing, loose JSON output, deterministic Shadcn ZIP generation, unsupported ZIP refusal, and all prior registered Angular extraction/schema tests.

For an extracted mixed ZIP, validate each included renderer independently:

```sh
cd renderers/react
npm ci
npm run build

cd ../angular
npm ci
npm run test:portable
npm run test:schema
npm run build
npm run test:runtime
```

## Current boundary

All 64 local Shadcn story files are discoverable and use the included React catalog-demo renderer. The registered Angular renderer remains fully supported for FinanceMetricCard, MaterialButton and MaterialCheckbox. Other Angular stories generate JSON but intentionally remain `needs-configuration` for ZIP output until their templates, events and dependencies receive reviewed adapters.
