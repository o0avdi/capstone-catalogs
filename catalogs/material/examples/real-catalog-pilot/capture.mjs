import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const here = fileURLToPath(new URL('.', import.meta.url));
const project = path.resolve(here, '../..');
const built = path.resolve(process.argv[2] ?? path.join(project, '../../research-output/real-catalog-pilot/shadcn-complete'));
const staged = path.resolve(process.argv[3] ?? path.join(built, '../isolated'));
const angular = fs.readFileSync(path.resolve(process.argv[4] ?? path.join(built, '../angular-index.json')));
const bytes = fs.readFileSync(path.join(built, 'manifests/components.json'));
const index = fs.readFileSync(path.join(built, 'index.json'));
const manifest = JSON.parse(bytes);
for (const entry of Object.values(manifest.components)) {
  const docgen = entry.reactDocgenTypescript ?? entry.reactDocgen;
  if (!docgen?.filePath) continue;
  const relative = path.relative(staged, docgen.filePath);
  if (relative.startsWith('..') || path.isAbsolute(relative)) throw new Error('Source escaped staged project.');
  if (!fs.readFileSync(path.join(staged, relative)).equals(fs.readFileSync(path.join(project, relative))))
    throw new Error(`Staged source differs: ${relative}`);
  docgen.filePath = './' + relative.replaceAll('\\', '/');
}
const destination = path.join(here, 'evidence');
fs.mkdirSync(destination, { recursive: true });
fs.writeFileSync(path.join(destination, 'index.json'), index);
fs.writeFileSync(path.join(destination, 'components.json'), JSON.stringify(manifest, null, 2) + '\n');
const angularIndex = JSON.parse(angular);
fs.writeFileSync(path.join(destination, 'angular-candidates-index.json'), JSON.stringify({
  ...angularIndex,
  entries: Object.fromEntries(Object.entries(angularIndex.entries).filter(([, entry]) =>
    ['Material/Input', 'Material/Tooltip', 'Material/Card'].includes(entry.title))),
}, null, 2) + '\n');
fs.writeFileSync(path.join(destination, 'capture.json'), JSON.stringify({
  source: 'Official Storybook 10.6 build of byte-identical catalog sources with isolated tsconfig and Components Manifest enabled.',
  transformations: [
    'Only docgen.filePath made project-relative; React index and prop metadata unchanged.',
    'Angular index filtered to the three investigated titles; retained entries unchanged.',
  ],
  originalManifestSha256: createHash('sha256').update(bytes).digest('hex'),
  originalIndexSha256: createHash('sha256').update(index).digest('hex'),
  originalAngularIndexSha256: createHash('sha256').update(angular).digest('hex'),
  sourceFiles: JSON.parse(fs.readFileSync(path.join(staged, 'source-provenance.json'))).files.filter((item) =>
    /src\/shadcn\/components\/ui\/(separator|badge|progress)\.tsx$/.test(item.path)),
}, null, 2) + '\n');
console.log(destination);
