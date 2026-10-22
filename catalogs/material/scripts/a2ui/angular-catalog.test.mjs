import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { createAngularCatalogExtractor } from './angular-catalog.mjs';
import { extract } from './metadata.mjs';
import { discoverProject, selectCandidates } from './discovery.mjs';
import { assessV1Readiness, assertV1Convertible, exportV1Selection, validateV1Export } from './integration-v1.mjs';
import { makeCatalogV1 } from './catalog-v1.mjs';
import { createComponentInstanceValidator } from './validate-catalog-v1.mjs';

const root = fileURLToPath(new URL('../..', import.meta.url));
const fixture = path.join(root, 'scripts/a2ui/fixtures/angular-catalog');
const sourceText = fs.readFileSync(path.join(fixture, 'src/status-note.component.ts'), 'utf8');
const discover = (project) => discoverProject(project, { indexes: [{ framework: 'angular', file: 'index.json' }] });
const discovery = discover(fixture);
const candidate = selectCandidates(discovery, ['angular:src/status-note.stories.ts'])[0];

function temporary(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'angular-catalog-'));
  t.after(() => {
    assert.ok(path.resolve(directory).startsWith(path.resolve(os.tmpdir()) + path.sep));
    fs.rmSync(directory, { recursive: true, force: true });
  });
  return directory;
}

function copyFixture(t) {
  const directory = temporary(t);
  fs.cpSync(fixture, directory, { recursive: true });
  return directory;
}

function metadata(project = fixture) {
  const candidates = discover(project).candidates;
  return createAngularCatalogExtractor(project, candidates)(candidates[0]);
}

test('official fixture index discovers unregistered class with real story identities and no invented exports', () => {
  assert.equal(candidate.registrationName, null);
  assert.equal(fs.existsSync(path.join(fixture, 'a2ui/registrations.json')), false);
  assert.deepEqual(candidate.variants, ['Formatted', 'Numeric']);
  assert.equal(candidate.discovery.stories[0].name, 'Preformatted value');
  const component = metadata();
  assert.equal(component.name, 'StatusNoteComponent');
  assert.equal(component.identity, 'src/status-note.component.ts#StatusNoteComponent');
  assert.deepEqual(component.storyIds, candidate.storyIds);
  const fields = Object.fromEntries(component.fields.map((field) => [field.name, field]));
  assert.equal(fields.label.required, true);
  assert.equal(fields.label.schema.default, 'Status');
  assert.equal(fields.label.schema.description, 'Accessible label for the reported value.');
  assert.equal(fields.value.required, true);
  assert.deepEqual(new Set(fields.value.schema.type), new Set(['number', 'string']));
  assert.equal('default' in fields.value.schema, false);
  assert.equal(fields.tone.schema.default, 'quiet');
  assert.deepEqual(new Set(fields.tone.schema.enum), new Set(['quiet', 'highlight']));
  assert.equal(fields.visible.schema.default, true);
  assert.equal(fields.precision.schema.default, 2);
  assert.equal(fields.suffix.required, false);
  assert.equal('default' in fields.suffix.schema, false);
});

test('unregistered source transforms through existing generator and official validators with strict instance checks', () => {
  const component = metadata();
  assertV1Convertible([component]);
  const catalog = makeCatalogV1([component]);
  assert.equal(validateV1Export(catalog).valid, true);
  assert.deepEqual(catalog.components.StatusNoteComponent.required, ['component', 'label', 'value']);
  const validate = createComponentInstanceValidator(catalog);
  const valid = { component: 'StatusNoteComponent', label: 'Count', value: 7 };
  for (const value of [7, 'seven', { '@path': '/count' }]) assert.equal(validate({ ...valid, value }).valid, true);
  for (const invalid of [
    { component: 'StatusNoteComponent', value: 7 },
    { ...valid, value: false }, { ...valid, tone: 'invented' }, { ...valid, precision: 'two' },
    { ...valid, callback: 'invented' }, { ...valid, visible: null },
  ]) assert.equal(validate(invalid).valid, false, JSON.stringify(invalid));
});

