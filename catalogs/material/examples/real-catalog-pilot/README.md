# Real catalog compatibility pilot

`verified-checkbox/catalog.json` is a freshly generated, validated **existing**
Material Checkbox control. It is not a new support claim. The six new candidates
(Material Input/Tooltip/Card; Shadcn Separator/Badge/Progress) remain unsupported
because their complete source contracts need reviewed mappings. See the
[results and three-minute demo](../../../../research-output/REAL_CATALOG_PILOT_RESULT.md).

Run from `catalogs/material`, using the existing Node 24 installation and lockfile.
No API key, renderer, LLM or dependency upgrade is needed.

## Quick sponsor reproduction

```powershell
New-Item -ItemType Directory -Force ../../research-output/pilot-demo | Out-Null
.\node_modules\.bin\storybook.cmd index --config-dir .storybook --output-file ../../research-output/pilot-demo/angular-index.json --disable-telemetry
npm.cmd run a2ui -- export --catalog-only --angular-index ../../research-output/pilot-demo/angular-index.json --components MaterialCheckbox --catalog-id https://example.org/catalogs/real-catalog-pilot/checkbox/1 --title "Verified Material Checkbox" --description "Existing reviewed Material Checkbox source contract; compatibility pilot control." --out ../../research-output/pilot-demo/checkbox
node examples/real-catalog-pilot/verify.mjs ../../research-output/pilot-demo/checkbox/catalog.json
npm.cmd run a2ui -- export --catalog-only --react-index examples/real-catalog-pilot/evidence/index.json --react-manifest examples/real-catalog-pilot/evidence/components.json --all-ready --out ../../research-output/pilot-demo/rejected
```

The final command intentionally fails with `Supported: 0/6`; it publishes no
catalog. Use fresh output directories on repeats. The checked-in React artifacts
are a reproducible snapshot of a real build, not fresh metadata or fabricated
schemas. To inspect an explicit rejection and retain details:

```powershell
npm.cmd run a2ui -- export --catalog-only --react-index examples/real-catalog-pilot/evidence/index.json --react-manifest examples/real-catalog-pilot/evidence/components.json --components react:examples/real-catalog-pilot/Separator.stories.tsx --diagnostics --out ../../research-output/pilot-demo/separator-rejected
```

## Rebuild the official evidence

The normal Angular tsconfig excludes Shadcn TSX. `prepare.mjs` makes byte-identical
source copies in an **absent** workspace destination, links the already installed
node_modules, and supplies an isolated React tsconfig. It records SHA-256 hashes
and does not modify library source, normal configs, dependencies or lockfiles.
The isolated configuration enables Components Manifest, uses the installed
React/Vite framework and keeps `propFilter: () => true`. Storybook still applies
its separate bulk inherited-prop filter; the exporter's TypeScript audit detects
the omissions. Direct stories import actual `Separator`, `Badge` and `Progress`.
Original ComponentDemo presentation stories are also included unchanged.

```powershell
New-Item -ItemType Directory -Force ../../research-output/real-catalog-pilot | Out-Null
.\node_modules\.bin\storybook.cmd index --config-dir .storybook --output-file ../../research-output/real-catalog-pilot/angular-index.json --disable-telemetry
.\node_modules\.bin\storybook.cmd index --config-dir .storybook-shadcn --output-file ../../research-output/real-catalog-pilot/react-index.json --disable-telemetry
node examples/real-catalog-pilot/prepare.mjs
Push-Location ../../research-output/real-catalog-pilot/isolated
.\node_modules\.bin\storybook.cmd build --config-dir examples/real-catalog-pilot/.storybook --output-dir ../shadcn-complete --disable-telemetry
Pop-Location
node examples/real-catalog-pilot/capture.mjs
npm.cmd run a2ui -- discover --protocol 1.0 --project ../../research-output/real-catalog-pilot/isolated --react-index ../shadcn-complete/index.json --react-manifest ../shadcn-complete/manifests/components.json --json
npm.cmd run test:a2ui
```

`capture.mjs` checks that staged library files still match the originals. It keeps
the official React index, makes only docgen source paths project-relative, and
captures an Angular index subset with entries unchanged. `evidence/capture.json`
records transformations and original artifact/source hashes. Build directories and
the disposable source copy are ignored by Git; only small metadata snapshots,
stories, scripts and the control catalog belong in review.

For an independent repetition, pass an absent destination to `prepare.mjs`, build
from that directory, then pass build, staged source and Angular index paths to
`capture.mjs`. Never point the build output at source directories. The preparer
does not clean or overwrite an existing destination.

## What the tests protect

```powershell
node --test --test-isolation=none scripts/a2ui/real-catalog-pilot.test.mjs
node examples/real-catalog-pilot/verify.mjs
```

Tests cover real wrapper rejection, docgen omissions, unsupported slots/render
callbacks, missing inherited events, forged partial metadata, requiredness and
identity mismatch, and failure without partial catalogs. A tiny unit-only typed
function verifies audit invariants; it is never counted as a real-library success.
