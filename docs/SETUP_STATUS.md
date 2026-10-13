# Local setup status

Prepared October 12, 2026 for the Storybook -> A2UI export MVP. The exporter and both required components are implemented. Automated source/schema, renderer DOM and parent-frame protocol checks pass. The browser startup dependency bug is fixed and all required Composer browser checks passed: literal rendering, bound revenue updates, enabled Button action and disabled no-event behavior. The disabled contrast fix is also verified visually. Recording remains pending; see the latest evidence section below.

## Checkouts and tools

- Implementation: `C:\Users\omara\repos\bacs496\storybook-a2ui-mvp\capstone-catalogs`
- Feature branch: `feat/storybook-a2ui-export-mvp`
- Source baseline: `753759f38a0f9d259ec75a4d3417da1b96fd9c87`
- Composer reference: `C:\Users\omara\repos\bacs496\storybook-a2ui-mvp\composer`
- Composer baseline: `8155592d3522fff213188e8382153e473e2c3315`
- Node v24.20.0, npm 11.19.0, Git 2.50.0.windows.2, Composer Yarn 4.5.0 through Corepack.
- Existing user checkouts were left untouched, including their uncommitted work.

## Verified installation

- `npm.cmd ci --no-audit --no-fund` in capstone-catalogs/catalogs/material: passed, 1405 packages installed.
- `corepack.cmd yarn install --immutable` in composer: passed with upstream peer-dependency warnings.
- Neither repository's package manifest or lockfile was changed during setup.
- `corepack.cmd yarn workspace a2ui-bridge build` in composer: passed (lint, JS build, TypeScript declarations).
- Compodoc generation completed successfully and documents 17 local components. MetricCardComponent has label/value marked required and value/change typed number|string. Generated documentation.json remains ignored.

## Compatibility notes

Installed @a2ui/angular 0.10.4 declares Angular peers ^21.2.5, whereas the pinned Composer sample uses Angular 22.0.7 and the source catalog uses 22.1.6. The upstream install tolerates this with warnings. A passing compilation does not replace runtime compatibility tests; verify the exported renderer during milestone 1. Do not blindly force dependency installation or upgrade the project.

The upstream bridge is a private workspace package named a2ui-bridge. Its distribution is an explicit implementation task. An independently installable export must include or properly package the bridge; it must not depend on a file link to ../composer.

npm emitted notices about dependency install scripts without allowScripts entries. No global policy was changed. Baseline build outcomes below determine whether this affects the task.

## Build results

- Composer bridge: passed with `corepack.cmd yarn workspace a2ui-bridge build`.
- Composer Angular sample: passed with `corepack.cmd yarn workspace ng-basic-catalog build`.
- Composer shell: passed with `corepack.cmd yarn workspace a2ui-composer-shell exec ng build --configuration development`.
- Angular Storybook: passed with `npm.cmd run build-storybook`. The output is catalogs/material/storybook-static. The v5 index contains 274 entries, including 223 stories; Metric Card has 8 stories and Material Button has 4. Build warnings concern unused compilation inputs and bundle sizes, not errors.

These are installation and compilation checks, not browser interaction or exporter acceptance tests. No custom exporter or renderer was implemented in setup.

## Run the existing apps

Each command runs in its own terminal. No servers are left running by setup.

Angular Storybook on port 6006:

    Set-Location 'C:\Users\omara\repos\bacs496\storybook-a2ui-mvp\capstone-catalogs\catalogs\material'
    npm.cmd run storybook:material

This uses the Angular-only script. The generic storybook script can start the composed React catalog too, which the MVP does not require.

Composer's upstream Angular sample on port 3456:

    Set-Location 'C:\Users\omara\repos\bacs496\storybook-a2ui-mvp\composer'
    corepack.cmd yarn workspace ng-basic-catalog start

