# A2UI v1.0 Exporter — Sprint Demo Release & Onboarding Audit

**Date**: October 23, 2026
**Auditor**: Antigravity Technical Pair Programmer
**Repository**: `capstone-catalogs-react-manifest`
**Branch**: `feat/a2ui-external-qa`
**Target Milestone**: October 30 Sprint Demonstration
**Baseline Test Suite**: 112 / 112 tests passing cleanly (duration: ~225s)
**Primary Deliverables**: Tracked README corrections, minimal tracked example catalog, sponsor demonstration script, catalog-ID URI diagnosis, external Chromatic compatibility assessment, and fresh-clone validation evidence.

This preserves the external-QA branch's historical fresh-clone evidence. The
integrated `capstone-catalogs-codex` branch also includes the real-library pilot
and reviewed export surfaces, whose 134-test milestone is recorded in the
[export plan](A2UI_EXPORT_MVP_PLAN.md). The original audit checkout and 112-test
results below describe that earlier run.

---

## 1. Executive Summary & Audit Verdict

### Verdict: **READY FOR SPRINT DEMONSTRATION WITH DOCUMENTED BOUNDARIES**

This audit addresses and resolves every developer onboarding defect, documentation inaccuracy, and reproducibility blocker identified during the external compatibility audit (`EXTERNAL_STORYBOOK_QA_RESULT.md`).

1. **Clean Baseline Integrity**: All **112/112 tests pass (100%)** via `npm.cmd run test:a2ui`. Zero tests skipped. Zero production exporter code modified (preserving concurrent workstreams).
2. **Fresh-Clone Onboarding Fixed**: Fixed the critical Storybook CLI `ENOENT` failure by instructing developers to pre-create the destination directory before invoking `storybook index`.
3. **Broken Links Eliminated**: Replaced dead links to untracked research files with tracked, curated documentation (`docs/SPRINT_DEMO_RELEASE_AUDIT.md`, `docs/SPONSOR_DEMO_SCRIPT.md`, `docs/A2UI_EXPORT_MVP_PLAN.md`).
4. **Tracked Reference Catalog Provided**: Added `examples/catalog.json` (56 lines) generated directly from verified `MaterialCheckbox`, accompanied by `examples/README.md` containing exact commands to reproduce and validate it.
5. **Storybook Version Boundaries Documented**: Supported artifacts are Storybook Index v5 and Components Manifest v0. React manifest generation requires Storybook **>= 10.6.0** with `features.componentsManifest = true`; Angular index-only export has no such manifest requirement. Provided upgrade guidance avoiding broad project dependency changes.
6. **Chromatic External Compatibility Clarified**: Documented that the real `chromaui/intro-storybook-react-template` Button is safely blocked by an unmapped `onClick` callback; scalar-only extraction in an isolated harness proved docgen fidelity, but does not constitute complete Button API export.
7. **Catalog-ID URN Limitation Diagnosed**: Diagnosed why URNs fail validator resolution despite passing argument parsing: relative JSON Schema references (`common_types.json`) require a hierarchical base URI with a path component; WHATWG URL throws `TypeError: Invalid URL` on opaque schemes. Documented requirement for absolute HTTP/HTTPS URIs.
8. **Sponsor Demonstration Script Authored**: Delivered a reproducible, under-5-minute demo script (`docs/SPONSOR_DEMO_SCRIPT.md`) showcasing Angular export, React JSX export, mixed catalog output, and safe rejection.

---

## 2. Priority Audit Findings and Resolutions

### Priority 1: Destination Directory Creation Precondition
- **Issue**: Running `storybook index --config-dir .storybook --output-file ../../research-output/developer-cli/angular-index.json` failed on fresh checkouts with `ENOENT: no such file or directory` because Node's `fs/promises.writeFile` does not create missing parent directories.
- **Resolution**: Updated `README.md`, `examples/README.md`, and `docs/SPONSOR_DEMO_SCRIPT.md` to include explicit directory pre-creation:
  ```powershell
  New-Item -ItemType Directory -Path ../../research-output/developer-cli -Force
  ```
  (and documented cross-platform `mkdir -p` equivalent).

### Priority 2: Broken Documentation Links & Tracked Locations
- **Issue**: README line 106 linked to `research-output/DEVELOPER_CLI_RELEASE_RESULT.md`, a file that was never committed to git. In a fresh clone, clicking this link resulted in a 404 error.
- **Resolution**:
  - Curated release audit reports into tracked repository locations: `docs/SPRINT_DEMO_RELEASE_AUDIT.md` and `docs/SPONSOR_DEMO_SCRIPT.md`.
  - Updated `README.md` to reference only tracked documentation files.
  - Preserved all existing uncommitted QA reports in `research-output/` without resetting branches.

