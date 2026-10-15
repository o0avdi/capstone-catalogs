# Codex task: verify the exporter and deepen the team implementation plans

> **Run in the repository workspace**, not just against this document alone. This is a documentation/architecture refinement task. Do not implement the assigned features in this run.
>
> Repository: `https://github.com/o0avdi/capstone-catalogs`
>
> Expected baseline branch: `feat/storybook-a2ui-exporter`
>
> Known published checkpoint: `793eef108d5646e649cb54b911521a5415f9c8d1` (use as context; inspect current local HEAD and any newer commits rather than assuming this is still current).
>
> Expected documentation folder: `docs/team-onboarding/`

## Your role and desired outcome

Act as a senior engineer, architect, technical educator, and team lead advising a four-person capstone team building an Angular Storybook → A2UI exporter. The existing MVP exports **FinanceMetricCard**, **MaterialButton**, and **MaterialCheckbox** into an independent Angular source bundle with A2UI catalog/schema, runtime contracts, adapters, styles/source, fixtures, dependencies/lockfile, vendored bridge, and renderer. Real interaction was verified through Composer: bound revenue changes; enabled/disabled button actions; host-owned checkbox boolean proposals/data-model updates. There is also a separate Battery Finance/Qwen demonstration; it does **not** directly consume this export, and it must not be conflated with the exporter implementation.

We want unusually useful documentation: teammates with modest knowledge of A2UI can open their assigned **task-named Markdown file**, point Codex/Claude/ChatGPT at it in their own local checkout, get a tailored explanation, work safely through small implementation phases, verify their results, and present the technical reasoning themselves. The AI should accelerate each owner's real engineering work, not hide complexity or invent status.

I am supplying an initial 9-file onboarding kit as a draft. **Improve it substantially through source inspection and reasoned engineering planning.** Preserve the main ownership and dependency table. Rename any references to "M" in the teammate-owner context to **Matangi** (do not modify unrelated code identifiers or legitimate occurrences of the letter M). Name each task file for the **task**, not the person, while giving the **suggested owner** inside the file. Suggested owners are subject to team/sponsor confirmation:

| Suggested owner | Workstream | Dependency | First useful deliverable |
| --- | --- | --- | --- |
| Omar | Architecture, integration, sponsor alignment, cross-feature review | Maintains and protects demonstrated exporter baseline | Decide sponsor-approved MVP, review interfaces/tests/PRs |
| Audrey | Storybook component discovery and export-eligibility reporting | Can start independently; align identity/eligibility contract with Matangi | Read-only report of local component candidates grouped from story variants, with grounded statuses |
| Matangi | Component selection and correctly scoped portable exports | Can start selecting existing registration IDs; coordinate inventory IDs with Audrey | CLI subset export plus tests for single/mixed/all supported components |
| Eric | Fresh-clone onboarding, reproducibility and developer QA | Independent; consult Audrey/Matangi as docs surface new commands | Verified from-scratch run, error/UX report, documentation corrections |

## Required process — do not skip repository verification

1. **Safety / worktree preflight.** Report repo top level, current branch and HEAD, remote, `git status --short`, relevant ignored/untracked doc changes. Never reset, clean, overwrite live-demo evidence, discard local modifications, switch a dirty checkout, force push, or modify preserved ZIPs. Do not assume `main` contains the MVP. If the docs provided in this package are not yet under `docs/team-onboarding/`, tell me how to place them (or copy them there if available in the workspace); do not invent a file location. If any relevant source file has evolved since the published checkpoint, anchor the revised documents to the **actual** checkout and document differences.
2. **Read the draft kit end to end**: README, architecture, quickstart, AI workflow, roadmap/sponsor questions, Omar handoff, and all three task files.
3. **Read the actual implementation** before refining the plans. At minimum inspect:
   - `catalogs/material/package.json`, `.storybook/main.ts`, `angular.json`, representative `src/stories/**/*.stories.ts`, and any built `storybook-static/index.json` (which may be ignored/not checked in);
   - `catalogs/material/a2ui/registrations.json`, all three `a2ui/components/*/{adapter.ts,fixtures.json}` and component assets;
   - `catalogs/material/scripts/a2ui/{export.mjs,metadata.mjs,component-files.mjs,zip.mjs,metadata.test.mjs}`;
   - `catalogs/material/scripts/a2ui/portable/*` and `catalogs/material/a2ui/renderer/src/{main.ts,validating-renderer.ts}`;
   - `docs/EXPORT_ANOTHER_COMPONENT.md`, relevant exporter README, existing validation evidence.
   Follow imports or tests as needed. No framework/network search is required unless source has an unresolved technical question; repo code is primary authority.
