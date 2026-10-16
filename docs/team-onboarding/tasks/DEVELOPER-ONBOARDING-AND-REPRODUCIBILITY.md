# Developer onboarding and reproducibility

## At a glance

**Suggested owner:** Eric, subject to confirmation. **Status:** PLANNED; a second-developer reproduction has not been performed by this documentation audit. **Priority:** high and independent. **Suggested branch:** docs/a2ui-first-user-experience. **Effort:** first useful report in 1–2 sessions; full independent runtime/browser checks may take longer.

**Goal:** prove a newcomer can understand and reproduce the current exporter from their own clone, then correct documentation using observed confusion and failures. This turns the working author-maintained demo into a reusable developer workflow. Your contribution includes engineering investigation, evidence quality and explanation, not just proofreading.

**Non-goals:** exporter/runtime fixes, dependency upgrades, framework changes, generated artifact cleanup, modifying other checkouts or fixing every root README issue in one PR. Keep changes docs/QA-only; raise concrete source bugs to Omar. Work in docs/team-onboarding initially. Changes to root docs or QA automation need a separately agreed scope.

**Dependencies:** none on Audrey or Matangi. Test current baseline now; rerun after their work merges. Ask Audrey about inventory statuses/IDs and Matangi about selection/errors when documenting their commands. Omar owns integration and source-bug decisions; Alan decides broader product scope.

Repository o0avdi/capstone-catalogs, baseline branch feat/storybook-a2ui-exporter, audited SHA `793eef108d5646e649cb54b911521a5415f9c8d1` on October 15, 2026. A prepared maintainer checkout passed 11/11 source tests during refinement. Its ignored index had v5/274 entries/223 local stories/50 local paths. These are context, **not your clean-clone results**.

## Learn first: 10–20 minutes

Open in this order (all paths repository-relative):

1. docs/team-onboarding/README.md, 01-ARCHITECTURE.md and 02-QUICKSTART.md: understand inspection vs execution vs Composer.
2. catalogs/material/package.json, angular.json and .storybook/main.ts: identify npm scripts, Angular builders and remote Shadcn composition.
3. catalogs/material/scripts/storybook.mjs: aggregate launcher directly spawns React .cmd, waits for 6007, then Angular. Compare with storybook:material's ng run material-catalog:storybook --port 6006.
4. catalogs/material/a2ui/registrations.json; scripts/a2ui/export.mjs; metadata.mjs::discover()/extract()/makeCatalog(); component-files.mjs::componentFixtures() under catalogs/material.
5. catalogs/material/a2ui/components/metric-card/{adapter.ts,fixtures.json}; button and checkbox equivalents: trace fixed fixture messages and authored behavior.
6. catalogs/material/a2ui/renderer/package.json and src/main.ts; scripts/a2ui/portable/{audit,validate,runtime-test}.mjs under catalogs/material: exported commands and what they actually verify.
7. docs/EXPORT_ANOTHER_COMPONENT.md and docs/SETUP_STATUS.md: prior evidence/limits; read latest dated sections rather than copying obsolete early pending status.

**Concepts:** a clean clone contains tracked source, not ignored generated index/node_modules/ZIPs. A lockfile records exact dependencies; npm ci installs those and replaces node_modules. A cache can permit offline install but is an environmental dependency. Reproducibility means another developer can obtain the same behavior using documented prerequisites. An emulated jsdom parent is different evidence from an actual browser Composer session.

Trace two paths: (1) build-storybook creates local index, exporter reads index plus live registrations/source and packages source ZIP; (2) fresh extraction installs its own locked dependencies/vendor bridge, builds Angular, loads fixed A2UI fixtures and sends actions. No Composer or API key is needed to prove the first path or standalone runtime.

Before running expensive steps answer:

- Why can test:a2ui fail on a fresh clone even with dependencies installed?
- Which command starts Angular Storybook and which starts the exported app?
- Why is source Angular 22 vs portable Angular 21 intentional?
- Why is HTTP 200 for index.html insufficient for runtime success?
- What does a Checkbox click propose and who changes the model?
- What does your evidence prove if installation used an existing npm cache?

60–90-second explanation target: “I tested the documented route as a second developer, recorded exact versions and results, isolated setup failures from source bugs, and corrected the steps so another newcomer can reproduce them. Here is what I actually ran and what remains unverified.”

## Safety and environment record

Use your own machine/clone where possible. Follow the [quickstart](../02-QUICKSTART.md) to clone exporter branch into an unused directory. If a fresh environment is unavailable, label the result prepared-checkout QA and keep clean-clone acceptance NOT RUN; do not fabricate independence.

At repository root:

