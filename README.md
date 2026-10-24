# Storybook to A2UI catalog exporter

Export selected Angular, React TypeScript, or documented JavaScript/JSX components
as one validated A2UI v1.0 `catalog.json`. Bring your own A2UI renderer and agent;
no API key or LLM is needed. Storybook discovers stories, TypeScript and official
React docgen metadata supply contracts, and Ajv validates the generated catalog.

## Setup

From this repository root, in PowerShell (use `npm` outside Windows):

```powershell
cd catalogs/material
npm.cmd ci
```

Use Node 24 and the committed lockfile. Commands below run in `catalogs/material`.
The exporter stays in this repository; it is not an npm-published package.
On macOS/Linux, substitute `./node_modules/.bin/storybook` for `.\node_modules\.bin\storybook.cmd`
and `npm` for `npm.cmd`; use `mkdir -p <path>` for directory creation.

## Minimal Tracked Example & Independent Validation

A minimal, tracked reference catalog generated from verified `MaterialCheckbox` is committed
at [`examples/catalog.json`](examples/catalog.json) (56 lines). Developers cloning this repository
can immediately inspect or validate a compliant A2UI v1.0 catalog without building Storybook:

```powershell
# Validate the tracked example catalog against official A2UI v1.0 specifications
node -e "import('./scripts/a2ui/integration-v1.mjs').then(m => { import('node:fs').then(fs => { const cat = JSON.parse(fs.readFileSync('../../examples/catalog.json', 'utf8')); const res = m.validateV1Export(cat); console.log('A2UI v1.0 Validation Result:', res.valid ? 'PASS' : 'FAIL'); }); })"
```

Expected output: `A2UI v1.0 Validation Result: PASS`.
See [`examples/README.md`](examples/README.md) for full reproduction and schema validation details.

## Angular

Generate an official index using the existing Angular Storybook configuration,
then export the three verified components:

```powershell
# Pre-create the destination directory (Storybook index does not create missing parent directories)
New-Item -ItemType Directory -Path ../../research-output/developer-cli -Force

# Generate official Storybook index
.\node_modules\.bin\storybook.cmd index --config-dir .storybook --output-file ../../research-output/developer-cli/angular-index.json --disable-telemetry

# Export verified components to a single catalog.json
npm.cmd run a2ui -- export --catalog-only --angular-index ../../research-output/developer-cli/angular-index.json --components FinanceMetricCard,MaterialButton,MaterialCheckbox --catalog-id https://example.org/catalogs/angular/1 --title "Angular Demo" --description "Finance and Material source contracts." --out ../../research-output/developer-cli/angular-catalog
```

Result: `research-output/developer-cli/angular-catalog/catalog.json` from the
repository root. Unregistered Angular components with supported source inputs can
also export; projected content and outputs require reviewed mappings.

## React / JavaScript

This runnable example builds the included JSX fixture with documented PropTypes.
Its isolated configuration enables `features.componentsManifest: true` and
`typescript.reactDocgen: 'react-docgen'`; JavaScript is not converted to TypeScript.

```powershell
# Pre-create output directory
New-Item -ItemType Directory -Path ../../research-output/developer-cli -Force

# Install fixture dependencies and build Storybook with Components Manifest enabled
npm.cmd ci --prefix scripts/a2ui/fixtures/react-javascript --ignore-scripts --no-audit --no-fund
.\node_modules\.bin\storybook.cmd build --config-dir scripts/a2ui/fixtures/react-javascript/.storybook --output-dir ../../research-output/developer-cli/react-storybook --disable-telemetry

# Export StatusNotice from the official manifest
npm.cmd run a2ui -- export --catalog-only --react-index ../../research-output/developer-cli/react-storybook/index.json --react-manifest ../../research-output/developer-cli/react-storybook/manifests/components.json --components StatusNotice --catalog-id https://example.org/catalogs/react/1 --title "React Demo" --description "Documented JSX source contracts." --out ../../research-output/developer-cli/react-catalog
```

