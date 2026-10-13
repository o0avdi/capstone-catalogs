import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { createRequire } from 'node:module';
import { extract, discover, makeCatalog } from './metadata.mjs';
const require = createRequire(import.meta.url);
const Ajv2020 = require('../../a2ui-output/node_modules/ajv/dist/2020.js').default;
const root = process.cwd();
const registrations = JSON.parse(fs.readFileSync('a2ui/registrations.json'));
const index = JSON.parse(fs.readFileSync('storybook-static/index.json'));
const metadata = extract(root, registrations, index);
const catalog = makeCatalog(metadata);
const ajv = new Ajv2020({ strict: false, allErrors: true });
ajv.addSchema(catalog);
const validate = ajv.compile({ $ref: catalog.$id + '#/$defs/anyComponent' });
const metric = { id: 'root', component: 'FinanceMetricCard', label: 'Revenue', value: 42 };
const button = {
  id: 'root',
  component: 'MaterialButton',
  label: 'Save',
  disabled: false,
  appearance: 'filled',
  action: { event: { name: 'save' } },
};

test('discovery deduplicates and excludes docs and remote stories', () => {
  const entries = Object.values(index.entries).filter((e) =>
    e.importPath?.includes('metric-card.stories'),
  );
  const story = entries.find((e) => e.type === 'story');
  const altered = {
    entries: {
      a: story,
      b: { ...story },
      docs: { ...story, type: 'docs', id: 'docs' },
      remote: { ...story, refId: 'react', id: 'remote' },
    },
  };
  assert.deepEqual(discover(altered, [registrations[0]])[0].storyIds, [story.id]);
  assert.equal(metadata[0].storyIds.length, 8);
  assert.equal(metadata[1].storyIds.length, 4);
});
test('source contracts preserve requiredness, union types, enums and defaults', () => {
  const fields = metadata[0].fields;
  assert.equal(fields.find((f) => f.name === 'label').required, true);
  assert.equal(fields.find((f) => f.name === 'value').required, true);
  assert.deepEqual([...fields.find((f) => f.name === 'value').schema.type].sort(), [
    'number',
    'string',
  ]);
  assert.deepEqual([...fields.find((f) => f.name === 'format').schema.enum].sort(), [
    'compact',
    'currency',
    'number',
    'percent',
  ]);
  assert.equal(fields.find((f) => f.name === 'currency').schema.default, 'USD');
  assert.equal(fields.find((f) => f.name === 'value').schema.default, undefined);
  assert.equal(metadata[1].fields.find((f) => f.name === 'disabled').schema.default, undefined);
  assert.match(metadata[1].fields.find((f) => f.name === 'label').schema.description, /projected/);
  assert.equal(metadata[0].examples.find((e) => e.name === 'LargeValue').props.change, undefined);
  assert.equal(metadata[0].examples.find((e) => e.name === 'Neutral').props.icon, undefined);
});
test('Draft 2020-12 accepts literal, bound and all extracted examples', () => {
  for (const instance of [
    metric,
    { ...metric, value: '$42' },
    { ...metric, value: { path: '/revenue' } },
    button,
    { ...button, disabled: { path: '/disabled' } },
  ])
    assert.ok(validate(instance), JSON.stringify(validate.errors));
  for (const c of metadata)
    for (const example of c.examples)
      assert.ok(
        validate({
          id: 'root',
          component: c.name,
          ...example.props,
          ...(c.events ? { action: { event: { name: 'save' } } } : {}),
        }),
        JSON.stringify(validate.errors),
      );
  assert.equal(Object.keys(catalog).length, 8);
  assert.deepEqual(catalog.functions, {});
  assert.equal(catalog.$defs.anyFunction, false);
});
test('required, types, enums, internal refs and inherited unevaluated fields fail correctly', () => {
  const { label, ...missingLabel } = metric;
  const { value, ...missingValue } = metric;
  const { id, ...missingId } = metric;
  for (const instance of [
    missingLabel,
    missingValue,
    missingId,
    { ...metric, value: true },
    { ...metric, state: 'unknown' },
    { ...metric, unknown: 1 },
    { ...metric, value: { path: '/revenue', extra: 1 } },
    { ...button, appearance: 'unknown' },
    { ...button, disabled: 'yes' },
    { ...button, action: { functionCall: { call: 'unsupported' } } },
    { ...button, action: { event: { name: 'save', context: { bad: { path: '/x' } } } } },
  ])
    assert.equal(validate(instance), false, JSON.stringify(instance));
});
function changedFixture(change) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'a2ui-metadata-'));
  try {
    for (const file of [...registrations.flatMap((r) => [r.story, ...r.files])]) {
      const dest = path.join(tmp, file);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(path.join(root, file), dest);
    }
    change(tmp);
    return extract(tmp, registrations, index);
  } finally {
    if (!path.resolve(tmp).startsWith(path.resolve(os.tmpdir()) + path.sep))
      throw new Error('Unsafe test cleanup path');
    fs.rmSync(tmp, { recursive: true, force: true });
  }
}
test('real metadata edit regenerates description; source fixture remains unchanged', () => {
  const before = fs.readFileSync(registrations[0].story, 'utf8');
  const changed = changedFixture((tmp) => {
    const p = path.join(tmp, registrations[0].story);
    fs.writeFileSync(
      p,
      fs
        .readFileSync(p, 'utf8')
        .replace('Custom financial KPI composition', 'Changed KPI description'),
    );
  });
  assert.match(
    makeCatalog(changed).components.FinanceMetricCard.description,
    /Changed KPI description/,
  );
  assert.equal(fs.readFileSync(registrations[0].story, 'utf8'), before);
});
test('unsupported types, missing mappings, identity collisions, expressions and enum conflicts diagnose', () => {
  assert.throws(() => extract(root, [registrations[0], registrations[0]], index), /collision/);
  assert.throws(
    () => extract(root, [{ ...registrations[0], bindings: ['label'] }], index),
    /missing binding/,
  );
  assert.throws(
    () => extract(root, [{ ...registrations[0], files: [registrations[0].source] }], index),
    /missing local source dependency/,
  );
  assert.throws(
    () => extract(root, [{ ...registrations[0], adapter: 'MissingAdapter' }], index),
    /adapter mapping/,
  );
  assert.throws(
    () =>
      changedFixture((tmp) => {
        const p = path.join(tmp, registrations[0].source);
        fs.writeFileSync(
          p,
          fs.readFileSync(p, 'utf8').replace('value: number | string', 'value: Date'),
        );
      }),
    /unsupported type/,
  );
  assert.throws(
    () =>
      changedFixture((tmp) => {
        const p = path.join(tmp, registrations[1].story);
        fs.writeFileSync(
          p,
          fs.readFileSync(p, 'utf8').replace("options: ['text',", "options: ['bogus',"),
        );
      }),
    /conflict/,
  );
  assert.throws(
    () =>
      changedFixture((tmp) => {
        const p = path.join(tmp, registrations[1].story);
        fs.writeFileSync(
          p,
          fs.readFileSync(p, 'utf8').replace("label: 'Save changes'", 'label: getLabel()'),
        );
      }),
    /unsupported metadata expression/,
  );
});
test('same extracted metadata produces stable serialized catalog', () => {
  assert.equal(
    JSON.stringify(makeCatalog(extract(root, registrations, index))),
    JSON.stringify(catalog),
  );
});

test('supported source enum edit regenerates catalog when story options agree', () => {
  const changed = changedFixture((tmp) => {
    const types = path.join(tmp, 'src/app/finance/finance.types.ts');
    fs.writeFileSync(
      types,
      fs
        .readFileSync(types, 'utf8')
        .replace(
          "'positive' | 'negative' | 'neutral'",
          "'positive' | 'negative' | 'neutral' | 'warning'",
        ),
    );
    const story = path.join(tmp, registrations[0].story);
    fs.writeFileSync(
      story,
      fs
        .readFileSync(story, 'utf8')
        .replace(
          "options: ['positive', 'negative', 'neutral']",
          "options: ['positive', 'negative', 'neutral', 'warning']",
        ),
    );
  });
  assert.ok(
    makeCatalog(
      changed,
    ).components.FinanceMetricCard.allOf[2].properties.state.anyOf[0].enum.includes('warning'),
  );
});
