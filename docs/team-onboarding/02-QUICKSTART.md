# Quickstart: inspect first, then reproduce safely

Target: `feat/storybook-a2ui-exporter`, audited at `793eef108d5646e649cb54b911521a5415f9c8d1`. Commands/scripts were checked against source October 15, 2026. Only test:a2ui ran here (11/11 PASS on prepared dependencies/index). Other commands below are reproduction instructions; see [evidence](README.md#verified-basis-of-these-plans).

## Choose your path

**Read-only:** inspect files below without installation, build, Composer or API key. **Source tests/export:** require installed catalogs/material dependencies and generated index. **Independent renderer:** needs fresh ZIP extraction and its own install/build. A 15-minute inspection is realistic; install/build timing depends on cache/network and is not guaranteed to fit that window.

## Get an isolated checkout

From a parent working directory, choose an unused directory. Accept the collaborator invitation if GitHub requires access.

```powershell
git clone --branch feat/storybook-a2ui-exporter --single-branch https://github.com/o0avdi/capstone-catalogs.git capstone-catalogs-onboarding
if ($LASTEXITCODE -ne 0) { throw 'Clone failed; stop here' }
Set-Location .\capstone-catalogs-onboarding
git rev-parse --show-toplevel
git branch --show-current
git rev-parse HEAD
git remote -v
git status --short
```

Record actual SHA; the branch may advance. Do not reset to force a match. If using an existing dirty checkout, preserve changes before switching. Before coding, create your own branch from the team-approved base, e.g. `git switch -c feat/a2ui-component-inventory`. Do not switch Omar's prepared checkout. These onboarding docs are currently an uncommitted handoff; if absent remotely, obtain Omar's docs package in your clone rather than assuming clone includes them.

On macOS/Linux use `npm` instead of `npm.cmd`, `cd catalogs/material` and native equivalents for PowerShell file commands. Keep package scripts/cwd unchanged. No global Angular CLI or package-manager policy change is needed.

## First 15 minutes: read-only map

From repository root, open:

1. `catalogs/material/a2ui/registrations.json`: find name, story, adapterFile, fixturesFile and files.
2. `catalogs/material/src/stories/finance/metric-card.stories.ts` and its component: compare inputs with example args.
3. `catalogs/material/a2ui/components/metric-card/adapter.ts` and fixtures.json: find the source import and /revenue binding.
4. `catalogs/material/scripts/a2ui/export.mjs`: trace selected -> extract -> makeCatalog -> componentFixtures -> archive.
5. `catalogs/material/a2ui/renderer/src/main.ts`: identify generated menu and bridge.

Explain story vs component, catalog vs renderer, adapter vs contract and why the exported app runs without Storybook. Then open your [task](README.md); its first checkpoint may need no build.

## Install and generate the index

Run only in your clone. npm ci replaces that clone's node_modules. First install needs registry access or a populated cache; Omar's offline success does not prove a fresh machine can install offline.

```powershell
Set-Location .\catalogs\material
node --version
npm.cmd --version
npm.cmd ci --no-audit --no-fund
if ($LASTEXITCODE -ne 0) { throw 'Source install failed; do not build yet' }
npm.cmd run build-storybook
if ($LASTEXITCODE -ne 0) { throw 'Storybook build failed; inspect the log' }
Test-Path .\storybook-static\index.json
npm.cmd run test:a2ui
if ($LASTEXITCODE -ne 0) { throw 'Baseline tests failed; record the failure' }
```

Maintainer tools observed: Node v24.20.0, npm 11.19.0, Git 2.50.0.windows.2. Match these when diagnosing differences. Source package peers differ from the portable Angular 21 tree; the portable README's older Node minimum does not establish source compatibility. The source lockfile determines installed versions despite floating manifest ranges such as Compodoc latest.

build-storybook uses Angular's configured Storybook builder and Compodoc. It writes ignored storybook-static and documentation metadata. Tests read storybook-static/index.json at startup: a fresh clone needs the build first. Rebuild after adding/renaming/removing stories; extraction reads descriptions/types/args live.

Optional interactive Angular Storybook, from catalogs/material in another terminal:

```powershell
npm.cmd run storybook:material -- --host localhost --ci --no-open
```

Open http://localhost:6006/ and stop only your own server with Ctrl+C. This uses `ng run material-catalog:storybook --port 6006` plus shown options. Aggregate `storybook` uses scripts/storybook.mjs: spawns React on 6007, waits for its index, then Angular. Direct .cmd spawning has historical Windows spawn EINVAL evidence. Use Angular-only for export; bare storybook dev is not a builder replacement. Remote Shadcn may be unavailable when only Angular runs.

## Export to a new, ignored destination

Still in catalogs/material. This GUID name matches root .gitignore's a2ui-output* patterns; the earlier draft's a2ui-onboarding-* did not.

```powershell
$exportTarget = Join-Path (Get-Location).Path ('a2ui-output-onboarding-' + [guid]::NewGuid().ToString('N'))
if ((Test-Path -LiteralPath $exportTarget) -or (Test-Path -LiteralPath ($exportTarget + '.zip'))) { throw 'Choose a new destination' }
npm.cmd run export:a2ui -- --out $exportTarget
if ($LASTEXITCODE -ne 0) { throw 'Export failed; retain error and partial output for diagnosis' }
Get-ChildItem -LiteralPath $exportTarget | Select-Object Name
Get-Item -LiteralPath ($exportTarget + '.zip')
Get-FileHash -LiteralPath ($exportTarget + '.zip') -Algorithm SHA256
```

Expect Exported FinanceMetricCard, MaterialButton, MaterialCheckbox and notices that numeric Controls do not narrow source unions. Inspect catalogs, metadata/diagnostics, fixtures, src/contracts.ts, src/adapters.ts, src/public-api.ts, manifest/provenance. See [output map](01-ARCHITECTURE.md#package-surfaces-and-authority).

Implemented CLI options: --out and --metric-only. **Do not run proposed --components yet: unknown flags can currently be ignored.** Never reuse default a2ui-output, a2ui-three-*, known-good ZIPs or manifest-bearing folders. Current exporter can overwrite and leave stale files; existing ZIP alone is not protected. To retry, choose another GUID destination and retain failure evidence locally.

## Optional clean extraction and portable acceptance

Extract outside the checkout. ZIP files are at its root without another wrapper folder.

```powershell
$unpackedTarget = Join-Path $env:TEMP ('a2ui-onboarding-verify-' + [guid]::NewGuid().ToString('N'))
Expand-Archive -LiteralPath ($exportTarget + '.zip') -DestinationPath $unpackedTarget -ErrorAction Stop
Push-Location $unpackedTarget
try {
  npm.cmd ci --no-audit --no-fund
  if ($LASTEXITCODE -ne 0) { throw 'Portable install failed' }
  foreach ($checkScript in @('test:portable', 'test:schema', 'build', 'test:runtime')) {
    npm.cmd run $checkScript
    if ($LASTEXITCODE -ne 0) { throw ('Portable check failed: ' + $checkScript) }
  }
} finally { Pop-Location }
```

test:portable audits manifest paths, required files and credential patterns. test:schema checks fixtures/negative cases. build compiles Angular. test:runtime executes real production ES modules in jsdom with an emulated parent frame; it is not a real Composer browser. Current portable suites assume Metric/all-component cases; generic subsets need Matangi's work.

In a new terminal, change into the printed extraction path and run `npm.cmd start` (port **3456**). If busy, choose a free port, e.g. `npm.cmd exec -- ng serve --host localhost --port 3458`. Do not stop demo services. Wait for compilation, open the URL and verify visible controls plus /main.js and /catalog.json. HTML 200 alone does not prove startup.

## Optional Composer

Composer is unnecessary for clone/tests/export/standalone checks. Reference upstream: a2ui-project/composer at `8155592d3522fff213188e8382153e473e2c3315`. Use your own checkout and its instructions. On Windows its Yarn command is corepack.cmd yarn; do not change global settings or Omar's sibling.

Existing all-three resolver check, from catalogs/material (replace placeholders with actual paths):

```text
npm.cmd run test:a2ui:composer -- <your-composer-checkout> <your-new-export-folder>
```

Positional arguments are Composer then export paths. It bundles Composer's resolver via esbuild and assumes all three names; this is schema integration, not browser acceptance.

With Composer running (historically 4200), select your renderer URL, paste full generated fixture **message arrays** into A2UI JSON, edit Data Model and inspect Events. Use metricBound, button, buttonDisabled, checkboxBound, checkboxDisabled. Incremental host-update fixtures require a prior surface. Catalog ID is an identifier, not a public fetch URL. No provider credentials/LLM are required.

## Troubleshooting and evidence

| Symptom | Next investigation |
| --- | --- |
| Missing index / local stories | Check cwd, index age/importPath and registration; rebuild after identity changes |
| spawn EINVAL aggregate startup | Use Angular-only builder; retain OS/command/error without migration |
| EPERM / ENOTCACHED | Record process/cache/network restrictions; reproduce before calling it a code regression |
| Port conflict | Identify listener, choose a free port for your service and update Composer URL |
| Blank UI / HTML 200 | Check compilation, console/network, /main.js and markdown dependency |
| Schema/binding error | Inspect diagnostics, full fixture sequence, source types and host data; retain validation |
| Artifacts in git status | Inspect ignore patterns; don't stage artifacts or clean existing work |

Record command, cwd, version, exit code, outcome and PASS/FAIL/NOT RUN. A blocked export is a useful report but does not satisfy successful newcomer reproduction. Never turn historical browser/clean-install results into fresh-run PASS entries.
