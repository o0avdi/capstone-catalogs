// Inventory/evidence only. This never authorizes a subset or writes review reasons.
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createReactSourceAudit } from '../../scripts/a2ui/react-source-audit.mjs';
import { normalizeReactComponentManifest } from '../../scripts/a2ui/react-manifest.mjs';
const root = fileURLToPath(new URL('../..', import.meta.url));
const manifest = JSON.parse(fs.readFileSync(new URL('../real-catalog-pilot/evidence/components.json', import.meta.url)));
const entry = manifest.components['pilot-separator'];
const audit = createReactSourceAudit(root, [entry]);
audit({ id: 'react:examples/real-catalog-pilot/Separator.stories.tsx', storyPath: entry.path.replace(/^\.\//, '') },
  normalizeReactComponentManifest(entry), entry.reactDocgenTypescript, {
    onEvidence: (facts) => {
      const json = JSON.stringify(facts, null, 2) + '\n';
      if (process.argv[2]) fs.writeFileSync(process.argv[2], json);
      else process.stdout.write(json);
    },
  });
