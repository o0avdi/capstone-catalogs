# Official Storybook index fixtures

Reduced, otherwise unchanged entries from Storybook 10.6.0 `storybook index`, index v5,
generated October 20, 2026 from this project's unchanged configurations:

- `angular-index-v5.json`: `.storybook`, Finance Metric Card, Material Button,
  Material Checkbox and standalone Configure MDX documentation.
- `react-index-v5.json`: `.storybook-shadcn`, Shadcn Button and its autodocs.

The tests use the repository's actual story paths. Synthetic variants in the test
module exercise malformed data, collisions, configured titles and export filtering.
Regeneration commands (run from `catalogs/material`, PowerShell):

```powershell
.\node_modules\.bin\storybook.cmd index --config-dir .storybook --output-file ../../research-output/codex-storybook/experiment-results/implementation-angular-index.json
.\node_modules\.bin\storybook.cmd index --config-dir .storybook-shadcn --output-file ../../research-output/codex-storybook/experiment-results/implementation-react-index.json
```

Reduce entries by importPath, retaining full entries and `{ "v": 5, "entries": ... }`.
