import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  catalogV1Id,
  formatFieldPropertyV1,
  generateCatalogV1,
  makeCatalogV1,
  sortDeterministic,
} from './catalog-v1.mjs';
import {
  createCatalogValidator,
  createComponentInstanceValidator,
  loadOfficialSchemas,
  validateCatalogStructuralRules,
  validateRuntimeMappings,
  runValidationSuite,
} from './validate-catalog-v1.mjs';

const root = path.resolve(fileURLToPath(import.meta.url), '../../..');
const registrations = JSON.parse(fs.readFileSync(path.join(root, 'a2ui/registrations.json'), 'utf8'));
const index = JSON.parse(fs.readFileSync(path.join(root, 'storybook-static/index.json'), 'utf8'));
const { extract } = await import('./metadata.mjs');
const metadata = extract(root, registrations, index);
const catalog = makeCatalogV1(metadata);

test('official v1.0 meta-schema validates generated three-component catalog', () => {
  const validator = createCatalogValidator();
  const result = validator(catalog);

  assert.equal(result.valid, true, `Catalog failed official meta-schema: ${JSON.stringify(result.errors, null, 2)}`);
  assert.equal(catalog.protocolVersion, '1.0');
  assert.equal(catalog.catalogId, catalogV1Id);
  assert.equal(catalog.$id, catalogV1Id);
  assert.equal(catalog.$schema, 'https://json-schema.org/draft/2020-12/schema');
  assert.ok(catalog.instructions && catalog.instructions.length > 50);
  assert.deepEqual(Object.keys(catalog.components).sort(), [
    'FinanceMetricCard',
    'MaterialButton',
    'MaterialCheckbox',
  ]);
  assert.deepEqual(catalog.functions, {});
  assert.deepEqual(Object.keys(catalog.$defs).sort(), ['anyComponent', 'anyFunction']);
  assert.equal(catalog.$defs.anyFunction, false);
});

test('structural validator rejects illegal $defs, bad names, envelope leakage and missing discriminators', () => {
  const structuralCheck = validateCatalogStructuralRules(catalog);
  assert.equal(structuralCheck.valid, true, JSON.stringify(structuralCheck.errors));

  // 1. Disallowed extra helper in $defs
  const catalogWithExtraDef = {
    ...catalog,
    $defs: {
      ...catalog.$defs,
      common_types_DataBinding: { type: 'object' },
    },
  };
  const extraDefResult = validateCatalogStructuralRules(catalogWithExtraDef);
  assert.equal(extraDefResult.valid, false);
  assert.match(extraDefResult.errors[0], /disallowed helper key/);

  // 2. Missing discriminator in anyComponent
  const catalogMissingDiscriminator = {
    ...catalog,
    $defs: {
      ...catalog.$defs,
      anyComponent: {
        oneOf: catalog.$defs.anyComponent.oneOf,
      },
    },
  };
  const noDiscResult = validateCatalogStructuralRules(catalogMissingDiscriminator);
  assert.equal(noDiscResult.valid, false);
  assert.match(noDiscResult.errors[0], /discriminator/);

  // 3. Component named "Surface"
  assert.throws(
    () => makeCatalogV1([{ name: 'Surface', fields: [] }]),
    /reserved/,
  );

  // 4. Component name violating UAX #31
  assert.throws(
    () => makeCatalogV1([{ name: 'material-button', fields: [] }]),
    /UAX #31/,
  );

  // 5. Envelope property 'id' leaking into component definition
  const catalogWithIdLeak = JSON.parse(JSON.stringify(catalog));
  catalogWithIdLeak.components.MaterialButton.properties.id = { type: 'string' };
  const idLeakResult = validateCatalogStructuralRules(catalogWithIdLeak);
  assert.equal(idLeakResult.valid, false);
  assert.match(idLeakResult.errors[0], /envelope property 'id'/);

  // 6. Legacy allOf wrapping ComponentCommon
  const catalogWithAllOfLeak = JSON.parse(JSON.stringify(catalog));
  catalogWithAllOfLeak.components.MaterialButton.allOf = [
    { $ref: '#/$defs/ComponentCommon' },
  ];
  const allOfLeakResult = validateCatalogStructuralRules(catalogWithAllOfLeak);
  assert.equal(allOfLeakResult.valid, false);
  assert.match(allOfLeakResult.errors[0], /ComponentCommon/);
});

