import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { parseArguments } from './cli.mjs';
import { discoverProject, selectCandidates } from './discovery.mjs';
import { exportSelection } from './bundle.mjs';
import { assessV1Readiness } from './integration-v1.mjs';
import { createReactCatalogExtractor } from './react-integration.mjs';
import { createComponentInstanceValidator } from './validate-catalog-v1.mjs';

const root = fileURLToPath(new URL('../..', import.meta.url));
const fixture = 'scripts/a2ui/fixtures/react-javascript';
const indexFile = `${fixture}/evidence/index.json`;
const manifestFile = `${fixture}/evidence/components.json`;
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const original = read(path.join(root, manifestFile));
const discovery = discoverProject(root, { indexes: [{ framework: 'react', file: indexFile }] });
const candidate = (name) => selectCandidates(discovery, [name])[0];
const status = candidate('StatusNotice');

function temporary(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'a2ui-react-cli-'));
  t.after(() => {
    assert.ok(path.resolve(directory).startsWith(path.resolve(os.tmpdir()) + path.sep));
    fs.rmSync(directory, { recursive: true, force: true });
  });
  return directory;
}
function altered(t, mutate) {
  const manifest = structuredClone(original);
  mutate(manifest, manifest.components['javascript-statusnotice']);
  const file = path.join(temporary(t), 'manifest.json');
  fs.writeFileSync(file, JSON.stringify(manifest));
  return file;
}
function invoke(t, args) {
  const logs = temporary(t);
  const stdout = fs.openSync(path.join(logs, 'stdout.log'), 'w');
  const stderr = fs.openSync(path.join(logs, 'stderr.log'), 'w');
  try {
    const result = spawnSync(process.execPath, [path.join(root, 'scripts/a2ui/cli.mjs'), ...args], {
      cwd: root, stdio: ['ignore', stdout, stderr], windowsHide: true, timeout: 120000,
    });
    if (result.error) throw result.error;
    return { ...result, stdout: fs.readFileSync(path.join(logs, 'stdout.log'), 'utf8'), stderr: fs.readFileSync(path.join(logs, 'stderr.log'), 'utf8') };
  } finally { fs.closeSync(stdout); fs.closeSync(stderr); }
}
function command(t, output, components = 'StatusNotice', extra = []) {
  return invoke(t, ['export', '--project', root, '--protocol', '1.0', '--react-index', indexFile,
    '--react-manifest', manifestFile, '--components', components, '--outputs', 'json', '--out', output, ...extra]);
}

test('React CLI exports real JavaScript PropTypes metadata through the shared v1 generator and official validator', (t) => {
  const output = path.join(temporary(t), 'export');
  const result = command(t, output);
  assert.equal(result.status, 0, result.stderr);
  const catalog = read(path.join(output, 'catalog.json'));
  assert.deepEqual(Object.keys(catalog.components), ['StatusNotice']);
  const component = catalog.components.StatusNotice;
  assert.deepEqual(component.required, ['component', 'label']);
  assert.deepEqual(component.properties.tone.enum, ['info', 'success', 'warning']);
  assert.equal(component.properties.tone.default, 'info');
  assert.equal(component.properties.count.default, 0);
  assert.equal(component.properties.compact.default, false);
  assert.equal('default' in component.properties.label, false);
  assert.match(component.properties.label.description, /Accessible summary label/);
  const validation = read(path.join(output, 'validation.json'));
  assert.equal(validation.valid, true);
  assert.equal(validation.componentSchemasCompiled, true);
  const validate = createComponentInstanceValidator(catalog);
  for (const instance of [
    { component: 'StatusNotice', label: 'Ready', count: 3, tone: 'info', compact: false },
    { component: 'StatusNotice', label: { '@path': '/label' }, count: { '@path': '/count' } },
  ]) assert.equal(validate(instance).valid, true);
  for (const instance of [
    { component: 'StatusNotice' }, { component: 'StatusNotice', label: 3 },
    { component: 'StatusNotice', label: 'Ready', count: true },
    { component: 'StatusNotice', label: 'Ready', tone: 'error' },
    { component: 'StatusNotice', label: 'Ready', compact: 'false' },
    { component: 'StatusNotice', label: 'Ready', mystery: 1 },
  ]) assert.equal(validate(instance).valid, false, JSON.stringify(instance));
  const [record] = read(path.join(output, 'components.json'));
  assert.equal(record.id, status.id);
  assert.equal(record.sourceIdentity.exportName, 'StatusNotice');
  assert.deepEqual(record.storyIds, status.storyIds);
  assert.deepEqual(record.discovery, status.discovery);
  assert.equal(Object.keys(record.rawProperties).length, 4);
  assert.equal('fields' in record, false);
  const provenance = read(path.join(output, 'provenance.json'));
  assert.equal(provenance.reactManifests[0].sha256, createHash('sha256').update(fs.readFileSync(path.join(root, manifestFile))).digest('hex'));
  assert.equal(read(path.join(output, 'diagnostics.json')).warnings[0].code, 'REACT_METADATA_SCOPE');
});

