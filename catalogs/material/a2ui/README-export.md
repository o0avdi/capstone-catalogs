# Portable Angular Storybook export

Requires Node 22.12+ or 24 and npm. From this extracted folder:

    npm.cmd ci --no-audit --no-fund
    npm.cmd run test:schema
    npm.cmd run build
    npm.cmd start

Open http://localhost:3456. Select Bound metric, then Update revenue: $1,340,000 becomes $1,750,000. Enabled button dispatches a save action; disabled button does not.

In the pinned A2UI Composer shell, choose custom renderer http://localhost:3456. Paste the message array from fixtures.json for metricLiteral, then metricBound. Send a DATA_MODEL_CHANGE or edit /revenue in the data model. Paste button, click Save changes, and inspect the event log. Paste buttonDisabled and verify no event. No API key is needed.

catalog.json and metadata.json are generated from selected CSF metadata and TypeScript source inputs. Source styles and formatting helpers are included. src/adapters.ts maps all exported properties through reactive A2UI BoundProperty signals. Button label is projected text, appearance binds matButton, and click dispatches an event action after checking disabled.

Only path bindings and event actions with scalar literal context are advertised. No custom functions, generic template interpretation, React stories, or layout/common properties beyond id are exported. Empty function support is represented by a false schema. Story args are examples; optional component initializers provide documented API defaults. The explicit registration allowlist controls source packaging.

The upstream Composer bridge is vendored under vendor/a2ui-bridge with Apache-2.0 license, source, built JavaScript and original package metadata. See provenance.json. Angular 21 is used only for this renderer to satisfy pinned A2UI peers; original Storybook stays on Angular 22. Source code and public exports travel with this folder. No sibling checkout is required.

The included checks run without Composer or an API key:

    npm.cmd run test:portable
    npm.cmd run test:schema
    npm.cmd run test:runtime

Run build before test:runtime. Runtime tests execute the production AOT bundle in jsdom with standalone and emulated parent-frame transports. They verify reactive values, action dispatch, disabled behavior, catalog/usages exchange, origin checks, and invalid messages. They do not verify actual browser layout or the real Composer shell.

Individual fixed message arrays are also served at /fixtures/metricLiteral.json, /fixtures/metricBound.json, /fixtures/button.json, /fixtures/buttonDisabled.json and /fixtures/revenueUpdate.json. Custom theme messages and partial component property updates are outside this bounded MVP; send full component instances. Optional source defaults apply when a property is omitted. A referenced binding must resolve to its declared source type when the message batch completes.
