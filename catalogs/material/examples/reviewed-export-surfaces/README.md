# Explicit reviewed A2UI surfaces

The strict default exports the complete metadata contract and rejects missing
inherited properties. `--reviewed-surfaces <file>` optionally defines a different,
deliberately limited A2UI contract. It does not change the component implementation
or turn a presentation story into a source API. This example uses the pilot's
existing direct `meta.component: Separator` stories and unchanged library source.

`separator.surface.json` exposes only `orientation` and explicitly reviews all 82
other optional source properties. Its schema is never configured by hand:
Storybook docgen supplies the enum, optional requiredness and `horizontal` default;
TypeScript checks the enum/requiredness and the local destructured literal default.
The existing `makeCatalogV1` produces the catalog and official validators check it.

## Why the specification permits this

The pinned official A2UI specification commit is
[`059b8d34874f96c0395dbfe23e6cc8b41cdb0f87`](https://github.com/a2ui-project/a2ui/blob/059b8d34874f96c0395dbfe23e6cc8b41cdb0f87/specification/v1_0/json/catalog_definition.json).
The local normative copy is
[`catalog_definition.json`](../../scripts/a2ui/specification/v1_0/catalog_definition.json),
with provenance in the adjacent `PROVENANCE.md`.
`properties.components` defines components supported by the catalog, and
`$defs.ComponentDefinition` accepts a Draft 2020-12 JSON Schema plus composition
constraints. It neither references a framework source API nor mandates that every
library prop be exposed. Thus a scoped schema is permitted. This is an inference
from the normative schema, **not an official endorsement of this configuration
format or a guarantee that any arbitrary subset is semantically safe**.

## Contract and renderer obligations

| Capability | Reviewed A2UI contract |
| --- | --- |
| `orientation` | Optional string enum `horizontal` / `vertical`; source default `horizontal`. Literal values only with the existing enum generator; no `@path` binding. |
| Source styling | Original classes, including the vertical sizing rules. No A2UI class/style overrides. Parent layout must provide useful dimensions for a vertical divider. |
| Primitive element | Original `hr` default and built-in `div` switch for vertical. No custom `elementType` or `render`. |
| Events, refs, React key | Not exposed. No fabricated A2UI actions; renderer owns identity and DOM references. |
| Slots, collection/menu behavior | Not exposed. Render standalone, outside provider-injected SeparatorContext or collection behavior. No omitted-prop injection through context. |
| DOM/ARIA overrides | Not exposed. Primitive supplies separator semantics. Protocol identity is not a DOM `id` override. |

The developer supplies the renderer. It must validate messages against this
catalog, forward only exposed props to the actual Separator, preserve source
defaults, and enforce the standalone context restriction. An omitted default is
not inserted by JSON Schema validation; omission works because the source sets
the default. This export ships **no renderer**, and claims no v1.0 runnable ZIP.

## Review format and limits

The version-1 JSON map is keyed by exact discovery ID. Each entry contains only
`source`, `exportName`, `expose`, `omit`, and `review`. `expose` is a nonempty list
of names. `omit` maps every other compiler-resolved prop to a nonempty review
reason. `review` has `rationale`, `usage: "standalone"`, `dependencies: []`, and
`evidenceSha256`. There are no wildcard ignores, schema overrides, callback/action
declarations, rename rules, default overrides, or auto-loaded config files.

`dependencies: []` is an explicit reviewer assertion about the exposed surface's
behavioral independence; nonempty dependencies and non-standalone modes are
unsupported and rejected. It does **not** assert that the source imports no npm
packages. Review runtime semantics and test the real source before authoring it.
The actual Separator was reviewed against installed React Aria Separator and
useSeparator behavior and tested in all three standalone cases.

The fingerprint pins source and direct-story bytes, prop-declaration source
files, package-lock bytes, the full source prop name/type/requiredness/docgen
presence inventory, and the full component docgen object. It detects stale
evidence; it is not a signature, reviewer authentication or a proof of runtime
independence. It does not hash every installed dependency implementation. Use the
unchanged lockfile/install and repeat semantic/runtime review after dependency
changes. Even line-ending changes to pinned evidence require review again.

The audit retains all 83 source names and records 75 docgen omissions. Only names
explicitly listed as optional omissions can pass without their docgen schemas.
Missing exposed metadata, required omissions, invented props, type/requiredness/
default conflicts, stale fingerprints, unpaired indexes/manifests, unavailable
source identity, unresolved source dependencies, union/open props and unsupported
exposed behavior still fail. Ordinary project-local TypeScript function
components with a single signature and source-verifiable scalar metadata are the
bounded implementation; JavaScript, wrappers and inherited/computed defaults
need further support. Existing JS full-contract support is unchanged.

The inventory helper prints evidence only; it never writes or approves review
reasons. Review source and each name before copying a new fingerprint into the
configuration. Export re-reads evidence, independently of discovery readiness.

## Exact reproduction

Run from `catalogs/material`, with dependencies already installed from the
unchanged lockfile. Output directories must be absent or empty. Captured official
index/manifest evidence and unchanged direct stories are in the neighboring
`real-catalog-pilot` example; its README gives the full official rebuild process.

```powershell
node examples/reviewed-export-surfaces/inspect.mjs ../../research-output/reviewed-surface-current-inventory.json
node --test --test-isolation=none scripts/a2ui/reviewed-surface.test.mjs
npm.cmd run test:a2ui

npm.cmd run a2ui -- export --catalog-only --react-index examples/real-catalog-pilot/evidence/index.json --react-manifest examples/real-catalog-pilot/evidence/components.json --reviewed-surfaces examples/reviewed-export-surfaces/separator.surface.json --components react:examples/real-catalog-pilot/Separator.stories.tsx --catalog-id https://capstone.example/catalogs/reviewed-separator/1.0.0 --title "Reviewed Separator" --out ../../research-output/reviewed-surface-rerun
node examples/reviewed-export-surfaces/verify.mjs ../../research-output/reviewed-surface-rerun/catalog.json

npm.cmd run a2ui -- discover --catalog-only --react-index examples/real-catalog-pilot/evidence/index.json --react-manifest examples/real-catalog-pilot/evidence/components.json --reviewed-surfaces examples/reviewed-export-surfaces/separator.surface.json --json
```

Add `--diagnostics` to retain `components.json` (including complete omission
review and source inventory), provenance and official validation sidecars. The
single catalog still states its limited scope without those sidecars.

Negative reproductions (expected nonzero exits; diagnostics only, no catalog):

```powershell
# Same actual direct component without the explicit opt-in: strictness preserved.
npm.cmd run a2ui -- export --catalog-only --react-index examples/real-catalog-pilot/evidence/index.json --react-manifest examples/real-catalog-pilot/evidence/components.json --components react:examples/real-catalog-pilot/Separator.stories.tsx --diagnostics --out ../../research-output/reviewed-surface-strict-rejected

# A reviewed direct component cannot promote its normal ComponentDemo story.
npm.cmd run a2ui -- export --catalog-only --react-index examples/real-catalog-pilot/evidence/index.json --react-manifest examples/real-catalog-pilot/evidence/components.json --reviewed-surfaces examples/reviewed-export-surfaces/separator.surface.json --components react:src/stories/Shadcn/separator.stories.tsx --diagnostics --out ../../research-output/reviewed-surface-wrapper-rejected
```

The focused suite additionally mutates review/metadata in temporary files to
demonstrate missing review reasons, stale evidence, required omissions,
unsupported dependencies, false enums/defaults/requiredness, fabricated actions,
identity/pairing mismatches and no partial product on failure. It transpiles the
unchanged Separator source only for its runtime test; discovery/export never
execute stories or library components.
