# Recorded three-component demo

All three components passed real Composer checks. Evidence is in docs/evidence and exact commands/results are in SETUP_STATUS.md. A recording is optional and has not been made. Do not push, publish, deploy or merge as part of this workflow.

## Reproduce the portable source bundle

In catalogs/material, reuse the verified baseline dependencies and built Storybook index. Rebuild Storybook only when discovery changes:

    npm.cmd run build-storybook
    npm.cmd run export:a2ui -- --out a2ui-three-output
    npm.cmd run test:a2ui
    npm.cmd run test:a2ui:composer -- ../../../composer a2ui-three-output

The exporter reads current source descriptions, types, requiredness, defaults and declarative story args. Its component code comes from registered adapters; fixtures come from per-component configurations. It creates a2ui-three-output/ and a2ui-three-output.zip. The preserved two-component ZIP is artifacts/two-component-known-good-C0532F49.zip.

## Clean installation

Extract the three-component ZIP into a fresh folder outside the checkout. In that folder:

    npm.cmd ci --no-audit --no-fund
    npm.cmd run test:portable
    npm.cmd run test:schema
    npm.cmd run build
    npm.cmd run test:runtime
    npm.cmd exec -- ng serve --host localhost --port 3457

Port 3457 keeps the known-good two-component server on 3456 available. The local extraction-location record is intentionally untracked; choose a fresh directory for reproduction. Check /main.js as well as /catalog.json: markdown-it is required for real dev-server startup. Runtime tests execute the production ES module graph and its lazy/shared chunks.

## Recording sequence

Use the pinned Composer shell at http://localhost:4200. Its existing startup command in the sibling reference is:

    corepack.cmd yarn workspace a2ui-composer-shell exec ng serve --host localhost --port 4200

1. Show the Metric Card, Button and Checkbox stories and a2ui/registrations.json. Show the adapter and fixtures directories, then run the export command and inspect the ZIP's actual source/styles/contracts, lockfile, bridge and license.
2. In Composer Settings select Portable Three Components at http://localhost:3457 (or add that custom renderer). The actual shell retrieves the three-component catalog.
3. Paste /fixtures/metricBound.json from the renderer into the raw layout editor. Show $1,340,000, then change Data Model to {"revenue":1750000} while leaving the component bound to /revenue. Show $1,750,000.
4. Paste /fixtures/button.json, click Save changes and show the save event with surface demo, component root and context.source portable-export. Paste /fixtures/buttonDisabled.json; click it and show that no event is added and the disabled label remains readable.
5. Paste /fixtures/checkboxBound.json. Click the unchecked control and show checkedChange with context.checked true while Data Model remains false. Apply {"includeArchived":true} in Data Model and show the check mark. Click it again: the new event contains checked false while the host-owned model and displayed control remain true. Apply false externally to clear the control.
6. Paste /fixtures/checkboxDisabled.json and verify native disabled state, checked display, and no new event on click. Show the registration workflow proof and the clean ZIP checks.

No API key or LLM call is needed. A five-to-six-minute recording is sufficient. Checkbox emits proposals; the host must apply the checked value. This explicitly replaces Storybook's local updateArgs behavior.

## Adding another supported component later

See EXPORT_ANOTHER_COMPONENT.md. This task stops at FinanceMetricCard, MaterialButton and MaterialCheckbox; no fourth component is part of this change. The workflow is a registration, adapter and fixture file, with supported source extraction and strict portable contracts rather than arbitrary template interpretation.
