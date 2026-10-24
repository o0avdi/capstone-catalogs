import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';
import ts from 'typescript';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { discoverProject } from './discovery.mjs';
import { createReactCatalogExtractor } from './react-integration.mjs';
import { createReactSourceAudit } from './react-source-audit.mjs';
import { normalizeReactComponentManifest } from './react-manifest.mjs';
import { readReviewedSurfaces } from './reviewed-surface.mjs';
import { exportSelection } from './bundle.mjs';
import { assessV1Readiness, validateV1Export } from './integration-v1.mjs';
import { createComponentInstanceValidator } from './validate-catalog-v1.mjs';
import { parseArguments } from './cli.mjs';

const root = fileURLToPath(new URL('../..', import.meta.url));
const evidence = 'examples/real-catalog-pilot/evidence';
const configPath = 'examples/reviewed-export-surfaces/separator.surface.json';
const read = (file) => JSON.parse(fs.readFileSync(path.resolve(root, file), 'utf8'));
const manifest = read(`${evidence}/components.json`);
const config = read(configPath);
const discovery = discoverProject(root, { indexes: [{ framework: 'react', file: `${evidence}/index.json` }] });
const candidate = discovery.candidates.find((item) => item.title === 'Pilot/Separator');
const surface = config.components[candidate.id];
const audit = createReactSourceAudit(root, Object.values(manifest.components));
const normalized = normalizeReactComponentManifest(manifest.components['pilot-separator']);
const docgen = manifest.components['pilot-separator'].reactDocgenTypescript;
const codes = (issues) => issues.map((issue) => issue.code);
function temporary(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'a2ui-reviewed-surface-'));
  t.after(() => {
    assert.ok(path.resolve(directory).startsWith(path.resolve(os.tmpdir()) + path.sep));
    fs.rmSync(directory, { recursive: true, force: true });
  });
  return directory;
}
function writeConfig(t, value) {
  const file = path.join(temporary(t), 'surface.json');
  fs.writeFileSync(file, JSON.stringify(value));
  return file;
}

test('surface opt-in is explicit, v1-only and never supplies handwritten schemas/actions', (t) => {
  assert.equal(parseArguments(['export', '--catalog-only', '--reviewed-surfaces', configPath]).reviewedSurfaces, configPath);
  assert.throws(() => parseArguments(['--reviewed-surfaces', configPath]), /require/);
  assert.throws(() => parseArguments(['--catalog-only', '--reviewed-surfaces', 'a', '--reviewed-surfaces', 'b']), /once/);
  for (const mutate of [
    (c) => { c.components[candidate.id].schemas = { orientation: { type: 'string' } }; },
    (c) => { c.components[candidate.id].actions = { onClick: 'save' }; },
    (c) => { c.components[candidate.id].omit.onClick = ''; },
    (c) => { c.components[candidate.id].expose.push('orientation'); },
    (c) => { c.components[candidate.id].review.dependencies = ['slot']; },
    (c) => { c.components[candidate.id].review.usage = 'collection'; },
    (c) => { delete c.components[candidate.id].review; },
  ]) {
    const changed = structuredClone(config); mutate(changed);
    assert.throws(() => readReviewedSurfaces(root, writeConfig(t, changed)), /Reviewed surface/);
  }
});

test('actual Separator review records all source properties and all docgen omissions', () => {
  let facts;
  assert.deepEqual(audit(candidate, normalized, docgen, { surface, onEvidence: (value) => { facts = value; } }), []);
  assert.equal(facts.properties.length, 83);
  assert.equal(facts.properties.filter((prop) => !prop.docgenPresent).length, 75);
  assert.equal(Object.keys(surface.omit).length, 82);
  assert.equal(facts.evidenceSha256, surface.review.evidenceSha256);
  assert.ok(facts.properties.every((prop) => !prop.required));
  assert.ok(facts.sourceFiles.some((file) => file.path === 'package-lock.json'));
});

test('review evidence is independent of prior candidates and nested union encounter order', () => {
  const ordered = createReactSourceAudit(root, Object.values(manifest.components));
  for (const name of ['pilot-badge', 'pilot-progress']) {
    const entry = manifest.components[name];
    ordered({ id: `react:${entry.path.slice(2)}`, storyPath: entry.path.slice(2) }, normalizeReactComponentManifest(entry), entry.reactDocgenTypescript);
  }
  assert.deepEqual(ordered(candidate, normalized, docgen, { surface }), []);
});

test('review cannot hide unreviewed names, fake properties, or stale evidence', () => {
  const missing = structuredClone(surface); delete missing.omit.onClick;
  assert.ok(codes(audit(candidate, normalized, docgen, { surface: missing })).includes('REVIEWED_SURFACE_UNREVIEWED_OMISSION'));
  assert.ok(codes(audit(candidate, normalized, docgen, { surface: { ...surface, expose: ['onSave'] } }))
    .includes('REVIEWED_SURFACE_UNKNOWN_PROPERTY'));
  const stale = structuredClone(surface); stale.review.evidenceSha256 = '0'.repeat(64);
  assert.ok(codes(audit(candidate, normalized, docgen, { surface: stale })).includes('REVIEWED_SURFACE_STALE'));
});

