# Component selection and correctly scoped portable exports

## At a glance

**Suggested owner:** Matangi, subject to confirmation. **Status:** PLANNED. **Priority:** high. **Suggested branch:** feat/a2ui-selected-export. **Effort:** roughly 3–5 focused sessions; portability/testing is substantial.

**Goal:** let developers noninteractively select one or more **already registered** components and receive a consistent portable source ZIP containing exactly that supported set. This is the selection step in our Storybook -> eligibility -> selection -> runnable A2UI package vision.

**Non-goals:** arbitrary component onboarding/adapter generation, framework migration, dependency upgrades, interactive picker/addon, new packaging formats or sibling Composer changes. Do not implement selection by editing registrations.json or pruning only catalog.json after a full export.

**Dependencies:** start immediately with registrations[].name. Audrey's inventory is not required for the first PR. Agree componentId/registrationName mapping before inventory integration; Omar approves shared exporter/schema/runtime contract changes. Eric can reproduce baseline and later rerun selector docs.

Baseline: o0avdi/capstone-catalogs, feat/storybook-a2ui-exporter at `793eef108d5646e649cb54b911521a5415f9c8d1`, audited October 15, 2026. Source tests reran PASS 11/11 on prepared dependencies/index; no subset feature was implemented here.

## Learn first: 10–20 minutes

Paths are repository-relative.

| Read order | Actual files/functions | Question to resolve |
| --- | --- | --- |
| 1 | catalogs/material/a2ui/registrations.json | Names are FinanceMetricCard, MaterialButton, MaterialCheckbox; which files/assets/fixtures does each own? |
| 2 | catalogs/material/scripts/a2ui/export.mjs: top-level options/get/out/selected; write/json/copyTree | Where does selection enter? Which checks happen before writing? |
| 3 | catalogs/material/scripts/a2ui/metadata.mjs::discover(), extract(), makeCatalog() | Why can a registration subset flow through existing generation? Why does empty metadata fail? |
| 4 | catalogs/material/scripts/a2ui/component-files.mjs::contracts(), registrationSource(), componentFixtures() | Which generated schemas/imports/examples depend on metadata? |
| 5 | catalogs/material/a2ui/renderer/src/main.ts::App; validating-renderer.ts::processMessages() | Menu is already data-driven; full props and resolved bindings are validated |
| 6 | catalogs/material/scripts/a2ui/portable/{audit,validate,runtime-test}.mjs; composer-schema-test.mjs | Which assertions assume Metric/all-three or fixed positions? |
| 7 | catalogs/material/scripts/a2ui/metadata.test.mjs; docs/evidence/registration-workflow-proof.json; scripts/a2ui/zip.mjs::archive() under catalogs/material | Historical source hash pinning, subset generation test and deterministic archive |

A registration is an explicit supported mapping, not a story variant. Metadata is extracted API/example information. A subset must change every component-specific output surface consistently. A deterministic result has the same content/order for equivalent selections. Portability means independent install/build/run, beyond the source checkout.

Trace: export selects registrations -> extract validates/reads source and story IDs -> makeCatalog -> contracts/registration/fixtures -> selected source/adapter/assets/provenance copying -> manifest -> ZIP. FinanceMetricCard contributes three source files and Metric fixtures; Button contributes its authored adapter and SCSS, with Material supplied by dependencies.

Trace interaction separately: ButtonAdapter.click dispatches save through surface/DataContext; CheckboxAdapter.change proposes boolean context.checked while preserving the host-owned current state. Selecting Checkbox only must preserve that behavior without any Metric dependency.

Before editing answer:

1. Why does catalog-only filtering leave broken or excessive runtime output?
2. Which source does a Button-only package actually need?
3. Why do current runtime/schema tests fail when Metric is absent?
4. What is the difference between proposed candidate componentId and existing registration.name?
5. Why can repeat writes to an old export folder leave stale files outside the ZIP?
6. Why shouldn't a historical proof JSON be regenerated to accept new source changes?

Target a 60–90-second explanation: “The CLI validates supported registration names first, feeds the subset into the same generators, and packages matching contracts, examples and source. Independent subset tests prove we did not leave hidden dependencies on unselected components.”

