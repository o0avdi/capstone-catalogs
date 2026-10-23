// Capture official build artifacts for portable regression tests. No source parsing.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const root = fileURLToPath(new URL('../../../../', import.meta.url));
const built = path.resolve(process.argv[2] ?? path.join(root, '../../research-output/react-javascript/storybook'));
const destination = fileURLToPath(new URL('./evidence/', import.meta.url));
const manifestBytes = fs.readFileSync(path.join(built, 'manifests/components.json'));
const indexBytes = fs.readFileSync(path.join(built, 'index.json'));
const manifest = JSON.parse(manifestBytes);
for (const component of Object.values(manifest.components)) {
  const docgen = component.reactDocgen ?? component.reactDocgenTypescript;
  for (const key of ['definedInFile', 'filePath']) if (docgen?.[key]) {
    const relative = path.relative(root, docgen[key]);
    if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('Fixture source must stay inside project.');
    docgen[key] = './' + relative.replaceAll('\\', '/');
  }
}
fs.mkdirSync(destination, { recursive: true });
fs.writeFileSync(path.join(destination, 'index.json'), indexBytes);
fs.writeFileSync(path.join(destination, 'components.json'), JSON.stringify(manifest, null, 2) + '\n');
fs.writeFileSync(path.join(destination, 'capture.json'), JSON.stringify({
  source: 'Real Storybook build of ../*.stories.jsx with ../.storybook/main.js',
  transformations: ['Docgen absolute source paths made relative to catalogs/material; all prop metadata unchanged.'],
  originalManifestSha256: createHash('sha256').update(manifestBytes).digest('hex'),
  originalIndexSha256: createHash('sha256').update(indexBytes).digest('hex'),
}, null, 2) + '\n');