test('reviewed source and manifest types, requiredness and literal defaults must agree', () => {
  for (const [mutate, expected] of [
    [(d) => { d.props.orientation.type.value.push({ value: '"diagonal"' }); }, 'REVIEWED_SURFACE_TYPE_CONFLICT'],
    [(d) => { d.props.orientation.defaultValue.value = 'vertical'; }, 'REVIEWED_SURFACE_DEFAULT_CONFLICT'],
    [(d) => { d.props.orientation.defaultValue = null; }, 'REVIEWED_SURFACE_DEFAULT_CONFLICT'],
    [(d) => { d.props.orientation.required = true; }, 'REACT_SOURCE_REQUIREDNESS_MISMATCH'],
    [(d) => { d.props.elementType.type = { name: 'number' }; }, 'REVIEWED_SURFACE_TYPE_CONFLICT'],
    [(d) => { d.props.onSave = { required: false, type: { name: 'string' } }; }, 'REACT_DOCGEN_PROP_NOT_IN_SOURCE'],
  ]) {
    const changed = structuredClone(docgen); mutate(changed);
    const entry = { ...manifest.components['pilot-separator'], reactDocgenTypescript: changed };
    const issues = audit(candidate, normalizeReactComponentManifest(entry), changed, { surface });
    assert.ok(codes(issues).includes(expected), JSON.stringify(issues));
    assert.ok(codes(issues).includes('REVIEWED_SURFACE_STALE'));
  }
});

test('exposing unsupported render/callback capabilities still needs a real mapping', () => {
  const changed = structuredClone(surface);
  changed.expose.push('render', 'onClick'); delete changed.omit.render; delete changed.omit.onClick;
  const issues = audit(candidate, normalized, docgen, { surface: changed });
  assert.ok(issues.some((issue) => issue.code === 'REVIEWED_SURFACE_UNSUPPORTED_PROPERTY' && issue.property === 'render'));
  assert.ok(issues.some((issue) => issue.code === 'REACT_DOCGEN_PROP_OMITTED' && issue.property === 'onClick'));
});

test('required properties cannot be omitted even when docgen omits them', (t) => {
  const directory = temporary(t);
  fs.writeFileSync(path.join(directory, 'source.ts'), "export function Notice({label, tone = 'plain'}: {label: string; tone?: 'plain' | 'loud'}) { return label + tone; }");
  fs.writeFileSync(path.join(directory, 'story.ts'), "import {Notice} from './source'; export default {component: Notice};");
  const inspect = createReactSourceAudit(directory, [{ path: 'story.ts' }]);
  const item = { id: 'react:story.ts', storyPath: 'story.ts' };
  const metadata = { name: 'Notice', source: 'source.ts', exportName: 'Notice', fields: [
    { name: 'tone', schema: { type: 'string', enum: ['plain', 'loud'], default: 'plain' } },
  ] };
  const props = { tone: { required: false } };
  const changed = { source: 'source.ts', exportName: 'Notice', expose: ['tone'], omit: { label: 'Cannot actually omit this required property.' },
    review: { evidenceSha256: '0'.repeat(64) } };
  const issues = inspect(item, metadata, { props }, { surface: changed });
  assert.ok(codes(issues).includes('REVIEWED_SURFACE_REQUIRED_OMISSION'));
});

test('scopes do not authorize wrapper stories, wrong source exports or orphan candidate IDs', (t) => {
  const changed = structuredClone(config);
  changed.components['react:missing.stories.tsx'] = surface;
  assert.throws(() => createReactCatalogExtractor(root, `${evidence}/components.json`, { reviewedSurfaces: writeConfig(t, changed) }), /no matching/);
  assert.ok(codes(audit(candidate, normalized, docgen, { surface: { ...surface, exportName: 'Wrong' } })).includes('REVIEWED_SURFACE_IDENTITY'));
  assert.ok(codes(audit(candidate, { ...normalized, exportName: 'Wrong' }, docgen, { surface })).includes('REACT_SOURCE_AUDIT_UNAVAILABLE'));
  const wrapper = discovery.candidates.find((item) => item.title === 'Shadcn/Separator');
  assert.throws(() => createReactCatalogExtractor(root, `${evidence}/components.json`, { reviewedSurfaces: configPath })(wrapper), /meta.component/);
});

test('reviewed mode preserves exact index/manifest story pairing', (t) => {
  const changed = structuredClone(manifest);
  changed.components['pilot-separator'].stories[0].id = 'fabricated--horizontal';
  const file = path.join(temporary(t), 'components.json');
  fs.writeFileSync(file, JSON.stringify(changed));
  assert.throws(() => createReactCatalogExtractor(root, file, { reviewedSurfaces: configPath })(candidate), /story IDs disagree/);
});

