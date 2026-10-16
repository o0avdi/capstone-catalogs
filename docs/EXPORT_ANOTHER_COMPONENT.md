# How to export another supported component

This MVP supports FinanceMetricCard, MaterialButton and MaterialCheckbox. It deliberately uses a registration list and small Angular adapters, not a plugin framework. Adding another component with supported primitive inputs should not require changes to scripts/a2ui/export.mjs, metadata.mjs, component-files.mjs or the shared renderer.

## Files to add

Create a directory under catalogs/material/a2ui/components/<component>/ containing adapter.ts and fixtures.json, plus local styles/assets when needed. Add one entry to a2ui/registrations.json. Checkbox is the worked example; see its three files and registration entry.

The registration specifies:

- name: stable A2UI component identity. Do not reuse another name.
- story: local CSF file discovered by the built Storybook v5 index.
- source/className for an Angular component, or typeName for the template story's argument type. Types and requiredness come from this source, not from controls or args.
- adapter: exported Angular class name; adapterFile: authored adapter path; adapterOutput: portable path under src/adapters/. The adapter imports its generated <adapter>Api from ../contracts.
- bindings: every supported scalar input name. The current bounded workflow supports string, number, boolean, source unions/enums and optional fields. Each declared field must have a mapping. Unmapped fields and unsupported types fail extraction.
- content: explicit projected-text mapping where applicable.
- events: DOM/framework event to A2UI action-property mapping. Action properties are required and accept named event actions with scalar literal context. Custom functions are not supported.
- callbacks, when the story declares callback arguments: exact signature, event/property, payload mapping, permitted example expression and data ownership. A registered callback is recorded as provenance rather than serialized as a data input.
- files: allowlisted local component files, templates, styles and helpers copied verbatim. Local TypeScript imports must be present. Third-party dependencies belong in the portable renderer package.json and its tested lockfile.
- assets: explicit {source, output} entries for adapter styles/assets. Button demonstrates a packaged SCSS file preserving its disabled theme correction.
- publicExports: selected packaged source files to expose, or an empty list for a template-only wrapper.
- fixturesFile: declarative usage and demo fixture configuration.

## Write the adapter

Extend CatalogComponent<typeof YourAdapterApi>. Use props().field.value() (and optional access/defaults as needed) so data bindings stay reactive. Required source inputs must be supplied. Do not hand-maintain a parallel schema. The exporter generates bound and resolved Zod schemas and Draft 2020-12 catalog fields from the same extracted metadata.

For a component with source defaults, obtain fallback values from that source. Metric Card creates its source component's default values rather than duplicating them in the exporter. Preserve source styles and helpers through files. For a template story, explicitly wrap the equivalent Angular Material template and projected content; arbitrary story render functions are not interpreted or executed by Node.

Dispatch actions through the actual surface's dispatchAction with componentId. Respect disabled before dispatch. Event payloads must match the documented callback mapping. The shared ValidatingRenderer stages full messages and checks both raw props and resolved bound values before changing renderer state.

## Callback mapping: Checkbox

The existing CheckboxArgs declares onCheckedChange: (checked: boolean) => void and supplies the Storybook fn() spy. Registration maps that exact callback to the Material change event, A2UI action property, and context.checked = $event.checked. The extractor verifies the source callback signature and the named fn import from storybook/test. It accepts only the explicitly registered fn() example expression; it never calls the spy, useArgs, render or any other story function. Unknown callbacks, signature changes, arrow functions and other expressions produce errors. The spy is omitted from exported data props and retained in metadata callbacks/provenance.

CheckboxAdapter calls MatCheckbox's change handler, emits {event: {name: <configured name>, context: {...configuredContext, checked: <new boolean>}}}, and uses the standard A2UI v0.9 surface/action envelope. The new boolean overrides any same-name context literal. It prevents dispatch when disabled.

The host owns the data model. A click emits a proposal and restores the control to its authoritative current value; it does not call onUpdate or set dataModel. The host must apply updateDataModel for a bound checked property (or send a full component update for a literal). Storybook's local updateArgs behavior is intentionally replaced by this explicit host policy. External changes to /includeArchived immediately update the displayed control. Fixtures include host-set-true and host-set-false messages.

## Write fixtures

fixtures.json has {usage: <fixture name>, fixtures: [...]}. A component fixture names a source example (exported story name), an optional props override, optional data, and a demo label. The base args are extracted from the story, not copied into the shared exporter. Event actions belong in the fixture override. A messages entry contains a fixed incremental message array, such as a host data update.

The exporter rejects duplicate fixture names, missing source examples, undeclared props, invalid literal types/enums and invalid event action contexts. It generates per-fixture message files, a demo menu and Composer component usages. The shared app loops over that menu; it has no component names, imports or component-specific messages.

## Export and verify

From catalogs/material:

    npm.cmd run export:a2ui -- --out a2ui-three-output
    npm.cmd run test:a2ui
    npm.cmd run test:a2ui:composer -- ../../../composer a2ui-three-output

Without arguments, export:a2ui and test:a2ui:composer both use a2ui-output. The named output above preserves the existing two-component output; pass the same output directory as the Composer test's second positional argument (after its Composer checkout argument). Do not run a default export over the preserved two-component output.

Use the existing built Storybook index when discovery is unchanged. Rebuild with npm.cmd run build-storybook after adding/renaming stories. Descriptions, source types/defaults and args are always read live at export time.

Extract the ZIP to a fresh external directory, then run:

    npm.cmd ci --no-audit --no-fund
    npm.cmd run test:portable
    npm.cmd run test:schema
    npm.cmd run build
    npm.cmd run test:runtime
    npm.cmd start

Use only that extraction's dependencies and lockfile. Verify /main.js as well as the HTML/catalog endpoints; the markdown dependency is required for dev-server startup even though its upstream peer is optional. Run actual Composer checks using fixed messages, external model edits and Events. Compilation/jsdom alone are insufficient.

## Proof and limits

The Checkbox addition changes registration, adapter and fixtures, plus acceptance tests/documentation. docs/evidence/registration-workflow-proof.json records hashes of the shared exporter/metadata/contract generator/ZIP/shared renderer before and after that addition; the regression test verifies equality and compares generating two vs three components from the same code.

Supported patterns are bounded, declarative CSF metadata and explicit Angular adapters. Functions, arbitrary object/array inputs, arbitrary template/callback execution, partial component updates, custom theme messages and React exports are outside this workflow. Extending those capabilities requires a separate deliberate extractor/schema/runtime change and its own validation. This task stops at the three implemented components.