test('real CLI exports fixture without registration, adapters or fixtures and preserves provenance', (t) => {
  const directory = temporary(t);
  const log = fs.openSync(path.join(directory, 'cli.log'), 'w');
  let result;
  try {
    result = spawnSync(process.execPath, [path.join(root, 'scripts/a2ui/cli.mjs'), 'export', '--project', fixture,
      '--protocol', '1.0', '--angular-index', 'index.json', '--components', candidate.id,
      '--outputs', 'json', '--out', path.join(directory, 'export')], {
      cwd: root, stdio: ['ignore', log, log], timeout: 120000, windowsHide: true,
    });
  } finally { fs.closeSync(log); }
  assert.ifError(result.error);
  assert.equal(result.status, 0, fs.readFileSync(path.join(directory, 'cli.log'), 'utf8'));
  const read = (file) => JSON.parse(fs.readFileSync(path.join(directory, 'export', file), 'utf8'));
  assert.equal(validateV1Export(read('catalog.json')).valid, true);
  assert.deepEqual(Object.keys(read('catalog.json').components), ['StatusNoteComponent']);
  assert.deepEqual(read('components.json')[0].discovery, candidate.discovery);
  assert.equal(read('components.json')[0].sourceIdentity, 'src/status-note.component.ts#StatusNoteComponent');
  assert.equal(read('diagnostics.json').renderer.available, false);
  assert.deepEqual(fs.readdirSync(path.join(directory, 'export')).sort(),
    ['catalog.json', 'components.json', 'diagnostics.json', 'provenance.json', 'validation.json']);
  exportV1Selection({ projectRoot: fixture, candidates: [{ ...candidate, fields: [{ name: 'fake' }] }],
    discovery, outputs: ['json'], output: path.join(directory, 'repeat') });
  assert.equal(fs.readFileSync(path.join(directory, 'export/catalog.json'), 'utf8'),
    fs.readFileSync(path.join(directory, 'repeat/catalog.json'), 'utf8'));
});

test('source edits, not story args or hardcoded schemas, determine exported contracts', (t) => {
  const project = copyFixture(t);
  fs.appendFileSync(path.join(project, 'src/status-note.stories.ts'), '\nthrow new Error("Story code must never execute during extraction");\n');
  fs.writeFileSync(path.join(project, 'src/status-note.component.ts'), sourceText
    .replace('Accessible label for the reported value.', 'Edited source documentation.')
    .replace("'compact' | 'comfortable'", "'compact' | 'comfortable' | 'spacious'")
    .replace('precision = 2', 'precision = 4'));
  const catalog = makeCatalogV1([metadata(project)]);
  const props = catalog.components.StatusNoteComponent.properties;
  assert.equal(props.label.description, 'Edited source documentation.');
  assert.deepEqual(props.density.enum, ['comfortable', 'compact', 'spacious']);
  assert.equal(props.precision.default, 4);
  assert.equal(fs.readFileSync(path.join(fixture, 'src/status-note.component.ts'), 'utf8'), sourceText);
});

test('catalog-only registered extraction needs no packaging files; legacy extraction still enforces them', (t) => {
  const project = temporary(t);
  const registrations = JSON.parse(fs.readFileSync(path.join(root, 'a2ui/registrations.json')));
  const registration = registrations.find((r) => r.name === 'MaterialButton');
  const { adapter, adapterFile, adapterOutput, fixturesFile, files, assets, ...catalogRegistration } = registration;
  fs.mkdirSync(path.dirname(path.join(project, registration.story)), { recursive: true });
  fs.copyFileSync(path.join(root, registration.story), path.join(project, registration.story));
  const index = JSON.parse(fs.readFileSync(path.join(root, 'storybook-static/index.json')));
  const components = extract(project, [catalogRegistration], index, { catalogOnly: true });
  assert.equal(validateV1Export(makeCatalogV1(components)).valid, true);
  assert.throws(() => extract(project, [catalogRegistration], index), /missing supported adapter mapping/);
});

