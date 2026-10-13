# October 15 recorded demo

A recorded demonstration is sufficient. The export and automated checks are implemented. The missing markdown dependency that caused a blank browser preview is fixed. All required Composer browser checks passed: literal Metric Card, bound revenue update, enabled Button save event and disabled no-event behavior. Disabled Button readability is improved for light and dark themes. The recording itself remains to be captured; repeat the steps below for the clip.

## Reproduce the export

Run in catalogs/material, with the baseline dependencies installed:

    npm.cmd run build-storybook
    npm.cmd run export:a2ui

The existing baseline Storybook build may be reused if story discovery did not change. Descriptions, types, defaults and story args are read directly from current source when exporting. The command produces a2ui-output/ and a2ui-output.zip. For Metric Card alone:

    npm.cmd run export:a2ui -- --metric-only --out a2ui-metric

Choose a new output directory or one containing export-manifest.json. The exporter refuses to overwrite unrelated directories. It archives only manifest-listed files; installed node_modules, build output and caches are excluded. ZIP bytes and generated content are deterministic.

## Use the portable ZIP

Extract a2ui-output.zip into a fresh folder outside this checkout. In that folder:

    npm.cmd ci --no-audit --no-fund
    npm.cmd run test:portable
    npm.cmd run test:schema
    npm.cmd run build
    npm.cmd run test:runtime
    npm.cmd start

Open http://localhost:3456. Select Literal metric, then Bound metric and Update revenue. The formatted value should change from $1,340,000 to $1,750,000. Select Enabled button, click Save changes, and check the visible save action. Select Disabled button: it must be disabled and add no event.

After installing the default export, run the exporter tests in catalogs/material:

    npm.cmd run test:a2ui
    npm.cmd run test:a2ui:composer

The last command reads the sibling pinned Composer source without editing it and exercises its actual catalog schema resolver. Neither test is a substitute for the browser steps below.

## Check Composer and capture the recording

Start the Composer shell from the pinned sibling reference checkout in its own terminal:

    corepack.cmd yarn workspace a2ui-composer-shell exec ng serve --host localhost --port 4200

This is the already verified upstream command; the upstream checkout needs no source or configuration changes. Use the portable renderer on port 3456, rather than starting the upstream Angular sample on that port too.

1. Open http://localhost:4200. In Settings, use Add custom renderer, name it Portable Finance, set Renderer URL to http://localhost:3456, and select it. Verify the received catalog lists FinanceMetricCard and MaterialButton only.
2. Copy the message array from http://localhost:3456/fixtures/metricLiteral.json into Composer's raw layout JSON editor. Verify the actual card, styles and formatted value in the rendered frame.
3. Replace it with /fixtures/metricBound.json. In the Data model JSON editor, change revenue from 1340000 to 1750000 while keeping the bound component. Verify the visible card changes. If editing the model is unavailable, append the updateDataModel command from /fixtures/revenueUpdate.json to the message array and observe the update.
4. Replace the layout with /fixtures/button.json. Click Save changes in the rendered frame and verify the Events panel records save, sourceComponentId root, surfaceId demo, and context.source portable-export.
5. Replace it with /fixtures/buttonDisabled.json. Verify disabled appearance and that a click adds no event.
6. Record source stories, export generation, the folder/ZIP and source files, clean install/build results, and the observed Composer behaviors above. A four-to-five-minute clip is sufficient. No API key, chat prompt or LLM call is involved.

## Scope and remaining verification

Both required components, typed literal/path bindings, event actions, source packaging and standalone renderer are included. Checkbox is deferred until the real Composer browser check passes. There are no custom functions, arbitrary template extraction, React/Shadcn export, custom theme messages, or partial component updates. The vendored bridge license/source and dependency lockfile are included. No publication, deployment or merge is part of this workflow.

Save the known-good archive and its SHA-256 after all checks. Actual validation results and the browser automation limitation are recorded in SETUP_STATUS.md and A2UI_EXPORT_MVP_PLAN.md.