test('union types, enums, defaults and requiredness are strictly preserved', () => {
  const metricCard = catalog.components.FinanceMetricCard;
  const button = catalog.components.MaterialButton;
  const checkbox = catalog.components.MaterialCheckbox;

  // 1. Genuine requiredness
  assert.deepEqual(metricCard.required, ['component', 'label', 'value']);
  assert.deepEqual(button.required, ['component', 'label', 'action']);
  assert.deepEqual(checkbox.required, ['component', 'label', 'checked']);

  // 2. Union type preservation on FinanceMetricCard.value and change
  assert.ok(metricCard.properties.value.oneOf, 'value should use oneOf union');
  const valueTypes = metricCard.properties.value.oneOf.map((t) => t.type ?? t.$ref);
  assert.ok(valueTypes.includes('number'));
  assert.ok(valueTypes.includes('string'));
  assert.ok(valueTypes.includes('common_types.json#/$defs/DataBinding'));
  assert.ok(valueTypes.includes('common_types.json#/$defs/FunctionCall'));

  // 3. Enums preserved
  assert.deepEqual(metricCard.properties.format.enum, [
    'compact',
    'currency',
    'number',
    'percent',
  ]);
  assert.equal(metricCard.properties.format.default, 'currency');
  assert.deepEqual(button.properties.appearance.enum, [
    'elevated',
    'filled',
    'outlined',
    'text',
    'tonal',
  ]);

  // 4. Source defaults preserved (FinanceMetricCard has class initializers; MaterialButton has no source initializers)
  assert.equal(metricCard.properties.currency.default, 'USD');
  assert.equal(metricCard.properties.locale.default, 'en-US');
  assert.equal(metricCard.properties.state.default, 'neutral');
  assert.equal(button.properties.appearance.default, undefined);
  assert.equal(button.properties.disabled.default, undefined);

  // 5. Standard common_types references
  assert.equal(metricCard.properties.label.$ref, 'common_types.json#/$defs/DynamicString');
  assert.equal(button.properties.disabled.$ref, 'common_types.json#/$defs/DynamicBoolean');
  assert.equal(button.properties.action.$ref, 'common_types.json#/$defs/Action');
  assert.equal(checkbox.properties.checked.$ref, 'common_types.json#/$defs/DynamicBoolean');

  // 6. No legacy local $defs references in properties
  const catalogJson = JSON.stringify(catalog);
  assert.equal(catalogJson.includes('#/$defs/common_types'), false);
  assert.equal(catalogJson.includes('#/$defs/catalog_'), false);
});

