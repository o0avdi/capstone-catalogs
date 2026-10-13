# Storybook to A2UI MVP

This checkout is dedicated to the Angular export MVP for the October 15, 2026 class demo. The demo may be prerecorded; a live presentation is not required.

Read `docs/A2UI_EXPORT_MVP_PLAN.md` before implementation and keep its progress and decisions current. The required outcome is an actual metadata-driven export containing a catalog, component source, styles, adapters, and an independently runnable Angular renderer.

- Implement in this repository. The sibling `../composer` checkout is the pinned upstream integration reference/test application. Avoid upstream changes unless necessary and document them separately.
- Preserve the existing Storybook framework and lockfile. Do not migrate to Vite or upgrade dependencies speculatively.
- Required components are Finance Metric Card and Material Button. Checkbox is a stretch goal after all required checks pass.
- Exclude the composed React/Shadcn Storybook from Angular export.
- Treat `docs/references/composer-catalog.json` as an immutable reference fixture, not the generated output.
- Keep schema, runtime mapping, and source packaging consistent. Never silently drop unsupported fields or replace extraction with copying a hand-maintained catalog.
- No API key or LLM is needed for acceptance. Use fixed A2UI messages.
- On this Windows machine use `npm.cmd` and `corepack.cmd yarn` where PowerShell command resolution matters. Do not change global package-manager settings.
- Do not touch the user's other checkouts. Do not publish, deploy, or merge as part of the MVP.
- Record real validation results and distinguish pre-existing problems from new regressions.
