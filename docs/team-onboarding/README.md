# Storybook to A2UI: team onboarding and implementation plans

The implemented MVP exports **FinanceMetricCard, MaterialButton and MaterialCheckbox** from registered Angular stories into an independent Angular source renderer ZIP. TypeScript/CSF extraction generates the catalog and contracts; authored adapters supply rendering and event semantics. Independent installation/build/runtime and real Composer interactions are recorded in [SETUP_STATUS](../SETUP_STATUS.md). General component inventory and generic subset selection are **PLANNED**, as is independent newcomer reproduction. Battery Finance/Qwen is a separate demonstration and does not directly consume this export.

Start with [architecture](01-ARCHITECTURE.md), choose the inspection or execution path in [quickstart](02-QUICKSTART.md), and follow [AI workflow](03-AI-WORKFLOW.md). Each task is a standalone brief with a copy-ready assistant prompt, milestones, edge cases and learning checks. Suggested owners require team confirmation.

| Suggested owner | Workstream | Dependency | First useful deliverable |
| --- | --- | --- | --- |
| Omar | Architecture, integration, sponsor alignment, cross-feature review | Maintains and protects demonstrated exporter baseline | Decide sponsor-approved MVP, review interfaces/tests/PRs |
| Audrey | Storybook component discovery and export-eligibility reporting | Can start independently; align identity/eligibility contract with Matangi | Read-only report of local component candidates grouped from story variants, with grounded statuses |
| Matangi | Component selection and correctly scoped portable exports | Can start selecting existing registration IDs; coordinate inventory IDs with Audrey | CLI subset export plus tests for single/mixed/all supported components |
| Eric | Fresh-clone onboarding, reproducibility and developer QA | Independent; consult Audrey/Matangi as docs surface new commands | Verified from-scratch run, error/UX report, documentation corrections |

Assignments:

- [Discovery and eligibility — Audrey](tasks/STORYBOOK-DISCOVERY-AND-ELIGIBILITY.md): read-only candidate inventory; no packaging changes.
- [Selection and subset export — Matangi](tasks/COMPONENT-SELECTION-AND-SUBSET-EXPORT.md): exact subsets of existing registrations; no automatic component onboarding.
- [Developer onboarding and reproducibility — Eric](tasks/DEVELOPER-ONBOARDING-AND-REPRODUCIBILITY.md): independent evidence and docs; no exporter fixes hidden in QA.

## Verified basis of these plans

Audit date: October 15, 2026. Repository: `https://github.com/o0avdi/capstone-catalogs`; local root: `C:/Users/omara/repos/bacs496/storybook-a2ui-mvp/capstone-catalogs`. Branch and HEAD: `feat/storybook-a2ui-exporter`, `793eef108d5646e649cb54b911521a5415f9c8d1`. Origin fetch/push URL: `https://github.com/o0avdi/capstone-catalogs.git`. No tracked implementation under `catalogs/material` differed from that checkpoint. Do not assume the exporter is on `main`.

The supplied onboarding folder was entirely untracked. Existing unrelated changes were preserved: root README, MVP plan and recording guide modifications; untracked live runbook, live-demo JSON, scripts and browser evidence. This refinement edits the nine onboarding guides only; [the original refinement instructions](CODEX-REFINEMENT-PROMPT.md) remain unchanged. The MVP plan remains historical/progress context; this audit does not edit it or override live-demo preparation.

| Evidence | Result in this refinement run | Meaning / limitation |
| --- | --- | --- |
| Source/config/tests/adapters/fixtures inspection | PASS | Implementation informed the plans |
| Environment | Node v24.20.0; npm 11.19.0; Git 2.50.0.windows.2 | Observed locally; fresh-machine setup remains Eric's task |
| Existing ignored Storybook index | v5, 274 entries, 223 local stories, 50 distinct local story paths | Observed generated file, not rebuilt here; counts are not component totals or acceptance constants |
| `npm.cmd run test:a2ui` in `catalogs/material` | PASS, 11/11 | Prepared dependencies/index; not clean-clone evidence |
| Documentation QA | PASS, 33 relative Markdown links including anchors; nine guides checked for whitespace/fences | All linked local targets exist; original refinement prompt retained |
| New Storybook build/export, clean ZIP installation/build/runtime, Composer/browser | NOT RUN | Prior results are in SETUP_STATUS; no new UI acceptance claimed |

## Coordination that keeps first PRs independent

Audrey inventories local story paths while Matangi selects current `registrations.json[].name` values. Neither first PR depends on the other's code. Eric can test the baseline immediately. Before connecting inventory to selection, Audrey and Matangi write one short identity note in the discovery brief and have Omar review it: `componentId` identifies a candidate, `registrationName` identifies an implemented mapping, and eligibility states whether that mapping passed bounded checks. See the [proposed contract](tasks/STORYBOOK-DISCOVERY-AND-ELIGIBILITY.md#proposed-shared-identity-contract).

Selection must reject unsupported/unmapped candidates; silently omitting one is a failure. Omar owns shared exporter/renderer contract review. Alan gates new frameworks, arbitrary adapter automation and reverse conversion. See [roadmap and decisions](04-ROADMAP-AND-SPONSOR-QUESTIONS.md) and [30-minute handoff](05-OMAR-HANDOFF.md).

## Working boundaries

Use your own clone and branch. Check status before changes; keep dependencies, framework and lockfiles pinned. No API key or LLM is needed for acceptance: use fixed fixtures. Preserve ZIPs and demo services. Choose a **new** output path, not an existing directory; current export can overwrite manifest-bearing outputs without cleaning stale files.

Only three registered components are supported today. `--metric-only` exists; `--components`, inventory CLI and alternate packaging tiers do not. The archive includes renderer **source**, lockfile and vendored bridge, without installed `node_modules` or a precompiled application. Finish each milestone with actual evidence, diff review and an explanation in your own words. No silent stage, commit, push, merge, deployment or publication.
