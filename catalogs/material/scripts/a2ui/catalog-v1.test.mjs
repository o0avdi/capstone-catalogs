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
  isValidCatalogId,
} from './catalog-v1.mjs';
import {
  createCatalogValidator,
  createComponentInstanceValidator,
  loadOfficialSchemas,
  validateCatalogReferences,
  validateCatalogStructuralRules,
  validateRuntimeMappings,
  runValidationSuite,
  categorizeValidationIssues,
} from './validate-catalog-v1.mjs';
import { normalizeReactManifest, toA2UIComponentMetadata } from './react-manifest.mjs';

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


// ============================================================================
// BACS 496 Quality Gate Hardening Tests (Tasks 1 - 10)
// ============================================================================

test('detect duplicate component names and invalid catalog identities (Task 5)', () => {
  // 1. Duplicate component names in candidates array are rejected
  assert.throws(
    () =>
      makeCatalogV1([
        { name: 'DuplicateButton', fields: [] },
        { name: 'DuplicateButton', fields: [] },
      ]),
    (err) => {
      assert.match(err.message, /Duplicate component name 'DuplicateButton'/);
      return true;
    },
  );

  // 2. isValidCatalogId validation
  assert.equal(isValidCatalogId(catalogV1Id), true);
  assert.equal(isValidCatalogId('https://example.com/catalogs/v1'), true);
  assert.equal(isValidCatalogId('http://localhost:3000/catalog.json'), true);
  assert.equal(isValidCatalogId('urn:uuid:6e8bc430-9c3a-11d9-9669-0800200c9a66'), true);
  assert.equal(isValidCatalogId('urn:catalog:material-widgets:1.0.0'), true);

  // Negative catalog IDs
  assert.equal(isValidCatalogId(''), false);
  assert.equal(isValidCatalogId('   '), false);
  assert.equal(isValidCatalogId('https://example.com/bad path with spaces'), false);
  assert.equal(isValidCatalogId('https://example.com/catalog#with-fragment'), false);
  assert.equal(isValidCatalogId('not-a-uri'), false);
  assert.equal(isValidCatalogId(12345), false);
  assert.equal(isValidCatalogId(null), false);
  assert.equal(isValidCatalogId(undefined), false);

  // 3. makeCatalogV1 rejects invalid catalogId options
  assert.throws(
    () => makeCatalogV1(metadata, { catalogId: 'bad id with spaces' }),
    /Invalid catalogId/,
  );
  assert.throws(
    () => makeCatalogV1(metadata, { catalogId: 'https://example.com/cat#fragment' }),
    /Invalid catalogId/,
  );
  assert.throws(
    () => makeCatalogV1(metadata, { catalogId: '' }),
    /Invalid catalogId/,
  );

  // 4. Structural validator rejects duplicate references in $defs.anyComponent.oneOf
  const dupRefCatalog = JSON.parse(JSON.stringify(catalog));
  dupRefCatalog.$defs.anyComponent.oneOf.push({ $ref: '#/components/FinanceMetricCard' });
  const dupRefResult = validateCatalogStructuralRules(dupRefCatalog);
  assert.equal(dupRefResult.valid, false);
  assert.ok(dupRefResult.errors.some((e) => e.includes('duplicate component reference')));

  // 5. Reference validator also catches duplicate references in anyComponent.oneOf
  const { commonTypes } = loadOfficialSchemas();
  const refDupResult = validateCatalogReferences(dupRefCatalog, commonTypes);
  assert.equal(refDupResult.valid, false);
  assert.ok(refDupResult.errors.some((e) => e.includes('Duplicate component reference')));

  // 6. Structural validator rejects missing or invalid catalogId
  const invalidIdCatalog = { ...catalog, catalogId: 'invalid uri' };
  const badIdResult = validateCatalogStructuralRules(invalidIdCatalog);
  assert.equal(badIdResult.valid, false);
  assert.ok(badIdResult.errors.some((e) => e.includes("Invalid 'catalogId'")));
});

