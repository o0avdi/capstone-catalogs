# Capstone Catalogs

Shared Storybook component catalogs for our capstone project. The current catalog demonstrates Angular Material components and their states. We are also investigating how story metadata can support a future A2UI export workflow; this repository does not yet provide that exporter.

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

## Export investigation

The observed `storybook-static/index.json` contains story discovery information such as IDs, titles, names, and source references. It does not contain our complete args, component contracts, or Angular template mappings. The current Compodoc component list documents local components, including Storybook starter examples. A future A2UI exporter needs an explicit strategy to combine metadata and map rendering, content, and events.
