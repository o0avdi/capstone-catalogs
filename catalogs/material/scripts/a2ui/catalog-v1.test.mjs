import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  catalogV1Id,
  DEFAULT_REVIEWED_POLICIES,
  defaultInstructions,
  formatFieldPropertyV1,
  generateCatalogV1,
  generateInstructions,
  getRequiredProperties,
  makeCatalogV1,
  sortDeterministic,
} from './catalog-v1.mjs';
import {
  createCatalogValidator,
  createComponentInstanceValidator,
  loadOfficialSchemas,
  validateCatalogReferences,
  validateCatalogStructuralRules,
  validateRuntimeMappings,
  runValidationSuite,
} from './validate-catalog-v1.mjs';

const root = path.resolve(fileURLToPath(import.meta.url), '../../..');
const registrations = JSON.parse(fs.readFileSync(path.join(root, 'a2ui/registrations.json'), 'utf8'));

// Fresh-checkout resilient index resolution: loads storybook-static if present, otherwise committed fixture
const indexPath = path.join(root, 'storybook-static/index.json');
const fixturePath = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  'fixtures/storybook-index.fixture.json',
);
const index = fs.existsSync(indexPath)
  ? JSON.parse(fs.readFileSync(indexPath, 'utf8'))
  : JSON.parse(fs.readFileSync(fixturePath, 'utf8'));

const { extract } = await import('./metadata.mjs');
const metadata = extract(root, registrations, index);
const catalog = makeCatalogV1(metadata);

