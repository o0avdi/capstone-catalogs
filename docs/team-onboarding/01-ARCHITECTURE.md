# Architecture: follow a component from story to running UI

Source basis: `feat/storybook-a2ui-exporter`, commit `793eef108d5646e649cb54b911521a5415f9c8d1`; inspected October 15, 2026. Paths are repository-relative unless stated otherwise. [Audit results](README.md#verified-basis-of-these-plans) distinguish new checks from historical evidence.

## Vocabulary and product goal

**Angular** implements the UI; **Angular Material** supplies controls such as Button and Checkbox. **Storybook** displays example states called **stories**: eight Metric Card variants describe one registration. **CSF** is the story-file format with `meta`, `args`, `argTypes` and exported variants. Args are example values; Controls are editor hints, not authoritative API types.

**A2UI** carries structured messages describing surfaces, components, bindings and actions. A **catalog** names components and specifies properties using JSON Schema. A **contract** is a runtime validation rule; we also generate Zod contracts for Angular. An **adapter** connects props/actions to real Angular markup/code. A **renderer** validates messages and creates UI. **Composer** is a separate host that embeds the renderer, supplies messages/data and receives actions. Catalog JSON alone cannot render a component.

Our vision is: inspect a Storybook, understand readiness, select supported components and obtain a consistent runnable package. The MVP proves the registered export path. Assigned tasks improve discovery, selection and reproducibility without claiming arbitrary conversion.

## Actual call and file flow

Paths in this table are relative to `catalogs/material/`.

| Stage | Actual file / function | Input and output / constraint |
| --- | --- | --- |
| Story build | `package.json`, `angular.json`, `.storybook/main.ts` | `build-storybook` uses `@storybook/angular:build-storybook`, Compodoc and Angular target; writes ignored `storybook-static/index.json` |
| Entry point | `scripts/a2ui/export.mjs` top-level `options`, `get`, `selected` | Reads registrations and fixed index; all registrations or `registrations.slice(0,1)` for `--metric-only` |
| Existing discovery | `scripts/a2ui/metadata.mjs::discover(index, registrations)` | Per registration, matches local `type: story` entries to `r.story`, excludes `refId`, sorts/deduplicates IDs; throws on no match |
| Extraction | `metadata.mjs::extract(root, registrations, index)` | Checks adapter exports/mappings/paths/allowlists, calls discover, uses TypeScript program/checker and bounded AST reading; returns metadata |
| Literal/type reading | `metadata.mjs::literal()`, private `typeSchema()` | Declarative values and supported scalar source types/unions/enums; unsupported expressions/types fail visibly |
| Catalog | `metadata.mjs::makeCatalog(metadata)` | Generates schema and `$defs.anyComponent` refs; empty metadata fails; no custom functions |
| Runtime composition | `scripts/a2ui/component-files.mjs::contracts()`, `registrationSource()` | Generates raw/bound and resolved Zod schemas, adapter imports and `ExportCatalog extends AngularCatalog` |
| Examples | `component-files.mjs::componentFixtures()` | Reads fixture configs; merges source examples/overrides; builds message arrays, menu, usages; checks collisions/types/actions |
| Package | `export.mjs::write/json/copyTree`, `scripts/a2ui/zip.mjs::archive()` | Copies shared renderer/vendor and selected source/assets/adapters/provenance; manifest and sorted ZIP with fixed metadata |
| Startup | `a2ui/renderer/src/main.ts::App`, `bootstrapApplication()` | Imports generated catalog/fixtures/demo/usages/registry, provides bridge and validating service; menu loops over demo |
| Guard | `a2ui/renderer/src/validating-renderer.ts::ValidatingRenderer.processMessages()` | Stages full batch, checks envelopes/catalog/props/resolved bindings, then calls superclass |
| UI/events | `a2ui/components/*/adapter.ts` | Reactive `CatalogComponent` props via `.value()`; surface/DataContext dispatch preserves component identity |

```text
Storybook source/config --> generated index (story identities)
registrations + live TS/CSF --> extract --> metadata --> catalog + Zod contracts
                                         |
authored adapters + fixture configs -----+--> registry/menu/usages
                                         |
                     source/styles + renderer/vendor/lockfile
                                         |
                           folder + deterministic source ZIP
                                         |
                             extract, npm ci, build
                                         |
Composer host <---- bridge messages ----> Angular renderer --> UI
```

Reuse an index for source type/description edits because extraction reads files live; rebuild after adding/renaming/removing stories. Optional index `componentPath` is a hint: current Button/Checkbox entries lack it and use template adapters.

## Concrete path: Metric Card value and binding

`src/stories/finance/metric-card.stories.ts` points at `src/app/finance/components/metric-card.component.ts`. Registration includes that file, `finance.types.ts` and `shared/format-value.ts`. Extraction recognizes decorated `@Input` members, required label/value, defaults and enum aliases. Numeric Controls do not narrow `value: number | string`. Story args are not API defaults.

`a2ui/components/metric-card/adapter.ts::MetricCardAdapter` imports copied source and generated `MetricCardAdapterApi`, binds via `.value()`, and gets fallback defaults from `new MetricCardComponent()`. Inline styles travel in copied TS. Material implementation comes from dependencies.

An instance can contain `"value":{"path":"/revenue"}`. The `metricBound` fixture creates a surface, sets revenue to 1340000, and supplies a full component. `revenueUpdate` changes it to 1750000 without resending the component. The validating renderer checks the resolved scalar before committing; boolean revenue fails and preserves prior state. A binding object accepts only a nonempty string path.

## Concrete path: Button action and Checkbox ownership

`src/stories/material/button.stories.ts` defines `ButtonArgs`, projected label and a matButton template. Extraction reads the type alias; it does not convert the render function. Registration maps click to required action. `ButtonAdapter.click()` checks disabled, resolves through `DataContext`, and calls `surface.dispatchAction(action, componentId)`. Explicit `adapter.scss` packaging preserves disabled contrast.

`CheckboxArgs` declares `onCheckedChange: (checked: boolean) => void`. Registration maps it to change/action, `$event.checked` and host-owned updates. Extraction validates the signature and specifically imported `storybook/test` `fn()` spy, records provenance and omits it from data props. It executes neither the spy nor Storybook's useArgs/updateArgs render logic.

`CheckboxAdapter.change(event)` emits configured checkedChange with boolean context.checked, and restores the control to its current authoritative prop. The host receives the proposal and must send updateDataModel for /includeArchived (or full component replacement for a literal). Disabled controls emit nothing. Clicking alone does not mutate the host model.

The bridge transports RENDERER_READY, GET_CATALOG/A2UI_CATALOG, usages, RENDER_A2UI, DATA_MODEL_CHANGE and SEND_TO_SERVER. See `scripts/a2ui/portable/runtime-test.mjs` for envelopes/origin checks. Standalone `App.load(name)` posts a local RENDER_A2UI message; the app logs surface actions.

## Package surfaces and authority

Output contains root `catalog.json`, `metadata.json`, `diagnostics.json`, `fixtures.json`, `provenance.json`, `export-manifest.json`, package manifests/lockfile and renderer source. Also: public catalog/fixtures/demo/usages JSON, per-fixture files in `fixtures/` and `public/fixtures/`, generated `src/contracts.ts`, `src/adapters.ts`, `src/public-api.ts`, selected adapters/source, `provenance/`, licenses and `vendor/a2ui-bridge`.

The ZIP has no installed dependency tree or prebuilt renderer app. The bridge includes its intentional upstream distribution/source/license and needs no sibling at runtime.

Automated: bounded extraction, catalog/contracts, registry, fixtures, selected-file packaging and ZIP. Authored: registrations, adapters, projected content/events, fixture configs, source/dependency allowlists and host policy. `docs/references/composer-catalog.json` is immutable reference material, never generated output.

## Constraints for the next work

- Source Storybook uses Angular 22, TypeScript 6 and existing @storybook/angular setup/lockfile. Renderer pins Angular 21.2.17, Material/CDK 21.2.14, TypeScript 5.9.3, @a2ui/angular 0.10.4 and @a2ui/web_core 0.10.5 while using **v0.9** protocol/imports. Package version differs from protocol version; preserve both dependency trees.
- @a2ui/markdown-it 0.1.0 is needed for real dev-server startup; HTML 200 previously concealed failing JS. Bridge dependency is `file:vendor/a2ui-bridge`.
- Supported fields: scalar strings/numbers/booleans and bounded unions/enums/optionals, literals or path bindings. Actions: named events with scalar literal context. Arbitrary object/array inputs, callbacks/functions/templates, partial component updates, custom themes and common layout/accessibility/check fields beyond id are outside scope.
- .storybook/main.ts composes remote React/Shadcn at 6007; it is excluded from Angular export. Battery Finance/Qwen follows a separate route.
- Current discover cannot inventory unregistered candidates. Generic subset CLI is absent. Permissive option scanning can ignore unknown flags; proposed commands must never be presented as working today.
- Output guard rejects project/parents and existing folders without manifests. It does not clean previous exports, protect an existing sibling ZIP or provide transactionality. Use fresh paths.
- Portable validate/runtime scripts and Composer resolver test assume Metric/all-component cases. Runtime menu already has data-fixture attributes; tests use positions. Metadata tests pin historical shared-source hashes. See [selection plan](tasks/COMPONENT-SELECTION-AND-SUBSET-EXPORT.md) before edits.

## Explain it yourself

Answer with source references: Why are eight stories one registration? Why can't schema draw a button? Where do types/defaults originate? Why does Checkbox wait for the host? What proves portability beyond ZIP creation? Which mappings were authored?

Further reading: [component workflow](../EXPORT_ANOTHER_COMPONENT.md), [export README](../../catalogs/material/a2ui/README-export.md), [historical validation](../SETUP_STATUS.md). Scaffolding another component is future work outside the three assignments.
