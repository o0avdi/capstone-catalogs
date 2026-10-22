# Angular Storybook export MVP

### Unregistered Angular catalog-only milestone — October 22, 2026

- Current milestone delivers only the A2UI v1.0 `catalog.json`; the developer owns
  the renderer and agent. Historical portable-renderer requirements below remain
  the preserved v0.9 workflow, not requirements for this milestone.
- [x] Reproduce the pre-change baseline: 45/45 exporter tests passed.
- [x] Add `extract(..., { catalogOnly: true })` for registered metadata, retaining
  source/callback checks while bypassing adapter, fixture and packaging requirements.
- [x] Reuse TypeScript program/literal/type helpers for a bounded unregistered
  Angular extractor resolving the actual default-exported `meta.component` class.
- [x] Generate an official v5 index and validated catalog for the isolated
  `StatusNoteComponent` source fixture, without registration, schema or adapter.
- [x] Preserve index identities/provenance; refuse outputs, projected content,
  callbacks, unsupported types and uncertain source semantics with diagnostics.
- [x] Use actual extraction plus generator/validator preflight for v1.0 `--all-ready`;
  record rejected candidates explicitly. Renderer ZIP readiness is independent.
- Focused new tests: 8/8 passed. Combined regression suite: 53/53 passed, zero skips.
  Final focused rerun after source-ambiguity guards also passed 8/8.
  Main-project bulk selection exported the existing three contracts and explicitly
  diagnosed the remaining 47 candidates. Detailed results and reproduction commands
  are in `research-output/UNREGISTERED_ANGULAR_EXPORT_RESULT.md`.
- Decision: primitive inputs, homogeneous string literal unions/string enums and
  number|string are supported; additional types require a reviewed lossless conversion.
  Source JSDoc/defaults and Angular decorator requiredness are authoritative.
- Decision: Example Button/Header require output mappings; Finance Panel requires
  projected-content semantics; charts require complex data contracts. Use an isolated
  fixture and its own index harness; existing Storybook configurations remain unchanged.
- No renderer, React manifest, pinned schema, dependency, lockfile or Composer changes.
  Work remains uncommitted on `feat/a2ui-unregistered-angular`.

### A2UI v1.0 CLI integration — October 21, 2026

- [x] Establish combined baseline: `npm.cmd run test:a2ui` passed 33/33 before edits.
- [x] Add explicit `--protocol 1.0` JSON path on `feat/storybook-a2ui-v1-integration`.
  Preserve v0.9 as the compatibility default and its existing renderer/ZIP path.
- [x] Reuse official index discovery, `metadata.mjs`, reviewed registrations,
  `makeCatalogV1` and pinned official validators. Never use discovery example fields
  as authoritative schemas. Preserve full selected index provenance and reviewed
  content/event/callback mappings separately from the single catalog.
- [x] Generate all three registered source contracts from a fresh official Angular
  index; official meta-schema, structural checks and component-schema compilation pass.
- [x] Add CLI integration coverage for subsets, source contracts, unsupported candidates,
  validation failures, stale output refusal and rejection of untested v1.0 renderers.
- Decision: keep the generator's stable catalogId for each selected output. Reject
  nonempty destinations and all v1.0 ZIP requests. Emit no legacy example messages.
- Decision: the integration rejects unsupported/lossy field shapes before the generator's
  general DynamicValue fallback; do not modify the protected generator/validator/schema
  files owned by the concurrent workstream. Override generator usage instructions so
  the export does not advertise unexported Row/Column/Surface components or custom functions.
- Focused integration suite passed 8/8; final combined suite passed 41/41. Exact reproduction
  are recorded in `research-output/codex-storybook/V1_INTEGRATION_RESULT.md`.

### Official index discovery implementation — October 20, 2026

- Universal discovery now accepts supplied official Storybook v5 index artifacts through
  `--angular-index` and `--react-index`. The two configurations remain separate; local
  Angular composition does not imply local React index entries.
