import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { parseArguments, run } from './cli.mjs';
import { resolveArtifacts } from './local-artifacts.mjs';
import { validateV1Export } from './integration-v1.mjs';

const root = fileURLToPath(new URL('../..', import.meta.url));
const reactIndex = 'scripts/a2ui/fixtures/react-javascript/evidence/index.json';
const manifest = 'scripts/a2ui/fixtures/react-javascript/evidence/components.json';
const angularIndex = 'scripts/a2ui/fixtures/angular-index-v5.json';
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
function temporary(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'a2ui-developer-'));
  t.after(() => {
    assert.ok(path.resolve(directory).startsWith(path.resolve(os.tmpdir()) + path.sep));
    fs.rmSync(directory, { recursive: true, force: true });
  });
  return directory;
}
async function invoke(args) {
  const stdout = [], stderr = [];
  const log = console.log, error = console.error;
  console.log = (...values) => stdout.push(values.join(' '));
  console.error = (...values) => stderr.push(values.join(' '));
  try {
    await run(args);
    return { stdout: stdout.join('\n'), stderr: stderr.join('\n') };
  } finally { console.log = log; console.error = error; }
}
function command(output, extra = []) {
  return ['export', '--project', root, '--catalog-only', '--react-index', reactIndex,
    '--react-manifest', manifest, '--components', 'StatusNotice', '--out', output, ...extra];
}

test('developer options preserve metadata text, imply v1.0 and reject empty or repeated metadata flags', () => {
  const options = parseArguments(['--catalog-only', '--catalog-id', 'urn:demo:catalog', '--title', 'Demo Catalog', '--description', 'Source contracts.']);
  assert.equal(options.protocol, '1.0');
  assert.deepEqual(options.catalogOptions, { catalogId: 'urn:demo:catalog', title: 'Demo Catalog', description: 'Source contracts.' });
  for (const flag of ['--catalog-id', '--title', '--description']) {
    assert.throws(() => parseArguments(['--catalog-only', flag]), /requires a value/);
    assert.throws(() => parseArguments(['--catalog-only', flag, '  ']), /requires a value/);
    assert.throws(() => parseArguments(['--catalog-only', flag, 'first', flag, 'second']), /only be supplied once/);
  }
});

test('developer options refuse incompatible protocols and output modes instead of silently ignoring flags', () => {
  for (const args of [
    ['--catalog-only', '--protocol', '0.9'], ['--catalog-only', '--outputs', 'json,zip'],
    ['--title', 'Demo'], ['--diagnostics'], ['--detect-artifacts'],
    ['--catalog-only', '--detect-artifacts', '--static-discovery'],
  ]) assert.throws(() => parseArguments(args), /requires|require|supports|cannot/);
});

for (const framework of ['React', 'Angular', 'mixed']) test(`catalog-only ${framework} CLI export has one validated file and custom generator metadata`, async (t) => {
  const output = path.join(temporary(t), 'catalog');
  const inputs = framework === 'React' ? ['--react-index', reactIndex, '--react-manifest', manifest, '--components', 'StatusNotice']
    : framework === 'Angular' ? ['--angular-index', angularIndex, '--components', 'FinanceMetricCard,MaterialButton,MaterialCheckbox']
    : ['--angular-index', angularIndex, '--react-index', reactIndex, '--react-manifest', manifest, '--components', 'MaterialCheckbox,StatusNotice'];
  const result = await invoke(['export', '--project', root, '--catalog-only', ...inputs, '--out', output,
    '--catalog-id', 'https://example.org/catalogs/demo/1', '--title', 'Demo Catalog', '--description', 'Our source contracts.']);
  assert.deepEqual(fs.readdirSync(output), ['catalog.json']);
  const catalog = read(path.join(output, 'catalog.json'));
  assert.equal(catalog.catalogId, 'https://example.org/catalogs/demo/1');
  assert.equal(catalog.$id, catalog.catalogId);
  assert.equal(catalog.title, 'Demo Catalog');
  assert.equal(catalog.description, 'Our source contracts.');
  assert.equal(validateV1Export(catalog).valid, true);
  assert.deepEqual(Object.keys(catalog.components).sort(), framework === 'React' ? ['StatusNotice']
    : framework === 'Angular' ? ['FinanceMetricCard', 'MaterialButton', 'MaterialCheckbox'] : ['MaterialCheckbox', 'StatusNotice']);
  if (framework !== 'Angular') assert.match(result.stderr, /REACT_METADATA_SCOPE/);
});

