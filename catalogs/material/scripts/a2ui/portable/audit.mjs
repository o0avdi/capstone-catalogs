import fs from 'node:fs';
import path from 'node:path';
const manifest = JSON.parse(fs.readFileSync('export-manifest.json'));
const unique = new Set(manifest.files);
if (unique.size !== manifest.files.length) throw Error('Duplicate packaged paths');
for (const name of unique) {
  if (
    path.isAbsolute(name) ||
    name.split('/').includes('..') ||
    name.split('/').includes('node_modules')
  )
    throw Error('Unsafe packaged path ' + name);
  const text = fs.readFileSync(name, 'utf8');
  if (/(?:[A-Z]:[\\/]Users[\\/]|\.\.[\\/]composer(?:[\\/]|["']))/i.test(text))
    throw Error('Machine or sibling path in ' + name);
  if (/(?:sk-proj-[A-Za-z0-9_-]{20,}|sk-[A-Za-z0-9]{40,})/.test(text))
    throw Error('Possible credential in ' + name);
}
for (const name of [
  'catalog.json',
  'package-lock.json',
  'src/adapters.ts',
  'src/public-api.ts',
  'src/styles.scss',
  'vendor/a2ui-bridge/LICENSE',
  'fixtures.json',
])
  if (!unique.has(name)) throw Error('Missing required bundle file ' + name);
console.log(
  'PASS portable manifest: ' +
    unique.size +
    ' files, no node_modules, machine paths, sibling dependencies or credential patterns.',
);
