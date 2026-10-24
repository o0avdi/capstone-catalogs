# A2UI v1.0 Exporter — Sprint Sponsor Demonstration Script

**Date**: October 30, 2026 Sprint Review
**Audience**: Project Sponsors, Technical Leads, and Stakeholders
**Goal**: Demonstrate that the Storybook to A2UI v1.0 Exporter deterministically converts component source contracts into strict, validated A2UI v1.0 `catalog.json` definitions across Angular and React/JSX, while enforcing strict contract fidelity and safe rejection when components contain unmapped callbacks.

---

## Preparation and Quality Gate Pre-Check (< 1 minute)

Before the timed demo, install from the committed lockfile, build the Angular
Storybook index and run the complete suite. The integrated branch should pass at
least 134 tests, including the reviewed export surfaces; the original audit ran 112.

```powershell
cd catalogs/material
npm.cmd ci
npm.cmd run build-storybook
npm.cmd run test:a2ui
```

**Talking Point for Sponsors**:
> *"Our release candidate has at least 134 passing automated tests covering Angular AST parsing, React docgen metadata extraction, reviewed export surfaces, strict JSON Schema Draft 2020-12 compliance, cross-framework merging, and negative validation safety checks. Zero tests are skipped."*

Run the remaining commands from `catalogs/material`. Use absent or empty export
destinations; choose new paths when repeating the demo. Installation, builds and
the full test run are preparation time, outside the five-minute presentation.

---

## Demonstration 1: Angular Component Export (< 1 minute)

Export three verified Angular components (`FinanceMetricCard`, `MaterialButton`, `MaterialCheckbox`) from the existing Storybook index into a single, clean `catalog.json`.

```powershell
# 1. Pre-create output directory (avoids ENOENT in Storybook CLI)
New-Item -ItemType Directory -Path ../../research-output/demo-artifacts -Force

# 2. Generate official Storybook index
.\node_modules\.bin\storybook.cmd index --config-dir .storybook --output-file ../../research-output/demo-artifacts/angular-index.json --disable-telemetry

# 3. Export validated A2UI v1.0 catalog
npm.cmd run a2ui -- export --catalog-only `
  --angular-index ../../research-output/demo-artifacts/angular-index.json `
  --components FinanceMetricCard,MaterialButton,MaterialCheckbox `
  --catalog-id https://example.org/catalogs/angular/demo `
  --title "Angular Sponsor Demo" `
  --description "Verified Angular Material and Finance widgets." `
  --out ../../research-output/demo-artifacts/angular-catalog
```

**What to Show on Screen**:
1. Check the output directory:
   ```powershell
   Get-ChildItem ../../research-output/demo-artifacts/angular-catalog
   ```
   *Show that exactly one file exists: `catalog.json`.*
2. Inspect `catalog.json`:
   - Highlight the root `$id` and `catalogId` matching `https://example.org/catalogs/angular/demo`.
   - Point out `MaterialCheckbox`: has `label`, `checked` (boolean), `disabled` (boolean), and `action` (interaction handler).
   - Point out that wire envelope `id` does NOT leak into component properties.
   - Point out `discriminator: { "propertyName": "component" }`.

**Talking Point for Sponsors**:
> *"With `--catalog-only`, the exporter produces exactly one production-ready `catalog.json`. All source inputs, JSDoc descriptions, required properties, and reviewed action mappings are preserved faithfully."*

---

## Demonstration 2: React JavaScript/JSX Component Export (< 1 minute)

Export the documented React JSX `StatusNotice` component directly from an official Storybook Components Manifest without converting JavaScript to TypeScript.

```powershell
# 1. Install isolated fixture dependencies and build Storybook with Components Manifest enabled
npm.cmd ci --prefix scripts/a2ui/fixtures/react-javascript --ignore-scripts --no-audit --no-fund
.\node_modules\.bin\storybook.cmd build --config-dir scripts/a2ui/fixtures/react-javascript/.storybook --output-dir ../../research-output/demo-artifacts/react-storybook --disable-telemetry

# 2. Export StatusNotice from official manifest
npm.cmd run a2ui -- export --catalog-only `
  --react-index ../../research-output/demo-artifacts/react-storybook/index.json `
  --react-manifest ../../research-output/demo-artifacts/react-storybook/manifests/components.json `
  --components StatusNotice `
  --catalog-id https://example.org/catalogs/react/demo `
  --title "React JSX Sponsor Demo" `
  --description "Documented React JSX source contracts." `
  --out ../../research-output/demo-artifacts/react-catalog