test('contract hardening: required properties must actually exist in generated properties (Task 3)', () => {
  // 1. Generator rejects a component whose required list references an ungenerated property
  const componentWithGhostRequired = {
    name: 'GhostRequiredWidget',
    required: ['component', 'title', 'ghostProperty'],
    fields: [
      { name: 'title', required: true, schema: { type: 'string' } },
    ],
  };

  assert.throws(
    () => makeCatalogV1([componentWithGhostRequired]),
    (err) => {
      assert.match(
        err.message,
        /Required property 'ghostProperty' on component 'GhostRequiredWidget' is not defined/,
      );
      return true;
    },
  );

  // 2. Structural validator flags error when comp.required references missing property
  const catalogWithMissingProp = JSON.parse(JSON.stringify(catalog));
  catalogWithMissingProp.components.FinanceMetricCard.required.push('nonExistentField');
  const structuralCheck = validateCatalogStructuralRules(catalogWithMissingProp);
  assert.equal(structuralCheck.valid, false);
  assert.ok(
    structuralCheck.errors.some(
      (e) =>
        e.includes("FinanceMetricCard") &&
        e.includes("required property 'nonExistentField' does not exist in component properties"),
    ),
  );

  // 3. Reference validator also flags the missing required property
  const { commonTypes } = loadOfficialSchemas();
  const refCheck = validateCatalogReferences(catalogWithMissingProp, commonTypes);
  assert.equal(refCheck.valid, false);
  assert.ok(
    refCheck.errors.some(
      (e) =>
        e.includes("FinanceMetricCard") &&
        e.includes("required property 'nonExistentField' does not exist in component properties"),
    ),
  );
});

test('contract hardening: every normalized input field is represented or produces a blocking diagnostic (Task 2 & 8)', () => {
  // 1. Unsupported types produce blocking error when diagnostics array is not provided
  assert.throws(
    () =>
      formatFieldPropertyV1(
        { name: 'rawFunction', schema: { type: 'function' } },
        'TestWidget',
      ),
    /Unsupported property type for 'TestWidget.rawFunction'/,
  );

  // 2. Diagnostics collection records code, severity: 'error', blocking: true
  const diagnostics = [];
  const res = formatFieldPropertyV1(
    { name: 'renderCallback', schema: { type: 'function' } },
    'TestWidget',
    { diagnostics },
  );
  assert.equal(res, null);
  assert.equal(diagnostics.length, 1);
  assert.equal(diagnostics[0].code, 'UNSUPPORTED_PROPERTY_TYPE');
  assert.equal(diagnostics[0].severity, 'error');
  assert.equal(diagnostics[0].blocking, true);
  assert.equal(diagnostics[0].component, 'TestWidget');
  assert.equal(diagnostics[0].field, 'renderCallback');

  // 3. A required field with unsupported type CANNOT be silently omitted by generator
  const compWithUnsupportedRequired = {
    name: 'BrokenRequiredComp',
    fields: [
      { name: 'label', required: true, schema: { type: 'string' } },
      { name: 'badProp', required: true, schema: { type: 'object' } },
    ],
  };

  const genDiags = [];
  assert.throws(
    () => makeCatalogV1([compWithUnsupportedRequired], { diagnostics: genDiags }),
    /Required field 'BrokenRequiredComp.badProp' cannot be omitted from catalog output/,
  );

  // 4. Reserved property 'id' leaking into component definition is caught by structural validation
  const catalogWithLeakedId = makeCatalogV1([
    {
      name: 'IdCollisionWidget',
      fields: [{ name: 'id', schema: { type: 'string' } }],
    },
  ]);
  const leakCheck = validateCatalogStructuralRules(catalogWithLeakedId);
  assert.equal(leakCheck.valid, false);
  assert.match(leakCheck.errors[0], /envelope property 'id'/);
});

