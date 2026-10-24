import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const project = fileURLToPath(new URL('../..', import.meta.url));
const destination = path.resolve(process.argv[2] ?? path.join(project, '../../research-output/real-catalog-pilot/isolated'));
if (fs.existsSync(destination)) throw new Error(`Destination must be absent: ${destination}`);
fs.mkdirSync(destination, { recursive: true });
const files = [];
function copy(relative) {
  const source = path.join(project, relative);
  if (fs.statSync(source).isDirectory()) {
    for (const name of fs.readdirSync(source)) copy(`${relative}/${name}`);
    return;
  }
  const target = path.join(destination, relative);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  const bytes = fs.readFileSync(source);
  fs.writeFileSync(target, bytes);
  files.push({ path: relative, sha256: createHash('sha256').update(bytes).digest('hex') });
}
for (const relative of ['src/shadcn', 'src/stories/Shadcn', 'examples/real-catalog-pilot', 'package.json', 'package-lock.json']) copy(relative);
// Reuse exactly the installed locked dependencies; never install or modify them.
fs.symlinkSync(path.join(project, 'node_modules'), path.join(destination, 'node_modules'), process.platform === 'win32' ? 'junction' : 'dir');
fs.writeFileSync(path.join(destination, 'tsconfig.json'), JSON.stringify({
  compilerOptions: {
    target: 'ES2022', module: 'ESNext', moduleResolution: 'Bundler', jsx: 'react-jsx',
    strict: true, skipLibCheck: true, esModuleInterop: true,
    paths: { '@/*': ['./src/shadcn/*'] },
  },
  include: ['src/shadcn/**/*.tsx', 'src/shadcn/**/*.ts', 'src/stories/Shadcn/**/*.tsx', 'examples/**/*.tsx'],
}, null, 2) + '\n');
fs.writeFileSync(path.join(destination, 'source-provenance.json'), JSON.stringify({
  description: 'Byte-identical copies of existing catalog sources; only isolated tsconfig is generated.', files,
}, null, 2) + '\n');
console.log(destination);
