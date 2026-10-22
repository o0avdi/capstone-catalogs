import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { parseArguments } from './cli.mjs';
import { exportSelection } from './bundle.mjs';
import { discoverProject, selectCandidates } from './discovery.mjs';
import { assertV1Convertible, validateV1Export } from './integration-v1.mjs';
import { catalogV1Id } from './catalog-v1.mjs';
import { createCatalogValidator, createComponentInstanceValidator } from './validate-catalog-v1.mjs';

const root = fileURLToPath(new URL('../..', import.meta.url));
const cli = path.join(root, 'scripts/a2ui/cli.mjs');
// Real built Angular index, also used by the existing source/generator suites.
const indexFile = path.join(root, 'storybook-static/index.json');
const index = JSON.parse(fs.readFileSync(indexFile));
const discovery = discoverProject(root, { indexes: [{ framework: 'angular', file: indexFile }] });
const names = ['FinanceMetricCard', 'MaterialButton', 'MaterialCheckbox'];
const read = (directory, file) => JSON.parse(fs.readFileSync(path.join(directory, file), 'utf8'));

function temporary(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'a2ui-v1-integration-'));
  t.after(() => {
    assert.ok(path.resolve(directory).startsWith(path.resolve(os.tmpdir()) + path.sep));
    fs.rmSync(directory, { recursive: true, force: true });
  });
  return directory;
}

function command(project, destination, selectors = names, extra = []) {
  return invoke([cli, 'export', '--project', project, '--protocol', '1.0',
    '--angular-index', project === root ? indexFile : 'index.json',
    '--components', selectors.join(','), '--out', destination, ...extra]);
}

// File-backed capture also works on Windows sandboxes that deny child pipe creation.
function invoke(args) {
  const logs = fs.mkdtempSync(path.join(os.tmpdir(), 'a2ui-v1-cli-logs-'));
  const stdout = fs.openSync(path.join(logs, 'stdout.log'), 'w');
  const stderr = fs.openSync(path.join(logs, 'stderr.log'), 'w');
  try {
    const result = spawnSync(process.execPath, args, {
      cwd: root, stdio: ['ignore', stdout, stderr], timeout: 120000, windowsHide: true,
    });
    if (result.error) throw result.error;
    return { ...result, stdout: fs.readFileSync(path.join(logs, 'stdout.log'), 'utf8'), stderr: fs.readFileSync(path.join(logs, 'stderr.log'), 'utf8') };
  } finally {
    fs.closeSync(stdout);
    fs.closeSync(stderr);
    assert.ok(path.resolve(logs).startsWith(path.resolve(os.tmpdir()) + path.sep));
    fs.rmSync(logs, { recursive: true, force: true });
  }
}