For your own React Storybook, build with Components Manifest enabled and point
`--project`, `--react-index` and `--react-manifest` at that project and its build.
Use TypeScript props or documented PropTypes that your docgen engine exposes.
Index v5 and inline Components Manifest v0 are supported. Callbacks, slots, object
props, missing types and uncertain contracts fail clearly. For TypeScript stories,
the compiler also checks direct `meta.component` identity, prop coverage and
requiredness against the manifest. Omitted inherited props block export; they are
not reconstructed from story args. JavaScript still requires documented PropTypes
and source review for metadata omissions.

Combine frameworks into a single unified catalog with the same CLI:

```powershell
npm.cmd run a2ui -- export --catalog-only --angular-index ../../research-output/developer-cli/angular-index.json --react-index ../../research-output/developer-cli/react-storybook/index.json --react-manifest ../../research-output/developer-cli/react-storybook/manifests/components.json --components MaterialCheckbox,StatusNotice --catalog-id https://example.org/catalogs/mixed/1 --title "Mixed Demo" --description "Angular and React source contracts." --out ../../research-output/developer-cli/mixed-catalog
```

## Storybook Version Requirements & Older Storybooks

- **Supported Storybook Index**: Version `v: 5` (Storybook 8.x, 9.x, and 10.x).
- **Supported React Components Manifest**: Schema version `v: 0` (`manifests/components.json`).
- **React manifest generation**: Storybook **>= 10.6.0** with builder feature flag
  (this minimum does not apply to Angular index-only export):
  ```ts
  // .storybook/main.ts
  export default {
    features: {
      componentsManifest: true,
    },
    // ...
  };
  ```

### Older Storybooks (< 10.6.0)
Storybook versions prior to 10.6.0 (such as 10.1.x, 8.x, or 7.x) silently ignore `features.componentsManifest`
and generate no `manifests/` directory, causing discovery to report `REACT_MANIFEST_REQUIRED`.

**How to Upgrade Safely (Avoid Broad Upgrades)**:
Do **not** perform broad project dependency upgrades (avoid upgrading React, TypeScript, Vite, or UI libraries),
which risks introducing breaking changes into your application. Instead:
1. In your external project, update its existing Storybook core, framework and addon
   devDependencies together to compatible versions `>= 10.6.0`, preserving its
   current builder. This repository already pins 10.6.0; use its committed lockfile.
2. Alternatively, run Storybook 10.6.0 in an isolated build harness targeting your existing component sources.
3. Add `features: { componentsManifest: true }` to `.storybook/main.ts` and run `storybook build -o ./storybook-static`.

## External Storybook Compatibility & Chromatic Audit Findings