```

**What to Show on Screen**:
1. View `catalog.json`:
   - Show `StatusNotice` properties: `label` (required string), `type` (enum: `"info" | "success" | "warning" | "error"`), `count` (number), `pinned` (boolean).
   - Point out that all types were derived from standard React `PropTypes` via Storybook's `react-docgen` builder.

**Talking Point for Sponsors**:
> *"For React and JSX teams, our exporter reads the official Storybook Components Manifest. Teams do not need to rewrite their JavaScript components in TypeScript. Validated PropTypes map directly into JSON Schema types."*

---

## Demonstration 3: Mixed Cross-Framework Catalog Export (< 1 minute)

Combine both Angular (`MaterialCheckbox`) and React JSX (`StatusNotice`) into a single unified A2UI v1.0 catalog.

```powershell
npm.cmd run a2ui -- export --catalog-only `
  --angular-index ../../research-output/demo-artifacts/angular-index.json `
  --react-index ../../research-output/demo-artifacts/react-storybook/index.json `
  --react-manifest ../../research-output/demo-artifacts/react-storybook/manifests/components.json `
  --components MaterialCheckbox,StatusNotice `
  --catalog-id https://example.org/catalogs/mixed/demo `
  --title "Unified Cross-Framework Catalog" `
  --description "Unified Angular and React component catalog." `
  --out ../../research-output/demo-artifacts/mixed-catalog
```

**What to Show on Screen**:
1. View `mixed-catalog/catalog.json`:
   - Point out `$defs.anyComponent.oneOf` containing `$ref` pointers to both `#/components/MaterialCheckbox` and `#/components/StatusNotice`.
   - Show neutral, non-hardcoded title and instructions.

**Talking Point for Sponsors**:
> *"Enterprise design systems often span multiple front-end frameworks. A single command produces a unified A2UI catalog where an AI agent can select either an Angular or React component through a single standard interface."*

---

## Demonstration 4: Safe Rejection & Contract Fidelity (< 1 minute)

Demonstrate what happens when a developer attempts to export a component with unmapped callbacks or insufficient metadata:

```powershell
# Attempt to export InteractiveNotice (declares an unmapped onDismiss callback and children slot)
npm.cmd run a2ui -- export --catalog-only `
  --react-index ../../research-output/demo-artifacts/react-storybook/index.json `
  --react-manifest ../../research-output/demo-artifacts/react-storybook/manifests/components.json `
  --components InteractiveNotice `
  --catalog-id https://example.org/catalogs/rejected/demo `
  --title "Rejected Demo" `
  --description "Should fail safely." `
  --out ../../research-output/demo-artifacts/rejected-catalog
```

**What to Show on Screen**:
1. The command fails immediately with exit code `1`.
2. The error output clearly explains:
   ```text
   Error: react:InteractiveNotice.stories.jsx: onDismiss: Callback or projected content.
   An explicit reviewed A2UI mapping is required. This CLI currently exports scalar
   React contracts only; implement and test a lossless mapping before selecting this component.
   ```
3. Check the destination directory:
   ```powershell
   Test-Path ../../research-output/demo-artifacts/rejected-catalog
   ```
   *Show that `False` is returned — no partial, broken, or corrupt catalog was written to disk.*

**Talking Point for Sponsors**:
> *"This is the most critical safety feature of the exporter. Rather than silently dropping interactive callbacks like `onClick` or fabricating synthetic fake actions, the exporter halts safely. It guarantees that any generated catalog is 100% faithful to the component's actual runtime capabilities."*

---

## Demonstration 5: Validating the Tracked Example (< 30 seconds)

Show sponsors that a tracked reference example is committed in the repository and can be validated immediately:

```powershell
node -e "import('./scripts/a2ui/integration-v1.mjs').then(m => { import('node:fs').then(fs => { const cat = JSON.parse(fs.readFileSync('../../examples/catalog.json', 'utf8')); const res = m.validateV1Export(cat); console.log('A2UI v1.0 Validation Result:', res.valid ? 'PASS' : 'FAIL'); }); })"
```

Output:
```text
A2UI v1.0 Validation Result: PASS
```

**Talking Point for Sponsors**:
> *"New developers cloning the repository don't even need to run Storybook to inspect or validate a valid catalog. We provide a minimal tracked reference catalog at `examples/catalog.json` that validates cleanly against official A2UI specifications."*