Composer shell on port 4200, without invoking builds of all sample frameworks:

    Set-Location 'C:\Users\omara\repos\bacs496\storybook-a2ui-mvp\composer'
    corepack.cmd yarn workspace a2ui-composer-shell exec ng serve --host localhost --port 4200

Use Composer's custom renderer URL http://localhost:3456 for the upstream Angular sample. Replace it with the exported renderer URL during implementation. The Lit and React sample builds are not part of this setup. Fixed A2UI messages, not LLM calls, should drive acceptance.

## Remaining handoff

The implementation is in catalogs/material/a2ui and scripts/a2ui. Run npm.cmd run export:a2ui from catalogs/material to reproduce the portable folder and ZIP. See DEMO_RECORDING.md for clean extraction/install/build commands and the fixed-message Composer recording script.

The automated checks below are real validation evidence, but they do not replace the real Composer browser demonstration. Computer Use could not verify the current Chrome URL and stopped; no further UI automation was attempted. Resume that browser check in a session where browser policy can determine the current URL, then record the demo if desired. Checkbox remains deferred until that required acceptance check passes.

No application source in Storybook or the sibling Composer was modified, and no publication, deployment or merge occurred.

## Implementation evidence � October 12, 2026 Eastern

- Metric-only export generated with `npm.cmd run export:a2ui -- --metric-only` in catalogs/material. Reads Storybook v5 discovery, CSF literals and live TypeScript input types; packages all three local Metric Card source files and original inline styles.
- Independent renderer dependencies installed without force/legacy peer flags: Angular 21.2.17, Material/CDK 21.2.14, A2UI Angular 0.10.4 and web_core 0.10.5. Source Storybook manifest versions and lockfile remain unchanged. Renderer lockfile generated and retained under a2ui/renderer.
- Metric-only production renderer build passed. Restricted sandbox first failed with `spawn EPERM`; rerunning the same build with worker spawning permitted passed. This was an execution restriction, not a source/build regression.
- Draft 2020-12 validation of literal and bound Metric Card fixture instances passed.
- Bridge build/source/license vendored from pinned Composer. Angular-only package exports and compatible peer metadata are local packaging changes; no upstream checkout edits.
- Runtime/Composer verification and final portable ZIP validation are still pending; compilation alone is not completion.

### Component/runtime validation � October 12, 2026 Eastern

- Full export generates FinanceMetricCard and MaterialButton, their schemas, runtime Zod contracts/adapters, source allowlist, provenance, theme, fixtures, portable lockfile and deterministic ZIP.
- Both-component production Angular build passed (~751 kB initial raw JS/CSS). Original Storybook dependencies and lockfile are unchanged.
- Eight metadata/schema tests passed using `npm.cmd run test:a2ui`: local discovery deduplication/docs/remote exclusion; requiredness; number|string; enums; API defaults vs args; explicit undefined example overrides; every extracted example; Draft 2020-12 inherited id and unevaluatedProperties; missing/wrong/unknown fields; unsupported types/expressions/mappings/dependencies and collisions; regenerated description and enum; stable serialization.
- `npm.cmd run test:runtime` in the exported folder passed against its production AOT bundle in jsdom: literal Metric Card, bound update from 1,340,000 to 1,750,000, Button action log, disabled behavior.
- Parent-frame protocol test passed with the real vendored bridge: RENDERER_READY, GET_CATALOG/A2UI_CATALOG, RENDER_A2UI/RENDER_SUCCESS, DATA_MODEL_CHANGE, save SEND_TO_SERVER envelope (v0.9, root, demo), disabled no-event behavior, origin rejection and unsupported-field error overlay. This is an emulated parent frame, not the real Composer browser UI.
- A guard was added because the upstream web_core message processor does not validate component props. Unsupported fields are now rejected before processing.
- Browser automation ended with: "Computer Use has been stopped for this turn because it could not determine the current browser URL on Windows with enough confidence to enforce policy." No further UI input was attempted. Actual Composer rendering and the recorded demo remain unverified; do not mark end-to-end acceptance complete.
- Immutable reference fixture SHA-256 still matches F26C167E0C5C1ABE026B4E2B3035B11EA6D33D08FE0DDD5B34E5F9C47E9903A8.

