# Universal Storybook-to-A2UI exporter

This guide explains how to discover Storybook components, choose what to export, and produce A2UI JSON, a self-contained renderer ZIP, or both.

The exporter currently understands the Storybook layouts in this repository:

- Angular and Angular Material stories in `.stories.ts` files.
- React/Shadcn stories in `.stories.tsx` files.
- Explicitly registered Angular adapters for `FinanceMetricCard`, `MaterialButton`, and `MaterialCheckbox`.
- The shared React/Shadcn catalog-demo renderer for all currently discovered Shadcn components.

The exporter runs locally. It does not need an API key, an LLM, or a running Storybook server.

## 1. Install the project

Use Node.js **24.20.0** and npm **11.19.0** to match the maintained setup. From the repository root:

```sh
cd catalogs/material
npm ci
```

All commands in the rest of this guide run from `catalogs/material` unless stated otherwise.

## 2. See what the exporter found

Run:

```sh
npm run a2ui:discover
```

Discovery scans local Storybook source files without building or starting Storybook. It prints the generated component name, support status, available output types, and source story path.

The current catalog discovers 114 component story files: 50 Angular/Angular Material candidates and 64 React/Shadcn candidates.

Each component has one of three statuses:

| Status | Meaning | Available outputs |
| --- | --- | --- |
| `portable` | A reviewed registration and Angular renderer adapter exist. | JSON and ZIP |
| `custom` | A library-specific renderer path exists. Shadcn currently uses the included React catalog-demo renderer. | JSON and ZIP |
| `needs-configuration` | The story can be described as A2UI JSON, but no reviewed runtime adapter exists yet. | JSON only |

To receive the complete discovery result as machine-readable JSON, run:

```sh
npm run a2ui -- discover --json
```

## 3. Use the interactive exporter

Run:

```sh
npm run a2ui
```

The first checklist contains every discovered component and shows whether it supports JSON only or JSON plus ZIP.

Keyboard controls:

| Key | Action |
| --- | --- |
| Up/Down arrows | Move through the checklist |
| Enter or Space | Check or uncheck the highlighted item |
| `A` | Select all or clear all |
| `Q` or Escape | Cancel |

After choosing components, move to **Choose outputs** and press Enter. The second checklist lets you select:

- **Loose A2UI JSON files**
- **Self-contained renderer ZIP**
- Both options together

Move to **Review export**, press Enter, review the summary, and confirm the export. The default destination is `catalogs/material/a2ui-export`.

If any selected component is marked `needs-configuration`, ZIP export stops and identifies the components that need adapters. Choose JSON only, or add the missing adapters before requesting a ZIP.

## 4. Use the exporter in scripts or CI

The non-interactive command is:

```sh
npm run a2ui -- export \
  --components MaterialButton,ShadcnButton \
  --outputs json,zip \
  --out ./a2ui-export
```

Available options:

| Option | Purpose |
| --- | --- |
| `--project <path>` | Scan another supported Storybook project. The current directory is the default. |
| `--components <names>` | Export a comma-separated list of discovery IDs, generated component names, or registered names. |
| `--outputs <values>` | Choose `json`, `zip`, or `json,zip`. The default is both. |
| `--out <path>` | Set the destination directory. The default is `<project>/a2ui-export`. |
| `--all-ready` | Select every discovered component with renderer ZIP support. |
| `--json` | Print `discover` output as JSON. |
| `--help` | Show CLI help. |

You can also provide a project as a positional argument:

```sh
npm run a2ui -- discover /path/to/storybook-project
npm run a2ui -- /path/to/storybook-project
```

The second example opens the interactive exporter for that project.

### Common export recipes

Export one Shadcn component as loose JSON only:

```sh
npm run a2ui -- export \
  --components ShadcnButton \
  --outputs json \
  --out ./a2ui-shadcn-button-json
```

Export one registered Material component as a renderer ZIP only:

```sh
npm run a2ui -- export \
  --components MaterialButton \
  --outputs zip \
  --out ./a2ui-material-button-zip
```

Export Angular Material and Shadcn components together:

```sh
npm run a2ui -- export \
  --components MaterialButton,MaterialCheckbox,ShadcnButton,ShadcnCard \
  --outputs json,zip \
  --out ./a2ui-mixed-export
```

Export every component that currently has a renderer:

```sh
npm run a2ui -- export \
  --all-ready \
  --outputs json,zip \
  --out ./a2ui-all-ready
```

Use a new or empty destination for each export. The exporter refuses to overwrite a non-empty directory.

## 5. Understand the output

### JSON output

When `json` is selected, the destination contains:

```text
<output>/
├── catalog.json
├── messages.json
├── components.json
└── diagnostics.json
```

- `catalog.json` is the generated Draft 2020-12 A2UI custom catalog.
- `messages.json` contains deterministic A2UI v0.9 example message arrays for the selected components.
- `components.json` records normalized discovery data, source paths, variants, and renderer support.
- `diagnostics.json` explains readiness, renderer support, and known limitations.

JSON-only export is useful for inspecting contracts, feeding another A2UI workflow, or preparing an adapter for a component that does not yet have one.

### ZIP output

When `zip` is selected, the destination contains `a2ui-export.zip`. The archive is source-based and self-contained:

