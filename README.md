# Capstone Catalogs

Shared Storybook component catalogs for our capstone project. The repository includes a universal Storybook-to-A2UI CLI that discovers Angular Material and React/Shadcn stories, lets users choose components and output formats, and produces loose A2UI JSON and/or a self-contained renderer ZIP.

## Get started

Accept the GitHub collaborator invitation before cloning this private repository. Install Git, Node.js, and npm first. The maintainer's working environment is Node.js **24.20.0** and npm **11.19.0**; use those versions to match the current setup. VS Code is optional.

Run these commands in a terminal (PowerShell works on Windows):

```sh
git clone https://github.com/o0avdi/capstone-catalogs.git
cd capstone-catalogs/catalogs/material
npm ci
npm run storybook
```

Open the local URL printed in the terminal, normally http://localhost:6006. Keep that terminal running. Use a second terminal for Git commands, and stop the server with Ctrl+C when finished.

`npm ci` installs the dependency versions recorded in `package-lock.json`. No global Angular CLI installation or separate Angular project creation is needed. Run it again after pulling dependency changes; it replaces the local `node_modules` installation.

## Where to work

Paths below are relative to the repository root:

| Path | Purpose |
| --- | --- |
| `catalogs/material/src/stories/material/` | Add Material story files here |
| `catalogs/material/.storybook/` | Shared Storybook configuration |
| `catalogs/material/src/styles.scss` | Shared Material theme |
| `catalogs/material/package.json` | Dependencies and commands |
| `catalogs/material/package-lock.json` | Reproducible dependency versions; commit intentional changes |

Reference stories: `button.stories.ts` for inputs and visual variants, `card.stories.ts` for composition, `checkbox.stories.ts` for state and events, and `tooltip.stories.ts` for directive behavior.

## Add a component

1. Claim a component in the group chat or a GitHub issue before starting.
2. Start a branch from the latest `main` (commands below).
3. Create one file such as `slider.stories.ts` in the Material stories folder. Use the closest existing story as a starting point.
4. Import the appropriate Angular Material module and include it in `moduleMetadata({ imports: [...] })`.
5. Give the story a unique title such as `Material/Slider`, include `tags: ['autodocs']`, and define useful `args` and `argTypes`.
6. Add a default example and relevant variants: disabled, alternate values, long text, or another meaningful state. Aim for 3–4 useful stories when appropriate.
7. Check Controls, keyboard interaction, and the Accessibility panel. For interactive stories, check that events and displayed state behave as intended.
8. Build Storybook and open a pull request.

We demonstrate Angular Material's installed components. Most contributions only need a story file. Describe whether each argument maps to a real component input, projected text, or story-only behavior. Avoid changing shared configuration or dependencies unless the component requires it; explain such changes in the pull request.

## Branch and submit

Start from a clean working tree. The following commands run from `catalogs/material` after the initial clone:

```sh
git switch main
git pull --ff-only origin main
git switch -c feat/material-slider
```

Replace `slider` with the component you claimed. Create and check your story, then:

```sh
npm run build-storybook
```

After a successful build:

```sh
git status --short
git add src/stories/material/slider.stories.ts
git diff --cached --stat
git commit -m "Add Material Slider stories"
git push -u origin feat/material-slider
```

On GitHub, open a pull request with **base: main** and **compare: your feature branch**. Include:

- The component and stories added.
- A screenshot of the rendered component.
- Whether the Storybook build passed.
- Interaction and keyboard checks performed.
- Any remaining accessibility findings or limitations.

Ask a teammate to review before merging. Use a new branch from updated `main` for your next contribution.

## Useful commands

Run these inside `catalogs/material`:

| Command | Purpose |
| --- | --- |
| `npm ci` | Install locked dependencies |
| `npm run storybook` | Start the component catalog |
| `npm run build-storybook` | Build the static catalog into `storybook-static/` |
| `npm run build` | Build the separate Angular application |

`npm start` starts the Angular application, not Storybook.

## Generated files and troubleshooting

- Keep `node_modules/`, `storybook-static/`, and generated `documentation.json` out of commits. Storybook's configured Compodoc step regenerates `documentation.json`.
- If a new story does not appear, check its `.stories.ts` filename, location, title, and terminal errors.
- If port 6006 is already occupied, stop an old Storybook terminal or run `npm run storybook -- --port 6007`.
- If a checkbox reports a missing accessible label, check whether Controls has overridden its label with an empty string. Reset the story and rerun the check; do not dismiss findings without inspecting them.
- If an install or build fails, share the actual terminal error and your `node --version` and `npm --version` output. Keep the lockfile intact while diagnosing it.

## Universal Storybook-to-A2UI CLI

Run these commands inside `catalogs/material`:

```sh
npm ci
npm run a2ui:discover
npm run a2ui
```

`npm run a2ui` opens an interactive checklist. Use the arrow keys to move, Enter or Space to toggle a component, `A` to select/clear all, and Enter on the final row to continue. A second checklist selects loose JSON, a renderer ZIP, or both.