### Clean archive run � October 12, 2026 Eastern

- Fresh ZIP extraction outside the checkout: C:\Users\omara\AppData\Local\Temp\a2ui-mvp-final-2af9151cc4ae438bb170113fbf3257f1.
- `npm.cmd ci --no-audit --no-fund` passed, 461 packages installed from the bundled lockfile without forced/legacy peers or external workspace links.
- `npm.cmd run test:portable` passed: 109 manifest files; no node_modules, machine/sibling dependency paths, missing required files or credential patterns.
- `npm.cmd run test:schema` passed valid fixtures and negative cases for missing required fields, empty ids, wrong types/enums and unknown properties.
- `npm.cmd run build` passed in the clean extraction: 756.04 kB initial raw JS/CSS, 172.03 kB estimated transfer.
- Initial final runtime test failed because jsdom does not supply window.structuredClone. The test harness now supplies Node's native structuredClone as that browser API. This is an emulation gap introduced by the staged validation test, not evidence of a browser failure. Final rerun results are recorded below.
- The next runtime rerun exposed a test timing issue: the assertion for an unsupported-field error was reading the preceding bound-type error before the deferred render completed. The test now waits for the specific new error text. The bad bound value had been correctly rejected, preserving the displayed value.

### Final verified artifact � October 12, 2026 Eastern

- Final clean runtime rerun passed both standalone AOT DOM and real-bridge/emulated-parent protocol suites, including rejection of an invalid resolved bound value without changing the displayed card.
- Clean extracted renderer started successfully with `npm.cmd start` on http://localhost:3456. HTTP 200 checks passed for /, /catalog.json, /fixtures/metricBound.json and /fixtures/button.json. The clean renderer is currently left running for review; the earlier in-checkout server was stopped.
- Artifact: catalogs/material/a2ui-output.zip (source bundle only; 109 manifest files). Its generated folder is catalogs/material/a2ui-output. The exact clean extraction is recorded in docs/a2ui-clean-location.txt.
- Final ZIP SHA-256: 208C5B7BB2E77A911D693D649308B5614A926B666E355174A38E418FCAEA2B94. Repeated generation produced the identical final hash.
- Source `npm.cmd run test:a2ui`: 8/8 passed. `npm.cmd run test:a2ui:composer`: pinned upstream CatalogSchemaResolver parsed both generated component schemas and required fields without warnings. These do not assert actual browser rendering in Composer.
- Final clean checks passed: lockfile ci, portable manifest audit, positive/negative Draft 2020-12 instances, production Angular build, standalone DOM behavior, parent-frame bridge protocol, and independently served app/catalog/fixtures.
- Original Angular Storybook lockfile and application source are unchanged. No dependency migration, API key, LLM call, Composer source edit, publication, deployment or merge occurred.
- Remaining acceptance: open the real Composer shell with this renderer, observe both components/data change/action/disabled behavior, then capture the optional prerecorded demo. Follow DEMO_RECORDING.md. Checkbox remains deferred.

### Browser startup fix and actual Composer check - October 12, 2026 Eastern

The user's real browser check exposed a missing optional dependency that compilation and jsdom had missed. GET /main.js on the live Angular dev server returned HTTP 500: Vite could not resolve @a2ui/markdown-it. Angular marks this peer optional, but Vite still resolves the dynamic import during startup. The HTML/catalog endpoints returned HTTP 200 while the application could not bootstrap or announce RENDERER_READY.

Added the official sample's pinned @a2ui/markdown-it 0.1.0 dependency and regenerated the renderer lockfile and ZIP. Applied the same fix to the running clean extraction. GET /main.js now returns HTTP 200, and the standalone renderer displays the card in a real browser.