### Priority 3: Minimal Tracked Example Catalog & Validation
- **Issue**: New developers had no tracked, committed A2UI v1.0 `catalog.json` fixture to inspect or validate without first running Storybook builds.
- **Resolution**:
  - Generated a clean, 56-line `catalog.json` from verified component `MaterialCheckbox` and placed it at `examples/catalog.json`.
  - Authored `examples/README.md` detailing exact reproduction steps and an independent validation one-liner:
    ```powershell
    node -e "import('./scripts/a2ui/integration-v1.mjs').then(m => { import('node:fs').then(fs => { const cat = JSON.parse(fs.readFileSync('../../examples/catalog.json', 'utf8')); const res = m.validateV1Export(cat); console.log('A2UI v1.0 Validation Result:', res.valid ? 'PASS' : 'FAIL'); }); })"
    ```
  - Result: `A2UI v1.0 Validation Result: PASS`.

### Priority 4: Supported Storybook Index and Manifest Versions
- **Storybook Index**: Version `v: 5` (standard across Storybook 8.x, 9.x, and 10.x).
- **React Components Manifest**: Schema version `v: 0` (located at `<output-dir>/manifests/components.json`).
- **Minimum Storybook Version for React Manifest Generation**: Storybook **>= 10.6.0**; separate from Angular index-only export.
- **Configuration Requirement**: Must declare `features: { componentsManifest: true }` in `.storybook/main.ts` or `.storybook/main.js`.
- **Docgen Engine**: Compatible with both `react-docgen` (PropTypes/JSX) and `react-docgen-typescript` (TypeScript interfaces/types).

### Priority 5: Guidance for Older Storybook Installations (< 10.6.0)
- **Problem**: Storybook versions prior to 10.6.0 (e.g. 10.1.11, 8.x, 7.x) silently ignore `features.componentsManifest` and generate no `manifests/` directory, causing exporter discovery to report `REACT_MANIFEST_REQUIRED`.
- **Safe Migration Guidance (No Broad Upgrades)**:
  - Do NOT perform broad application updates (do NOT upgrade React, TypeScript, Vite, or UI libraries).
  - In the external project, update existing Storybook core, framework and addon
    devDependencies together to compatible versions `>= 10.6.0`, preserving the
    existing builder. This repository already pins 10.6.0; use its lockfile.
  - Or run Storybook 10.6.0 in an isolated build harness targeting existing component sources.
  - Enable `features: { componentsManifest: true }` in `.storybook/main.ts`.
  - Rebuild Storybook: `.\node_modules\.bin\storybook.cmd build -o ./storybook-static`.

### Priority 6: Real Chromatic Storybook Result & Limitations
- **External Target**: `chromaui/intro-storybook-react-template` (commit `5cad2aa3f096ddd24fe24c62842e4e1d1a3958dd`).
- **Original Unmodified Behavior**:
  - The external `Button` declares props: `primary` (boolean), `backgroundColor` (string), `size` (enum), `label` (string, required), and `onClick` (`() => void`, optional callback).
  - Out of the box, the exporter safely refused export with `REACT_REVIEWED_MAPPING_REQUIRED`:
    `react:src/stories/Button.stories.ts: onClick: Callback or projected content. An explicit reviewed A2UI mapping is required.`
- **Clarification**: In the QA audit, removing `onClick` in an isolated scratch copy allowed pure scalar props to generate a valid v1.0 catalog. However, this is **NOT proof that the complete Button API exports**. Out-of-the-box interactive components with unmapped callbacks cannot export until a reviewed event mapping adapter is implemented.

### Priority 7: Catalog-ID URN vs URI Validator Diagnosis
- **The Pilot Finding**: An earlier test reported that URN catalog IDs passed CLI argument parsing but failed downstream validation.
- **Root Cause Diagnosis**:
  - Initial CLI syntax validation (`isValidCatalogId` in `catalog-v1.mjs`) uses regex `/^[a-z][a-z0-9+.-]*:/` which permits `urn:...`.
  - Downstream validation in `validate-catalog-v1.mjs` (lines 191 & 398) resolves external references via `new URL('common_types.json', catalog.$id)`.
  - In Node's WHATWG URL implementation, resolving a relative reference like `'common_types.json'` against an opaque non-hierarchical scheme like `'urn:uuid:1234'` throws `TypeError: Invalid URL`.
  - In JSON Schema Draft 2020-12 / RFC 3986 section 5, relative reference resolution requires a hierarchical base URI with a path component.
