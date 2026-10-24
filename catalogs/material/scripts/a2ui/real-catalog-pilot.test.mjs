import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import { discoverProject } from './discovery.mjs';
import { createAngularCatalogExtractor } from './angular-catalog.mjs';
import { createReactCatalogExtractor } from './react-integration.mjs';
import { createReactSourceAudit } from './react-source-audit.mjs';
import { exportSelection } from './bundle.mjs';

const root = fileURLToPath(new URL('../..', import.meta.url));
const evidence = 'examples/real-catalog-pilot/evidence';
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const manifest = read(`${evidence}/components.json`);
const discovery = discoverProject(root, { indexes: [{ framework: 'react', file: `${evidence}/index.json` }] });
const extract = createReactCatalogExtractor(root, `${evidence}/components.json`);
const candidate = (title) => discovery.candidates.find((item) => item.title === title);
function rejection(fn) {
  try { fn(); assert.fail('Expected source contract rejection'); }
  catch (error) { assert.ok(error.details?.length, error.message); return error.details; }
}
function temporary(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'a2ui-real-pilot-'));
  t.after(() => {
    assert.ok(path.resolve(directory).startsWith(path.resolve(os.tmpdir()) + path.sep));
    fs.rmSync(directory, { recursive: true, force: true });
  });
  return directory;
}

test('pilot evidence comes from six official indexed stories and unchanged existing library source', () => {
  assert.equal(discovery.candidates.length, 6);
  for (const file of read(`${evidence}/capture.json`).sourceFiles)
    assert.equal(createHash('sha256').update(fs.readFileSync(path.join(root, file.path))).digest('hex'), file.sha256);
  assert.deepEqual(Object.keys(manifest.components['pilot-badge'].reactDocgenTypescript.props), ['variant', 'render']);
  assert.equal(manifest.components['pilot-progress'].reactDocgenTypescript.props.children, undefined);
  assert.deepEqual(manifest.components['pilot-separator'].reactDocgenTypescript.props.orientation.type.value,
    [{ value: '"horizontal"' }, { value: '"vertical"' }]);
});

test('real Shadcn ComponentDemo state selectors never become underlying component contracts', () => {
  for (const name of ['Separator', 'Badge', 'Progress']) {
    const issues = rejection(() => extract(candidate(`Shadcn/${name}`)));
    assert.ok(issues.some((item) => item.code === 'MISSING_META_COMPONENT'));
  }
});

test('real Material Input, Tooltip and Card template args never become underlying contracts', () => {
  const angular = discoverProject(root, { indexes: [{ framework: 'angular', file: `${evidence}/angular-candidates-index.json` }] });
  const selected = angular.candidates.filter((item) => ['Material/Input', 'Material/Tooltip', 'Material/Card'].includes(item.title));
  assert.equal(selected.length, 3);
  const extractAngular = createAngularCatalogExtractor(root, selected);
  for (const item of selected) assert.throws(() => extractAngular(item), /Missing resolvable meta.component/);
});

test('direct real Shadcn contracts report omitted inherited props and unsupported composition', () => {
  for (const [name, omitted] of [['Separator', 'onClick'], ['Badge', 'children'], ['Progress', 'children']]) {
    const issues = rejection(() => extract(candidate(`Pilot/${name}`)));
    assert.ok(!issues.some((item) => item.code === 'REACT_SOURCE_AUDIT_UNAVAILABLE'), JSON.stringify(issues));
    assert.ok(issues.some((item) => item.code === 'REACT_DOCGEN_PROP_OMITTED' && item.property === omitted));
    assert.ok(issues.some((item) => item.code === 'REACT_REVIEWED_MAPPING_REQUIRED' && item.property === 'render'));
  }
});

test('a scalar-only partial manifest cannot turn real Separator into a successful catalog', (t) => {
  const changed = structuredClone(manifest);
  const entry = changed.components['pilot-separator'];
  entry.reactDocgenTypescript.props = { orientation: entry.reactDocgenTypescript.props.orientation };
  const file = path.join(temporary(t), 'manifest.json');
  fs.writeFileSync(file, JSON.stringify(changed));
  const issues = rejection(() => createReactCatalogExtractor(root, file)(candidate('Pilot/Separator')));
  assert.ok(issues.some((item) => item.code === 'REACT_DOCGEN_PROP_OMITTED' && item.property === 'render'));
});

test('a misleading success manifest cannot promote a real state wrapper without meta.component', (t) => {
  const changed = structuredClone(manifest);
  const entry = changed.components['shadcn-separator'];
  delete entry.error;
  entry.reactDocgenTypescript = structuredClone(changed.components['pilot-separator'].reactDocgenTypescript);
  entry.reactDocgenTypescript.props = { state: { type: { name: 'string' }, required: false } };
  const file = path.join(temporary(t), 'manifest.json');
  fs.writeFileSync(file, JSON.stringify(changed));
  assert.ok(rejection(() => createReactCatalogExtractor(root, file)(candidate('Shadcn/Separator')))
    .some((item) => item.code === 'MISSING_META_COMPONENT'));
});

test('real unsupported selection writes diagnostics and never a partial catalog', (t) => {
  const output = path.join(temporary(t), 'export');
  assert.throws(() => exportSelection({ projectRoot: root, candidates: [candidate('Pilot/Progress')],
    protocol: '1.0', outputs: ['json'], catalogOnly: true, diagnostics: true, reactManifest: `${evidence}/components.json`, discovery, output }), /requires|mapping|omitted/i);
  assert.equal(fs.existsSync(path.join(output, 'catalog.json')), false);
  assert.deepEqual(fs.readdirSync(output), ['diagnostics.json']);
  const diagnostic = JSON.parse(fs.readFileSync(path.join(output, 'diagnostics.json')));
  assert.ok(diagnostic.issues[0].details.some((item) => item.code === 'REACT_DOCGEN_PROP_OMITTED' && item.property === 'children'));
});

// Small unit source solely tests audit invariants; never counted as a pilot success.
test('TypeScript audit accepts complete props and rejects stale requiredness, identity and fabricated props', (t) => {
  const directory = temporary(t);
  fs.writeFileSync(path.join(directory, 'source.ts'), 'export function Notice(props: { label: string; count?: number }) { return props.label; }\n');
  fs.writeFileSync(path.join(directory, 'notice.stories.ts'), "import { Notice } from './source'; export default { component: Notice };\n");
  const audit = createReactSourceAudit(directory, [{ path: 'notice.stories.ts' }]);
  const item = { id: 'unit', storyPath: 'notice.stories.ts' };
  const normalized = { name: 'Notice', source: 'source.ts', exportName: 'Notice' };
  const props = { label: { required: true }, count: { required: false } };
  assert.deepEqual(audit(item, normalized, { props }), []);
  assert.ok(audit(item, normalized, { props: { ...props, label: { required: false } } })
    .some((issue) => issue.code === 'REACT_SOURCE_REQUIREDNESS_MISMATCH'));
  assert.ok(audit(item, normalized, { props: { ...props, invented: { required: false } } })
    .some((issue) => issue.code === 'REACT_DOCGEN_PROP_NOT_IN_SOURCE'));
  assert.ok(audit(item, { ...normalized, exportName: 'Wrong' }, { props })
    .some((issue) => issue.code === 'REACT_SOURCE_AUDIT_UNAVAILABLE'));
});