## Safe baseline and existing commands

Read AGENTS.md and docs/A2UI_EXPORT_MVP_PLAN.md. Use your own clone. At repository root:

```powershell
git rev-parse --show-toplevel
git branch --show-current
git rev-parse HEAD
git remote -v
git status --short
```

If clean on approved exporter base, create a new personal branch: `git switch -c feat/a2ui-selected-export`. Inspect newer commits/dirty files; do not reset, overwrite or switch Omar's checkout. [Quickstart](../02-QUICKSTART.md) covers clone/install and fail-fast checks.

From catalogs/material with installed dependencies and a current built index:

```powershell
npm.cmd run test:a2ui
if ($LASTEXITCODE -ne 0) { throw 'Record baseline failure before changes' }
```

Build missing/stale index with npm.cmd run build-storybook first. Never use default a2ui-output or preserved a2ui-three-* folders/ZIPs. Choose GUID paths named a2ui-output-selection-* matching existing ignore rules. No API key, LLM or Composer is required for basic acceptance.

## Verified gaps and confirmed integration surfaces

**Implemented:** no flag selects all registrations; --metric-only selects registrations.slice(0,1), relying on current ordering. --out specifies destination. No generic --components exists. Option parsing uses process.argv scanning, so unsupported flags may be ignored. Do not try proposed CLI examples against baseline and infer selection worked from a zero exit code.

**Already parameterized:** extract, makeCatalog, contracts, registrationSource, componentFixtures and selected metadata copying. Keep these as the single source of generation; add only minimal orchestration/helpers.

**Important output behavior:** project/parent destinations are rejected; existing directories without export-manifest.json are rejected. Manifest-bearing folders are reused without removing old files; a sibling ZIP can be overwritten. copyTree/writes start before componentFixtures is evaluated. ZIP only includes this run's written list, so disk folder and archive can diverge on a reused destination. Never rely on “it has a manifest” as proof replacement is safe.

## Proposed CLI and deterministic policy

**PROPOSED until implemented and tested**, from catalogs/material:

```text
npm.cmd run export:a2ui -- --components FinanceMetricCard,MaterialCheckbox --out <new-unique-folder>
```

Recommend one comma-separated --components value using **case-sensitive registration names**. Keep no-flag all and --metric-only compatibility. Resolve legacy Metric by its explicit name instead of array position if Omar approves; reject combining --metric-only with --components to avoid ambiguity. No inventory dependency.

Proposed parser acceptance table (agree with Omar before code):

| Input | Required behavior |
| --- | --- |
| No selection flag | Current all-three behavior and ordering preserved |
| One name / mixed list | Select exactly the requested registered set |
| Same set in different input order | Canonical registrations.json order; byte-identical generated content/ZIP on same checkout |
| Spaces around names | Trim each token; document behavior |
| Duplicate name | Nonzero error naming duplicate; no silent deduplication |
| Empty string, whitespace-only, leading/trailing comma, doubled comma, missing flag value | Nonzero explanatory error; do not interpret as all |
| Unknown name, wrong case, title, story variant ID, unmapped inventory ID | Nonzero error listing valid registered names |
| Repeated --components, conflicting selection flags, unknown flags | Nonzero error; no ignored typos |
| Missing/invalid --out argument | Nonzero before filesystem mutation |
| Output project/parent | Existing rejection preserved |
| New subset mode destination folder OR .zip already exists | Recommended nonzero collision error, leave both byte-for-byte unchanged |

Validate the **entire** request before destination writes: mixed valid/invalid must not partially export. Check selected registrations/extracted metadata/catalog/fixtures and required copied inputs before writing where practical. Minimum guarantee: selection/CLI/path/collision errors create neither folder nor ZIP. Packaging failure policy must be documented; fresh partial output may be retained with an error, never reported success. Full atomic publish/staging is a separate design choice, not an excuse to weaken early validation.

For a minimal backwards-compatible slice, enforce fresh destination policy in new subset mode and preserve legacy no-flag overwrite behavior with documented limitations. Omar decides whether to harden all modes in a separate scoped change. Retry/idempotence: repeat into **different fresh** destinations and compare hashes. Same destination is rejected in subset mode; idempotence does not require rewriting preserved artifacts.