test('type safety: preserve supported types, enums, unions, nullability, defaults, and descriptions accurately (Task 4)', () => {
  // 1. Integer scalar maps to DynamicNumber
  const intProp = formatFieldPropertyV1(
    { name: 'count', schema: { type: 'integer' }, description: 'Item count', default: 0 },
    'TestComp',
  );
  assert.equal(intProp.$ref, 'common_types.json#/$defs/DynamicNumber');
  assert.equal(intProp.description, 'Item count');
  assert.equal(intProp.default, 0);

  // 2. Nullable number|string union
  const nullableUnion = formatFieldPropertyV1(
    {
      name: 'metricVal',
      schema: { type: ['number', 'string', 'null'] },
      description: 'Nullable metric value',
      default: null,
    },
    'TestComp',
  );
  assert.ok(nullableUnion.oneOf);
  const unionTypes = nullableUnion.oneOf.map((t) => t.type ?? t.$ref);
  assert.deepEqual(unionTypes, [
    'number',
    'string',
    'null',
    'common_types.json#/$defs/DataBinding',
    'common_types.json#/$defs/FunctionCall',
  ]);
  assert.equal(nullableUnion.description, 'Nullable metric value');
  assert.equal(nullableUnion.default, null);

  // 3. Nullable string enum
  const nullableEnum = formatFieldPropertyV1(
    {
      name: 'priority',
      schema: { type: 'string', enum: ['high', 'low', null] },
      description: 'Task priority',
    },
    'TestComp',
  );
  assert.ok(nullableEnum.oneOf);
  assert.deepEqual(nullableEnum.oneOf[0], { type: 'string', enum: ['high', 'low'] });
  assert.deepEqual(nullableEnum.oneOf[1], { type: 'null' });
  assert.equal(nullableEnum.description, 'Task priority');

  // 4. Rejection of empty enum
  assert.throws(
    () => formatFieldPropertyV1({ name: 'emptyEnum', schema: { type: 'string', enum: [] } }, 'TestComp'),
    (err) => {
      assert.match(err.message, /Empty enum definition/);
      return true;
    },
  );

  // 5. Rejection of non-string enum
  assert.throws(
    () => formatFieldPropertyV1({ name: 'numEnum', schema: { enum: [1, 2, 3] } }, 'TestComp'),
    (err) => {
      assert.match(err.message, /Unsupported non-string enum values/);
      return true;
    },
  );

  // 6. Source defaults are preserved accurately (boolean, number, string, null)
  const boolProp = formatFieldPropertyV1(
    { name: 'visible', schema: { type: 'boolean', default: false } },
    'TestComp',
  );
  assert.equal(boolProp.default, false);

  const strProp = formatFieldPropertyV1(
    { name: 'title', schema: { type: 'string', default: 'Untitled' } },
    'TestComp',
  );
  assert.equal(strProp.default, 'Untitled');
});

test('JavaScript considerations: untyped props, any, unknown must not fabricate types or defaults (Task 8 & JS note)', () => {
  // 1. Untyped JS prop (empty schema) throws and produces explicit diagnostic
  assert.throws(
    () => formatFieldPropertyV1({ name: 'untypedProp', schema: {} }, 'JSComponent'),
    (err) => {
      assert.match(err.message, /Missing or unspecified source type/);
      assert.match(err.message, /generator will not fabricate types/);
      return true;
    },
  );

  const diagUntyped = [];
  const resUntyped = formatFieldPropertyV1(
    { name: 'untypedProp', schema: {} },
    'JSComponent',
    { diagnostics: diagUntyped },
  );
  assert.equal(resUntyped, null);
  assert.equal(diagUntyped[0].code, 'UNSPECIFIED_SOURCE_TYPE');
  assert.equal(diagUntyped[0].severity, 'error');
  assert.equal(diagUntyped[0].blocking, true);

  // 2. type: 'any' throws and produces explicit diagnostic
  assert.throws(
    () => formatFieldPropertyV1({ name: 'anyProp', schema: { type: 'any' } }, 'JSComponent'),
    (err) => {
      assert.match(err.message, /Unconstrained source type 'any'/);
      assert.match(err.message, /generator will not fabricate/);
      return true;
    },
  );

  // 3. type: 'unknown' throws and produces explicit diagnostic
  assert.throws(
    () => formatFieldPropertyV1({ name: 'unknownProp', schema: { type: 'unknown' } }, 'JSComponent'),
    (err) => {
      assert.match(err.message, /Unconstrained source type 'unknown'/);
      return true;
    },
  );

  // 4. Missing default does NOT fabricate a default
  const noDefaultProp = formatFieldPropertyV1(
    { name: 'noDef', schema: { type: 'string' } },
    'JSComponent',
  );
  assert.equal('default' in noDefaultProp, false);

  // 5. Defaults do NOT make a required property optional
  const requiredWithDefault = {
    name: 'JSWidget',
    fields: [
      { name: 'requiredWithDefault', required: true, schema: { type: 'string', default: 'hello' } },
    ],
  };
  const requiredList = getRequiredProperties(requiredWithDefault);
  assert.deepEqual(requiredList, ['component', 'requiredWithDefault']);
});