test('official v1.0 meta-schema validates generated three-component catalog', () => {
  const validator = createCatalogValidator();
  const result = validator(catalog);

  assert.equal(
    result.valid,
    true,
    `Catalog failed official meta-schema: ${JSON.stringify(result.errors, null, 2)}`,
  );
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

test('fresh-checkout reproducibility: generator and tests work without storybook-static artifact', () => {
  // 1. Explicit index fixture injection
  const injectedCatalog = generateCatalogV1(root, {
    registrations,
    index,
  });
  assert.equal(Object.keys(injectedCatalog.components).length, 3);
  assert.equal(injectedCatalog.protocolVersion, '1.0');

  // 2. Fallback to committed fixture when storybook-static is explicitly absent
  const fallbackCatalog = generateCatalogV1(root, {
    indexPath: path.join(root, 'non-existent-storybook-dir/index.json'),
  });
  assert.deepEqual(fallbackCatalog, injectedCatalog);

  // 3. Ensure no machine-specific Windows paths leaked into catalog output
  const serialized = JSON.stringify(injectedCatalog);
  assert.equal(/C:[\\\/]/i.test(serialized), false, 'Catalog must not contain machine-specific Windows paths');
  assert.equal(/\\\\/.test(serialized), false, 'Catalog must not contain escaped backslashes');
});

test('contract hardening: getRequiredProperties eliminates hardcoded branches and respects source/policy', () => {
  // 1. FinanceMetricCard derives requiredness purely from extracted source (@Input({ required: true }))
  // without relying on a hardcoded component-name branch
  const metricMeta = metadata.find((m) => m.name === 'FinanceMetricCard');
  const metricRequired = getRequiredProperties(metricMeta);
  assert.deepEqual(metricRequired, ['component', 'label', 'value']);

  // 2. Source requiredness is preserved even when the schema defines a default value
  // A JSON Schema default does NOT make a property optional.
  const dynamicComponentWithDefaults = {
    name: 'DynamicKPIWidget',
    fields: [
      { name: 'title', required: true, schema: { type: 'string', default: 'Default Title' } },
      { name: 'score', required: true, schema: { type: 'number', default: 0 } },
      { name: 'notes', required: false, schema: { type: 'string', default: '' } },
    ],
  };
  const dynamicRequired = getRequiredProperties(dynamicComponentWithDefaults);
  assert.deepEqual(dynamicRequired, ['component', 'title', 'score']);

  // 3. MaterialButton and MaterialCheckbox use explicit reviewed registration policies
  const buttonMeta = metadata.find((m) => m.name === 'MaterialButton');
  const buttonRequired = getRequiredProperties(buttonMeta);
  assert.deepEqual(buttonRequired, ['component', 'label', 'action']);

  const checkboxMeta = metadata.find((m) => m.name === 'MaterialCheckbox');
  const checkboxRequired = getRequiredProperties(checkboxMeta);
  assert.deepEqual(checkboxRequired, ['component', 'label', 'checked']);

  // 4. Any newly exported component can provide explicit required list or custom policy
  const customComponent = {
    name: 'CustomActionCard',
    required: ['component', 'headline', 'onPress'],
    fields: [
      { name: 'headline', required: false, schema: { type: 'string' } },
      { name: 'subtitle', required: false, schema: { type: 'string' } },
    ],
  };
  const customRequired = getRequiredProperties(customComponent);
  assert.deepEqual(customRequired, ['component', 'headline', 'onPress']);

  // 5. Options can override or supply reviewed policies dynamically
  const policyOverridden = getRequiredProperties(
    { name: 'MaterialButton', fields: [] },
    { reviewedPolicies: { MaterialButton: { required: ['component', 'label'] } } },
  );
  assert.deepEqual(policyOverridden, ['component', 'label']);
});

test('type safety: formatFieldPropertyV1 eliminates silent DynamicValue widening and preserves supported types', () => {
  // 1. Supported scalar types
  const stringProp = formatFieldPropertyV1({ name: 'title', schema: { type: 'string' } }, 'TestComp');
  assert.equal(stringProp.$ref, 'common_types.json#/$defs/DynamicString');

  const numberProp = formatFieldPropertyV1({ name: 'count', schema: { type: 'number' } }, 'TestComp');
  assert.equal(numberProp.$ref, 'common_types.json#/$defs/DynamicNumber');

  const booleanProp = formatFieldPropertyV1({ name: 'active', schema: { type: 'boolean' } }, 'TestComp');
  assert.equal(booleanProp.$ref, 'common_types.json#/$defs/DynamicBoolean');

  // 2. Supported scalar union (number | string)
  const unionProp = formatFieldPropertyV1(
    { name: 'amount', schema: { type: ['number', 'string'] } },
    'TestComp',
  );
  assert.ok(unionProp.oneOf, 'Must generate oneOf union');
  const unionRefs = unionProp.oneOf.map((t) => t.type ?? t.$ref);
  assert.deepEqual(unionRefs, [
    'number',
    'string',
    'common_types.json#/$defs/DataBinding',
    'common_types.json#/$defs/FunctionCall',
  ]);

  // 3. String enums sorted
  const enumProp = formatFieldPropertyV1(
    { name: 'variant', schema: { type: 'string', enum: ['secondary', 'primary', 'ghost'] } },
    'TestComp',
  );
  assert.deepEqual(enumProp.enum, ['ghost', 'primary', 'secondary']);

  // 4. Nullable supported scalars (e.g. string | null)
  const nullableStringProp = formatFieldPropertyV1(
    { name: 'notes', schema: { type: ['string', 'null'] } },
    'TestComp',
  );
  assert.ok(nullableStringProp.oneOf);
  const nullableTypes = nullableStringProp.oneOf.map((t) => t.type ?? t.$ref);
  assert.deepEqual(nullableTypes, [
    'string',
    'null',
    'common_types.json#/$defs/DataBinding',
    'common_types.json#/$defs/FunctionCall',
  ]);

  // 5. String array list
  const listProp = formatFieldPropertyV1(
    { name: 'tags', schema: { type: 'array', items: { type: 'string' } } },
    'TestComp',
  );
  assert.equal(listProp.$ref, 'common_types.json#/$defs/DynamicStringList');

  // 6. Actionable diagnostic on unsupported types - MUST NOT silently widen to DynamicValue
  // Arbitrary object
  assert.throws(
    () => formatFieldPropertyV1({ name: 'config', schema: { type: 'object' } }, 'MyWidget'),
    (err) => {
      assert.match(err.message, /Unsupported property type for 'MyWidget\.config'/);
      assert.match(err.message, /does not permit widening/);
      return true;
    },
  );

  // Callback / Function
  assert.throws(
    () => formatFieldPropertyV1({ name: 'onClick', schema: { type: 'function' } }, 'MyWidget'),
    /Unsupported property type for 'MyWidget\.onClick'/,
  );

  // React Node / JSX
  assert.throws(
    () => formatFieldPropertyV1({ name: 'children', schema: { type: 'ReactNode' } }, 'MyWidget'),
    /Unsupported property type for 'MyWidget\.children'/,
  );

  // Unknown generic type
  assert.throws(
    () => formatFieldPropertyV1({ name: 'unknownData', schema: {} }, 'MyWidget'),
    /Unsupported property type for 'MyWidget\.unknownData'/,
  );

  // Diagnostics collection option
  const diagnostics = [];
  const diagnosticResult = formatFieldPropertyV1(
    { name: 'complex', schema: { type: 'object' } },
    'MyWidget',
    { diagnostics },
  );
  assert.equal(diagnosticResult, null);
  assert.equal(diagnostics.length, 1);
  assert.equal(diagnostics[0].component, 'MyWidget');
  assert.equal(diagnostics[0].field, 'complex');
  assert.match(diagnostics[0].message, /does not permit widening/);
});

test('instruction generation: instructions reflect actual exported components without phantom Row/Column', () => {
  // 1. Current 3-component catalog instructions must NOT mention unexported Row or Column
  assert.equal(
    catalog.instructions.includes('Row and Column'),
    false,
    'Instructions must not claim Row and Column when neither is in the catalog',
  );
  assert.equal(catalog.instructions.includes('Row components'), false);
  assert.equal(catalog.instructions.includes('Column components'), false);

  // 2. Instructions must describe the actual exported components
  assert.ok(catalog.instructions.includes('FinanceMetricCard:'));
  assert.ok(catalog.instructions.includes('MaterialButton:'));
  assert.ok(catalog.instructions.includes('MaterialCheckbox:'));

  // 3. Instructions must accurately represent Checkbox host-owned data model policy
  assert.ok(catalog.instructions.includes('host-owned'));
  assert.ok(catalog.instructions.includes('context.checked'));

  // 4. Functions instruction is omitted when catalog defines no functions
  assert.equal(catalog.instructions.includes('@call'), false);

  // 5. Container instructions appear dynamically only when container components are present
  const withRowCol = generateInstructions(['FinanceMetricCard', 'Row', 'Column']);
  assert.ok(withRowCol.includes('Use Row and Column container components'));

  const withRowOnly = generateInstructions(['FinanceMetricCard', 'Row']);
  assert.ok(withRowOnly.includes('Use Row container components to arrange child components horizontally'));

  // 6. Function instructions appear dynamically only when functions are defined
  const withFunctions = generateInstructions(['FinanceMetricCard'], {
    functions: { calculateKPI: {} },
  });
  assert.ok(withFunctions.includes('Functions: Active catalog functions are invoked using @call envelopes'));
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

test('reference integrity: validator catches malformed, broken, and unresolved references', () => {
  const { commonTypes } = loadOfficialSchemas();

  // 1. Valid catalog passes reference integrity check
  const refCheck = validateCatalogReferences(catalog, commonTypes);
  assert.equal(refCheck.valid, true, JSON.stringify(refCheck.errors));

  // 2. Broken external reference into common_types.json
  const brokenExternalCatalog = JSON.parse(JSON.stringify(catalog));
  brokenExternalCatalog.components.FinanceMetricCard.properties.label = {
    $ref: 'common_types.json#/$defs/NonExistentType',
  };
  const brokenExtResult = validateCatalogReferences(brokenExternalCatalog, commonTypes);
  assert.equal(brokenExtResult.valid, false);
  assert.match(brokenExtResult.errors[0], /Unresolved external reference/);

  // 3. createCatalogValidator rejects broken reference even if meta-schema passes
  const fullValidator = createCatalogValidator();
  const validatorResult = fullValidator(brokenExternalCatalog);
  assert.equal(validatorResult.valid, false);
  assert.ok(validatorResult.errors.some((e) => /NonExistentType/.test(e.message)));

  // 4. Broken internal reference
  const brokenInternalCatalog = JSON.parse(JSON.stringify(catalog));
  brokenInternalCatalog.components.MaterialButton.properties.action = {
    $ref: '#/components/NonExistentComponent',
  };
  const brokenIntResult = validateCatalogReferences(brokenInternalCatalog, commonTypes);
  assert.equal(brokenIntResult.valid, false);
  assert.match(brokenIntResult.errors[0], /Unresolved internal reference/);

  // 5. Component missing from anyComponent.oneOf
  const missingOneOfCatalog = JSON.parse(JSON.stringify(catalog));
  missingOneOfCatalog.$defs.anyComponent.oneOf = [
    { $ref: '#/components/FinanceMetricCard' },
    { $ref: '#/components/MaterialButton' },
  ];
  const missingOneOfResult = validateCatalogReferences(missingOneOfCatalog, commonTypes);
  assert.equal(missingOneOfResult.valid, false);
  assert.match(missingOneOfResult.errors[0], /missing from \$defs\.anyComponent\.oneOf/);

  // 6. anyComponent.oneOf references non-existent component
  const extraOneOfCatalog = JSON.parse(JSON.stringify(catalog));
  extraOneOfCatalog.$defs.anyComponent.oneOf.push({ $ref: '#/components/GhostWidget' });
  const extraOneOfResult = validateCatalogReferences(extraOneOfCatalog, commonTypes);
  assert.equal(extraOneOfResult.valid, false);
  assert.match(extraOneOfResult.errors[0], /references non-existent component 'GhostWidget'/);
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

  // Valid system function call (@index)
  assert.equal(
    validate({
      component: 'FinanceMetricCard',
      label: 'Current Item',
      value: { '@call': '@index', args: { offset: 1 } },
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

  // Negative: Invalid enum value for appearance in MaterialButton
  assert.equal(
    validate({
      component: 'MaterialButton',
      label: 'Button',
      appearance: 'neon_glow',
      action: { event: { name: 'click' } },
    }).valid,
    false,
  );

  // Negative: Action missing required event.name
  assert.equal(
    validate({
      component: 'MaterialButton',
      label: 'Button',
      action: { event: {} },
    }).valid,
    false,
  );

  // Negative: Missing required checked in MaterialCheckbox
  assert.equal(
    validate({ component: 'MaterialCheckbox', label: 'Check me' }).valid,
    false,
  );

  // Negative: String value for boolean checked in MaterialCheckbox
  assert.equal(
    validate({ component: 'MaterialCheckbox', label: 'Check me', checked: 'yes' }).valid,
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

  // Negative: Unregistered function call rejected when anyFunction is false
  assert.equal(
    validate({
      component: 'FinanceMetricCard',
      label: 'Function KPI',
      value: { '@call': 'unregisteredFunction', args: {} },
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
  const third = JSON.stringify(generateCatalogV1(root, { registrations, index }), null, 2);

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
  assert.equal(suite.referenceResult.valid, true);
  assert.equal(suite.instancesPassed, suite.instancesTotal);
  assert.equal(suite.runtimeResults.valid, true);
  assert.equal(suite.allPassed, true);
});