Discovery statically scans `.stories.ts` and `.stories.tsx` files; a Storybook build is not required. Every candidate reports one of these states:

- `portable`: a reviewed registration and renderer adapter exist.
- `custom`: a library-specific renderer path exists, currently the Shadcn catalog-demo renderer.
- `needs-configuration`: JSON can be generated, but a renderer adapter is still required for ZIP export.

The same workflow supports scripts and CI:

```sh
npm run a2ui -- discover --json
npm run a2ui -- export \
  --components MaterialButton,ShadcnButton \
  --outputs json,zip \
  --out ./a2ui-export
```

Loose output contains `catalog.json`, `messages.json`, `components.json`, and `diagnostics.json`. The ZIP additionally contains selected original stories/direct component sources and independent framework projects under `renderers/angular` and `renderers/react`. It never includes `node_modules` or machine-specific source paths.

See the [detailed exporter instructions](catalogs/material/A2UI_EXPORTER_README.md) for the complete interactive and scripted workflow, output contents, renderer setup, examples, safety behavior, and troubleshooting. The shorter [universal exporter contract](docs/UNIVERSAL_EXPORTER.md) describes the design boundary and validation contract.

## Registered Angular renderer

The existing registered Angular path packages a generated JSON Schema catalog, selected component source and styles, Angular adapters, fixed A2UI v0.9 examples, strict runtime validation, and an independently runnable Angular renderer. It supports **FinanceMetricCard**, **MaterialButton**, and **MaterialCheckbox**. No API key or LLM is needed.

Discovery uses the built Storybook index. A bounded TypeScript extractor reads current source types, required inputs, defaults, descriptions, and declarative CSF metadata. Explicit registrations map inputs, projected content, events, source files, adapters, and fixtures. Unsupported metadata is diagnosed. Generated schema and runtime contracts share that metadata; the reference catalog in `docs/references/` is never used as generated output.

From a fresh clone, run these commands in `catalogs/material` (use `npm` instead of `npm.cmd` outside Windows):

```sh
npm.cmd ci
npm.cmd run build-storybook
npm.cmd run test:a2ui
npm.cmd run export:a2ui -- --out a2ui-three-release
```

This creates `a2ui-three-release/` and `a2ui-three-release.zip`. Choose a new output name when preserving a demo artifact: the default `a2ui-output` may contain the known-good two-component export. Generated outputs remain local and are ignored by Git.

Extract the ZIP into a fresh directory outside the source checkout, then run:

```sh
npm.cmd ci --no-audit --no-fund
npm.cmd run test:portable
npm.cmd run test:schema
npm.cmd run build
npm.cmd run test:runtime
npm.cmd exec -- ng serve --host localhost --port 3458
```

The renderer pins Angular 21/Material 21 for A2UI peer compatibility, while the source Storybook retains Angular 22 and its existing framework. Both dependency lockfiles and the vendored Composer bridge source, distribution, and licenses are committed. The export needs no sibling checkout or source repository at runtime.

### Use with Composer

Use the official `a2ui-project/composer` checkout pinned to `8155592d3522fff213188e8382153e473e2c3315`; follow its setup instructions. From that checkout, start its shell with:

```sh
corepack.cmd yarn workspace a2ui-composer-shell exec ng serve --host localhost --port 4200
```

Open `http://localhost:4200`, add/select the custom renderer `http://localhost:3458` in Settings, and paste a generated message array into the raw layout editor. The renderer serves its catalog at `/catalog.json` and examples at `/fixtures/metricLiteral.json`, `/fixtures/metricBound.json`, `/fixtures/button.json`, `/fixtures/buttonDisabled.json`, `/fixtures/checkboxBound.json`, and `/fixtures/checkboxDisabled.json`. These files also live in the exported `fixtures/` directory; aggregate messages are in `fixtures.json`, and story-derived usages are in `public/usages.json`.

With the bound examples, edit `revenue` or `includeArchived` in Composer's Data Model. Observe button and checkbox actions in Events. Checkbox actions carry a boolean `context.checked`; the host owns the model and must apply the proposed value with `updateDataModel`. Clicking alone preserves the authoritative model/display value. Disabled controls emit no event.

The pinned Composer resolver can additionally be checked from `catalogs/material` when Composer is a sibling of this repository:

```sh
npm.cmd run test:a2ui:composer -- ../../../composer a2ui-three-release
```

Validated capabilities include 11 extraction/schema/workflow tests, Composer schema resolution, fresh ZIP installation and production build, portability auditing, positive/negative Draft 2020-12 validation, production DOM and parent-frame protocol tests, and actual Composer browser rendering of all three components. The user personally verified the final renderer on port 3458. Tests use fixed messages. Arbitrary templates/callbacks, custom functions, general layout properties, and automatic host model writes are outside the supported contract.

See [demo instructions](docs/DEMO_RECORDING.md), [validation history](docs/SETUP_STATUS.md), and the [registration guide](docs/EXPORT_ANOTHER_COMPONENT.md). Browser screenshots and local extraction-location records are intentionally kept local; no recording is claimed.