test('representative component instances validate; invalid cases fail', () => {
  const validate = createComponentInstanceValidator(catalog);

  // Valid literals
  assert.equal(
    validate({ component: 'FinanceMetricCard', label: 'Revenue', value: 50000 }).valid,
    true,
  );
  assert.equal(
    validate({ component: 'FinanceMetricCard', label: 'Margin', value: '42%' }).valid,
    true,
  );
  assert.equal(
    validate({
      component: 'MaterialButton',
      label: 'Submit',
      appearance: 'filled',
      disabled: false,
      action: { event: { name: 'submit_event' } },
    }).valid,
    true,
  );
  assert.equal(
    validate({ component: 'MaterialCheckbox', label: 'Agree to terms', checked: true }).valid,
    true,
  );

  // Valid @path data bindings
  assert.equal(
    validate({
      component: 'FinanceMetricCard',
      label: { '@path': '/kpi/title' },
      value: { '@path': '/kpi/revenue' },
    }).valid,
    true,
  );
  assert.equal(
    validate({
      component: 'MaterialButton',
      label: { '@path': '/label' },
      disabled: { '@path': '/disabled' },
      action: {
        event: {
          name: 'click_action',
          context: { id: { '@path': '/selectedId' }, source: 'unit_test' },
        },
      },
    }).valid,
    true,
  );
  assert.equal(
    validate({
      component: 'MaterialCheckbox',
      label: 'Subscribe',
      checked: { '@path': '/user/subscribe' },
      action: { event: { name: 'checkbox_changed' } },
    }).valid,
    true,
  );

  // Negative: Missing required label in FinanceMetricCard
  assert.equal(
    validate({ component: 'FinanceMetricCard', value: 100 }).valid,
    false,
  );

  // Negative: Missing required value in FinanceMetricCard
  assert.equal(
    validate({ component: 'FinanceMetricCard', label: 'Revenue' }).valid,
    false,
  );

  // Negative: Invalid boolean value type in FinanceMetricCard
  assert.equal(
    validate({ component: 'FinanceMetricCard', label: 'Revenue', value: true }).valid,
    false,
  );

  // Negative: Legacy path binding {"path": "/x"} rejected in place of {"@path": "/x"}
  assert.equal(
    validate({
      component: 'FinanceMetricCard',
      label: 'Revenue',
      value: { path: '/revenue' },
    }).valid,
    false,
  );

  // Negative: Missing required action in MaterialButton
  assert.equal(
    validate({ component: 'MaterialButton', label: 'Click' }).valid,
    false,
  );

  // Negative: Missing required checked in MaterialCheckbox
  assert.equal(
    validate({ component: 'MaterialCheckbox', label: 'Check me' }).valid,
    false,
  );

  // Negative: Disallowed extra property under additionalProperties: false
  assert.equal(
    validate({
      component: 'MaterialButton',
      label: 'Button',
      action: { event: { name: 'click' } },
      unknownField: 'illegal',
    }).valid,
    false,
  );

  // Negative: Unknown component discriminator
  assert.equal(
    validate({ component: 'UnknownComponent', label: 'Bad' }).valid,
    false,
  );
});

test('repeated generation produces byte-for-byte deterministic JSON', () => {
  const first = JSON.stringify(makeCatalogV1(metadata), null, 2);
  const second = JSON.stringify(makeCatalogV1(metadata), null, 2);
  const third = JSON.stringify(generateCatalogV1(root), null, 2);

  assert.equal(first, second, 'In-memory repeated generation must be identical');
  assert.equal(first, third, 'generateCatalogV1 must match makeCatalogV1');

  // Verify key order determinism
  const parsed = JSON.parse(first);
  const rootKeys = Object.keys(parsed);
  assert.deepEqual(rootKeys, [
    '$defs',
    '$id',
    '$schema',
    'catalogId',
    'components',
    'description',
    'functions',
    'instructions',
    'protocolVersion',
    'title',
  ].sort());
});

test('runtime mapping validation separates adapter checks from schema errors', () => {
  const result = validateRuntimeMappings(metadata, registrations, root);
  assert.equal(result.valid, true, `Runtime mapping issues: ${result.issues.join(', ')}`);
  assert.ok(result.warnings.length > 0, 'Should detect known compodoc story control warnings');
  assert.match(result.warnings[0], /numeric story control does not narrow/);

  // Test detection of broken adapter
  const brokenRegistrations = [
    {
      ...registrations[0],
      adapterFile: 'non/existent/adapter.ts',
    },
  ];
  const brokenResult = validateRuntimeMappings(metadata, brokenRegistrations, root);
  assert.equal(brokenResult.valid, false);
  assert.match(brokenResult.issues[0], /Adapter file not found/);
});

test('full validation suite execution passes cleanly', () => {
  const suite = runValidationSuite(catalog, metadata, registrations, root);
  assert.equal(suite.schemaResult.valid, true);
  assert.equal(suite.structuralResult.valid, true);
  assert.equal(suite.instancesPassed, suite.instancesTotal);
  assert.equal(suite.runtimeResults.valid, true);
  assert.equal(suite.allPassed, true);
});