- Index paths/variants are authoritative. Preserve full entries, version/SHA-256,
  associated docs and standalone documentation provenance without executing stories.
  Stable candidate identity uses framework and CSF import path. Shared titles/component
  paths across CSF files require review; do not infer a shared component export.
- Static scanning remains the compatibility fallback, with explicit fallback diagnostics
  and `--static-discovery`. Invalid supplied artifacts fail without fallback.
- Validation: baseline 18/18 passed; implementation suite 26/26 passed. Official installed
  Storybook 10.6 index commands passed for both unchanged configurations. Combined
  discovery found 50 Angular and 64 React candidates; indexed MaterialButton CLI JSON
  export passed. See `research-output/codex-storybook/INDEX_IMPLEMENTATION_RESULT.md`.
- Catalog versions/contracts, source metadata extraction, adapters and packaging are
  unchanged. A2UI v1.0 generator/validator integration is a separate workstream.

## Outcome and deadline

By Wednesday evening, October 14, 2026 Eastern, aim to have a reproducible export ready for a recorded class demo on Thursday, October 15. The user does not require a live demo.

The full demonstration is: existing Storybook -> export command -> portable source bundle -> independent Angular renderer -> working components in A2UI Composer. A manually copied catalog or a renderer that imports files from the original checkout does not meet acceptance.

## Workspace

The implementation checkout is `<repository>`, branch `feat/storybook-a2ui-export-mvp`, created from commit `753759f38a0f9d259ec75a4d3417da1b96fd9c87`.

The sibling `../composer` checkout is the official a2ui-project/composer repository at commit `8155592d3522fff213188e8382153e473e2c3315`. It is a reference and integration test application. Its bridge is a workspace package; do not assume `a2ui-bridge@0.1.0` can simply be installed from the public npm registry. Verify its packaging/distribution approach before generating an independent renderer. If a local bridge artifact is necessary, include that artifact and its license inside the export rather than referring to the sibling checkout.

Neither the Storybook source repository nor the full a2ui source repository needs to be cloned for the MVP. Use installed packages and their types; inspect upstream sources only when a specific issue requires it.

The Angular project is `catalogs/material`. Storybook configuration is in its `.storybook` directory. It uses @storybook/angular (Webpack), Compodoc, and a composed remote React/Shadcn Storybook. Do not migrate frameworks. The lockfile pins Storybook 10.6.0, Compodoc 2.0.0, and Angular/Material 22.1.6. Verify versions before implementation rather than upgrading them.

This machine has Node v24.20.0, npm 11.19.0, Git 2.50.0, and Corepack. Composer uses Yarn 4.5.0 through `corepack.cmd yarn`; the implementation project uses npm.

## Progress

- [x] Research Storybook extraction and Composer schema/runtime requirements.
- [x] Create clean implementation and Composer reference checkouts without touching existing work.
- [x] Create dedicated feature branch.
- [x] Preserve the uploaded reference catalog and its provenance.
- [x] Verify baseline builds: Angular Storybook, Composer bridge, Angular sample, and Composer shell all passed. See SETUP_STATUS.md.
- [x] Export Metric Card end to end, including independent source bundle and Composer rendering. Literal rendering and bound revenue updates passed in the real Composer browser UI.
- [x] Add Material Button with action dispatch. Real Composer enabled save events and disabled no-event behavior passed; disabled readability is improved in light and dark themes.
- [x] Verify portable packaging and metadata/schema tests: clean external extraction, lockfile install, build, runtime/protocol tests, manifest audit and HTTP checks passed.
- [x] Prepare recorded demo instructions in docs/DEMO_RECORDING.md. A recording has not been made; all three-component browser acceptance checks passed.

## Required components

