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

## Angular

Generate an official index using the existing Angular Storybook configuration,
then export the three verified components:

```powershell
.\node_modules\.bin\storybook.cmd index --config-dir .storybook --output-file ../../research-output/developer-cli/angular-index.json --disable-telemetry
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
npm.cmd ci --prefix scripts/a2ui/fixtures/react-javascript --ignore-scripts --no-audit --no-fund
.\node_modules\.bin\storybook.cmd build --config-dir scripts/a2ui/fixtures/react-javascript/.storybook --output-dir ../../research-output/developer-cli/react-storybook --disable-telemetry
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

Combine frameworks with the same CLI:

```powershell
npm.cmd run a2ui -- export --catalog-only --angular-index ../../research-output/developer-cli/angular-index.json --react-index ../../research-output/developer-cli/react-storybook/index.json --react-manifest ../../research-output/developer-cli/react-storybook/manifests/components.json --components MaterialCheckbox,StatusNotice --catalog-id https://example.org/catalogs/mixed/1 --title "Mixed Demo" --description "Angular and React source contracts." --out ../../research-output/developer-cli/mixed-catalog
```

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
| `--catalog-id`, `--title`, `--description` | Override existing generator defaults; ID must be an absolute HTTP(S) URI or URN without whitespace/fragments; both `$id` and `catalogId` match |
| `--diagnostics` | Adds `diagnostics.json`, `components.json`, `provenance.json`, `validation.json`; failed extraction writes only diagnostics |
| `--out` | Destination relative to your terminal directory; must be absent or empty, never overwritten |
| `--project` | Source project directory; index/manifest paths are relative to it |
| `--detect-artifacts` | Explicit opt-in to existing local build snapshots, with paths and freshness warning |

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

The regression suite uses the built Angular index. See the
[developer CLI release result](research-output/DEVELOPER_CLI_RELEASE_RESULT.md),
[export plan and decisions](docs/A2UI_EXPORT_MVP_PLAN.md), and
[historical exporter/renderer guide](catalogs/material/A2UI_EXPORTER_README.md).
The original Finance Metric Card, Material Button and Material Checkbox renderer
path remains available; this release adds no renderer or agent.

The [real catalog pilot](research-output/REAL_CATALOG_PILOT_RESULT.md) records
Material Input/Tooltip/Card and Shadcn Separator/Badge/Progress compatibility,
including inherited props omitted by official docgen. The small
[reproducible example](catalogs/material/examples/real-catalog-pilot/README.md)
includes direct source stories, captured official metadata and a validated
existing Material Checkbox control catalog. The complete contracts of those six
candidates remain unsupported.

## Reviewed A2UI subsets

An optional `--reviewed-surfaces <JSON>` can expose a deliberately limited,
reviewed React/TypeScript property contract. Full-contract strictness remains the
default. The actual existing Separator has an orientation-only standalone
example with all optional omissions explicitly reviewed; no renderer is supplied.
See the [review format and exact commands](catalogs/material/examples/reviewed-export-surfaces/README.md)
and [validation results](research-output/REVIEWED_EXPORT_SURFACE_RESULT.md).