test('unsupported semantics and lossy types diagnose instead of disappearing', (t) => {
  const project = copyFixture(t);
  const cases = [
    ["@Input() suffix?: string;", '@Input() suffix?: { text: string };', /unsupported type/],
    ["@Input() suffix?: string;", '@Input() suffix?: () => void;', /callback|unsupported type/i],
    ["@Input() suffix?: string;", '@Input() suffix?: number[];', /unsupported type/],
    ["@Input() suffix?: string;", '@Input() suffix?: any;', /unsupported type/],
    ["@Input() suffix?: string;", '@Input() suffix?: string | null;', /unsupported type/],
    ['@Input() precision = 2;', '@Input() precision: 1 | 2 = 2;', /unsupported v1.0 source schema/],
    ['@Input() precision = 2;', '@Input() precision = Math.random();', /unsupported metadata expression/],
    ['@Input() precision = 2;', '@Input() __proto__ = 2;', /cannot be preserved/],
    ['@Input() precision = 2;', '@Input({ alias: "digits" }) precision = 2;', /aliases\/transforms/],
    ['@Input() precision = 2;', '@Input() get precision(): number { return 2; }', /accessor/],
    ['export class StatusNoteComponent {', 'export class StatusNoteComponent extends Base {', /Inherited inputs/],
    ['export class StatusNoteComponent {', 'export class StatusNoteComponent { constructor() {}', /Constructor initialization/],
    ["template: '<p", "template: '<ng-content></ng-content><p", /Projected content/],
  ];
  for (const [before, after, expected] of cases) {
    fs.writeFileSync(path.join(project, 'src/status-note.component.ts'), sourceText.replace(before, after));
    assert.throws(() => assertV1Convertible([metadata(project)]), expected, after);
  }
  for (const [api, declaration, expected] of [
    ['Output, EventEmitter', '@Output() changed = new EventEmitter<string>();', /@Output/],
    ['input', 'extra = input.required<string>();', /Signal input/],
    ['output', 'extra = output<string>();', /Signal input/],
    ['model', 'extra = model(0);', /Signal input/],
  ]) {
    fs.writeFileSync(path.join(project, 'src/status-note.component.ts'), sourceText
      .replace('Component, Input', `Component, Input, ${api}`).replace('@Input() suffix?: string;', declaration));
    assert.throws(() => metadata(project), expected);
  }
  fs.writeFileSync(path.join(project, 'src/status-note.component.ts'), sourceText);
  const storyFile = path.join(project, 'src/status-note.stories.ts');
  const storyText = fs.readFileSync(storyFile, 'utf8');
  fs.writeFileSync(storyFile, storyText.replace('component: Note,', 'component: Note, component: Note,'));
  assert.throws(() => metadata(project), /Duplicate metadata keys/);
  fs.writeFileSync(storyFile, storyText.replace('export const Numeric:', 'export const Renamed:'));
  assert.throws(() => metadata(project), /Indexed exports are missing/);
});

test('actual Example outputs, Finance projection and complex chart inputs require review', () => {
  const actual = discoverProject(root, { indexes: [{ framework: 'angular', file: 'storybook-static/index.json' }] });
  const candidates = selectCandidates(actual, ['angular:src/stories/button.stories.ts',
    'angular:src/stories/finance/panel.stories.ts', 'angular:src/stories/finance/candlestick.stories.ts']);
  const extractAngular = createAngularCatalogExtractor(root, candidates);
  assert.throws(() => extractAngular(candidates[0]), /@Output/);
  assert.throws(() => extractAngular(candidates[1]), /Projected content/);
  assert.throws(() => extractAngular(candidates[2]), /unsupported type/);
});

test('readiness uses catalog extraction, reports unsupported candidates and blocks identity collisions', (t) => {
  const ready = assessV1Readiness(fixture, [candidate]);
  assert.deepEqual(ready, [{ id: candidate.id, ready: true, name: 'StatusNoteComponent' }]);
  assert.equal(candidate.outputSupport.rendererZip, false);
  const rejected = assessV1Readiness(fixture, [{ ...candidate, framework: 'react' }]);
  assert.equal(rejected[0].ready, false);
  assert.match(rejected[0].message, /React/);
  const duplicates = assessV1Readiness(fixture, [candidate, { ...candidate, id: 'another-csf-identity' }]);
  assert.ok(duplicates.every((item) => !item.ready && item.code === 'COMPONENT_IDENTITY_COLLISION'));
  const destination = path.join(temporary(t), 'collision');
  assert.throws(() => exportV1Selection({ projectRoot: fixture, candidates: [candidate, { ...candidate, id: 'other' }],
    outputs: ['json'], output: destination }), /identity collision/);
  assert.equal(fs.existsSync(path.join(destination, 'catalog.json')), false);
});