test('one CLI command exports all three real indexed source contracts as validated v1.0 JSON', (t) => {
  const output = path.join(temporary(t), 'export');
  assert.ok(discovery.summary.angular >= 40, 'Use the complete real Angular index, not the three-component fixture');
  const result = command(root, output);
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Exported validated A2UI v1.0/);
  assert.deepEqual(fs.readdirSync(output).sort(), ['catalog.json', 'components.json', 'diagnostics.json', 'provenance.json', 'validation.json']);
  const catalog = read(output, 'catalog.json');
  assert.equal(catalog.protocolVersion, '1.0');
  assert.equal(catalog.catalogId, catalogV1Id);
  assert.equal(catalog.$id, catalogV1Id);
  assert.deepEqual(Object.keys(catalog.components), names);
  assert.deepEqual(createCatalogValidator()(catalog), { valid: true, errors: [] });
  assert.equal(read(output, 'validation.json').componentSchemasCompiled, true);
  assert.equal(read(output, 'diagnostics.json').status, 'success');
  assert.equal(read(output, 'diagnostics.json').renderer.available, false);
  assert.ok(read(output, 'diagnostics.json').warnings.some((warning) => warning.includes('does not narrow')));

  const metric = catalog.components.FinanceMetricCard;
  assert.deepEqual(metric.required, ['component', 'label', 'value']);
  for (const field of ['value', 'change']) {
    assert.deepEqual(metric.properties[field].oneOf.slice(0, 2), [{ type: 'number' }, { type: 'string' }]);
    assert.equal('default' in metric.properties[field], false);
  }
  assert.ok(metric.properties.subtitle);
  assert.equal(metric.required.includes('subtitle'), false);
  assert.equal(metric.properties.currency.default, 'USD');
  assert.equal(metric.properties.format.default, 'currency');
  assert.equal(metric.properties.state.default, 'neutral');
  assert.equal('default' in metric.properties.label, false);
  const button = catalog.components.MaterialButton;
  assert.match(button.properties.label.description, /projected/);
  for (const field of ['label', 'disabled', 'appearance']) assert.equal('default' in button.properties[field], false);
  assert.equal(button.properties.action.$ref, 'common_types.json#/$defs/Action');
  const checkbox = catalog.components.MaterialCheckbox;
  assert.equal('onCheckedChange' in checkbox.properties, false);
  assert.equal(checkbox.properties.action.$ref, 'common_types.json#/$defs/Action');
  assert.equal(checkbox.required.includes('action'), false);

  const records = read(output, 'components.json');
  const checkboxRecord = records.find((record) => record.name === 'MaterialCheckbox');
  assert.deepEqual(checkboxRecord.callbacks[0].payload, { checked: '$event.checked' });
  assert.equal(checkboxRecord.callbacks[0].modelUpdate, 'host');
  assert.deepEqual(checkboxRecord.events, { change: 'action' });
  const buttonRecord = records.find((record) => record.name === 'MaterialButton');
  assert.deepEqual(buttonRecord.content, { label: 'projected text' });
  assert.deepEqual(buttonRecord.events, { click: 'action' });
  const provenance = read(output, 'provenance.json');
  assert.equal(provenance.indexSources[0].sha256, createHash('sha256').update(fs.readFileSync(indexFile)).digest('hex'));
  for (const record of records) {
    const stories = Object.values(index.entries).filter((entry) => entry.type === 'story' && entry.importPath === `./${record.storyPath}`).sort((a, b) => a.id.localeCompare(b.id));
    assert.deepEqual(record.discovery.stories, stories);
    assert.deepEqual(record.storyIds, stories.map((entry) => entry.id));
    assert.ok(record.discovery.docs.length);
    assert.equal('fields' in record, false, 'Do not publish a second inferred component schema');
  }
  const validate = createComponentInstanceValidator(catalog);
  for (const value of [12, '12%', { '@path': '/revenue' }])
    assert.equal(validate({ component: 'FinanceMetricCard', label: 'Revenue', value }).valid, true);
  for (const instance of [
    { component: 'FinanceMetricCard', value: 12 },
    { component: 'FinanceMetricCard', label: 'Revenue' },
    { component: 'FinanceMetricCard', label: 'Revenue', value: true },
    { component: 'MaterialButton', label: 'Save' },
    { component: 'MaterialCheckbox', label: 'Agree', checked: true, onCheckedChange: 'fn()' },
  ]) assert.equal(validate(instance).valid, false);
  assert.equal(validate({ component: 'MaterialButton', label: 'Save', action: { event: { name: 'save' } } }).valid, true);
  assert.equal(validate({ component: 'MaterialCheckbox', label: 'Agree', checked: { '@path': '/checked' } }).valid, true);
});

test('CLI subset selection writes one component and the same stable catalogId', (t) => {
  const output = path.join(temporary(t), 'subset');
  const result = command(root, output, ['MaterialButton']);
  assert.equal(result.status, 0, result.stderr);
  const catalog = read(output, 'catalog.json');
  assert.deepEqual(Object.keys(catalog.components), ['MaterialButton']);
  assert.deepEqual(catalog.$defs.anyComponent.oneOf, [{ $ref: '#/components/MaterialButton' }]);
  assert.equal(catalog.catalogId, catalogV1Id);
  assert.deepEqual(read(output, 'components.json').map((record) => record.name), ['MaterialButton']);
});

test('source extraction ignores discovery-inferred fields and repeated JSON is deterministic', (t) => {
  const directory = temporary(t);
  const candidates = selectCandidates(discovery, ['FinanceMetricCard']).map((candidate) => ({
    ...candidate, fields: [{ name: 'invented', schema: { type: 'string', default: 'not a source default' } }],
  }));
  const options = { projectRoot: root, candidates, protocol: '1.0', outputs: ['json'], discovery };
  exportSelection({ ...options, output: path.join(directory, 'first') });
  exportSelection({ ...options, output: path.join(directory, 'second') });
  assert.deepEqual(fs.readFileSync(path.join(directory, 'first/catalog.json')), fs.readFileSync(path.join(directory, 'second/catalog.json')));
  assert.equal('invented' in read(path.join(directory, 'first'), 'catalog.json').components.FinanceMetricCard.properties, false);
});

test('unsupported real indexed candidate fails the whole selection with actionable diagnostics', (t) => {
  const output = path.join(temporary(t), 'unsupported');
  const unsupported = discovery.candidates.find((candidate) => !candidate.registrationName);
  const result = command(root, output, ['MaterialButton', unsupported.id]);
  assert.notEqual(result.status, 0);
  assert.doesNotMatch(result.stdout, /Exported/);
  assert.match(result.stderr, /no unique reviewed Angular source registration/);
  assert.equal(fs.existsSync(path.join(output, 'catalog.json')), false);
  const diagnostic = read(output, 'diagnostics.json');
  assert.equal(diagnostic.status, 'failed');
  assert.equal(diagnostic.issues[0].id, unsupported.id);
  assert.equal(diagnostic.issues[0].code, 'UNSUPPORTED_V1_COMPONENT');
});

