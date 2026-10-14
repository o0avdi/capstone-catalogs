# Portable Angular Storybook export

The bundle contains FinanceMetricCard, MaterialButton and MaterialCheckbox, actual selected source/styles/helpers, generated contracts, authored adapters, theme, fixtures/usages, strict runtime validation, a vendored Composer bridge and its license, and a tested dependency lockfile.

From this extracted folder (Node 22.12+ or 24):

    npm.cmd ci --no-audit --no-fund
    npm.cmd run test:portable
    npm.cmd run test:schema
    npm.cmd run build
    npm.cmd run test:runtime
    npm.cmd start

Open http://localhost:3456. Use the generated fixture menu to show literal/bound metrics, update revenue, enabled/disabled buttons, and literal/bound/disabled checkboxes. Checkbox clicks emit checkedChange with context.checked as the new boolean. The host owns data: the checkbox stays on the current value until the host applies the change. Use Host sets checked and Host clears checked to simulate deterministic host updates.

In Composer select this renderer's URL and paste the arrays served at /fixtures/metricLiteral.json, /fixtures/metricBound.json, /fixtures/button.json, /fixtures/buttonDisabled.json, /fixtures/checkboxBound.json and /fixtures/checkboxDisabled.json. Edit /revenue or /includeArchived in Data Model while keeping the components bound. Observe actions in Events. No API key or LLM is needed.

The catalog/schema and examples are generated from live TypeScript source and supported CSF literals. Controls do not narrow source types. Story args are examples, not API defaults. The registration-and-adapter workflow is documented in ADDING_COMPONENTS.md; component-specific adapters and fixture configurations are retained in provenance.

Only typed literal/path bindings and named event actions with scalar context are supported. There are no custom functions, common layout/accessibility/check properties beyond id, custom theme messages, partial component updates, or arbitrary template/callback execution. Registered Storybook fn() callback spies are diagnosed/mapped as metadata and never executed or serialized as inputs. Runtime tests load the actual production ES module graph in jsdom; actual Composer browser results are recorded in the source repository docs/SETUP_STATUS.md; browser screenshots are retained locally.

Angular 21.2.17/Material 21.2.14 satisfy pinned A2UI peers; original Storybook remains on Angular 22 with its original lockfile. @a2ui/markdown-it 0.1.0 is included for real dev-server startup. The private upstream bridge is vendored under vendor/a2ui-bridge; no sibling or original-checkout dependencies are required. See provenance.json and licenses/.
