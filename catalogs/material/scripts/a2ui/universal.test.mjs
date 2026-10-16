import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';
import { exportSelection } from './bundle.mjs';
import { parseArguments } from './cli.mjs';
import { discoverProject, selectCandidates } from './discovery.mjs';
import { makeMessages, makeUniversalCatalog } from './universal-json.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const discovery = discoverProject(root);

test('static discovery finds Angular and TSX stories without a Storybook build', () => {
  assert.ok(discovery.summary.angular >= 40);
  assert.ok(discovery.summary.react >= 60);
  assert.equal(discovery.candidates.length, new Set(discovery.candidates.map((item) => item.id)).size);
  const materialButton = discovery.candidates.find((item) => item.registrationName === 'MaterialButton');
  assert.equal(materialButton.status, 'portable');
  assert.equal(materialButton.outputSupport.rendererZip, true);
  assert.deepEqual(materialButton.variants, ['Disabled', 'Filled', 'LongLabel', 'Outlined']);
  const shadcnButton = discovery.candidates.find((item) => item.componentName === 'ShadcnButton');
  assert.equal(shadcnButton.framework, 'react');
  assert.equal(shadcnButton.status, 'custom');
  assert.equal(shadcnButton.sourceFiles[0], 'src/shadcn/components/ui/button.tsx');
  assert.deepEqual(shadcnButton.fields.find((field) => field.name === 'state').schema.enum, [
    'Basic',
    'Variants',
    'Disabled',
    'Loading',
  ]);
  const unregisteredMaterial = discovery.candidates.find(
    (item) => item.library === 'angular-material' && item.registrationName === null,
  );
  assert.equal(unregisteredMaterial.status, 'needs-configuration');
  assert.equal(unregisteredMaterial.outputSupport.rendererZip, false);
});

test('selectors accept canonical component names and reject unknown values', () => {
  assert.deepEqual(
    selectCandidates(discovery, ['ShadcnButton', 'MaterialButton']).map((item) => item.componentName),
    ['ShadcnButton', 'MaterialButton'],
  );
  assert.throws(() => selectCandidates(discovery, ['NotAComponent']), /Unknown component/);
});

test('universal catalog and example messages cover mixed frameworks', () => {
  const selected = selectCandidates(discovery, ['ShadcnButton', 'MaterialButton']);
  const catalog = makeUniversalCatalog(selected);
  const messages = makeMessages(selected);
  assert.deepEqual(Object.keys(catalog.components).sort(), ['MaterialButton', 'ShadcnButton']);
  assert.equal(messages.ShadcnButton[1].updateComponents.components[0].state, 'Basic');
  assert.equal(messages.MaterialButton[1].updateComponents.components[0].label, 'Save changes');
  const ajv = new Ajv2020({ strict: false, allErrors: true });
  ajv.addSchema(catalog);
  const validate = ajv.compile({ $ref: catalog.$id + '#/$defs/anyComponent' });
  for (const componentMessages of Object.values(messages))
    for (const message of componentMessages)
      for (const component of message.updateComponents?.components ?? [])
        assert.equal(validate(component), true, ajv.errorsText(validate.errors));
});

test('CLI flags parse deterministic component and output selections', () => {
  assert.deepEqual(
    parseArguments([
      'export',
      '/project',
      '--components',
      'ShadcnButton,MaterialButton',
      '--outputs',
      'json,zip',
      '--out',
      '/output',
    ]),
    {
      command: 'export',
      project: '/project',
      components: ['ShadcnButton', 'MaterialButton'],
      outputs: ['json', 'zip'],
      out: '/output',
    },
  );
  assert.throws(() => parseArguments(['--wat']), /Unknown option/);
});

test('JSON-only export writes selected loose artifacts and no ZIP', () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'a2ui-json-test-'));
  try {
    const out = path.join(temporary, 'output');
    const selected = selectCandidates(discovery, ['ShadcnButton']);
    const result = exportSelection({ projectRoot: root, candidates: selected, outputs: ['json'], output: out });
    assert.deepEqual(result.files, ['catalog.json', 'components.json', 'diagnostics.json', 'messages.json']);
    assert.equal(fs.existsSync(path.join(out, 'a2ui-export.zip')), false);
    assert.ok(JSON.parse(fs.readFileSync(path.join(out, 'catalog.json'))).components.ShadcnButton);
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test('Shadcn renderer ZIP is deterministic and includes source renderer inputs', () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'a2ui-zip-test-'));
  try {
    const selected = selectCandidates(discovery, ['ShadcnButton']);
    const first = path.join(temporary, 'first');
    const second = path.join(temporary, 'second');
    exportSelection({ projectRoot: root, candidates: selected, outputs: ['zip'], output: first });
    exportSelection({ projectRoot: root, candidates: selected, outputs: ['zip'], output: second });
    const firstZip = fs.readFileSync(path.join(first, 'a2ui-export.zip'));
    const secondZip = fs.readFileSync(path.join(second, 'a2ui-export.zip'));
    assert.ok(firstZip.length > 100_000);
    assert.deepEqual(firstZip, secondZip);
    assert.match(firstZip.toString('latin1'), /renderers\/react\/src\/main\.tsx/);
    assert.match(firstZip.toString('latin1'), /components\/ShadcnButton\/src\/shadcn\/components\/ui\/button\.tsx/);
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});

test('renderer ZIP refuses components without an adapter', () => {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'a2ui-refusal-test-'));
  try {
    const candidate = discovery.candidates.find(
      (item) => item.library === 'angular-material' && !item.outputSupport.rendererZip,
    );
    assert.throws(
      () =>
        exportSelection({
          projectRoot: root,
          candidates: [candidate],
          outputs: ['zip'],
          output: path.join(temporary, 'output'),
        }),
      /needs adapters/,
    );
  } finally {
    fs.rmSync(temporary, { recursive: true, force: true });
  }
});
