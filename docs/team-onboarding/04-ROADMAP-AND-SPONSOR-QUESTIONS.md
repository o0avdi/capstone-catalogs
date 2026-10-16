# Roadmap and sponsor decisions

This is a proposed development sequence, not sponsor-approved scope. Current code at `793eef108d5646e649cb54b911521a5415f9c8d1` implements three registered Angular exports; [README evidence](README.md#verified-basis-of-these-plans) records what this documentation audit actually reran. Preserve the live demo and source/renderer lockfiles.

## Incremental success definition

Implemented: source/index extraction for registrations, generated catalog/contracts/fixtures, authored adapters, deterministic portable source ZIP, standalone renderer and prior real Composer interaction evidence. Not implemented: general inventory, generic subset CLI, automatic onboarding/scaffolding, alternate packaging tiers, Storybook addon, cross-framework export or reverse conversion.

For the next checkpoint we recommend a newcomer can identify local candidates, understand eligibility reasons, choose registered names and run the resulting exact-subset ZIP. All selected components must have consistent schema/source/adapters/fixtures/runtime tests. Unsupported candidates produce explicit diagnostics. A new teammate can explain and reproduce the workflow without Omar. This is a **target**, not today's completed state.

## Ownership, dependencies and sequence

Preserve the [suggested ownership/dependency table](README.md) as the assignment source of truth. Each first deliverable is independent:

| Phase | Owner | Deliverable / gate |
| --- | --- | --- |
| Start now | Eric | Baseline clean-clone checklist and honest evidence; no discovery/selection prerequisite |
| First engineering PR A | Audrey | Read-only inventory, deterministic grouped candidates, conservative eligibility, synthetic tests; no exporter mutation |
| First engineering PR B | Matangi | Registered-name CLI selection plus subset-clean output and tests; can begin concurrently using current registration names |
| Before inventory-to-selection wiring | Audrey + Matangi; Omar reviews | Written componentId/registrationName/status contract, ambiguity/error policy, no title-based matching |
| Integration checkpoint | Omar + all owners | Reviewed all-component regression, subset ZIP install/build/runtime, Eric reruns newcomer docs |
| Later, only after sponsor priority | Unassigned | Narrow scaffolding or alternative output mode; independent feature brief required |

Recommended next **two engineering PRs** are A and B, with Eric's docs/evidence PR alongside them. Merge order can be A then B for review simplicity, but B's core must not wait for A. Omar owns shared exporter/renderer contract approval. Audrey owns the small identity note in her task document; Matangi coauthors selector semantics. This is not a new generalized plugin architecture.

## Architectural decisions Omar should settle

| Decision | Recommendation | Why / current evidence |
| --- | --- | --- |
| Candidate identity | First release: project-relative normalized CSF importPath, separate nullable registrationName; retain componentPath only as a hint | Current discover matches registration.story; Button/Checkbox lack componentPath; titles are display labels |
| Multiple registrations/aliases per story | Report ambiguous matches, withhold readiness/automatic mapping; no arbitrary first match | A story file is not always one underlying component; a future split needs explicit mapping |
| Selector spelling and compatibility | PROPOSED --components comma-separated registration names; preserve no-flag all and --metric-only; reject combining flags | Existing parser only scans --out/--metric-only and can ignore unknown flags |
| Ordering / duplicates | Canonical registration order; reject duplicates and empty tokens; case-sensitive names | Stable generation/hashes and early actionable errors |
| Output collision and retry | New subset mode refuses existing folder OR ZIP; preserve legacy no-flag behavior initially; always use new GUID paths | Existing guard allows manifest-folder overwrite and leaves stale files; ZIP-alone collision is unchecked |
| Hash-proof regression | Preserve historical proof JSON/equality; move current-source pinning to a historical snapshot check or replace it with meaningful scoped behavior assertions after review | metadata.test.mjs asserts today's shared files equal historical hashes, so legitimate selector changes fail |
| Catalog identity across subsets | Keep current ID for isolated first slice, explicitly document limitation; decide version/fingerprint/namespacing before simultaneous multi-subset host use | metadata.mjs exports one fixed catalogId; no versioned subset identity exists |
| Eligibility depth | Bounded extraction/catalog/fixture checks without builds; record check level and uncertainty | Primitive args or adapter presence alone cannot prove readiness; build/UI proof is a separate evidence axis |
| Partial export failure | At least validate selection and fixtures before writes; define fresh-path failure policy; transactionality can be separate if scoped explicitly | componentFixtures currently runs after initial copying/writes |

Resolve only decisions needed for each slice; do not block read-only reporting on future catalog federation.

## Questions for Alan, with concrete tradeoffs

1. **Who is the first user?** Storybook author needing readiness advice, renderer maintainer needing contracts, or application developer needing a runnable bundle? Recommendation: prove author-to-runnable-bundle first.
2. **What is sufficient automation?** Is selecting explicitly supported components valuable before adding new ones automatically? Recommendation: accept discovery plus reliable selection as the next MVP.
3. **Which output matters?** Full portable renderer is implemented. Schema-only is smaller but requires an existing compatible implementation; integration source needs a host API/version contract. Choose one next tier rather than promising all.
4. **Must onboarding generate adapters?** A narrowly supported primitive-input scaffold still needs reviewed semantics for content/events/providers/assets. Arbitrary render functions/callbacks cannot be inferred safely from Controls.
5. **Which interaction contract?** Continue A2UI v0.9, typed path bindings, scalar named actions and host-owned checkbox updates? Package versions 0.10.x do not change the protocol choice.
6. **CLI or addon?** CLI is deterministic/testable with fewer moving parts. A Storybook addon should later call the same services; browser UI alone cannot package server-side source.
7. **Angular first or another target?** React/Lit require separate source extraction/mapping/dependencies/runtime validation. Composed Shadcn is a remote reference, not already supported export.
8. **Reverse direction?** Known A2UI contracts could produce example stories; they cannot recover arbitrary original component source. Which concrete reverse-use case would justify its cost?
9. **Capstone alignment?** How do exporter milestones support analytics/chart components, ExecutiveDashboard templates and the November showcase? Which realistic developer task should the next sponsor demo demonstrate?

## Proposed output tiers and later work

| Tier | State | Acceptance needed before claiming support |
| --- | --- | --- |
| Full portable source renderer | IMPLEMENTED for registered set | Independent lockfile install, source audit, schema/build/runtime, explicit UI evidence |
| Catalog/contracts only | PROPOSED | Destination already implements identical names/props/actions and compatible protocol; clear absence of source/UI |
| Integration source package | PROPOSED | Explicit Angular host integration surface, dependencies/assets/providers and compatibility test |
| Input-only scaffold | PROPOSED | One narrow new component; generated draft mapping with semantic review and failures for unsupported inputs |
| Addon / multi-catalog / other frameworks / reverse | DEFERRED | Sponsor-selected use case and separate acceptance plan |

Multiple catalogs introduce identity/dependency conflicts. Providers, slots/templates, arbitrary callbacks, arrays/objects and source Angular 22 vs renderer Angular 21 remain constraints. Smaller ZIPs are not a dependency upgrade opportunity.

## Sponsor-ready explanation

“We can export three explicitly mapped Angular components into an independent renderer with generated contracts and tested interactions. Next we recommend making that workflow usable: show local candidates and readiness, select supported components, and reproduce a precise portable package on a teammate's machine. We need your priority on target users and output format before broader automation.”

Bring actual evidence, a planned selection example clearly labelled unimplemented, and one limitation. Do not present Battery Finance/Qwen as consuming this export.