4. **Map implemented capabilities versus next-step proposals.** Specifically check that discovery currently applies to *registered story paths*, not a user-facing inventory of unregistered components; `--metric-only` exists but generic subset selection is not yet implemented; supported source scalar bindings and named actions are bounded; fixture/standalone test assumptions may not be subset-independent; the ZIP bundles renderer **source**, not built `node_modules` or a precompiled artifact. If checkout disagrees with any statement, correct it rather than copying this prompt.
5. **Refine the documents, not application code.** Do a substantive rewrite where warranted, avoiding generic advice. Give each document clear scope, real file/function references, exact safe commands, cross-links, version limitations, checkpoints, failure recovery, and an appropriate difficulty level. Preserve all useful verified detail in the starter docs. Never claim browser testing, builds, or new feature implementation you have not executed. Fix outdated commands (the Angular-only Storybook builder command is preferable to the aggregate launcher for Windows where appropriate) and misleading repo/setup assumptions. Keep the reference to the published exporter branch rather than `main` when instructing clones.

## Exact output file set

Keep a coherent folder under `docs/team-onboarding/`:

- `README.md` — clear entry point, one-paragraph state of the MVP, how to use these documents, **suggested ownership AND dependency table**, status boundaries and assigned task links.
- `01-ARCHITECTURE.md` — beginner-friendly architecture, precise import/call/data/event flow, glossary for Storybook/Angular/A2UI/Composer/adapter/contract/renderer, distinction between automated extraction and authored mappings, illustrative real examples, file/function guide, framework constraints.
- `02-QUICKSTART.md` — fresh-checkout instructions on the exporter branch (Windows and platform-neutral command differences where useful), minimal read-only exploration path vs optional expensive full build, safe unique output path and expected artifacts, honest troubleshooting and local Composer as optional.
- `03-AI-WORKFLOW.md` — universal AI kickoff, safe branch workflow, learning/checkpoint protocol, prompt injection/credentials hygiene, test discipline, clean PR/handoff template, when to ask Omar for decisions; AI must explain code and quiz teammate before substantial changes.
- `04-ROADMAP-AND-SPONSOR-QUESTIONS.md` — incremental MVP success definition, sequencing, **repeat or reference the ownership/dependency table**, exact sponsor questions and feature tradeoffs (selection, scaffolding, packaging tiers, addon, cross-framework support, reverse conversion). Label proposed features distinctly from implemented ones.
- `05-OMAR-HANDOFF.md` — brief handoff agenda, suggested assignments, dependency checkpoints, a safe integration/review strategy, communication templates, sponsor meeting talking points.
- `tasks/STORYBOOK-DISCOVERY-AND-ELIGIBILITY.md` — **suggested owner Audrey**. Separate, independently usable task plan.
- `tasks/COMPONENT-SELECTION-AND-SUBSET-EXPORT.md` — **suggested owner Matangi**. Separate, independently usable task plan.
- `tasks/DEVELOPER-ONBOARDING-AND-REPRODUCIBILITY.md` — **suggested owner Eric**. Separate, independently usable task plan.

Task filenames must use the task, not a person's name. Remove stale links to the old `AUDREY-DISCOVERY.md`, `M-SELECTION.md`, `ERIC-ONBOARDING.md` files if any remain; do not leave duplicate task documents that teammates might accidentally follow.

## What EACH task file must contain

Aim for a standalone actionable engineering brief, not a vague bullet list:

A. **At a glance:** name, suggested owner, status PLANNED (unless evidence shows implemented), priority, goal, why it matters to the real product, explicit non-goals, dependencies, overlap/coordination with other tasks.
B. **Learn first (10–20 min):** exact paths and functions to inspect in a sensible order; define unfamiliar terms; explain 1–2 concrete code paths through existing MVP; at least 4 questions the teammate should be able to answer and a short sponsor-ready 60–90-second explanation target.
C. **Baseline and safe environment:** verified branch, commands or commands to discover locally (not invented), `git status`, new feature branch, no overwriting live/demo outputs, no protected ZIPs, handling generated index/ignored output. If task is docs/QA-only, don't require unnecessary build steps upfront.
D. **Milestones:** first planning/learning checkpoint, minimal implementation increment, negative cases/test coverage, integration handoff, with explicit acceptance criteria and evidence for each. Distinguish 'quick first PR' from stretch features. Mark any decision requiring Omar or Alan approval.
E. **Precise technical design notes:** actual integration surfaces, preferred data shapes and edge cases, expected touched files (label as likely vs confirmed), tests and exact commands where grounded. Avoid pseudo-code that invents APIs. Include failure paths and regressions that could affect other teammates.
F. **Copy-ready coding assistant prompt** containing context, the role of the assistant as tutor + engineer, current files to inspect, minimal scope, requirement to show design/tests before editing, iterative implementation plan, final results/limitations, and a learning check. Encourage the assistant to *perform* implementation and tests when the teammate authorizes, but not to silently push/merge or destroy state.
G. **Definition of Done and PR handoff:** which tests must pass, exact artifacts expected (source, CLI output, structured JSON, docs, etc.), what 'not done' means, 60-second review/demo, who reviews, and how to coordinate subsequent milestones.