test('JavaScript without PropTypes exposes a default but no type; omitted label is not invented from story args', (t) => {
  const entry = original.components['javascript-undocumentednotice'];
  assert.deepEqual(Object.keys(entry.reactDocgen.props), ['count']);
  assert.equal(entry.reactDocgen.props.count.defaultValue.value, '0');
  assert.equal(entry.reactDocgen.props.count.type, undefined);
  assert.equal(entry.reactDocgen.props.count.required, false);
  const output = path.join(temporary(t), 'rejected');
  const result = command(t, output, 'UndocumentedNotice');
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /no prop type/);
  assert.equal(fs.existsSync(path.join(output, 'catalog.json')), false);
  const diagnostics = read(path.join(output, 'diagnostics.json'));
  assert.ok(diagnostics.issues[0].details.some((item) => item.code === 'REACT_PROP_TYPE_UNAVAILABLE'));
});

test('React callbacks, slots and object props block the entire selection with every unsupported property reported', (t) => {
  const output = path.join(temporary(t), 'rejected');
  const result = command(t, output, 'StatusNotice,InteractiveNotice');
  assert.notEqual(result.status, 0);
  assert.equal(fs.existsSync(path.join(output, 'catalog.json')), false);
  const details = read(path.join(output, 'diagnostics.json')).issues[0].details;
  assert.deepEqual(details.filter((item) => item.code === 'REACT_REVIEWED_MAPPING_REQUIRED').map((item) => item.property).sort(), ['children', 'onDismiss', 'options']);
});

test('React discovery and all-ready use manifest validation, preserving rejection diagnostics', (t) => {
  const readiness = assessV1Readiness(root, discovery.candidates, { reactManifest: manifestFile });
  assert.deepEqual(readiness.filter((item) => item.ready).map((item) => item.name), ['StatusNotice']);
  const output = path.join(temporary(t), 'ready');
  const result = command(t, output, 'StatusNotice', ['--all-ready']);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stderr, /REACT_SOURCE_CONTRACT_UNSUPPORTED/);
  assert.deepEqual(Object.keys(read(path.join(output, 'catalog.json')).components), ['StatusNotice']);
  const listed = invoke(t, ['discover', '--project', root, '--protocol', '1.0', '--react-index', indexFile, '--react-manifest', manifestFile, '--json']);
  assert.equal(listed.status, 0, listed.stderr);
  const parsed = JSON.parse(listed.stdout);
  assert.equal(parsed.summary.sourceContracts, 1);
  assert.equal(parsed.candidates.find((item) => item.componentName === 'StatusNotice').outputSupport.rendererZip, false);
});

test('React manifest CLI flags are explicit and missing/invalid input never falls back to inferred fields', (t) => {
  assert.equal(parseArguments(['--react-manifest', 'input.json']).reactManifest, 'input.json');
  assert.throws(() => parseArguments(['--react-manifest']), /requires a value/);
  const badVersion = altered(t, (manifest) => { manifest.v = 1; });
  for (const manifest of [badVersion, 'missing-manifest.json']) {
    const output = path.join(temporary(t), 'failed');
    const result = command(t, output, 'StatusNotice', ['--react-manifest', manifest]);
    assert.notEqual(result.status, 0);
    assert.equal(fs.existsSync(path.join(output, 'catalog.json')), false);
    assert.equal(read(path.join(output, 'diagnostics.json')).status, 'failed');
  }
  const missing = invoke(t, ['export', '--project', root, '--protocol', '1.0', '--react-index', indexFile,
    '--components', 'StatusNotice', '--out', path.join(temporary(t), 'missing')]);
  assert.notEqual(missing.status, 0);
  assert.match(missing.stderr, /requires --react-manifest/);
  const legacy = invoke(t, ['discover', '--project', root, '--react-manifest', manifestFile]);
  assert.match(legacy.stderr, /requires --protocol 1.0/);
});

test('React matching uses CSF path plus exact story membership, never title or display name', (t) => {
  const extract = createReactCatalogExtractor(root, manifestFile);
  const renamedTitle = { ...status, title: 'Unrelated title', componentName: 'UnrelatedName', fields: [{ name: 'invented' }] };
  assert.equal(extract(renamedTitle).name, 'StatusNotice');
  const windowsPaths = altered(t, (_manifest, entry) => { entry.path = entry.path.replaceAll('/', '\\'); });
  assert.equal(createReactCatalogExtractor(root, windowsPaths)(status).name, 'StatusNotice');
  for (const mutate of [
    (_manifest, entry) => { entry.path = './another.stories.jsx'; },
    (manifest, entry) => { manifest.components.duplicate = { ...entry, id: 'duplicate' }; },
    (_manifest, entry) => { entry.stories.pop(); },
    (_manifest, entry) => { entry.stories[0].id = 'different--story'; },
    (manifest, entry) => { manifest.components['javascript-undocumentednotice'].stories.push(entry.stories[0]); },
    (_manifest, entry) => { entry.reactDocgen.definedInFile = './wrong.jsx'; },
  ]) assert.throws(() => createReactCatalogExtractor(root, altered(t, mutate))(status), /CSF path|story IDs|source file/);
});