Finance Metric Card: reuse `catalogs/material/src/app/finance/components/metric-card.component.ts` and its local dependencies. The story is `catalogs/material/src/stories/finance/metric-card.stories.ts`. Required inputs include label and value. Value accepts number|string even though the story uses a numeric control. Preserve styles and formatting helpers. Support a literal value and a bound value; a data-model update must update the displayed value.

Material Button: reuse the behavior of `catalogs/material/src/stories/material/button.stories.ts`. This is a template story, without a meta.component declaration. Its label is projected text; appearance binds to matButton; disabled prevents interaction. Add an explicit A2UI action mapping and verify dispatch.

Checkbox is optional only after all required checks pass. Other Material components, React export, reverse import, automatic arbitrary template interpretation, an export toolbar, and LLM integration are out of scope.

## Catalog contract

The exact uploaded catalog is preserved at `docs/references/composer-catalog.json`; it matched the pinned official Composer sample as parsed JSON. Its eight top-level fields are $schema, $id, title, description, catalogId, components, functions, and $defs. It uses JSON Schema Draft 2020-12, internal references, allOf component envelopes, component.const, required lists, unevaluatedProperties, and aggregate component/function unions.

Generate the same structural conventions for our supported components using our own versioned catalog identity. The fixture's 18 components and 20 functions are not a list of capabilities to claim automatically. Advertise only implemented components, functions, bindings, and common properties. Keep references and unions valid, including when no custom functions are implemented. Do not generate an invalid empty oneOf.

Storybook index.json is for discovery, not complete contracts. Combine selected CSF/Compodoc metadata with explicit A2UI configuration. Story args are usage examples, not automatically API defaults. Controls do not override actual component types or requiredness. Preserve provenance and report conflicts.

Use an explicit registration per exported component for stable identity, schema overrides, binding policy, adapter, source-file list, assets, and event/content mappings. A small allowlist of local source files is acceptable for this MVP; generic dependency closure analysis is not required.

The exporter must actually extract supported metadata. Changing a source description or enum option and regenerating must update the generated schema. Do not merely archive a manually written catalog.

## Milestones

### 1. Baseline and compatibility

Inspect current files and setup status. Reproduce relevant existing builds, separating baseline failures from regressions. Verify pinned A2UI v0_9 APIs and the Angular bridge. Composer's sample Angular version differs from the source project's version; confirm the supported dependency combination without forcing incompatible peers or speculative framework migrations. Determine how the bridge will travel inside the portable output.

### 2. One complete component

Use Storybook's index to discover selected stories. Extract supported declarative CSF metadata and Compodoc/source types. A bounded extractor for the selected story patterns is sufficient; reject or diagnose unsupported expressions. Runtime collection using a supported Storybook helper is an alternative if needed, but do not scrape the Docs UI or execute arbitrary story functions in plain Node.

Generate Metric Card's schema, examples, runtime registration, and source package. Compile its adapter and minimal renderer. Export to a separate folder outside this checkout and prove it renders in Composer. Do this before expanding the component count.

### 3. Button and packaging

Add Material Button and action handling. Expose one documented export command, preferably `npm run export:a2ui` in the existing Angular project. Produce both a folder and ZIP containing: catalog.json; selected TypeScript/templates/styles/utilities/assets; A2UI adapters and public exports; theme setup; a minimal Angular renderer; package.json and tested lockfile; necessary vendored bridge artifact/source if applicable; fixture A2UI messages; export diagnostics; licenses/provenance; and usage instructions.

Third-party Angular/Material dependencies may be installed through package.json. Do not export node_modules. The bundle must contain no original-checkout paths, machine-specific links, missing local dependencies, or secrets.

### 4. Acceptance

Test discovery deduplication and exclusion of docs/remote React entries. Preserve requiredness, enum values, and number|string types. Unsupported types, collisions, and missing mappings must yield actionable errors. Verify all internal schema references and validate real component instances with Draft 2020-12 semantics, including inherited fields and unevaluatedProperties. Valid examples pass; missing required fields, wrong types/enums, and unknown fields fail.