Actual Composer verification now passes for the literal Metric Card: the real shell at localhost:4200 embeds the portable renderer at localhost:3456, retrieves its catalog, and displays Total revenue, $1,340,000, +14.5%, and vs. previous quarter from the fixed v0.9 messages. This was observed through Computer Use's in-app browser, rather than an emulated parent frame. The user's Chrome tab needs a refresh after the server fix; if Composer resets the draft on reload, paste metricLiteral.json again.

Installing markdown enables production shared/lazy chunks. Updated the jsdom runtime harness to execute the real ES module graph through vm.SourceTextModule instead of treating main.js as one classic script. npm run test:runtime now enables Node VM modules and both standalone DOM and parent-frame suites pass. Production build, schema tests and all eight source metadata tests also pass after the fix.

Current archive SHA-256: 582702CD15670FA386A4E12115D30D968FBC02889CE4F190899BE30E3C9A459E. This supersedes the earlier artifact hash. Browser evidence: composer-metric-verified.jpg in the calling Capstone project workspace.

Remaining real Composer acceptance: bound revenue update, enabled Button event, disabled Button behavior, and recording. These checks are still pending; literal rendering alone does not complete every acceptance item.

Updated archive clean extraction passed: C:\Users\omara\AppData\Local\Temp\a2ui-startup-fixed-994ffba4e0604d4caa0ff67398e610f1. npm ci installed 470 packages from the bundled lockfile. The 109-file portable audit, production build, standalone DOM suite and parent-frame protocol suite all passed. The original extracted renderer remains serving at localhost:3456; this second extraction was used only for validation.

### Required browser acceptance passed; disabled contrast fix - October 12, 2026 Eastern

The user completed the required checks in the real Chrome Composer UI:
- Literal Metric Card rendering passed previously.
- Bound revenue changed from $1,340,000 to $1,750,000 by editing Data Model while the component definition remained bound to /revenue. Before/after screenshots are preserved under docs/evidence.
- Enabled Material Button emitted save events with surfaceId demo, source component root and context.source portable-export. The screenshot shows four such events.
- Disabled Button emitted no new event when clicked, as reported by the user; its screenshot retains the same four enabled events.

The screenshots also exposed a visual bug: the renderer body had a hard-coded light background while Composer applied dark Material tokens. Changed renderer body foreground/background to Material system theme tokens, and scoped filled disabled Button container/text colors to neutral theme tokens. Native disabled semantics and action mappings are unchanged. The running clean extraction and exporter template both contain the fix. Real browser inspection confirms a readable disabled label on a muted neutral container in both light and dark modes.

Current portable ZIP SHA-256: C0532F49379FF59E8626C8D7997397C5F6180790EC766B92E65FE98473A01E4D. This supersedes the previous hash. Final export regeneration and the 109-file portability audit passed. Browser acceptance for the two-component MVP is complete based on direct inspection plus the user's screenshots and interaction report. Recording remains to be done; no recording, publication, deployment or merge is claimed.

After the contrast fix, the production renderer build and both runtime suites (standalone DOM and parent-frame protocol) passed, including enabled action dispatch and disabled no-event behavior. No new test was added for the two-line theme correction; existing behavior suites and real light/dark browser inspection cover the change.


### Local checkpoint - October 13, 2026 Eastern

Reviewed the source extractor, strict runtime guard, portable module test loader, markdown dependency and disabled-button theme correction. Required two-component Composer browser acceptance has passed; the earlier pending-browser sections above are historical. Preserved the known-good ZIP separately at artifacts/two-component-known-good-C0532F49.zip, SHA-256 C0532F49379FF59E8626C8D7997397C5F6180790EC766B92E65FE98473A01E4D. Artifacts and generated exports/builds/caches/node_modules are excluded from Git. The vendored Composer bridge distribution and license are intentional runtime inputs to the portable package.