```powershell
git rev-parse --show-toplevel
git branch --show-current
git rev-parse HEAD
git remote -v
git status --short
node --version
npm.cmd --version
git --version
```

Record OS/architecture, shell/version, Node/npm/Git, actual SHA/branch, clone time, whether node_modules/index existed before install, registry reachability and cache state. Maintainer tools observed are Node v24.20.0, npm 11.19.0, Git 2.50.0.windows.2. Do not claim a broad version matrix from one setup. npm cache existence alone doesn't establish which packages were reused; record observed install mode/logs honestly.

If clean on the agreed exporter base, create `git switch -c docs/a2ui-first-user-experience`. Never switch/reset a dirty shared checkout. Obtain these uncommitted onboarding docs through Omar's authorized handoff if they are absent from remote. Don't copy his node_modules, generated index or prepared ZIP to fake source reproduction.

Do not run npm ci in a serving demo folder, alter global settings, stop unrelated services or delete existing exports. Use npm.cmd on Windows, npm elsewhere. Composer's optional reference uses corepack.cmd yarn; do not make Yarn/Composer a prerequisite for source export.

## Milestones and acceptance

### C0 — quick first deliverable: orientation and reproduction plan

Read files above, answer questions and create a small environment/evidence note in this task document on your branch. Before new command execution, label entries NOT RUN. Identify the actual package scripts and generated prerequisites; do not change code.

**Accept:** a beginner can distinguish Storybook/exporter/renderer/Composer, the plan names exact cwd and exit checks, and known historical evidence is clearly separated. No build is needed just to produce this first reviewable plan.

### C1 — fresh-clone source-to-ZIP

In catalogs/material, execute the fail-fast install -> build-storybook -> test:a2ui -> unique export path in quickstart. Expect generated index, all-three export summary, root/public catalog, metadata/diagnostics, adapters/contracts/API, fixtures/menu/usages, source/styles/provenance, manifest/vendor/lockfile and adjacent ZIP. Record actual elapsed times/counts/warnings; source tests historically number 11 but your evidence must be observed.

Use a new GUID a2ui-output-onboarding-* name so current ignore rules cover folder/ZIP. Check both do not exist first. Do not use default a2ui-output, a2ui-three-* or preserved archives. An existing manifest does not make replacement safe. Failed export: retain local evidence/partial folder and retry into a new path after diagnosis, never erase demo output.

Inspect one catalog field (Metric value union), one generated adapter registration, manifest paths and one path-bound fixture. Explain what is generated and authored.

**Accept:** actual successful export from your independent clone, or a reproducible blocking issue with downstream checks marked NOT RUN. The latter is a valid investigation milestone but not completed reproduction. Report source install/network/cache conditions without upgrading dependencies or using forced peer installs.

### C2 — developer UX and confusion report

Compare commands by reading source first:

- storybook:material uses Angular builder on 6006; aggregate storybook spawns React on 6007 and then Angular, with Windows .cmd spawning risks and no need for export.
- npm start in source is the separate Angular app; npm start in an **extracted renderer** serves that package on 3456.
- build-storybook creates the ignored index; adding/renaming stories requires rebuilding, changing source fields reads live.
- --out chooses a folder and sibling ZIP; generic --components is absent and may be ignored by current parser.
- Composed React/Shadcn, automatic adapters and model writes are not baseline features.

Run Angular-only dev startup in your own clone if available and record visible page/readiness. Aggregate startup comparison can be source inspection only; don't reproduce it on someone else's live ports. If testing aggregate, isolate ports/processes, record exact failure and stop only your own children. A historical spawn EINVAL is not a newly reproduced FAIL.

Maintain a newcomer checklist, a confusion/bug log and the evidence table below in this guide or an explicitly agreed onboarding evidence document. Since scope currently targets the existing kit, start here rather than scattering duplicate guides.

For each confusion/bug entry record: symptom, exact command/cwd, environment, expected vs actual, earliest failed stage, reproducibility, likely owner, evidence and documentation correction. Examples worth investigating: wrong branch, aggregate launcher vs builder, missing index, stale stories, port conflict, sandbox EPERM/ENOTCACHED, HTML 200 but failed main.js, past all-three instructions used against a subset. These are investigation topics, not prefilled bug claims.

**Accept:** revised quickstart/first-15-min guide grounded in observed problems; no unsupported flags or invented npm scripts. Raise code defects with a minimal reproduction for Omar/Matangi/Audrey. Propose one small UX improvement (e.g. a missing-index diagnostic) without implementing it in this docs task.

### C3 — independent ZIP acceptance