test('metadata configuration: customizable title, description, catalogId and neutral non-finance defaults (Task 6)', () => {
  // 1. Custom title, description, catalogId are strictly respected
  const customCatalog = makeCatalogV1(metadata, {
    catalogId: 'https://acme.org/catalogs/design-system/2.0.0',
    title: 'Acme Design System Catalog',
    description: 'Enterprise UI components for Acme platform.',
  });

  assert.equal(customCatalog.catalogId, 'https://acme.org/catalogs/design-system/2.0.0');
  assert.equal(customCatalog.$id, 'https://acme.org/catalogs/design-system/2.0.0');
  assert.equal(customCatalog.title, 'Acme Design System Catalog');
  assert.equal(customCatalog.description, 'Enterprise UI components for Acme platform.');

  // 2. A non-finance export (e.g. React or generic) does NOT inherit finance metadata
  const genericComponent = {
    name: 'AlertBanner',
    framework: 'react',
    fields: [
      { name: 'message', required: true, schema: { type: 'string' } },
      { name: 'level', schema: { type: 'string', enum: ['info', 'warning', 'error'] } },
    ],
  };

  const genericCatalog = makeCatalogV1([genericComponent], {
    catalogId: 'https://example.com/catalogs/react/1.0.0',
  });
  assert.equal(genericCatalog.title, 'React A2UI Catalog');
  assert.equal(genericCatalog.description, 'Standardized components exported from React Storybook.');
  assert.equal(
    genericCatalog.components.AlertBanner.description,
    'AlertBanner component definition exported from react.',
  );
  assert.equal(/finance/i.test(JSON.stringify(genericCatalog)), false);

  // 3. Project name option formats clean title
  const namedCatalog = makeCatalogV1([genericComponent], { projectName: 'PortalApp' });
  assert.equal(namedCatalog.title, 'PortalApp A2UI Catalog');
});

test('instruction generation: instructions reflect actually selected components and active functions (Task 7)', () => {
  // 1. Export with only a Button only generates Button instructions
  const buttonCatalog = makeCatalogV1([metadata.find((m) => m.name === 'MaterialButton')]);
  assert.ok(buttonCatalog.instructions.includes('MaterialButton:'));
  assert.equal(buttonCatalog.instructions.includes('FinanceMetricCard:'), false);
  assert.equal(buttonCatalog.instructions.includes('MaterialCheckbox:'), false);
  assert.equal(buttonCatalog.instructions.includes('Row and Column'), false);
  assert.equal(buttonCatalog.instructions.includes('Functions:'), false);

  // 2. Custom component instructions via options.componentInstructions are included
  const customInstCatalog = makeCatalogV1(
    [
      {
        name: 'CustomBanner',
        fields: [{ name: 'text', schema: { type: 'string' } }],
      },
    ],
    {
      componentInstructions: {
        CustomBanner: 'CustomBanner: Top-level notification banner displayed at page header.',
      },
    },
  );
  assert.ok(
    customInstCatalog.instructions.includes(
      'CustomBanner: Top-level notification banner displayed at page header.',
    ),
  );

  // 3. Functions instruction is present when active catalog functions exist
  const functionCatalog = makeCatalogV1(
    [metadata.find((m) => m.name === 'MaterialButton')],
    {
      functions: {
        fetchProfile: {
          type: 'object',
          properties: {
            '@call': { properties: { const: { type: 'string' } }, required: ['const'] },
          },
          required: ['type', 'properties', 'required'],
          returnType: 'object',
        },
      },
    },
  );
  assert.ok(functionCatalog.instructions.includes('Functions: Active catalog functions are invoked using @call envelopes.'));
  assert.ok(functionCatalog.$defs.anyFunction !== false);
  assert.deepEqual(functionCatalog.$defs.anyFunction, {
    oneOf: [{ $ref: '#/functions/fetchProfile' }],
  });
});

