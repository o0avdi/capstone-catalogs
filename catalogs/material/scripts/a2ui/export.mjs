import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { extract, makeCatalog, catalogId } from './metadata.mjs';
import { archive } from './zip.mjs';
import { contracts, registrationSource, componentFixtures } from './component-files.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const options = process.argv.slice(2);
const get = (name) => (options.includes(name) ? options[options.indexOf(name) + 1] : undefined);
const out = path.resolve(get('--out') ?? path.join(root, 'a2ui-output'));
if (out === root || root.startsWith(out + path.sep))
  throw new Error('Output must not be the project or a parent directory.');
const registrations = JSON.parse(fs.readFileSync(path.join(root, 'a2ui/registrations.json')));
const selected = options.includes('--metric-only') ? registrations.slice(0, 1) : registrations;
const index = JSON.parse(fs.readFileSync(path.join(root, 'storybook-static/index.json')));
const metadata = extract(root, selected, index);
const catalog = makeCatalog(metadata);
if (fs.existsSync(out) && !fs.existsSync(path.join(out, 'export-manifest.json')))
  throw new Error(
    'Refusing to overwrite a directory without an export-manifest.json. Choose a new --out directory.',
  );
fs.mkdirSync(out, { recursive: true });
const written = [];
function write(name, content) {
  fs.mkdirSync(path.dirname(path.join(out, name)), { recursive: true });
  fs.writeFileSync(path.join(out, name), content);
  written.push(name);
}
function json(name, value) {
  write(name, JSON.stringify(value, null, 2) + '\n');
}
function copyTree(src, dest) {
  for (const entry of fs
    .readdirSync(src, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))) {
    if (
      entry.name === 'package-lock.json' ||
      ['node_modules', '.angular', '.git', 'coverage'].includes(entry.name) ||
      (entry.name === 'dist' && src.startsWith(path.join(root, 'a2ui/renderer')))
    )
      continue;
    if (entry.isSymbolicLink())
      throw new Error('Source packaging refuses symlinks: ' + path.join(src, entry.name));
    const target = path.posix.join(dest, entry.name);
    if (entry.isDirectory()) copyTree(path.join(src, entry.name), target);
    else write(target, fs.readFileSync(path.join(src, entry.name)));
  }
}
copyTree(path.join(root, 'a2ui/renderer'), '');
copyTree(path.join(root, 'a2ui/vendor'), 'vendor');
const lock = path.join(root, 'a2ui/renderer/package-lock.json');
if (fs.existsSync(lock)) write('package-lock.json', fs.readFileSync(lock));
for (const c of metadata) {
  for (const file of c.files) write(file, fs.readFileSync(path.join(root, file)));
  write('provenance/' + c.story, fs.readFileSync(path.join(root, c.story)));
}
json('catalog.json', catalog);
json('public/catalog.json', catalog);
json('metadata.json', metadata);
json('diagnostics.json', {
  warnings: metadata.flatMap((c) => c.warnings),
  discovery: {
    source: 'Storybook v5 index.json',
    components: metadata.map((c) => ({ name: c.name, storyIds: c.storyIds })),
    excluded: 'docs entries, remote refId entries, and all unregistered stories',
  },
  typeAuthority: 'TypeScript source; story args are examples, not API defaults',
  unsupported: [
    'function calls',
    'common weight/accessibility/checks',
    'arbitrary template extraction',
    'React catalogs',
  ],
});
const { fixtures, menu, usages } = componentFixtures(root, metadata);
json('fixtures.json', fixtures);
json('public/fixtures.json', fixtures);
json('public/demo.json', menu);
for (const [name, messages] of Object.entries(fixtures)) {
  json('fixtures/' + name + '.json', messages);
  json('public/fixtures/' + name + '.json', messages);
}
json('public/usages.json', usages);
write('src/contracts.ts', contracts(metadata));
for (const c of metadata) {
  write(c.adapterOutput, fs.readFileSync(path.join(root, c.adapterFile)));
  for (const asset of c.assets ?? [])
    write(asset.output, fs.readFileSync(path.join(root, asset.source)));
  write('provenance/' + c.adapterFile, fs.readFileSync(path.join(root, c.adapterFile)));
  write('provenance/' + c.fixturesFile, fs.readFileSync(path.join(root, c.fixturesFile)));
}
write('src/adapters.ts', registrationSource(metadata));
write(
  'src/public-api.ts',
  "export * from './adapters';\nexport * from './contracts';\n" +
    metadata
      .flatMap((c) => c.publicExports ?? [])
      .map((file) => "export * from './" + file.replace(/^src\//, '').replace(/\.ts$/, '') + "';\n")
      .join(''),
);
copyTree(path.join(root, 'scripts/a2ui/portable'), 'scripts');
write('README.md', fs.readFileSync(path.join(root, 'a2ui/README-export.md')));
json('provenance.json', {
  source: 'capstone-catalogs Angular Storybook',
  catalogId,
  bridge: {
    upstream: 'https://github.com/a2ui-project/composer',
    commit: '8155592d3522fff213188e8382153e473e2c3315',
    license: 'Apache-2.0',
    changes:
      'Package metadata narrowed to Angular-only exports; compatible Angular 21 peer. Built JS and source unchanged.',
  },
  compatibility:
    'Portable renderer uses Angular 21.2.17 and Material 21.2.14 to satisfy A2UI 0.10.4 Angular 21 peers. Source Storybook Angular 22 and its lockfile are unchanged.',
  files: metadata.flatMap((c) => c.files),
});
json('export-manifest.json', {
  formatVersion: 1,
  catalogId,
  files: [...written, 'export-manifest.json'].sort(),
});
archive(out, [...written], out + '.zip');
console.log(`Exported ${metadata.map((c) => c.name).join(', ')} to ${out} and ${out}.zip`);
for (const warning of metadata.flatMap((c) => c.warnings)) console.log('NOTICE: ' + warning);