### Technical task-specific guardrails

**Audrey / Discovery**
- Index v5 entries may include docs, remote refs, different story variants of one underlying source; discovery must filter carefully and group *component candidates*, not list 223 entries as 223 exportable components.
- Explore stable identity based on local story `importPath` and associated registration, with explicit `componentId` / `registrationName` separation. Do not assume story display title is stable or unique. Produce a sample JSON contract with fields/metadata grounded in repository and discuss aliases/missing mappings.
- Eligibility statuses should distinguish "supported / export-ready", "requires explicit adapter or configuration", and "unsupported" with reasons. Status must be conservative: seeing primitive args does not prove action/rendering compatibility.
- Start read-only; do not change current exported output or hard-code all Storybook titles.
- Coordinate one *small shared selection identity contract* with Matangi; propose schema in docs, identify its owner, no new generalized plugin architecture.

**Matangi / Selection**
- Current `export.mjs` selects all registrations, except `--metric-only`; build deterministic noninteractive subset selection for *already registered* components first. Do not make automatic onboarding an accidental dependency.
- Specify CLI interface *as a proposal* until checked against existing code, e.g. `--components FinanceMetricCard,MaterialCheckbox`. Include unknown/duplicate/empty IDs, deterministic order, clear errors BEFORE destination writing, colliding outputs and idempotence policy; maintain no-flag behavior.
- All selected output surfaces must be subset-clean: schema, generated contracts/registration, fixtures and demo menu, adapter/source/assets/provenance, usages, manifest/ZIP, and runtime tests. Shared bridge/template/dependencies can remain. Don't just prune catalog.json after a complete export.
- Show robust acceptance: FinanceMetricCard only, MaterialButton only, MaterialCheckbox only, a mixed pair, all three, plus negative tests. Independent clean ZIP install/build/runtime in representative subsets. Identify and remediate current fixed-component/position test assumptions with minimal changes. Work closely with Audrey but don't wait to build basic registered-name selection.

**Eric / Onboarding and QA**
- Reproduce from a different clone if possible (do not create a fake clean-clone report from Omar's prepared machine). Track exact versions, cache/network preconditions, command outputs, and broken steps; fix documentation instead of changing the exporter.
- Verify `storybook:material` versus aggregate `storybook` behavior and Angular builder on Windows; document minimal path to execute `test:a2ui`, safe export, and optionally standalone rendering. No claims that Composer is required to validate a first clone.
- Create a newcomer checklist + confusion/bug log + evidence table with PASS/FAIL/NOT RUN. Produce a sponsor-visible "first 15 minutes" guide, link to the other two tasks, and surface issues for Omar/teammates.
- Keep changes docs/QA only without approval; no dependency upgrades or whole-repo cleanup.

## Cross-task coordination contract

Document dependencies explicitly in README/roadmap and both Audrey/Matangi briefs:

1. Audrey starts with Storybook index inventory and grounded IDs. Matangi starts with current `registrations.json` names. Neither task must block the other's **first** PR.
2. They agree by a short written note on stable component identity and mapping before wiring inventory to selection. The selector must reject unsupported candidates, not silently skip them.
3. Eric can test the **current** baseline immediately and later rerun the quickstart and selector docs against the merged results.
4. Omar owns cross-feature integration and approves any shared exporter/renderer contract change. Sponsor feedback gates new frameworks, automatic arbitrary adapter generation, and reverse conversion.

## Quality and verification before finishing

- No application source, build scripts, dependency manifests, `.env`, model/agent config, checked-in generated reference, or existing artifacts changed. Only docs under `docs/team-onboarding/` are in scope unless you explain and request authorization for anything else.
- Verify every linked relative Markdown path exists. Ensure a teammate can read any task file alone without an external conversation. Remove placeholders and stale owner names. Keep suggested ownership and dependency table intact.
- State explicit current status and unimplemented features accurately. Avoid promising arbitrary Storybook → A2UI transformation or automatic host model writes.
- Use existing repo commands rather than inventing `npm scripts` or selecting an unavailable tool. Where acceptance criteria are future commands, mark them **PROPOSED**.
- Produce a docs-only diff and a short report: edited/renamed files, strongest new technical findings with source paths, why each task is independent, shared interface decision still needed, what was NOT tested, recommended next two PRs, and suggested 30-minute handoff agenda.
- Do **not** stage, commit, push, or create PRs in this refinement task. Stop if there's risk of overwriting uncommitted docs and ask for confirmation.

Proceed through repository audit and refinement of all nine Markdown files. Do not stop after providing an abstract plan; the requested output is the revised **files**. If no workspace editing access, output full replacement Markdown for each requested file instead of claiming to have edited it.