Change a supported metadata field, regenerate, and verify output changes; restore the fixture after the test. Repeated generation should produce stable content/order. Every exported component/function must have a runtime implementation.

Extract the archive into a clean location outside the source checkout, install from its lockfile, build, and start its renderer. Do not rely on original node_modules or sibling workspace links. Connect Composer; verify both components, bound data changes, action dispatch, and disabled behavior. Use deterministic A2UI fixtures, not LLM-generated content.

### 5. Demonstration

Freeze features Wednesday evening. Save a known-good archive, exact reproduction commands, and a short recorded demonstration or recording instructions. Show source stories, export generation, the portable output, Composer rendering, a data-model change, and a button event. A live demo is not required.

If the first complete component is still blocked Tuesday evening, prioritize Metric Card alone. Preserve extraction, portable packaging, validation, and actual Composer integration. Report any scope reduction explicitly.

## Decision log

- 2026-10-12: Use clean sibling clones because both existing user checkouts contain unrelated unfinished work.
- 2026-10-12: Implement in capstone-catalogs; keep Composer as an integration reference.
- 2026-10-12: Export source plus a runnable example first. A polished publishable Angular library is deferred.
- 2026-10-12: Use two required components and fixed A2UI fixtures. A recorded demo is sufficient.

## Evidence and handoff

Consult SETUP_STATUS.md for installation/build results. Keep actual commands, failures, and fixes current here as implementation progresses. At completion, report artifact locations, exact commands, verified behavior, and remaining limitations. Do not label the feature complete based on compilation or valid JSON alone.


### Implementation decisions ï¿½ October 12, 2026 Eastern

- Portable renderer uses Angular 21.2.17 and Material/CDK 21.2.14 to satisfy A2UI 0.10.4 peers without forced installs. Original Storybook remains Angular 22. Compatibility must be verified in the browser.
- Bounded TypeScript AST/checker extractor reads declarative CSF title/descriptions/args/argTypes and source inputs/types/defaults. Source types and @Input requiredness take precedence. Static discovery uses the built Storybook index; docs and remote entries are excluded.
- No custom functions or common layout/accessibility properties are advertised. Only id, typed literal/path-bound inputs, and scalar event actions are supported. Button templates use an explicit registered adapter.
- Metric-only source bundle generated and production build/schema fixtures passed; runtime and Composer checks remain pending. Evidence is in SETUP_STATUS.md.

### Current implementation status ? October 12, 2026 Eastern

- Both required source-driven components are exported. Source input decorators/types and bounded declarative CSF metadata feed one catalog and generated runtime/resolve schemas. All exported APIs have Angular adapters; no custom functions are claimed. Explicit mappings handle Button projected text, matButton appearance, disabled, and event actions.
- Packaging includes source/styles/helpers, theme, adapters/public exports, catalog, examples/fixtures/usages, diagnostics/provenance, pinned dependency lockfile, vendored bridge build/source/license and bundled dependency notices. One export command creates a deterministic folder and ZIP.
- Eight source/schema tests pass, including edited descriptions and source enums, unsupported forms, missing local dependencies and schema errors. The pinned Composer CatalogSchemaResolver also parses the generated components and required fields without warnings. Parent-frame protocol and production DOM tests pass. See SETUP_STATUS.md for exact commands and clean-install evidence.
- The upstream message processor does not enforce component contracts. The local ValidatingRenderer now checks message envelopes, full component props and resolved bindings in a staged batch before mutating renderer state. Unsupported functions, fields, themes and wrong bound value types fail visibly.
- Real Composer UI verification is blocked this turn by the Computer Use URL-policy stop. No UI bypass was attempted. This is an automation limitation, not a demonstrated Composer regression. Milestone 2/4 end-to-end browser acceptance stays open, and Checkbox stays deferred.
- DEMO_RECORDING.md gives exact reproduction and manual Composer steps. No upstream source changes, publication, deployment or merge were made.