```text
a2ui-export.zip
├── README.md
├── manifest.json
├── catalog.json
├── messages.json
├── components.json
├── diagnostics.json
├── components/
│   └── <component name>/
│       ├── <original Storybook story>
│       └── <direct component source, when resolved>
└── renderers/
    ├── angular/   # included when registered Angular components were selected
    └── react/     # included when Shadcn components were selected
```

Yes, the ZIP includes the original selected story files and any directly resolved component source files under `components/`. These files preserve provenance and make the export inspectable.

The runnable renderer is under `renderers/angular` or `renderers/react`. A mixed export intentionally keeps the Angular and React applications separate because they use different frameworks and dependency graphs.

The ZIP does not contain `node_modules`, compiled dependency caches, symbolic links, or machine-specific absolute source paths. Each renderer includes its own `package.json`, lockfile, source, fixtures, and README so dependencies can be installed after extraction.

If both `json` and `zip` are selected, the four loose JSON files are written next to the ZIP, and the same contracts are also included inside the ZIP.

## 6. Run a renderer from the ZIP

Extract `a2ui-export.zip` into a new directory, then use the instructions for the renderer included in your selection.

### React/Shadcn renderer

```sh
cd renderers/react
npm ci
npm run build
npm start
```

Open http://localhost:3457. The page has a menu of deterministic fixtures for the selected Shadcn components. It also accepts Composer-style `RENDER_A2UI` and `GET_CATALOG` parent-frame messages.

### Angular renderer

```sh
cd renderers/angular
npm ci
npm run test:portable
npm run test:schema
npm run build
npm run test:runtime
npm start
```

Open the URL printed by Angular, normally http://localhost:3456. The exported renderer README contains its exact fixtures and runtime instructions.

For a mixed ZIP, install, test, and run the two renderer projects independently.

## 7. Validate the exporter in this repository

Run:

```sh
npm run build-storybook
npm run test:a2ui
```

The tests cover source discovery, mixed-framework selection, generated catalog and messages, CLI argument parsing, loose JSON output, deterministic Shadcn ZIP generation, unsupported ZIP refusal, and the registered Angular export path.

## 8. Safety behavior

The exporter stops instead of silently producing a partial or destructive result when:

- No component was selected.
- A selector is unknown or ambiguous.
- ZIP was requested for a component without a renderer adapter.
- An output name other than `json` or `zip` was supplied.
- The destination is the project itself or one of its parent directories.
- The destination directory already contains files.
- A source tree being packaged contains a symbolic link.

These checks are intended to keep exports deterministic and avoid overwriting project files.

## 9. Troubleshooting

### Interactive mode says a terminal is required

The checklist needs an interactive terminal. In CI, a redirected shell, or another non-interactive environment, use `export` with `--components` or `--all-ready` and `--outputs`.

### A component is missing

Confirm that its file:

- Is below the project's `src` directory.
- Uses `.stories.ts`, `.stories.tsx`, `.stories.js`, or `.stories.jsx`.
- Has declarative Component Story Format metadata that the static parser can read.

Run `npm run a2ui -- discover --json` to inspect the complete discovery record. Discovery does not require `storybook-static` or a running Storybook process.

### ZIP export says an adapter is required

The component is intentionally limited to JSON until its runtime behavior has been reviewed and mapped. Export it with `--outputs json`, or follow the registration guide in [`../../docs/EXPORT_ANOTHER_COMPONENT.md`](../../docs/EXPORT_ANOTHER_COMPONENT.md).

### The output directory is not empty

Choose a new `--out` path or move the previous export somewhere safe. The exporter does not delete or merge existing output.

### A selector is unknown or ambiguous

Copy the generated component name or full discovery ID from `npm run a2ui:discover`. Selectors are case-sensitive.

### Dependency installation fails after extracting the ZIP

Check `node --version` and `npm --version`, keep the exported lockfile intact, and retry `npm ci`. If the default npm cache is not writable, use a temporary writable cache:

```sh
npm ci --cache /tmp/a2ui-npm-cache
```

On Windows, replace that path with a writable temporary directory.

## 10. Add support for another component

Discovery and runtime support are separate on purpose. Finding a story is automatic; claiming that it can render arbitrary A2UI safely requires a reviewed adapter.

For Angular components, add a registration to `a2ui/registrations.json`, declare its bindings and events, provide its adapter and fixtures, and validate the generated schema/runtime behavior. See the [component registration guide](../../docs/EXPORT_ANOTHER_COMPONENT.md).

For another React component layout or another framework, add a renderer strategy that packages all required original sources and dependencies, reports ZIP support only when that strategy applies, and adds export/install/build tests.

The shorter [universal exporter contract](../../docs/UNIVERSAL_EXPORTER.md) documents the design boundary and output guarantees.

## Current support boundary

- All 114 discovered components can produce JSON.
- All 64 currently discovered Shadcn components can produce JSON and a React renderer ZIP.
- `FinanceMetricCard`, `MaterialButton`, and `MaterialCheckbox` can produce JSON and an Angular renderer ZIP.
- The other 47 Angular/Angular Material components remain JSON-only until reviewed adapters are added.
- Arbitrary callbacks, providers, custom functions, projected templates, and framework-specific state ownership are not inferred automatically from story source.

