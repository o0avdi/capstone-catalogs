# Universal Storybook to A2UI exporter

The original Angular export MVP is preserved, but current work extends it with framework-neutral discovery, interactive selection, JSON-only output and portable Angular/React renderer bundles.

Read `docs/A2UI_EXPORT_MVP_PLAN.md` before implementation and keep its progress and decisions current. The required outcome is an actual metadata-driven export containing a catalog, component source, styles, adapters, and an independently runnable Angular renderer.

- Implement in this repository. The sibling `../composer` checkout is the pinned upstream integration reference/test application. Avoid upstream changes unless necessary and document them separately.
- Preserve the existing Storybook framework and lockfile. Do not migrate to Vite or upgrade dependencies speculatively.
- Preserve the verified Finance Metric Card, Material Button and Material Checkbox path.
- Discover both Angular `.stories.ts` and React/Shadcn `.stories.tsx` sources without executing story code.
- Keep framework-specific renderer implementations separate while presenting one CLI and one normalized A2UI catalog interface.
- A candidate may produce JSON before it has a reviewed renderer adapter. Never label a ZIP runnable when no real renderer path exists.
- Treat `docs/references/composer-catalog.json` as an immutable reference fixture, not the generated output.
- Keep schema, runtime mapping, and source packaging consistent. Never silently drop unsupported fields or replace extraction with copying a hand-maintained catalog.
- No API key or LLM is needed for acceptance. Use fixed A2UI messages.
- On this Windows machine use `npm.cmd` and `corepack.cmd yarn` where PowerShell command resolution matters. Do not change global package-manager settings.
- Do not touch the user's other checkouts. Do not publish, deploy, push, or merge unless the user explicitly requests it.
- Record real validation results and distinguish pre-existing problems from new regressions.