### Portable acceptance evidence

Final source archive: catalogs/material/a2ui-output.zip. SHA-256: 208C5B7BB2E77A911D693D649308B5614A926B666E355174A38E418FCAEA2B94 (identical across repeated exports). A clean external extraction installed 461 packages from its bundled lockfile, passed the 109-file portability audit and Draft 2020-12 positive/negative checks, built successfully, and passed standalone AOT DOM plus emulated parent-frame protocol tests. The extracted renderer started on localhost:3456; app, catalog and fixture endpoints returned HTTP 200. Full details and test-harness failures/fixes are in SETUP_STATUS.md.

The actual Composer browser check stays unchecked. DEMO_RECORDING.md is ready, and no recording is claimed. No further feature additions should precede that check.

### Browser startup fix and actual Composer check - October 12, 2026 Eastern

The user's real browser check exposed a missing optional dependency that compilation and jsdom had missed. GET /main.js on the live Angular dev server returned HTTP 500: Vite could not resolve @a2ui/markdown-it. Angular marks this peer optional, but Vite still resolves the dynamic import during startup. The HTML/catalog endpoints returned HTTP 200 while the application could not bootstrap or announce RENDERER_READY.

Added the official sample's pinned @a2ui/markdown-it 0.1.0 dependency and regenerated the renderer lockfile and ZIP. Applied the same fix to the running clean extraction. GET /main.js now returns HTTP 200, and the standalone renderer displays the card in a real browser.

Actual Composer verification now passes for the literal Metric Card: the real shell at localhost:4200 embeds the portable renderer at localhost:3456, retrieves its catalog, and displays Total revenue, $1,340,000, +14.5%, and vs. previous quarter from the fixed v0.9 messages. This was observed through Computer Use's in-app browser, rather than an emulated parent frame. The user's Chrome tab needs a refresh after the server fix; if Composer resets the draft on reload, paste metricLiteral.json again.

Installing markdown enables production shared/lazy chunks. Updated the jsdom runtime harness to execute the real ES module graph through vm.SourceTextModule instead of treating main.js as one classic script. npm run test:runtime now enables Node VM modules and both standalone DOM and parent-frame suites pass. Production build, schema tests and all eight source metadata tests also pass after the fix.

Current archive SHA-256: 582702CD15670FA386A4E12115D30D968FBC02889CE4F190899BE30E3C9A459E. This supersedes the earlier artifact hash. Browser evidence: composer-metric-verified.jpg in the calling Capstone project workspace.

Remaining real Composer acceptance: bound revenue update, enabled Button event, disabled Button behavior, and recording. These checks are still pending; literal rendering alone does not complete every acceptance item.

Updated archive clean extraction passed: <temporary-directory>/a2ui-startup-fixed-994ffba4e0604d4caa0ff67398e610f1. npm ci installed 470 packages from the bundled lockfile. The 109-file portable audit, production build, standalone DOM suite and parent-frame protocol suite all passed. The original extracted renderer remains serving at localhost:3456; this second extraction was used only for validation.

### Required browser acceptance passed; disabled contrast fix - October 12, 2026 Eastern

The user completed the required checks in the real Chrome Composer UI:
- Literal Metric Card rendering passed previously.
- Bound revenue changed from $1,340,000 to $1,750,000 by editing Data Model while the component definition remained bound to /revenue. Before/after screenshots are preserved under docs/evidence.
- Enabled Material Button emitted save events with surfaceId demo, source component root and context.source portable-export. The screenshot shows four such events.
- Disabled Button emitted no new event when clicked, as reported by the user; its screenshot retains the same four enabled events.

The screenshots also exposed a visual bug: the renderer body had a hard-coded light background while Composer applied dark Material tokens. Changed renderer body foreground/background to Material system theme tokens, and scoped filled disabled Button container/text colors to neutral theme tokens. Native disabled semantics and action mappings are unchanged. The running clean extraction and exporter template both contain the fix. Real browser inspection confirms a readable disabled label on a muted neutral container in both light and dark modes.