- **Documentation Correction**: Updated README and documentation to specify that `--catalog-id` must be an absolute hierarchical HTTP or HTTPS URI with a path (e.g. `https://example.org/catalogs/angular/1`). Explicitly documented that URNs are unsupported by the v1.0 validator due to relative reference resolution.

### Priority 8: Sponsor Demonstration Script
- Authored a comprehensive, timed walkthrough in `docs/SPONSOR_DEMO_SCRIPT.md`:
  - Part 0: Quality gate pre-check (112 tests passing).
  - Part 1: Angular export (`FinanceMetricCard`, `MaterialButton`, `MaterialCheckbox`).
  - Part 2: React JSX export (`StatusNotice`).
  - Part 3: Mixed cross-framework catalog.
  - Part 4: Safe rejection demonstration (`InteractiveNotice` or Chromatic `Button` with `onClick`).
  - Part 5: Validating the tracked reference catalog.

### Priority 9: Fresh-Clone Setup Integrity
- Setup uses only tracked files, committed `package-lock.json`, and official Storybook CLI binaries.
- Zero reliance on external network registries during tests.
- Zero local machine paths leaked into catalogs.

---

## 3. Fresh-Clone Execution Evidence

To verify reproducibility, an isolated clone verification was executed in `$env:TEMP\a2ui-fresh-clone-audit`:

| Step | Command Executed | Result | Duration | Notes |
|---|---|---|---|---|
| **Clean Setup** | `npm.cmd ci` in `catalogs/material` | **PASS** | ~3.8m | 1,405 packages installed cleanly from committed lockfile. |
| **Test Suite** | `npm.cmd run test:a2ui` | **PASS** | 224.9s | **112/112 tests passed**. Zero skips. Zero failures. |
| **Directory Prep** | `New-Item -ItemType Directory -Path ../../research-output/developer-cli -Force` | **PASS** | < 1s | Created parent directory; prevented Storybook CLI ENOENT. |
| **Angular Index** | `storybook index --config-dir .storybook ...` | **PASS** | ~35s | Wrote `angular-index.json` (format version `v: 5`). |
| **Angular Export** | `npm run a2ui export --catalog-only ...` | **PASS** | ~12s | Emitted exactly one file: `angular-catalog/catalog.json` (6,126 bytes). |
| **React Build** | `storybook build --config-dir scripts/.../.storybook ...` | **PASS** | ~18s | Emitted `index.json` (v5) and `manifests/components.json` (v0). |
| **React Export** | `npm run a2ui export --catalog-only ...` | **PASS** | ~2s | Emitted exactly one file: `react-catalog/catalog.json` (2,190 bytes). |
| **Mixed Export** | `npm run a2ui export ... --components MaterialCheckbox,StatusNotice` | **PASS** | ~14s | Emitted unified `mixed-catalog/catalog.json` (4,420 bytes). |
| **Tracked Catalog Validation** | Node one-liner on `examples/catalog.json` | **PASS** | < 2s | `A2UI v1.0 Validation Result: PASS`. |

---

## 4. Specific Remaining Limitations

To ensure an honest, trustworthy sprint demonstration, the following technical limitations must be communicated to stakeholders:

1. **Scalar Contracts Only for React Components**: The React Components Manifest extractor currently translates scalar props (`string`, `number`, `boolean`, and string `enum`/`oneOf`). Objects, nested arrays, functions, and JSX child slots require custom reviewed adapters.
2. **Interactive Callbacks Require Reviewed Mappings**: Components declaring interactive callbacks (e.g. `onClick`, `onSelect`, `onChange`) are safely rejected unless an explicit reviewed event mapping exists in the exporter registry (e.g. `MaterialButton` and `MaterialCheckbox`).
3. **No Dynamic Action Fabrication**: The exporter will never guess or fabricate an action name from an unmapped callback. Unmapped callbacks halt export with `REACT_REVIEWED_MAPPING_REQUIRED`.
4. **Storybook Version Dependency**: Storybook < 10.6.0 does not emit `manifests/components.json`. Use compatible Storybook devDependencies >= 10.6.0 or an isolated harness for the React manifest workflow, preserving the project's builder.
5. **Hierarchical Catalog IDs Required**: URNs (e.g. `urn:uuid:...`) are rejected by the A2UI v1.0 validator due to relative reference resolution (`common_types.json`). Only absolute HTTP or HTTPS URIs with a path are supported.
6. **Catalog-Only Delivery**: The v1.0 exporter produces `catalog.json` only. Developers supply their own agents and renderer runtime. Historical v0.9 runnable renderers remain available for the three registered Angular components, but are not generated for v1.0 exports.
