# Universal A2UI exporter

## A2UI v1.0 JSON workflow

Use `--protocol 1.0` for the integrated October sprint workflow. The compatibility
default remains v0.9 so existing JSON/ZIP automation and the verified renderer path
continue to work. `npm.cmd run export:a2ui` is also the legacy portable exporter;
use `npm.cmd run a2ui -- export --protocol 1.0` for v1.0.

PowerShell, from `catalogs/material`:

```powershell
.\node_modules\.bin\storybook.cmd index --config-dir .storybook --output-file angular-index.json
npm.cmd run a2ui -- discover --protocol 1.0 --angular-index angular-index.json --json
npm.cmd run a2ui -- export --protocol 1.0 --angular-index angular-index.json --components FinanceMetricCard,MaterialButton,MaterialCheckbox --outputs json --out ./a2ui-v1-export
```

To export a subset, supply `--components MaterialButton` and a fresh destination.
Names, registration names and indexed discovery IDs use the same selector. With
v1.0, `--all-ready` selects registered Angular source contracts; interactive mode
offers JSON only. Supplying a separate `--react-index` discovers React candidates,
but React contracts need reviewed source registrations/conversions before v1.0 export.

The official index controls included stories and identity. The exporter matches the
selected story paths to reviewed registrations, calls the existing `metadata.mjs`
source extractor, and passes those contracts to `makeCatalogV1`. Discovery fields
inferred from story args never become component schemas. Source initializers supply
defaults, and the Metric Card's required label/value, number|string unions and
optional subtitle survive extraction. Button projected text/click mappings and
Checkbox callback payload/host ownership are retained in diagnostic metadata.

Before reporting success, the exporter uses the pinned official v1.0 meta-schema
validator, structural validator and component-schema compiler. Only lossless field
shapes supported by the current generator are accepted; unsupported types/constraints
fail with instructions to add a reviewed conversion. There is no LLM/API-key step.

Successful v1.0 destinations contain exactly:

```text
catalog.json       One authoritative A2UI v1.0 catalog
components.json    Selected indexed identities and reviewed content/event/callback mappings
provenance.json    Official index version, SHA-256, docs and origin
diagnostics.json   Export status, source warnings and explicit renderer limitation
validation.json    Official meta-schema/structural results and component compilation result
```

The catalogId is the existing generator's stable
`https://capstone.example/catalogs/finance-material/1.0.0`, including subset exports;
check `protocolVersion` for wire version. It is not a content hash or a separately
hosted catalog per subset. Each destination contains one selected component set.

V1.0 emits no example wire messages, legacy catalog, ZIP or renderer. Requests for
`--outputs zip` or `json,zip` fail because the existing runtimes use v0.9 and have
not been tested against v1.0. Unsupported selected components fail the whole export
with actionable `diagnostics.json`; they are never silently omitted. Failed extraction
or validation does not publish a catalog. Invalid arguments/indexes and nonempty
destinations fail before writing. Always use a fresh destination, preventing stale
v0.9 messages or catalogs from being mixed into a v1.0 result.

The following output/renderer sections describe the retained **v0.9 compatibility
workflow**. Validation of a v1.0 JSON catalog does not establish renderer compatibility.

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

Prefer official index artifacts (PowerShell, from `catalogs/material`):

```powershell
.\node_modules\.bin\storybook.cmd index --config-dir .storybook --output-file angular-index.json
.\node_modules\.bin\storybook.cmd index --config-dir .storybook-shadcn --output-file react-index.json
npm.cmd run a2ui -- discover --angular-index angular-index.json --react-index react-index.json --json
npm.cmd run a2ui -- export --angular-index angular-index.json --components MaterialButton --outputs json --out ./indexed-export
```

Index file arguments resolve relative to the project. Supply either or both; Angular's
local index does not enumerate its composed React Storybook. The CLI consumes only
supplied artifacts and does not run Storybook itself. Generating an index runs trusted
project configuration/indexers; ingesting it reads source text without executing stories.

Index v5 is validated; invalid supplied indexes fail without falling back. Included CSF
paths and variants come exclusively from the index. Full story entries (IDs, titles,
display names, tags, import paths and componentPath observations), index version/hash
and associated docs are retained in candidate discovery provenance. All local docs,
including unattached MDX, remain in discovery `indexSources`; docs never become candidates.
Remote ref entries are diagnosed and excluded.

Candidate IDs use framework plus project-relative CSF path. Variants group by CSF path;
same-title files stay distinct. Shared titles/component paths across files require identity
review rather than automatic merging: componentPath alone does not identify an export.
Conflicting titles/component paths within one CSF path fail. Colliding generated names
are qualified deterministically. Index ingestion does not expand existing renderer support.

With no supplied index, compatibility mode uses static discovery and reports
`fallbackUsed: true` and `STATIC_DISCOVERY_FALLBACK`. Request it explicitly with
`--static-discovery`; combining that flag with index inputs fails. Static fallback rules:

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