Follow quickstart's fresh external extraction and fail-fast checks: npm.cmd ci --no-audit --no-fund, test:portable, test:schema, build, test:runtime. Use only extraction's package/lockfile/vendor. Confirm no original-checkout or sibling imports. Record hashes, paths in sanitized form, dependencies/cache mode and exit codes.

If available, run extracted dev server on a free port; verify /main.js, /catalog.json and visible UI. In standalone mode show literal/bound Metric and update, enabled/disabled Button and Checkbox host update/proposal. Don't call jsdom a browser check. Browser interaction and Composer remain separate rows.

Optional Composer: use your own compatible reference checkout, select this renderer URL and full generated fixture arrays, edit Data Model and inspect Events. Browser claims require personal observation: Metric 1340000 -> 1750000, enabled save, disabled no new event, Checkbox true/false proposals with boolean checked and no automatic model write, external updates honored. Prior historical success is not your new PASS.

**Accept:** full baseline clean ZIP install/audit/schema/build/runtime evidence, or precise blocked stage with downstream NOT RUN. Successful fresh reproduction is required before marking the task's overall reproduction outcome complete. Browser/Composer may remain explicitly NOT RUN if unavailable; source portability and browser compatibility are distinct claims.

### C4 — team handoff and follow-up

Give Omar documentation diff and observed bugs, Audrey readiness/identity wording issues, Matangi selection/collision/command issues. After their changes merge into an approved baseline, repeat relevant newcomer commands and update actual SHA/results. Do not copy proposed inventory/selector commands into the quickstart as working until they exist and you test them.

**Accept:** someone else can follow the corrected first-15-minute orientation, choose the execution path and interpret every evidence label. Demonstrate your result in one minute without an assistant reading it for you.

## Newcomer checklist and current evidence template

These checkboxes are intentionally unchecked: Eric's independent work is PLANNED.

- [ ] Own clone, correct branch/base SHA, clean preflight and personal branch.
- [ ] Explain Storybook vs renderer; identify generated-index prerequisite.
- [ ] Exact source install/build/test outcomes and environment recorded.
- [ ] New ignored export path and expected source artifacts inspected.
- [ ] Fresh external ZIP install/audit/schema/build/runtime results recorded.
- [ ] Browser/Composer evidence separately marked, including NOT RUN.
- [ ] Confusions turned into documentation fixes or owner-addressed bug reports.
- [ ] Four or more learning questions answered and own contribution explained.

Use PASS only for observed success, FAIL for an executed failed check, NOT RUN for unexecuted/blocked downstream checks. Keep failed attempts visible beside successful retries. “Historical PASS” belongs in context, not current results.

| Check | Exact command / cwd | Current Eric result | Evidence needed to replace NOT RUN |
| --- | --- | --- | --- |
| Fresh clone/base/environment | Preflight above, repo root | NOT RUN | Own clone, SHA/tools/cache/network observations |
| Locked source install | npm.cmd ci --no-audit --no-fund, catalogs/material | NOT RUN | Exit code and install log; no force/upgrade |
| Angular static build | npm.cmd run build-storybook, catalogs/material | NOT RUN | Exit code and generated index context |
| Source behavior | npm.cmd run test:a2ui, catalogs/material | NOT RUN | Actual count/failures and exit code |
| Angular-only startup | npm.cmd run storybook:material -- --host localhost --ci --no-open, catalogs/material | NOT RUN | Compilation, URL and actual UI check |
| Aggregate comparison | Read scripts/storybook.mjs; execution optional | NOT RUN | Label source inspection separately from executed startup |
| Fresh export | npm.cmd run export:a2ui -- --out actual-new-path, catalogs/material | NOT RUN | Actual path/summary/ZIP SHA; do not literally use actual-new-path |
| Portable install | npm.cmd ci --no-audit --no-fund, new extraction | NOT RUN | Separate lockfile install log/cache conditions |
| Manifest audit | npm.cmd run test:portable, extraction | NOT RUN | Exit/output and source independence |
| Schema/build/runtime | npm.cmd run test:schema, build, test:runtime sequentially, extraction | NOT RUN | Separate results, no proceeding after install failure |
| Real standalone UI | npm.cmd start or explicit free-port ng serve, extraction | NOT RUN | main.js startup and personally observed controls/actions |
| Optional Composer | Renderer selection + fixed messages + model/events | NOT RUN | Personal browser observations with renderer/catalog context |

This is a ready-to-use log structure, not an assertion that checks ran. Add actual command, exit code, duration/log reference and sanitized output to each row during your task; don't leave “fill in” placeholders in a completed handoff.

