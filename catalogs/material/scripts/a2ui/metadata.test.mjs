import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import Ajv2020 from 'ajv/dist/2020.js';
import { extract, discover, makeCatalog } from './metadata.mjs';
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
    for (const file of [...registrations.flatMap((r) => [r.story,r.adapterFile,r.fixturesFile,...r.files])]) {
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
    () => extract(root, [{ ...registrations[0], adapterFile: 'a2ui/components/missing/adapter.ts' }], index),
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

const checkbox={id:'root',component:'MaterialCheckbox',label:'Archive',checked:false,disabled:false,action:{event:{name:'checkedChange'}}};
test('Checkbox extracts booleans and explicitly maps the Storybook callback',()=>{
 const c=metadata.find(c=>c.name==='MaterialCheckbox');assert.equal(c.storyIds.length,4);
 assert.deepEqual(c.fields.map(f=>[f.name,f.schema.type]),[['label','string'],['checked','boolean'],['disabled','boolean']]);
 assert.equal(c.callbacks[0].name,'onCheckedChange');assert.equal(c.callbacks[0].modelUpdate,'host');
 assert.deepEqual(c.callbacks[0].payload,{checked:'$event.checked'});
 assert.ok(c.examples.every(e=>!('onCheckedChange' in e.props)));
 for(const instance of [checkbox,{...checkbox,checked:true},{...checkbox,checked:{path:'/includeArchived'}}])assert.ok(validate(instance),JSON.stringify(validate.errors));
 for(const instance of [{...checkbox,checked:'true'},{...checkbox,checked:1},{...checkbox,disabled:0},{...checkbox,checked:undefined},{...checkbox,onCheckedChange:'fn()'}])assert.equal(validate(instance),false,JSON.stringify(instance));
});
test('unmapped callbacks, incompatible signatures and callback expressions are diagnosed',()=>{
 const registration=registrations.find(r=>r.name==='MaterialCheckbox');
 assert.throws(()=>extract(root,[{...registration,callbacks:{}}],index),/onCheckedChange.*unsupported metadata expression/);
 assert.throws(()=>changedFixture(tmp=>{const p=path.join(tmp,registration.story);fs.writeFileSync(p,fs.readFileSync(p,'utf8').replace('onCheckedChange: fn()','onCheckedChange: () => {}'));}),/unsupported callback expression/);
 assert.throws(()=>changedFixture(tmp=>{const p=path.join(tmp,registration.story);fs.writeFileSync(p,fs.readFileSync(p,'utf8').replace('(checked: boolean) => void','(checked: string) => void'));}),/callback signature conflicts/);
});
test('historical Checkbox proof is intact and registration extends schemas, fixtures and adapters',async()=>{
 const {contracts,registrationSource,componentFixtures}=await import('./component-files.mjs');
 const proof=JSON.parse(fs.readFileSync('../../docs/evidence/registration-workflow-proof.json'));
 for(const [file,before] of Object.entries(proof.beforeAddingCheckbox)){
  assert.equal(proof.afterAddingCheckbox[file],before,file+' historical before/after');
  assert.match(before,/^[a-f0-9]{64}$/,file+' historical SHA-256');
 }
 const subset=metadata.filter(c=>c.name!=='MaterialCheckbox');assert.equal(makeCatalog(subset).components.MaterialCheckbox,undefined);
 const added=componentFixtures(root,metadata);const original=componentFixtures(root,subset);
 assert.ok(added.fixtures.checkboxBound);assert.equal(original.fixtures.checkboxBound,undefined);
 assert.match(contracts(metadata),/CheckboxAdapterApi/);assert.doesNotMatch(contracts(subset),/CheckboxAdapterApi/);
 assert.match(registrationSource(metadata),/adapters\/checkbox/);
});