Current portable ZIP SHA-256: C0532F49379FF59E8626C8D7997397C5F6180790EC766B92E65FE98473A01E4D. This supersedes the previous hash. Final export regeneration and the 109-file portability audit passed. Browser acceptance for the two-component MVP is complete based on direct inspection plus the user's screenshots and interaction report. Recording remains to be done; no recording, publication, deployment or merge is claimed.

After the contrast fix, the production renderer build and both runtime suites (standalone DOM and parent-frame protocol) passed, including enabled action dispatch and disabled no-event behavior. No new test was added for the two-line theme correction; existing behavior suites and real light/dark browser inspection cover the change.

### Registration workflow and Checkbox extension - October 13, 2026 Eastern

- [x] Create local working-MVP checkpoint d2ea8ab and preserve the C0532F49 two-component archive.
- [x] Move component behavior and demo fixtures to registered adapter/fixture files; keep shared extraction/schema/packaging generic.
- [x] Add MaterialCheckbox via registration, adapter and fixtures only; explicitly map onCheckedChange and diagnose unsupported callback expressions.
- [x] Validate all three components, clean ZIP install/build, and actual Composer rendering.
- [x] Document the bounded supported-component workflow and event/data ownership. Stop at three components; no push/publication/deployment/merge.

Decision: Checkbox emits event context.checked (boolean). It does not write the A2UI data model on click. The host applies updateDataModel; external bound changes remain authoritative. This differs explicitly from Storybook's local updateArgs callback.

### Three-component completion - October 13, 2026 Eastern

Local checkpoint: d2ea8ab. Preserved two-component source ZIP C0532F49 under artifacts (ignored). The small registration/adapter/fixture workflow is documented in EXPORT_ANOTHER_COMPONENT.md and shipped as ADDING_COMPONENTS.md. Shared exporter, metadata/contract generation, ZIP and renderer hashes did not change when Checkbox was added; proof and regression tests are in docs/evidence/registration-workflow-proof.json.

All 11 extraction/schema/workflow tests passed. All three pinned Composer schema resolver checks passed. A fresh external ZIP extraction installed 470 locked packages, passed the 134-file portability audit and positive/negative Draft 2020-12 checks, built successfully and passed both ES-module production DOM/parent-frame runtime suites. Actual Chrome Composer rendered Checkbox, applied external checked updates, emitted true/false boolean events, and added no disabled event. Metric bound updates and enabled/disabled Button regression checks also passed in that three-component renderer. Screenshots and detailed evidence are in SETUP_STATUS.md and docs/evidence.

Checkbox model policy is host-owned: clicks emit context.checked and preserve the current displayed/model value until the host applies updateDataModel. The registered Storybook onCheckedChange callback signature and fn() example are validated, never executed or serialized as props. Unsupported callbacks/expressions diagnose rather than disappear.

Final ZIP: catalogs/material/a2ui-three-output.zip; SHA-256 5D2268182382732D94B9B71CC0501A221A820D9B581EC178AC9713C2149B4AAB. DEMO_RECORDING.md now covers all three components. This extension stops at three; no push, publication, deployment or merge occurred. Optional recording is the only demonstration activity not performed.

### Stabilization after read-only audit - October 13, 2026 Eastern

