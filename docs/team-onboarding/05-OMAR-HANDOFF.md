# Omar handoff: a concrete 30-minute team session

Share the [entry point and suggested ownership table](README.md), the exporter branch and all three task guides. The docs are currently uncommitted in this checkout; distributing them requires a separate user-authorized handoff. This refinement does not stage, commit, push or create PRs.

## Agenda

| Minutes | Discussion | Required output |
| --- | --- | --- |
| 0–5 | Story -> registration/adapter -> catalog/source ZIP -> independent renderer -> Composer | Each person identifies one source file in that path |
| 5–9 | Three supported components; authored semantics vs generated metadata; source vs renderer dependency trees | Everyone can state the automation boundary and host-owned Checkbox policy |
| 9–15 | Confirm Audrey/Matangi/Eric assignments and first milestones | Owner, personal branch, first review date; Eric starts reproduction immediately |
| 15–21 | Inspect proposed identity record and selector behavior | Audrey/Matangi agree componentId vs registrationName; Omar records pending approvals |
| 21–26 | Output collisions, subset test assumptions and historical hash test | Agreed minimal safety/test strategy for Matangi |
| 26–30 | Select questions for Alan and next check-in | Target user/output recommendation, two concrete engineering PRs and docs/evidence PR |

The task prompts require assistants to explain and quiz before substantial edits, then implement authorized milestones. Do not require Omar to approve every routine command; route shared design decisions and scope changes to him.

## Technical handoff checkpoints

- **Audrey:** read-only grouped inventory, explicit uncertainty and reasons. Source index currently has 223 local stories across 50 paths, not 223 export-ready components; do not freeze counts. First PR owns a new focused module/CLI/tests, not export.mjs.
- **Matangi:** starts with registration.name selection without inventory. Owns export option parsing, subset composition and subset-aware tests. main.ts menu already loops generated data; prefer test changes over renderer changes. Notify Omar before modifying shared hash-pinned files.
- **Eric:** own clone and evidence, docs/QA only. No Composer needed for first export. Compare Angular-only startup with aggregate launcher through source first; reproduce failures only in his isolated environment.
- **Omar:** review shared identity/eligibility semantics, CLI/errors/collisions, catalog identity and historical hash-test treatment. Alan decides expansion priorities.

The discovery brief owns the short written identity note, coauthored with Matangi. Until approved it is a proposal. Before wiring, verify unsupported/ambiguous candidates reject selection. No titles or story variant IDs as selection keys.

## Safe integration and review

Keep one owner per shared file. Audrey should not edit metadata/export generators in the first PR; Matangi should avoid broad extractor/runtime refactors. Eric can edit onboarding docs separately and rerun after merges. If a shared helper is essential, have Omar define a small follow-up PR rather than concurrent conflicting edits.

Review small branches against the actual approved exporter base, never assumed main. Require test logs and exact cwd, inspect generated outputs locally, and keep generated ZIPs/caches/node_modules out of commits. Preserve reference JSON and known-good artifacts. No dependency upgrades, renderer framework migration or sibling modifications.

First review: inventory synthetic tests + real report; selector parser negatives + all required subset surfaces. Integration review: all-component regressions, clean single/mixed ZIP install/build/runtime, then newcomer rerun. Real Composer interaction is separate from jsdom and can be scheduled when a browser/host is available; don't relabel historical results as new runs.

The historical workflow proof is evidence of how Checkbox was added. Updating hashes merely to make a selector PR pass would destroy that meaning. Review the scoped test adaptation described in [Matangi's guide](tasks/COMPONENT-SELECTION-AND-SUBSET-EXPORT.md), retaining historical JSON and before/after equality.

## Ready-to-send team message

```text
Please open docs/team-onboarding/README.md in your own exporter checkout,
then read architecture, quickstart, AI workflow and your task-named guide.
Suggested owners: Audrey discovery/eligibility, Matangi subset selection,
Eric clean-clone reproducibility. Confirm assignments at our handoff.
Use the guide's assistant prompt; have it teach the current path and quiz you
before substantial edits. Start an isolated branch and deliver one milestone.
Return exact commands/results, a diff and a 60–90-second explanation.
Don't overwrite exports/demo services, upgrade dependencies, push or merge
without authorization. Discovery and selection can start independently.
```

## Milestone update / blocker template

```text
Owner / branch / base SHA:
Milestone and actual behavior:
Files changed:
Exact command + cwd + exit code + evidence:
PASS / FAIL / NOT RUN and why:
What I can explain myself:
Decision needed, options, recommendation and which next step it blocks:
Next reviewable deliverable:
```

Ask for this within 24–48 hours, adjusted to team availability. A reproducible blocker is useful progress; it does not count as a completed working export.

## Sponsor conversation

Use [roadmap questions](04-ROADMAP-AND-SPONSOR-QUESTIONS.md). Lead with demonstrated three-component portability, then recommend discovery/selection/newcomer QA as the next product increment. Ask Alan to pick first user and next output tier. Keep arbitrary onboarding, extra frameworks, addon and reverse conversion labelled future scope. Each owner should present their own technical contribution; Omar supplies cross-feature context, not everyone's implementation explanation.
