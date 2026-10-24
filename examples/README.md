# Tracked Example A2UI v1.0 Catalog

This directory contains a minimal, tracked example A2UI v1.0 `catalog.json` generated directly from an existing verified component (`MaterialCheckbox`).

## Provenance
- **Source Component**: `MaterialCheckbox` (`catalogs/material/src/stories/material/checkbox.stories.ts`)
- **Specification**: A2UI v1.0 (`https://json-schema.org/draft/2020-12/schema`, `specification/v1_0/catalog_definition.json`)
- **Generator**: CLI export with `--catalog-only`
- **Output**: Exactly one file, `catalog.json` (56 lines)

## How to Reproduce

From the repository root in PowerShell (use `npm` and `./node_modules/.bin/storybook` on macOS/Linux):

```powershell
cd catalogs/material
npm.cmd ci

# 1. Ensure destination directory exists before writing index
New-Item -ItemType Directory -Path ../../research-output/developer-cli -Force

# 2. Generate official Angular Storybook index
.\node_modules\.bin\storybook.cmd index --config-dir .storybook --output-file ../../research-output/developer-cli/angular-index.json --disable-telemetry

# 3. Export verified MaterialCheckbox
npm.cmd run a2ui -- export --catalog-only `
  --angular-index ../../research-output/developer-cli/angular-index.json `
  --components MaterialCheckbox `
  --catalog-id https://example.org/catalogs/example/1 `
  --title "Example Catalog" `
  --description "Minimal example catalog generated from MaterialCheckbox." `
  --out ../../research-output/developer-cli/example-catalog
```

The resulting `research-output/developer-cli/example-catalog/catalog.json` is byte-for-byte identical to `examples/catalog.json`.

## How to Validate

Validate `examples/catalog.json` against the pinned official A2UI v1.0 specifications using the project's internal validator:

```powershell
# From the repository root (omit this cd if already in catalogs/material)
cd catalogs/material
node -e "import('./scripts/a2ui/integration-v1.mjs').then(m => { import('node:fs').then(fs => { const cat = JSON.parse(fs.readFileSync('../../examples/catalog.json', 'utf8')); const res = m.validateV1Export(cat); console.log('A2UI v1.0 Validation Result:', res.valid ? 'PASS' : 'FAIL'); }); })"
```

Expected output:
```text
A2UI v1.0 Validation Result: PASS
```

This verification confirms:
1. Strict adherence to JSON Schema Draft 2020-12 and `catalog_definition.json`.
2. Valid structural rules: matching `catalogId` and `$id`, discriminator property (`component`), `additionalProperties: false`, and no envelope property leakage.
3. Every property in `required` (`component`, `label`, `checked`) exists in `properties`.
4. Compilation and dereferencing under Ajv Draft 2020-12 with discriminator support.