- Normalize CRLF to LF only in the workflow-proof test. Preserve the original proof JSON/hashes, assert historical before/after equality, test LF and CRLF variants, and confirm real content changes still alter the hash. The existing two-vs-three-component generator checks remain in place; all 11 tests pass.
- Align the Composer schema test default with export:a2ui's existing a2ui-output default. Named exports must be passed explicitly to the resolver test; both extension-guide copies and DEMO_RECORDING.md now show this. The preserved two-component default output was not regenerated.
- New artifact: catalogs/material/a2ui-three-stabilized.zip, SHA-256 16C6D587C617967B703731036AB1BB6ED431CC0C82CFB46DD6DF7EC3BC487CC9. Repeated generation is byte-identical. Its only difference from the preserved three-component ZIP is ADDING_COMPONENTS.md; all component/runtime/schema code is unchanged.
- A fresh external extraction installed 470 locked packages and passed the 134-file portability audit, Draft 2020-12 positive/negative checks, production build and standalone/parent-frame runtime suites. The pinned Composer schema resolver passed after granting subprocess execution permission. Exact commands, environment limitations and extraction location are appended to SETUP_STATUS.md.
- Real Composer UI interactions were not repeated: no browser provider is available, and localhost:4200/3457 are not responding in this session. Prior browser evidence remains preserved and is not represented as a new rerun. No new component, dependency/framework upgrade, stage, commit, push, publication, deployment or merge occurred; d2ea8ab and the known-good C0532F49 archives remain intact.
- Fresh extracted dev server on localhost:3458 passed HTTP checks for HTML, main.js, catalog and bound Checkbox fixture after compilation completed. Final git diff --check passed; presentation readiness remains supported by new automated/portable verification and preserved prior browser acceptance.

### GitHub presentation checkpoint - October 13, 2026 Eastern

The user authorized committing and pushing the finished exporter to `feat/storybook-a2ui-exporter` on `https://github.com/o0avdi/capstone-catalogs`, overriding the earlier no-push scope for this checkpoint only. The branch was created from d2ea8ab without changing existing branches. No additional features, dependency upgrades, deployment, merge, or history rewrite are part of this task.

The user personally verified all three components in actual Composer using the final extracted renderer at localhost:3458. README now documents current support, architecture, reproduction, Composer configuration, examples and limits. New browser screenshots and the temporary extraction-location text remain local; the registration workflow proof is included because tests require it. Historical machine-specific documentation paths were replaced with portable placeholders. Both preserved two-component ZIPs still match C0532F49379FF59E8626C8D7997397C5F6180790EC766B92E65FE98473A01E4D.

Publication validation passed: 11/11 exporter tests, pinned Composer resolver, fresh ZIP installation (470 packages), 134-file portable audit, Draft 2020-12 checks, production build and standalone/Checkbox/parent-frame runtime checks. Sandbox install/subprocess failures and the successful fresh retry are recorded separately in SETUP_STATUS.md. Source dependencies, lockfiles and reference fixture are unchanged.

### Universal discovery and CLI extension - October 16, 2026 Eastern

- Work continues on branch `feat/universal-a2ui-cli`, based on `feat/storybook-a2ui-exporter`.
- Added static `.stories.ts`/`.stories.tsx` discovery independent of a built Storybook index. The current catalog reports 114 candidates: 50 Angular and 64 React/TSX.
- Added an interactive terminal checklist plus non-interactive `discover` and `export` commands. Users choose exact components and loose JSON, renderer ZIP, or both.
- Added a normalized mixed-framework catalog/messages/diagnostics output and deterministic universal ZIP container.
- Registered Angular components retain the verified Angular renderer. Shadcn stories use a self-contained React/Vite catalog-demo renderer containing the original Shadcn sources. Unregistered Angular stories remain JSON-only until they receive reviewed adapters.
- Added exact registered-component subset selection to the legacy exporter and made portable schema/runtime tests conditional on selected fixtures.
- Verification this turn: Storybook production build passed; 18/18 source tests passed; mixed MaterialButton + ShadcnButton JSON/ZIP generation passed; a fresh extracted React renderer installed 1,406 locked packages and built successfully. The extracted Angular subset installed 470 packages and passed portability/schema tests; its production build exited 134 without diagnostics in this execution environment, so the regenerated subset runtime test could not run here. The previously verified full Angular renderer path remains preserved.