## All output surfaces that must be subset-clean

| Surface | Concrete generator/path | Acceptance |
| --- | --- | --- |
| Catalog + public mirror | makeCatalog; catalog.json, public/catalog.json | Only selected keys and anyComponent refs; no dangling refs |
| Extracted metadata/diagnostics | export.mjs | Selected names, fields, callbacks/storyIds/warnings only |
| Runtime contracts/registry/API | contracts, registrationSource; src/contracts.ts, src/adapters.ts, src/public-api.ts | Only selected APIs, imports and public source exports; unselected not registered |
| Fixtures and menu | componentFixtures; fixtures.json/public mirror, both per-fixture folders, public/demo.json | Only selected component fixtures and their incremental host updates; first menu fixture initializes a valid surface |
| Usages | public/usages.json | Keys equal selected component names; no missing fixture references |
| Implementation/assets | metadata copying loop; src/adapters/*, source files, assets | Selected allowlisted source/helpers/styles only, deduplicated shared paths as necessary |
| Provenance | provenance/ stories/adapter/config; provenance.json files | Exactly selected source/mappings, no unselected local source evidence |
| Manifest/archive | export-manifest.json, zip.mjs | Unique, safe sorted paths; folder and ZIP contents agree; no stale unselected adapter/assets/fixtures |
| Shipped instructions | a2ui/README-export.md copied as README; renderer/ADDING_COMPONENTS.md | README describes actual selected demos; generic worked examples can remain clearly educational |
| Test scripts | scripts/a2ui/portable copied into scripts/ | Subset-aware required checks, no accidental requirement for Metric |

Shared renderer/template, theme, license notices, pinned dependencies/lockfile and vendored bridge may remain even if a subset doesn't use every dependency. Shared tests and educational docs may mention unselected names to test rejection or explain expansion. “Subset-clean” means no unselected runnable registration, fixture, implementation/asset or misleading availability claim; a global string grep is not a sufficient test. Don't prune dependency trees or remove validation coverage just to reduce text/size.

Raw incremental fixtures such as checkboxCheckedUpdate refer to an existing demo surface; include them only with their owning selected component. Test initialization before host updates and don't treat update-only messages as standalone demos.

## Test hazards that must be addressed deliberately

1. **Portable schema:** catalogs/material/scripts/a2ui/portable/validate.mjs always validates a valid FinanceMetricCard and its negative cases. Guard component-specific suites by catalog membership, add Button-only coverage, retain Checkbox booleans/bindings and negative checks. Require every selected known component to execute a positive/negative suite; never let a subset pass by skipping everything.
2. **Portable runtime:** runtime-test.mjs initially waits for 1,340,000, uses nav indices 1–4, always sends metricBound and uses Metric for final invalid-message tests. Use existing `button[data-fixture="..."]` attributes or named fixtures, and organize suites by available selected components. Do not change main.ts just to compensate for test positions.
3. **Generic protocol:** handshake/catalog/usages/origin rejection, invalid field rejection, wrong resolved binding type and preservation of previous state must run for **every** subset. Pick a present component/field; don't skip these because Metric is absent. Button.disabled and Checkbox.checked can exercise boolean binding failures. Assert unsupported/unselected component rejection.
4. **Interactions:** Button save action and disabled no-event, Checkbox true/false boolean proposals, no autonomous model update, external host updates and disabled behavior must remain tested. Capture event counts dynamically rather than absolute all-component counts. Add standalone Checkbox coverage as well as parent-frame behavior.
5. **Composer resolver:** catalogs/material/scripts/a2ui/composer-schema-test.mjs hardcodes all three names/required fields. Iterate actual selected catalog keys and known expected required fields; validate absence/rejection as appropriate. Keep default all behavior. It is optional for basic clone but must be subset-aware if shipped/documented for subsets.
6. **Historical hash proof:** metadata.test.mjs test “Checkbox registration alone extends schemas, fixtures and adapters while shared logic stays unchanged” reads docs/evidence/registration-workflow-proof.json, asserts before/after hashes equal AND compares current shared files to those hashes. Legitimate export.mjs/component-files or renderer edits will fail. **Do not update proof hashes or remove the test silently.** Propose to Omar: preserve immutable historical JSON and equality; verify historical source against the historical commit in a separate explicit check if retained, while using behavioral two-vs-three generation tests for current code. Avoid making normal tests require network/history absent in a shallow clone. Retain LF/CRLF and content-change assertions where relevant. This is an approval checkpoint before shared-file implementation.
7. **Source baseline tests:** some tests use metadata[0]/[1] and fixed story counts. They test the current full fixture and can remain if input stays all-three; new subset tests must find by name and not mutate the global registrations just to reuse those assertions.

## Milestones

### B0 — design and learning checkpoint

Show parser table, touched-file plan, output matrix, negative tests and historical-proof proposal before edits. Ask Omar only for contract/policy decisions; do not require inventory implementation. Answer learning questions and trace Checkbox-only expected output.

**Accept/evidence:** agreed CLI/order/collision/legacy policies, reviewed hash-test treatment, tests designed to fail for Button-only Metric assumptions.

### B1 — quick first PR: selection core and composition

Likely files: export.mjs, a focused new selection.mjs and selection.test.mjs (names PROPOSED), plus minimal metadata.test.mjs adaptation approved above. Parameterize metadata selection **before** extraction/generation/copying; don't fork exporter logic. Export selected names in CLI output. Generate parser/unit and packaging integration tests into unique disposable destinations; avoid import side effects from export.mjs in unit tests.

**Accept:** parser table passes, invalid requests write nothing, no-flag behavior preserved, every selected surface agrees. At minimum test each singleton, Metric+Checkbox and all-three before calling subset export useful; do not advertise portable runtime acceptance until B2 is done. Keep PR narrow; if split before B2, label feature incomplete and state failing/NOT RUN acceptance.

Proposed direct test command after creating the named module/test, from catalogs/material:

```text
node --test scripts/a2ui/selection.test.mjs
```

Existing npm.cmd run test:a2ui must remain meaningful/PASS after approved historical-test adaptation. Additional integration test names/commands must be documented when created.

### B2 — subset-aware portable tests and acceptance

Likely edits: portable/validate.mjs, portable/runtime-test.mjs, composer-schema-test.mjs, generated README composition/template as needed. Shared renderer implementation is a last resort requiring explanation; existing menu already works from data.

| Selection | Required behavior |
| --- | --- |
| FinanceMetricCard only | Literal/string-number union, revenue path update, wrong type rejection, no Button/Checkbox artifacts |
| MaterialButton only | Standalone startup without Metric; enabled save, disabled no-event, binding validation; required SCSS copied |
| MaterialCheckbox only | Startup without Metric/Button, external true/false, boolean proposals, authoritative model retained, disabled no-event |
| FinanceMetricCard + MaterialCheckbox | No Button schema/adapter/SCSS/fixtures/usages; both components work |
| All three | Same supported behavior and fixture order as no flag; no regression |
| Remaining pairs (Metric+Button, Button+Checkbox) | Generation/schema/manifest checks, no hidden dependency on third component |

Automate generation/composition checks for all **seven nonempty subsets**, plus order permutations, duplicate/unknown/empty/conflicting flags, missing index, malformed fixture, output folder/ZIP collisions and retry policy. Use file hashes/sentinel content to prove collision failures leave destination untouched. Assert schema components, generated registry, usages, fixture ownership and manifest/ZIP paths, not merely console output.

Independent acceptance must extract **new ZIPs outside source checkout**, install from each bundled lockfile and run fail-fast:
npm.cmd ci --no-audit --no-fund; test:portable; test:schema; build; test:runtime. See [quickstart's guarded loop](../02-QUICKSTART.md#optional-clean-extraction-and-portable-acceptance).
Required full independent matrix: each singleton, Metric+Checkbox and all-three. Run remaining pairs through schema/composition tests; broaden clean runtime runs if failures suggest interactions. Record exact SHA, selection, output/ZIP hashes, commands/cwd/exit codes and cache/network conditions. Do not share source node_modules.

**Accept:** suites actually exercise each present component and generic protocol checks, no selected output imports unselected source, both fresh equivalent exports hash identically. Browser/Composer checks are separate; perform representative enabled/disabled/host-update checks if available and explicitly record NOT RUN otherwise. Prior browser evidence is all-three historical evidence, not a subset rerun.

### B3 — integration and newcomer handoff

Finalize identity mapping note with Audrey/Omar. Selector still accepts registered names directly. A future candidate-ID bridge must reject unsupported/ambiguous/stale mappings and revalidate at export time, not skip them. Give Eric exact accepted commands, collisions policy and subset limitations; rerun quickstart and all-component regressions after integration.

Catalog ID currently remains the fixed metadata.mjs catalogId for every subset. First standalone subset can preserve it with documented limitation; Omar must decide namespacing/version/fingerprint before simultaneous multi-subset host registration. No silent identity change in this task.

## Definition of Done and review

- Deterministic supported-name selection, compatible default/metric-only behavior, clear early errors and tested collision/retry policy.
- All output surfaces and archive match exact selected set; shared dependencies/template retained intentionally.
- Baseline and new parser/composition tests PASS; five required fresh extraction/install/schema/build/runtime matrix runs PASS with evidence.
- Runtime negative/interaction/protocol checks remain substantive; historical evidence preserved and test adaptation reviewed.
- Audrey/Omar identity agreement recorded before wiring; Eric receives commands/docs.
- In 60–90 seconds, demonstrate a Button-only command, its catalog/menu/source and save/no-event behavior, then a rejected unknown ID that creates no output.
- You can explain generation flow, subset tests, host ownership and remaining catalog-ID limitation yourself.

Not done: filtering catalog only, keeping all fixtures/adapters in ZIP, tests that silently skip required behavior, or claiming a build from a generated ZIP. Reviewers: Omar (shared code/tests), Audrey (mapping), Eric (reproducibility). PR handoff includes base SHA, changed files, test matrix, exact commands, hashes and NOT RUN browser checks.

## Copy-ready assistant prompt — START HERE

```text
I am Matangi, suggested owner of subset export in o0avdi/capstone-catalogs.
Act as tutor and engineer. Read AGENTS.md, docs/A2UI_EXPORT_MVP_PLAN.md,
docs/team-onboarding/tasks/COMPONENT-SELECTION-AND-SUBSET-EXPORT.md fully,
and shared architecture/quickstart. Verify root/branch/SHA/status; expected
base feat/storybook-a2ui-exporter, audited 793eef108d5646e649cb54b911521a5415f9c8d1.
Preserve dirty work, ZIPs, demos, sibling checkouts and reference catalog.

Inspect catalogs/material/scripts/a2ui/export.mjs, metadata.mjs,
component-files.mjs, zip.mjs, metadata.test.mjs, portable/*.mjs,
composer-schema-test.mjs, a2ui/registrations.json, adapters/fixtures and
renderer/src/main.ts plus validating-renderer.ts. Trace Checkbox-only output.
Explain selection vs onboarding, generated surfaces and current test hazards.
Ask me four or more learning questions and check my answers before major edits.

Show CLI/parser policy, affected files, full output matrix and tests before
editing. Proposed --components is not currently supported. Start with exact
registration names, canonical order and early errors, independent of Audrey.
Agree identity mapping before integration; Omar reviews shared contracts.
Specifically show the historical source-hash test conflict and propose a
scoped adaptation for Omar's review; do not regenerate proof hashes to pass.

After I authorize a milestone, implement it and run meaningful checks.
Preserve no-flag behavior, --metric-only compatibility, Angular/Storybook,
dependencies/lockfiles, authored adapters and host-owned Checkbox semantics.
Use fresh ignored GUID output paths and new ZIP extractions. Reject invalid
selections before writes; test all seven nonempty subsets for composition
and each singleton + Metric/Checkbox + all-three for independent portability.
Make portable/schema/runtime tests subset-aware without skipping selected
behavior or generic validation. Do not prune only catalog.json.
Use npm.cmd on Windows. No API key/LLM, staging, commit, push, merge or deploy.
Report actual commands/cwd/exit/results, limitations, browser NOT RUN when
applicable, and a short demo. Finish by asking me to explain how selection
propagates, why the tests catch leaks and how Checkbox events differ from
data updates, without reading your answer.
```