test('an unresolved source dependency cannot authorize a reviewed subset', (t) => {
  const directory = temporary(t);
  fs.writeFileSync(path.join(directory, 'source.ts'), "import type {Missing} from './missing'; export function Notice(props: {tone?: string} & Missing) { return ''; }");
  fs.writeFileSync(path.join(directory, 'story.ts'), "import {Notice} from './source'; export default {component: Notice};");
  const inspect = createReactSourceAudit(directory, [{ path: 'story.ts' }]);
  const issues = inspect({ id: 'react:story.ts', storyPath: 'story.ts' },
    { name: 'Notice', source: 'source.ts', exportName: 'Notice' }, { props: { tone: { required: false } } }, { surface });
  assert.ok(codes(issues).includes('REACT_SOURCE_AUDIT_UNAVAILABLE'));
  assert.match(issues[0].message, /unresolved dependencies/);
});

test('real reviewed Separator exports through shared generation and official validators', (t) => {
  const output = path.join(temporary(t), 'catalog');
  const result = exportSelection({ projectRoot: root, candidates: [candidate], protocol: '1.0', outputs: ['json'],
    catalogOnly: true, diagnostics: true, reactManifest: `${evidence}/components.json`, reviewedSurfaces: configPath,
    discovery, output });
  assert.deepEqual(result.components, ['Separator']);
  const catalog = JSON.parse(fs.readFileSync(path.join(output, 'catalog.json')));
  assert.equal(validateV1Export(catalog).valid, true);
  assert.deepEqual(Object.keys(catalog.components.Separator.properties).sort(), ['component', 'orientation']);
  assert.match(catalog.components.Separator.description, /Reviewed A2UI subset, not a complete source API/);
  const validate = createComponentInstanceValidator(catalog);
  for (const orientation of ['horizontal', 'vertical']) assert.equal(validate({ component: 'Separator', orientation }).valid, true);
  assert.equal(validate({ component: 'Separator' }).valid, true);
  for (const instance of [
    { orientation: 'diagonal' }, { orientation: false }, { render: 'custom' }, { onClick: { name: 'save' } },
    { slot: 'menu' }, { className: 'override' }, { state: 'Horizontal' }, { orientation: { '@path': '/orientation' } },
  ]) assert.equal(validate({ component: 'Separator', ...instance }).valid, false, JSON.stringify(instance));
  // Existing enum generator emits a literal enum. Binding this property is not advertised.
  const details = JSON.parse(fs.readFileSync(path.join(output, 'components.json')))[0];
  assert.equal(details.contractScope, 'reviewed-subset');
  assert.equal(Object.keys(details.reviewedSurface.omit).length, 82);
  assert.equal(details.reviewedSurface.sourceEvidence.properties.filter((prop) => !prop.docgenPresent).length, 75);
});

test('reviewed readiness is distinct and strict mode still rejects the same real component', () => {
  const options = { reactManifest: `${evidence}/components.json`, reviewedSurfaces: configPath };
  const [scoped] = assessV1Readiness(root, [candidate], options);
  assert.equal(scoped.ready, true); assert.equal(scoped.contractScope, 'reviewed-subset');
  assert.deepEqual(scoped.exposed, ['orientation']);
  assert.throws(() => createReactCatalogExtractor(root, options.reactManifest)(candidate), /omitted|mapping/);
});

test('failed reviewed selection preserves omission audits and writes no partial catalog', (t) => {
  const changed = structuredClone(config); delete changed.components[candidate.id].omit.onClick;
  const output = path.join(temporary(t), 'failed');
  assert.throws(() => exportSelection({ projectRoot: root, candidates: [candidate], protocol: '1.0', outputs: ['json'],
    catalogOnly: true, diagnostics: true, reactManifest: `${evidence}/components.json`, reviewedSurfaces: writeConfig(t, changed),
    discovery, output }), /explicit reason/);
  assert.deepEqual(fs.readdirSync(output), ['diagnostics.json']);
});

test('unchanged actual Separator renders horizontal, vertical and source default without omitted capabilities', async () => {
  const source = fs.readFileSync(path.join(root, surface.source), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, jsx: ts.JsxEmit.ReactJSX,
    target: ts.ScriptTarget.ES2022 } }).outputText.replace(/from "([^"]+)"/g, (_match, specifier) => `from ${JSON.stringify(import.meta.resolve(specifier))}`);
  const { Separator } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
  for (const [props, tag] of [[{}, 'hr'], [{ orientation: 'horizontal' }, 'hr'], [{ orientation: 'vertical' }, 'div']]) {
    const html = renderToStaticMarkup(React.createElement(Separator, props));
    assert.match(html, new RegExp(`^<${tag}\\b`));
    assert.match(html, /data-slot="separator"/);
    assert.match(html, /bg-border/);
    if (tag === 'div') { assert.match(html, /role="separator"/); assert.match(html, /aria-orientation="vertical"/); }
  }
});