test('optional diagnostics retain provenance and validation with an identical authoritative catalog', async (t) => {
  const directory = temporary(t);
  const plain = path.join(directory, 'plain'), detailed = path.join(directory, 'detailed');
  await invoke(command(plain));
  await invoke(command(detailed, ['--diagnostics']));
  assert.deepEqual(fs.readdirSync(detailed).sort(), ['catalog.json', 'components.json', 'diagnostics.json', 'provenance.json', 'validation.json']);
  assert.deepEqual(fs.readFileSync(path.join(plain, 'catalog.json')), fs.readFileSync(path.join(detailed, 'catalog.json')));
  assert.equal(read(path.join(detailed, 'validation.json')).componentSchemasCompiled, true);
  assert.equal(read(path.join(detailed, 'provenance.json')).reactManifests.length, 1);
});

test('invalid catalog identities and unsupported components publish no catalog in minimal mode', async (t) => {
  const directory = temporary(t);
  for (const [name, flags, message] of [
    ['identity', ['--catalog-id', 'not-a-uri'], /Invalid catalogId/],
    ['unsupported', ['--components', 'StatusNotice,InteractiveNotice'], /onDismiss/],
    ['untyped', ['--components', 'UndocumentedNotice'], /no prop type/],
  ]) {
    const output = path.join(directory, name);
    await assert.rejects(invoke(command(output, flags)), message);
    assert.equal(fs.existsSync(output), false);
  }
  const output = path.join(directory, 'details');
  await assert.rejects(invoke(command(output, ['--components', 'InteractiveNotice', '--diagnostics'])), /Failure diagnostics/);
  assert.deepEqual(fs.readdirSync(output), ['diagnostics.json']);
  assert.equal(read(path.join(output, 'diagnostics.json')).status, 'failed');
});

test('catalog-only refuses existing outputs even with metadata changes and diagnostics enabled', async (t) => {
  const output = temporary(t);
  await invoke(command(output));
  const original = fs.readFileSync(path.join(output, 'catalog.json'));
  await assert.rejects(invoke(command(output, ['--title', 'Replacement', '--diagnostics'])), /not empty/);
  assert.deepEqual(fs.readdirSync(output), ['catalog.json']);
  assert.deepEqual(fs.readFileSync(path.join(output, 'catalog.json')), original);
  fs.writeFileSync(path.join(output, 'unrelated.txt'), 'keep me');
  await assert.rejects(invoke(command(output)), /not empty/);
  assert.equal(fs.readFileSync(path.join(output, 'unrelated.txt'), 'utf8'), 'keep me');
});

test('all-ready groups warnings, reports supported/unsupported counts and retains every rejected identity', async (t) => {
  const output = path.join(temporary(t), 'ready');
  const result = await invoke(command(output, ['--all-ready', '--diagnostics']));
  assert.match(result.stdout, /Supported: 1\/3 \(StatusNotice\). Unsupported: 2/);
  assert.equal(result.stderr.split('\n').filter((line) => line.startsWith('[REACT_SOURCE_CONTRACT_UNSUPPORTED]')).length, 1);
  assert.match(result.stderr, /2 occurrence\(s\)/);
  assert.match(result.stderr, /discover.*--json/);
  const rejected = read(path.join(output, 'diagnostics.json')).discovery.filter((item) => item.code === 'REACT_SOURCE_CONTRACT_UNSUPPORTED');
  assert.equal(rejected.length, 2);
  assert.ok(rejected.every((item) => item.id && item.message));
  const none = path.join(temporary(t), 'none');
  await assert.rejects(invoke(['export', '--project', root, '--catalog-only', '--react-index', reactIndex, '--all-ready', '--out', none]), /No supported components passed/);
  assert.equal(fs.existsSync(none), false);
});

function artifactProject(t, dependencies = { '@storybook/react-vite': '10.6.0' }) {
  const directory = temporary(t);
  fs.writeFileSync(path.join(directory, 'package.json'), JSON.stringify({ devDependencies: dependencies }));
  return directory;
}
function put(root, file, data = '{}') {
  fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
  fs.writeFileSync(path.join(root, file), data);
}

