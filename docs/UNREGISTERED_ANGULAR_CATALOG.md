# Angular source contracts without renderer registrations

The v1.0 CLI can export a bounded local Angular component directly from its source.
`catalog.json` is the product. The existing sidecar JSON files contain validation,
diagnostics and provenance only. The developer implements the renderer and agent.
V0.9 remains the compatibility default and retains the existing portable exporter.

Supply an official Storybook v5 index and select a canonical CSF identity:

```powershell
npm.cmd run a2ui -- export --protocol 1.0 --angular-index angular-index.json --components angular:src/stories/example.stories.ts --outputs json --out ./fresh-export
```

The index determines inclusion, IDs, titles, export names, display names and variants.
The TypeScript checker resolves the default CSF object's `component` to a named
local `@Component` class, including renamed imports. Source class name becomes the
catalog component name; source path plus class name is recorded separately from
the CSF candidate ID. Shared class names across selected CSF identities fail rather
than overwrite or merge contracts. `componentPath` is provenance, not an assumed
class identity. No story module is imported or executed by extraction.

The implementation reuses `metadata.mjs` program, literal, object-property and type
helpers, then passes normalized fields to the existing `makeCatalogV1` and official
pinned validators. It does not implement another parser or schema generator.

| Metadata | Automatic behavior |
| --- | --- |
| Inputs | Public instance property declarations with Angular `@Input()` or `@Input({required: true/false})`; renamed/namespace Angular imports are recognized. |
| Primitive types | `string`, `number`, `boolean`; inferred property types work. |
| Unions/enums | `number \| string`, homogeneous string literal unions, string enums, singleton string literals. String enums remain literal-only under the existing generator. |
| Optionality | `undefined` is excluded from JSON value types. Only Angular `required: true` requires presence; a TS definite-assignment marker or JSDoc `@required` does not. |
| Defaults | Static source primitive initializers, negative numeric literals, and resolved constant enum members. Defaults do not remove requiredness. No default is inferred from args or controls. |
| Descriptions | Input and class JSDoc from the checker. Story controls/descriptions do not override the source contract. |
| Provenance | Complete indexed entries and index hash/version, source class/path and original candidate ID. Excluded exports are not treated as stories. |
| Templates | Static inline templates and project-local template files are inspected for projected content and event bindings; this is not renderer analysis. |

The exporter fails with explicit review diagnostics for outputs, callback inputs,
projected content, template event handlers, signal input/output/model declarations,
input aliases/transforms/accessors, inheritance, constructor initialization,
component-level input/output/host/host-directive declarations, custom story render
functions or decorators, and story args not present in the source input surface.
It also rejects missing identity/export names, external or unresolved classes,
computed metadata/spreads, syntax errors, arrays, arbitrary objects, `any`, unknown
types, nullable types, numeric/mixed enums and unsupported union shapes. A rejected
selection writes diagnostics and no partial catalog.

This bounded path does not evaluate expressions, follow constructor/method behavior,
interpret child-component state, collect dependency closures, or prove rendering.
No actions or content properties are synthesized. Review must establish actual
event/payload/content semantics before adding a mapping. Existing reviewed
registrations remain available for known source/event contracts without requiring
their adapter/fixture/ZIP files when exporting v1.0 JSON. There is no new arbitrary
schema-override escape hatch: unsupported shapes require reviewed extraction and
lossless conversion support, with tests.

`discover --protocol 1.0` now preflights each candidate through extraction,
generation and validation. `--all-ready` selects the successfully validated catalog
contracts, including unregistered ones, and prints every unsupported candidate's
reason. Those reasons also appear in export diagnostics. Readiness is recalculated
from source during export; it never enables a renderer ZIP. Explicit selections
continue to fail as a whole if any selected component is unsupported.

For a complete executable example and exact fixture index/export/test commands,
see [the milestone result](../research-output/UNREGISTERED_ANGULAR_EXPORT_RESULT.md).