test('v1.0 refuses ZIP, missing index and nonempty output without overwriting legacy files', (t) => {
  const directory = temporary(t);
  const zipOutput = path.join(directory, 'zip');
  const zip = command(root, zipOutput, ['MaterialButton'], ['--outputs', 'json,zip']);
  assert.notEqual(zip.status, 0);
  assert.match(zip.stderr, /existing renderers use v0.9/);
  assert.equal(fs.existsSync(zipOutput), false);
  const missing = invoke([cli, 'export', '--project', root, '--protocol', '1.0', '--components', 'MaterialButton']);
  assert.notEqual(missing.status, 0);
  assert.match(missing.stderr, /requires an official Storybook index/);
  fs.writeFileSync(path.join(directory, 'catalog.json'), 'legacy catalog');
  fs.writeFileSync(path.join(directory, 'messages.json'), 'legacy v0.9 messages');
  const stale = command(root, directory, ['MaterialButton']);
  assert.notEqual(stale.status, 0);
  assert.match(stale.stderr, /not empty/);
  assert.equal(fs.readFileSync(path.join(directory, 'catalog.json'), 'utf8'), 'legacy catalog');
  assert.equal(fs.readFileSync(path.join(directory, 'messages.json'), 'utf8'), 'legacy v0.9 messages');
});

function buttonProject(t) {
  const project = temporary(t);
  const registration = JSON.parse(fs.readFileSync(path.join(root, 'a2ui/registrations.json'))).find((item) => item.name === 'MaterialButton');
  for (const file of [registration.story, registration.adapterFile, registration.fixturesFile, ...registration.assets.map((asset) => asset.source)]) {
    fs.mkdirSync(path.dirname(path.join(project, file)), { recursive: true });
    fs.copyFileSync(path.join(root, file), path.join(project, file));
  }
  fs.writeFileSync(path.join(project, 'package.json'), '{}');
  fs.writeFileSync(path.join(project, 'a2ui/registrations.json'), JSON.stringify([registration]));
  fs.writeFileSync(path.join(project, 'index.json'), JSON.stringify({ ...index, entries: Object.fromEntries(Object.entries(index.entries).filter(([, entry]) => entry.importPath === `./${registration.story}`)) }));
  return { project, registration, story: path.join(project, registration.story) };
}

test('real CLI fails official structural validation and never publishes an invalid catalog', (t) => {
  const { project, registration, story } = buttonProject(t);
  // Source-derived id leaks into the component rather than the wire envelope.
  fs.writeFileSync(story, fs.readFileSync(story, 'utf8').replace('label: string;', 'label: string; id: string;'));
  registration.bindings.push('id');
  fs.writeFileSync(path.join(project, 'a2ui/registrations.json'), JSON.stringify([registration]));
  const output = path.join(project, 'invalid-export');
  const result = command(project, output, ['MaterialButton']);
  assert.notEqual(result.status, 0, result.stdout);
  assert.match(result.stderr, /catalog validation failed/);
  assert.match(result.stderr, /envelope property 'id'/);
  assert.equal(fs.existsSync(path.join(output, 'catalog.json')), false);
  assert.equal(read(output, 'diagnostics.json').status, 'failed');
  assert.doesNotMatch(result.stdout, /Exported/);
});

test('unsupported source types fail extraction and lossy generator conversions are blocked', (t) => {
  const { project, story } = buttonProject(t);
  fs.writeFileSync(story, fs.readFileSync(story, 'utf8').replace('label: string;', 'label: { text: string };'));
  const output = path.join(project, 'unsupported-type');
  const result = command(project, output, ['MaterialButton']);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /unsupported type/);
  assert.equal(fs.existsSync(path.join(output, 'catalog.json')), false);
  for (const schema of [{ type: 'object' }, { type: 'number', enum: [1, 2] }, { type: 'string', const: 'exact' }, { type: 'string', minLength: 3 }])
    assert.throws(() => assertV1Convertible([{ name: 'Example', fields: [{ name: 'field', schema }] }]), /unsupported v1.0 source schema/);
});

test('validation rejects malformed catalogs and protocol flags reject unsupported versions', () => {
  assert.throws(() => validateV1Export({ protocolVersion: '1.0' }), /catalog validation failed/);
  assert.equal(parseArguments(['--protocol', '1.0']).protocol, '1.0');
  assert.throws(() => parseArguments(['--protocol', '2.0']), /Protocol must be/);
  assert.throws(() => parseArguments(['--protocol']), /requires a value/);
});