The exporter was independently audited against `chromaui/intro-storybook-react-template`
(Storybook/Chromatic's public reference repository):
- **Real Component Behavior**: Out of the box, `Button` declarations in external libraries typically include
  interactive callbacks (such as `onClick: () => void`).
- **Safe Rejection**: The exporter steadfastly refuses to invent types or fabricate synthetic actions without a
  reviewed runtime adapter. When presented with the external `Button`, it halts safely with exit code `1` and
  an actionable diagnostic: `REACT_REVIEWED_MAPPING_REQUIRED`.
- **Scalar Contract Fidelity**: In an isolated test where `onClick` was removed to isolate scalar props,
  the exporter cleanly extracted `label`, `primary`, `backgroundColor`, and `size`, producing a strictly valid
  v1.0 catalog.
- **Important Boundary**: Isolated scalar-only evidence is proof that docgen AST types translate accurately,
  but is **not** proof that the complete Button API exports out of the box. Complete interactive components
  require an explicit, reviewed event/action mapping adapter.

## Selection and troubleshooting

```powershell
npm.cmd run a2ui -- discover --protocol 1.0 --angular-index ../../research-output/developer-cli/angular-index.json --json
npm.cmd run a2ui -- export --catalog-only --angular-index ../../research-output/developer-cli/angular-index.json --all-ready --diagnostics --out ../../research-output/developer-cli/angular-ready
```

`--components` accepts comma-separated names or exact IDs printed by discovery.
`--all-ready` exports supported contracts and summarizes rejected candidates by
reason code. Explicitly selecting any unsupported component fails the entire export.
`discover --json` shows every rejection; it lists readiness and does not export.

| Option | Behavior |
| --- | --- |
| `--catalog-only` | Selects v1.0 and writes exactly one `catalog.json` on success |
| `--catalog-id`, `--title`, `--description` | Override existing generator defaults; ID must be an absolute hierarchical HTTP(S) URI with a path (e.g., `https://example.org/catalogs/1`); both `$id` and `catalogId` match |
| `--diagnostics` | Adds `diagnostics.json`, `components.json`, `provenance.json`, `validation.json`; failed extraction writes only diagnostics |
| `--out` | Destination relative to your terminal directory; must be absent or empty, never overwritten |
| `--project` | Source project directory; index/manifest paths are relative to it |
| `--detect-artifacts` | Explicit opt-in to existing local build snapshots, with paths and freshness warning |
| `--reviewed-surfaces <JSON>` | Explicit reviewed React/TypeScript property subset; requires source identity, omission reasons and matching evidence. Full-contract checks remain the default; no renderer is supplied. |

> [!IMPORTANT]
> **Catalog ID Validator Requirements**: `--catalog-id` must be an absolute hierarchical HTTP or HTTPS URI
> with a path (e.g., `https://example.org/catalogs/angular/1`). While URNs (e.g. `urn:uuid:...`) pass initial
> CLI argument syntax checks, they are rejected during A2UI v1.0 validator compilation: relative JSON Schema
> references (`common_types.json#/$defs/...`) require a hierarchical base URI with a path component (RFC 3986 section 5;
> WHATWG URL throws `TypeError: Invalid URL` on opaque schemes).

Detection checks `storybook-static/index.json` when package dependencies identify
one framework, plus `storybook-static-angular`, `storybook-static-react`, and
`storybook-static-shadcn`. Ambiguous frameworks or multiple builds of one framework
require explicit index flags. Supplied indexes define the entire discovery scope;
detection never adds other indexes to them. A missing React manifest is sought only
at `manifests/components.json` beside the chosen React index. Explicit manifest
flags win. For example, replace `--react-manifest ...` above with `--detect-artifacts`.

Rebuild index and manifest together after source/config changes. Detection never
builds, selects by timestamp, or proves freshness. Identity checks and provenance
hashes cannot detect every stale contract. Invalid artifacts fail without fallback.

Existing `--protocol 1.0 --outputs json` retains diagnostic sidecars. Omitting both
`--protocol` and `--catalog-only` retains the historical v0.9 behavior. Catalog
metadata flags require v1.0; catalog-only rejects ZIP and protocol 0.9. Choose a new
output directory for each run. Defaults remain compatible; set your own catalog ID
for distribution rather than relying on the historical example identity.

## Validation and project history

```powershell
npm.cmd run build-storybook
npm.cmd run test:a2ui
```

The regression suite uses the built Angular index. See:

- [Sprint demo release audit](docs/SPRINT_DEMO_RELEASE_AUDIT.md)
- [Sponsor demonstration script](docs/SPONSOR_DEMO_SCRIPT.md)
- [Export plan and decisions](docs/A2UI_EXPORT_MVP_PLAN.md)
- [Historical exporter/renderer guide](catalogs/material/A2UI_EXPORTER_README.md)
- [Tracked example catalog](examples/catalog.json)

The original Finance Metric Card, Material Button and Material Checkbox renderer
path remains available; this release adds no renderer or agent.

The [real catalog pilot](catalogs/material/examples/real-catalog-pilot/README.md) records
Material Input/Tooltip/Card and Shadcn Separator/Badge/Progress compatibility,
including inherited props omitted by official docgen. Its reproducible example
includes direct source stories, captured official metadata and a validated
existing Material Checkbox control catalog. The complete contracts of those six
candidates remain unsupported.

## Reviewed A2UI subsets

An optional `--reviewed-surfaces <JSON>` can expose a deliberately limited,
reviewed React/TypeScript property contract. Full-contract strictness remains the
default. The actual existing Separator has an orientation-only standalone
example with all optional omissions explicitly reviewed; no renderer is supplied.
See the [review format, exact commands and validation checks](catalogs/material/examples/reviewed-export-surfaces/README.md)
and [recorded milestone results](docs/A2UI_EXPORT_MVP_PLAN.md).