test('React manifest error entries, unknown requiredness and absent prop metadata fail explicitly', (t) => {
  for (const [mutate, pattern] of [
    [(_manifest, entry) => { entry.error = { name: 'No component found', message: 'Specify meta.component' }; }, /Specify 'meta.component'/],
    [(_manifest, entry) => { delete entry.reactDocgen; }, /neither 'reactDocgenTypescript' nor 'reactDocgen'/],
    [(_manifest, entry) => { entry.reactDocgen.props = {}; }, /No property contract/],
    [(_manifest, entry) => { delete entry.reactDocgen.props.label.required; }, /requiredness is unavailable/],
  ]) assert.throws(() => createReactCatalogExtractor(root, altered(t, mutate))(status), pattern);
});

test('React rejects numeric enums, computed defaults, wrong defaults and unreviewed DOM props instead of losing semantics', (t) => {
  for (const [mutate, pattern] of [
    [(_m, e) => { e.reactDocgen.props.tone.type.value = [{ value: '1' }, { value: '2' }]; }, /explicit reviewed A2UI mapping/],
    [(_m, e) => { e.reactDocgen.props.count.defaultValue = { value: 'initialCount', computed: true }; }, /not a verified scalar literal/],
    [(_m, e) => { e.reactDocgen.props.count.defaultValue = { value: 'initialCount', computed: false }; }, /not a verified scalar literal/],
    [(_m, e) => { e.reactDocgen.props.count.defaultValue = { value: 'false', computed: false }; }, /does not match/],
    [(_m, e) => { e.reactDocgen.props.style = { required: false, type: { name: 'object' } }; }, /explicit reviewed A2UI mapping/],
  ]) assert.throws(() => createReactCatalogExtractor(root, altered(t, mutate))(status), pattern);
});

test('React exports track metadata changes and are deterministic; discovery examples never replace source metadata', (t) => {
  const changed = altered(t, (_m, e) => {
    e.reactDocgen.props.label.description = 'Changed documented label';
    e.reactDocgen.props.count.defaultValue.value = '42';
  });
  const base = temporary(t);
  const selected = [{ ...status, fields: [{ name: 'invented', schema: { type: 'string' } }], exampleProps: { count: -1 } }];
  for (const output of ['first', 'second']) exportSelection({ projectRoot: root, candidates: selected, outputs: ['json'],
    protocol: '1.0', reactManifest: changed, discovery, output: path.join(base, output) });
  assert.deepEqual(fs.readFileSync(path.join(base, 'first/catalog.json')), fs.readFileSync(path.join(base, 'second/catalog.json')));
  const props = read(path.join(base, 'first/catalog.json')).components.StatusNotice.properties;
  assert.equal(props.count.default, 42);
  assert.equal(props.label.description, 'Changed documented label');
  assert.equal('invented' in props, false);
});

test('React and Angular share one validated catalog; existing reviewed Angular semantics remain', (t) => {
  const output = path.join(temporary(t), 'mixed');
  const result = command(t, output, 'StatusNotice,MaterialCheckbox', ['--angular-index', 'scripts/a2ui/fixtures/angular-index-v5.json']);
  assert.equal(result.status, 0, result.stderr);
  const catalog = read(path.join(output, 'catalog.json'));
  assert.deepEqual(Object.keys(catalog.components).sort(), ['MaterialCheckbox', 'StatusNotice']);
  const validate = createComponentInstanceValidator(catalog);
  assert.equal(validate({ component: 'MaterialCheckbox', label: 'Agree', checked: true }).valid, true);
  assert.equal(validate({ component: 'StatusNotice', label: 'Ready' }).valid, true);
  assert.equal(catalog.components.MaterialCheckbox.properties.action.$ref, 'common_types.json#/$defs/Action');
  assert.equal(read(path.join(output, 'components.json')).find((item) => item.name === 'MaterialCheckbox').callbacks[0].modelUpdate, 'host');
});

test('React source names colliding with Angular names fail rather than overwrite catalog entries', (t) => {
  const manifest = altered(t, (_m, e) => { e.reactDocgen.displayName = 'MaterialCheckbox'; });
  const output = path.join(temporary(t), 'collision');
  const result = command(t, output, 'StatusNotice,MaterialCheckbox', ['--angular-index', 'scripts/a2ui/fixtures/angular-index-v5.json', '--react-manifest', manifest]);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /identity collision/);
  assert.equal(fs.existsSync(path.join(output, 'catalog.json')), false);
});