A bug log entry should read like: “On [observed environment], [exact command] failed before [stage]. Expected [behavior]; observed [error]. Reproduction [steps]; likely owner [name] because [source evidence]; docs correction [change].” Use actual values when recording, and label unconfirmed causes as hypotheses.

## Sponsor-visible first 15 minutes

Teach this short path through the existing [quickstart](../02-QUICKSTART.md#first-15-minutes-read-only-map):

- Minutes 0–3: correct exporter branch/access, own clone or source view, identify three supported registrations.
- Minutes 3–8: follow Metric story -> input source -> adapter -> bound fixture.
- Minutes 8–12: identify exporter command and resulting catalog/source renderer/lockfile; explain that install/build are additional work.
- Minutes 12–15: explain host-owned events/data and choose next task/checkpoint.

Do not promise full cold installation/build/browser setup in 15 minutes. Link to [Audrey's inventory task](STORYBOOK-DISCOVERY-AND-ELIGIBILITY.md) and [Matangi's subset task](COMPONENT-SELECTION-AND-SUBSET-EXPORT.md) as planned next features.

## Definition of Done and PR handoff

Deliver docs corrections, completed newcomer checklist, actual environment/command evidence table, confusion/bug log, sponsor-visible first-15-minute orientation and a short self-explanation. No source/runtime/manifest/lockfile changes or committed generated outputs. Existing source tests and baseline export must succeed in your independent clone to claim successful reproduction; clean portable install/audit/schema/build/runtime must succeed to claim independent renderer reproduction.

A well-diagnosed blocker is useful evidence and may justify an interim docs PR; leave overall reproduction incomplete and clearly name the owner/next action. Browser/Composer unavailability is reported separately. Reviewers: Omar (accuracy/scope), Audrey/Matangi (their future commands), another newcomer when available (clarity).

In 60–90 seconds show environment/SHA, one actual result and one corrected confusing step; explain why it matters. You must answer four architecture/setup questions without copy-reading the AI. Include exact changes, commands, remaining NOT RUN checks and follow-up owners in the PR.

## Copy-ready assistant prompt — START HERE

```text
I am Eric, suggested owner of developer onboarding/reproducibility for
o0avdi/capstone-catalogs. Be my tutor and QA partner. Read AGENTS.md,
docs/A2UI_EXPORT_MVP_PLAN.md and this complete task:
docs/team-onboarding/tasks/DEVELOPER-ONBOARDING-AND-REPRODUCIBILITY.md,
plus README, architecture, quickstart and AI workflow in that folder.

Verify root/branch/SHA/status/tools and whether this is my independent clone.
Expected exporter branch feat/storybook-a2ui-exporter, audited commit
793eef108d5646e649cb54b911521a5415f9c8d1. Don't reset, overwrite dirty work,
copy prepared dependencies/artifacts or touch other checkouts/demo services.
Inspect catalogs/material/package.json, angular.json, .storybook/main.ts,
scripts/storybook.mjs, scripts/a2ui/export.mjs, metadata.mjs,
component-files.mjs, a2ui/registrations.json, adapters/fixtures,
renderer/package.json/main.ts and portable test scripts; read
docs/EXPORT_ANOTHER_COMPONENT.md and dated SETUP_STATUS evidence.

Explain the two paths source-to-ZIP and ZIP-to-renderer for a beginner.
Ask at least four learning questions and check my answers before major work.
Show the exact safe execution plan/cwd/prerequisites, evidence structure
and likely documentation edits before editing. Once I authorize the
milestone, perform useful checks yourself if you can and ask for my actual
outputs only when necessary. Check every exit code before proceeding.
Do not label the prepared maintainer checkout a fresh-clone verification.

Use npm.cmd on Windows. Angular-only Storybook is preferable to aggregate
startup; compare source before optional isolated startup. No Composer,
API key/LLM or dependency upgrade is needed for initial source/export QA.
Export into fresh ignored GUID paths, extract ZIP into a new external
directory and use its own lockfile/dependencies. Keep PASS/FAIL/NOT RUN
separate for source tests, clean install/build/jsdom and actual browser.
Retain failed attempts and diagnose rather than bypass errors.

Keep edits docs/QA-only under agreed onboarding scope. Raise exporter,
renderer or launcher bugs with minimal reproduction; don't fix source
without Omar's separately agreed scope. No global configuration changes,
staging, commit, push, merge, deployment or source cleanup.
Produce corrected docs, newcomer checklist, actual evidence and confusion
log, first-15-minute guide, and links/coordination with Audrey and Matangi.
Finish with changed files, commands/cwd/exits, limitations and a 90-second
self-explanation. Quiz me on what my evidence proves and does not prove.
```