test('cross-framework compatibility: normalized Angular and React metadata without duplicate parsers (Task 9)', () => {
  const manifestPath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    'fixtures/storybook-react-manifest.fixture.json',
  );

  // 1. Load official React manifest fixture
  const normalizedReact = normalizeReactManifest(manifestPath);
  assert.ok(normalizedReact.components.length > 0);

  // 2. Extract Intro Button and normalize to makeCatalogV1 format
  const introBtn = normalizedReact.components.find((c) => c.name === 'Button');
  assert.ok(introBtn, 'Should find Intro Button in manifest fixture');
  const reactCompMeta = toA2UIComponentMetadata(introBtn);

  // 3. Generate catalog from normalized React component
  const reactCatalog = makeCatalogV1([reactCompMeta], {
    catalogId: 'https://example.com/catalogs/react-components/1.0.0',
    title: 'React Button Catalog',
  });

  const validator = createCatalogValidator();
  const reactValResult = validator(reactCatalog);
  assert.equal(
    reactValResult.valid,
    true,
    `React catalog failed meta-schema: ${JSON.stringify(reactValResult.errors)}`,
  );

  const instanceValidator = createComponentInstanceValidator(reactCatalog);
  assert.equal(
    instanceValidator({ component: 'Button', label: 'Click Me', primary: true }).valid,
    true,
  );
  assert.equal(
    instanceValidator({ component: 'Button', label: 'Submit', size: 'large' }).valid,
    true,
  );

  // 4. Unified mixed catalog containing BOTH Angular and React normalized components
  const angularMetricCard = metadata.find((m) => m.name === 'FinanceMetricCard');
  const mixedCatalog = makeCatalogV1([angularMetricCard, reactCompMeta], {
    catalogId: 'https://example.com/catalogs/unified-cross-framework/1.0.0',
    title: 'Unified Cross-Framework Catalog',
  });

  assert.deepEqual(Object.keys(mixedCatalog.components).sort(), ['Button', 'FinanceMetricCard']);
  assert.deepEqual(
    mixedCatalog.$defs.anyComponent.oneOf.map((o) => o.$ref).sort(),
    ['#/components/Button', '#/components/FinanceMetricCard'],
  );

  // 5. Unified catalog validates cleanly under official A2UI validator
  const mixedValResult = validator(mixedCatalog);
  assert.equal(
    mixedValResult.valid,
    true,
    `Mixed catalog failed validation: ${JSON.stringify(mixedValResult.errors)}`,
  );

  // Instances of both frameworks validate against unified anyComponent discriminator
  const mixedInstanceValidator = createComponentInstanceValidator(mixedCatalog);
  assert.equal(
    mixedInstanceValidator({ component: 'FinanceMetricCard', label: 'Rev', value: 1000 }).valid,
    true,
  );
  assert.equal(
    mixedInstanceValidator({ component: 'Button', label: 'Next' }).valid,
    true,
  );
  assert.equal(
    mixedInstanceValidator({ component: 'NonExistent', label: 'Bad' }).valid,
    false,
  );
});

test('diagnostic categorization: clearly distinguish missing source metadata from invalid A2UI schema output (Task 10)', () => {
  const mixedIssues = [
    { code: 'UNSUPPORTED_PROPERTY_TYPE', message: "Unsupported property type for 'MyWidget.complex'" },
    { code: 'UNSPECIFIED_SOURCE_TYPE', message: "Missing or unspecified source type for 'JSComp.data'" },
    { code: 'MISSING_DOCGEN_DATA', message: "Component entry 'header' contains neither docgen" },
    { code: 'CALLBACK_PROP', message: "Property 'onClick' is a callback" },
    { code: 'INCOMPLETE_TS_MEMBERSHIP', message: "react-docgen-typescript did not return component docs" },
    "numeric story control does not narrow",
    "Missing mandatory root '$defs'.",
    "Root $id does not match catalogId.",
    "Unresolved internal reference '#/components/Missing' at components.Button.",
    "Adapter file not found at src/adapters/button.adapter.ts",
    "Source dependency not found at src/components/button.ts",
  ];

  const categorized = categorizeValidationIssues(mixedIssues);

  // 1. Source metadata deficiencies
  assert.equal(categorized.sourceMetadataDeficiencies.length, 6);
  assert.ok(
    categorized.sourceMetadataDeficiencies.some((i) => i.code === 'UNSUPPORTED_PROPERTY_TYPE'),
  );
  assert.ok(
    categorized.sourceMetadataDeficiencies.some((i) => i.code === 'UNSPECIFIED_SOURCE_TYPE'),
  );
  assert.ok(
    categorized.sourceMetadataDeficiencies.some((i) => typeof i === 'string' && i.includes('numeric story control')),
  );

  // 2. Schema output violations
  assert.equal(categorized.schemaOutputViolations.length, 3);
  assert.ok(
    categorized.schemaOutputViolations.some((i) => i.includes("Missing mandatory root '$defs'")),
  );
  assert.ok(
    categorized.schemaOutputViolations.some((i) => i.includes('Unresolved internal reference')),
  );

  // 3. Runtime mapping issues
  assert.equal(categorized.runtimeMappingIssues.length, 2);
  assert.ok(
    categorized.runtimeMappingIssues.some((i) => i.includes('Adapter file not found')),
  );
  assert.ok(
    categorized.runtimeMappingIssues.some((i) => i.includes('Source dependency not found')),
  );
});