test('artifact detection is opt-in, pairs adjacent manifests and leaves explicit inputs authoritative', (t) => {
  const project = artifactProject(t);
  put(project, 'storybook-static/index.json');
  put(project, 'storybook-static/manifests/components.json');
  assert.deepEqual(resolveArtifacts(project, {}), {});
  const result = resolveArtifacts(project, { detectArtifacts: true });
  assert.deepEqual(result.indexes, [{ framework: 'react', file: 'storybook-static/index.json' }]);
  assert.equal(result.reactManifest, path.join(project, 'storybook-static/manifests/components.json'));
  assert.match(result.artifactDiagnostics[0].message, /Freshness is not verified/);
  const explicit = { detectArtifacts: true, indexes: [{ framework: 'react', file: 'explicit/index.json' }], reactManifest: 'explicit/manifest.json' };
  assert.deepEqual(resolveArtifacts(project, explicit), { ...explicit, artifactDiagnostics: [] });
});

test('detection handles Angular and named mixed builds without evaluating Storybook configuration', (t) => {
  const angular = artifactProject(t, { '@storybook/angular': '10.6.0' });
  put(angular, 'storybook-static/index.json');
  assert.equal(resolveArtifacts(angular, { detectArtifacts: true }).indexes[0].framework, 'angular');
  const mixed = artifactProject(t, {});
  put(mixed, 'storybook-static-angular/index.json');
  put(mixed, 'storybook-static-react/index.json');
  put(mixed, 'storybook-static-react/manifests/components.json');
  assert.deepEqual(resolveArtifacts(mixed, { detectArtifacts: true }).indexes.map((item) => item.framework), ['angular', 'react']);
});

test('detection refuses ambiguous, absent and incomplete build artifacts with explicit recovery flags', (t) => {
  const project = artifactProject(t, { '@storybook/angular': '10.6.0', '@storybook/react-vite': '10.6.0' });
  assert.throws(() => resolveArtifacts(project, { detectArtifacts: true }), /No conventional Storybook index/);
  put(project, 'storybook-static/index.json');
  assert.throws(() => resolveArtifacts(project, { detectArtifacts: true }), /Cannot determine.*--angular-index/);
  const duplicate = artifactProject(t);
  put(duplicate, 'storybook-static-react/index.json');
  put(duplicate, 'storybook-static-shadcn/index.json');
  assert.throws(() => resolveArtifacts(duplicate, { detectArtifacts: true }), /Multiple conventional react indexes/);
  const missing = artifactProject(t);
  put(missing, 'storybook-static/index.json');
  assert.throws(() => resolveArtifacts(missing, { detectArtifacts: true }), /No React Components Manifest/);
});

test('detected official artifacts pass through existing adapters and malformed indexes never fall back', async (t) => {
  const project = artifactProject(t);
  const fixture = 'scripts/a2ui/fixtures/react-javascript';
  for (const file of fs.readdirSync(path.join(root, fixture)).filter((file) => file.endsWith('.jsx')))
    put(project, `${fixture}/${file}`, fs.readFileSync(path.join(root, fixture, file)));
  put(project, 'storybook-static/index.json', fs.readFileSync(path.join(root, reactIndex)));
  put(project, 'storybook-static/manifests/components.json', fs.readFileSync(path.join(root, manifest)));
  const output = path.join(project, 'export');
  const args = ['export', '--project', project, '--catalog-only', '--detect-artifacts', '--components', 'StatusNotice', '--out', output];
  const result = await invoke(args);
  assert.match(result.stderr, /LOCAL_BUILD_ARTIFACTS.*storybook-static/);
  assert.deepEqual(fs.readdirSync(output), ['catalog.json']);
  assert.equal(validateV1Export(read(path.join(output, 'catalog.json'))).valid, true);
  put(project, 'storybook-static/index.json', '{"v":99}');
  await assert.rejects(invoke([...args, '--out', path.join(project, 'invalid')]), /Unsupported Storybook index version/);
  assert.equal(fs.existsSync(path.join(project, 'invalid')), false);
});
