import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { parseArguments } from './cli.mjs';
import { discoverProject, selectCandidates } from './discovery.mjs';
import { assessV1Readiness, assertV1Convertible, exportV1Selection, validateV1Export } from './integration-v1.mjs';
import { makeCatalogV1, catalogV1Id, formatFieldPropertyV1 } from './catalog-v1.mjs';
import {
  createCatalogValidator,
  createComponentInstanceValidator,
  validateCatalogStructuralRules,
  validateCatalogReferences,
  categorizeValidationIssues,
  loadOfficialSchemas,
} from './validate-catalog-v1.mjs';
import { createReactCatalogExtractor } from './react-integration.mjs';
import { createAngularCatalogExtractor } from './angular-catalog.mjs';
import {
  readReactComponentsManifest,
  normalizeReactComponentManifest,
  toA2UIComponentMetadata,
  classifyProperty,
  parseDocgenDefault,
} from './react-manifest.mjs';

const root = fileURLToPath(new URL('../..', import.meta.url));
const cliPath = path.join(root, 'scripts/a2ui/cli.mjs');

// Pinned verification fixtures
const angularIndexFixture = path.join(root, 'scripts/a2ui/fixtures/angular-index-v5.json');
const reactIndexFixture = path.join(root, 'scripts/a2ui/fixtures/react-javascript/evidence/index.json');
const reactManifestFixture = path.join(root, 'scripts/a2ui/fixtures/react-javascript/evidence/components.json');
const angularCatalogFixture = path.join(root, 'scripts/a2ui/fixtures/angular-catalog');
const externalManifestFixture = path.join(root, 'scripts/a2ui/fixtures/storybook-react-manifest.fixture.json');

/**
 * Creates an isolated temporary directory cleaned up after the test finishes.
 */
function temporary(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'a2ui-acceptance-'));
  t.after(() => {
    assert.ok(path.resolve(directory).startsWith(path.resolve(os.tmpdir()) + path.sep));
    fs.rmSync(directory, { recursive: true, force: true });
  });
  return directory;
}

/**
 * Executes the exporter CLI in a separate process with file-backed stdio
 * to guarantee compatibility across Windows sandbox environments.
 */
function invokeCli(t, args, options = {}) {
  const logsDir = temporary(t);
  const stdoutPath = path.join(logsDir, 'stdout.log');
  const stderrPath = path.join(logsDir, 'stderr.log');
  const stdoutFd = fs.openSync(stdoutPath, 'w');
  const stderrFd = fs.openSync(stderrPath, 'w');
  try {
    const result = spawnSync(process.execPath, [cliPath, ...args], {
      cwd: options.cwd ?? root,
      stdio: ['ignore', stdoutFd, stderrFd],
      windowsHide: true,
      timeout: 120000,
    });
    if (result.error) throw result.error;
    return {
      status: result.status,
      stdout: fs.readFileSync(stdoutPath, 'utf8'),
      stderr: fs.readFileSync(stderrPath, 'utf8'),
    };
  } finally {
    fs.closeSync(stdoutFd);
    fs.closeSync(stderrFd);
  }
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// ============================================================================
// TEST 1: Registered Angular Component Export
// ============================================================================
test('Acceptance 1: Registered Angular component exports to compliant A2UI v1.0 catalog JSON', (t) => {
  const outputDir = path.join(temporary(t), 'export-angular-reg');
  const result = invokeCli(t, [
    'export',
    '--project', root,
    '--protocol', '1.0',
    '--angular-index', 'scripts/a2ui/fixtures/angular-index-v5.json',
    '--components', 'MaterialCheckbox',
    '--outputs', 'json',
    '--out', outputDir,
  ]);

  assert.equal(result.status, 0, `CLI failed unexpectedly: ${result.stderr}`);
  assert.ok(result.stdout.includes('Exported validated A2UI v1.0 catalog for MaterialCheckbox'));

  // Verify all expected output files exist
  const files = fs.readdirSync(outputDir).sort();
  assert.deepEqual(files, ['catalog.json', 'components.json', 'diagnostics.json', 'provenance.json', 'validation.json']);

  const catalog = readJson(path.join(outputDir, 'catalog.json'));

  // Official A2UI v1.0 protocol properties
  assert.equal(catalog.protocolVersion, '1.0');
  assert.equal(catalog.$schema, 'https://json-schema.org/draft/2020-12/schema');
  assert.equal(catalog.catalogId, catalogV1Id);
  assert.equal(catalog.$id, catalogV1Id);
  assert.ok(catalog.instructions && catalog.instructions.length > 20);

  // Discriminator and envelope definition
  assert.equal(catalog.$defs.anyComponent.discriminator.propertyName, 'component');
  assert.deepEqual(catalog.$defs.anyComponent.oneOf, [{ $ref: '#/components/MaterialCheckbox' }]);
  assert.equal(catalog.$defs.anyFunction, false);

  // Component schema definition
  const checkboxSchema = catalog.components.MaterialCheckbox;
  assert.ok(checkboxSchema, 'MaterialCheckbox component schema must exist');
  assert.equal(checkboxSchema.type, 'object');
  assert.equal(checkboxSchema.additionalProperties, false);
  assert.equal(checkboxSchema.properties.component.const, 'MaterialCheckbox');

  // Verify requiredness: component, label, checked
  assert.deepEqual(checkboxSchema.required, ['component', 'label', 'checked']);

  // Verify invariant: all required properties exist in properties
  for (const req of checkboxSchema.required) {
    assert.ok(req in checkboxSchema.properties, `Required property '${req}' must exist in properties`);
  }

  // Verify envelope property isolation: wire property 'id' must NOT be in properties
  assert.equal('id' in checkboxSchema.properties, false, "'id' is a wire envelope property and must not be in component properties");

  // Verify types: checked, disabled, label, action
  assert.equal(checkboxSchema.properties.checked.$ref, 'common_types.json#/$defs/DynamicBoolean');
  assert.equal(checkboxSchema.properties.disabled.$ref, 'common_types.json#/$defs/DynamicBoolean');
  assert.equal(checkboxSchema.properties.label.$ref, 'common_types.json#/$defs/DynamicString');
  assert.equal(checkboxSchema.properties.action.$ref, 'common_types.json#/$defs/Action');

  // Meta-schema and structural validation
  const catalogValidator = createCatalogValidator();
  const metaValidation = catalogValidator(catalog);
  assert.equal(metaValidation.valid, true, `Catalog failed meta-schema: ${JSON.stringify(metaValidation.errors)}`);

  const structuralValidation = validateCatalogStructuralRules(catalog);
  assert.equal(structuralValidation.valid, true, `Catalog failed structural rules: ${JSON.stringify(structuralValidation.errors)}`);

  // Runtime component instance validation
  const instanceValidator = createComponentInstanceValidator(catalog);
  const validInstance = { component: 'MaterialCheckbox', label: 'I agree', checked: true };
  assert.equal(instanceValidator(validInstance).valid, true, 'Valid instance must pass validation');

  const invalidInstanceMissingChecked = { component: 'MaterialCheckbox', label: 'I agree' };
  assert.equal(instanceValidator(invalidInstanceMissingChecked).valid, false, 'Instance missing checked must fail validation');

  const invalidInstanceExtraProp = { component: 'MaterialCheckbox', label: 'I agree', checked: true, extra: 42 };
  assert.equal(instanceValidator(invalidInstanceExtraProp).valid, false, 'Instance with undeclared property must fail validation');
});

// ============================================================================
// TEST 2: Unregistered Angular Component Export
// ============================================================================
test('Acceptance 2: Unregistered Angular component extracts directly from source AST without registrations or adapters', (t) => {
  const outputDir = path.join(temporary(t), 'export-angular-unreg');
  // In discovery, candidates without registrations are selected by discovery id or discovery componentName
  const result = invokeCli(t, [
    'export',
    '--project', angularCatalogFixture,
    '--protocol', '1.0',
    '--angular-index', 'index.json',
    '--components', 'StatusNote',
    '--outputs', 'json',
    '--out', outputDir,
  ], { cwd: angularCatalogFixture });

  assert.equal(result.status, 0, `CLI failed unexpectedly: ${result.stderr}`);
  assert.ok(result.stdout.includes('Exported validated A2UI v1.0 catalog for StatusNoteComponent'));

  const catalog = readJson(path.join(outputDir, 'catalog.json'));
  const schema = catalog.components.StatusNoteComponent;
  assert.ok(schema, 'StatusNoteComponent schema must exist');
  assert.equal(schema.type, 'object');
  assert.equal(schema.additionalProperties, false);
  assert.equal(schema.properties.component.const, 'StatusNoteComponent');

  // Properties extracted directly from TypeScript AST
  // 1. label: required, default "Status", description from JSDoc
  assert.ok(schema.properties.label);
  assert.equal(schema.properties.label.$ref, 'common_types.json#/$defs/DynamicString');
  assert.equal(schema.properties.label.default, 'Status');
  assert.equal(schema.properties.label.description, 'Accessible label for the reported value.');

  // 2. value: required, homogeneous number | string union supporting literals, bindings, function calls
  assert.ok(schema.properties.value);
  assert.ok(Array.isArray(schema.properties.value.oneOf));
  assert.deepEqual(
    schema.properties.value.oneOf.map((s) => s.type ?? s.$ref),
    ['number', 'string', 'common_types.json#/$defs/DataBinding', 'common_types.json#/$defs/FunctionCall'],
  );

  // 3. tone: string enum ['quiet', 'highlight'], default 'quiet'
  assert.ok(schema.properties.tone);
  assert.deepEqual(schema.properties.tone.enum.sort(), ['highlight', 'quiet']);
  assert.equal(schema.properties.tone.default, 'quiet');

  // 4. visible: DynamicBoolean, default true
  assert.ok(schema.properties.visible);
  assert.equal(schema.properties.visible.$ref, 'common_types.json#/$defs/DynamicBoolean');
  assert.equal(schema.properties.visible.default, true);

  // Invariant: No fabricated action property exists on unregistered component
  assert.equal('action' in schema.properties, false, 'Unregistered component must not have a fabricated action property');

  // Validation
  const catalogValidator = createCatalogValidator();
  assert.equal(catalogValidator(catalog).valid, true);

  const instanceValidator = createComponentInstanceValidator(catalog);
  const validInstance = { component: 'StatusNoteComponent', label: 'Metric', value: 42, tone: 'quiet', visible: true };
  assert.equal(instanceValidator(validInstance).valid, true);

  const invalidInstanceBadTone = { component: 'StatusNoteComponent', label: 'Metric', value: 10, tone: 'neon' };
  assert.equal(instanceValidator(invalidInstanceBadTone).valid, false, 'Invalid tone enum must fail instance validation');
});

// ============================================================================
// TEST 3: React JavaScript/JSX Component with Documented PropTypes
// ============================================================================
test('Acceptance 3: React JavaScript/JSX component exports official PropTypes metadata to compliant A2UI v1.0 catalog', (t) => {
  const outputDir = path.join(temporary(t), 'export-react-js');
  const result = invokeCli(t, [
    'export',
    '--project', root,
    '--protocol', '1.0',
    '--react-index', 'scripts/a2ui/fixtures/react-javascript/evidence/index.json',
    '--react-manifest', 'scripts/a2ui/fixtures/react-javascript/evidence/components.json',
    '--components', 'StatusNotice',
    '--outputs', 'json',
    '--out', outputDir,
  ]);

  assert.equal(result.status, 0, `CLI failed unexpectedly: ${result.stderr}`);
  assert.ok(result.stdout.includes('Exported validated A2UI v1.0 catalog for StatusNotice'));

  const catalog = readJson(path.join(outputDir, 'catalog.json'));
  const noticeSchema = catalog.components.StatusNotice;
  assert.ok(noticeSchema, 'StatusNotice component must exist in catalog');
  assert.equal(noticeSchema.additionalProperties, false);
  assert.equal(noticeSchema.properties.component.const, 'StatusNotice');

  // Exact PropTypes mapping:
  // label: PropTypes.string.isRequired
  assert.equal(noticeSchema.properties.label.$ref, 'common_types.json#/$defs/DynamicString');
  assert.equal(noticeSchema.properties.label.description, 'Accessible summary label supplied by the caller.');
  assert.ok(noticeSchema.required.includes('label'), 'label must be required');

  // tone: PropTypes.oneOf(['info', 'success', 'warning']), default 'info'
  assert.deepEqual(noticeSchema.properties.tone.enum.sort(), ['info', 'success', 'warning'].sort());
  assert.equal(noticeSchema.properties.tone.default, 'info');
  assert.equal(noticeSchema.properties.tone.description, 'Visual emphasis of the status.');

  // count: PropTypes.number, default 0
  assert.equal(noticeSchema.properties.count.$ref, 'common_types.json#/$defs/DynamicNumber');
  assert.equal(noticeSchema.properties.count.default, 0);

  // compact: PropTypes.bool, default false
  assert.equal(noticeSchema.properties.compact.$ref, 'common_types.json#/$defs/DynamicBoolean');
  assert.equal(noticeSchema.properties.compact.default, false);

  // Requiredness: strictly component and label
  assert.deepEqual(noticeSchema.required, ['component', 'label']);

  // Invariant: no synthetic action created
  assert.equal('action' in noticeSchema.properties, false, 'React scalar export must not synthesize an action');

  // Schema validation
  const catalogValidator = createCatalogValidator();
  assert.equal(catalogValidator(catalog).valid, true);

  // Instance validation
  const instanceValidator = createComponentInstanceValidator(catalog);
  const valid = { component: 'StatusNotice', label: 'All systems operational', tone: 'success', count: 0, compact: true };
  assert.equal(instanceValidator(valid).valid, true);

  const missingLabel = { component: 'StatusNotice', tone: 'info' };
  assert.equal(instanceValidator(missingLabel).valid, false, 'Missing required label must fail validation');
});

// ============================================================================
// TEST 4: Mixed Angular and React Catalog
// ============================================================================
test('Acceptance 4: Mixed Angular and React components combine into a single unified validated A2UI v1.0 catalog', (t) => {
  const outputDir = path.join(temporary(t), 'export-mixed');
  const result = invokeCli(t, [
    'export',
    '--project', root,
    '--protocol', '1.0',
    '--angular-index', 'scripts/a2ui/fixtures/angular-index-v5.json',
    '--react-index', 'scripts/a2ui/fixtures/react-javascript/evidence/index.json',
    '--react-manifest', 'scripts/a2ui/fixtures/react-javascript/evidence/components.json',
    '--components', 'MaterialCheckbox,StatusNotice',
    '--outputs', 'json',
    '--out', outputDir,
  ]);

  assert.equal(result.status, 0, `CLI failed unexpectedly: ${result.stderr}`);

  const catalog = readJson(path.join(outputDir, 'catalog.json'));

  // Both components present in single dictionary
  assert.deepEqual(Object.keys(catalog.components).sort(), ['MaterialCheckbox', 'StatusNotice']);

  // Universal metadata
  assert.equal(catalog.title, 'Storybook A2UI Catalog');
  assert.equal(catalog.description, 'Source contracts exported from official Storybook indexes and component metadata.');

  // Root discriminator references both components
  assert.deepEqual(catalog.$defs.anyComponent.oneOf, [
    { $ref: '#/components/MaterialCheckbox' },
    { $ref: '#/components/StatusNotice' },
  ]);

  // Comprehensive validation across both schemas
  const { commonTypes } = loadOfficialSchemas();
  const catalogValidator = createCatalogValidator();
  assert.equal(catalogValidator(catalog).valid, true);
  assert.equal(validateCatalogStructuralRules(catalog).valid, true);
  assert.equal(validateCatalogReferences(catalog, commonTypes).valid, true);

  // Component instances of BOTH frameworks validate against this unified schema
  const instanceValidator = createComponentInstanceValidator(catalog);
  const angularMsg = { component: 'MaterialCheckbox', label: 'Opt in', checked: false };
  const reactMsg = { component: 'StatusNotice', label: 'Sync complete', tone: 'info', count: 12 };
  assert.equal(instanceValidator(angularMsg).valid, true, 'Angular message must validate in mixed catalog');
  assert.equal(instanceValidator(reactMsg).valid, true, 'React message must validate in mixed catalog');

  const unknownMsg = { component: 'UnknownWidget', label: 'Test' };
  assert.equal(instanceValidator(unknownMsg).valid, false, 'Undeclared component must fail validation');
});

// ============================================================================
// TEST 5: JavaScript with Insufficient Source Metadata
// ============================================================================
test('Acceptance 5: JavaScript component with insufficient source metadata is rejected with explicit blocking diagnostics', (t) => {
  const outputDir = path.join(temporary(t), 'export-insufficient-js');
  const result = invokeCli(t, [
    'export',
    '--project', root,
    '--protocol', '1.0',
    '--react-index', 'scripts/a2ui/fixtures/react-javascript/evidence/index.json',
    '--react-manifest', 'scripts/a2ui/fixtures/react-javascript/evidence/components.json',
    '--components', 'UndocumentedNotice',
    '--outputs', 'json',
    '--out', outputDir,
  ]);

  // Export MUST fail
  assert.notEqual(result.status, 0, 'CLI must exit non-zero for component with insufficient source metadata');

  // Diagnostics must indicate missing prop type
  assert.ok(
    result.stderr.includes('REACT_PROP_TYPE_UNAVAILABLE') || result.stderr.includes('docgen exposes no prop type'),
    `Expected prop type unavailable diagnostic, got:\n${result.stderr}`,
  );

  // Invariant: no catalog.json is published on failure
  assert.equal(fs.existsSync(path.join(outputDir, 'catalog.json')), false, 'catalog.json must never be written on failure');

  // Diagnostics artifact was written
  assert.ok(fs.existsSync(path.join(outputDir, 'diagnostics.json')));
  const diagnostics = readJson(path.join(outputDir, 'diagnostics.json'));
  assert.equal(diagnostics.status, 'failed');
  assert.ok(
    diagnostics.issues.some(
      (i) => i.details?.some((d) => d.code === 'REACT_PROP_TYPE_UNAVAILABLE') || i.message.includes('docgen exposes no prop type'),
    ),
  );
});

// ============================================================================
// TEST 6: Unsupported Callback, Content Slot, or Complex Property
// ============================================================================
test('Acceptance 6: Unsupported React callback, content slot, and shape props are blocked with detailed diagnostics', (t) => {
  const outputDir = path.join(temporary(t), 'export-unsupported-props');
  const result = invokeCli(t, [
    'export',
    '--project', root,
    '--protocol', '1.0',
    '--react-index', 'scripts/a2ui/fixtures/react-javascript/evidence/index.json',
    '--react-manifest', 'scripts/a2ui/fixtures/react-javascript/evidence/components.json',
    '--components', 'InteractiveNotice',
    '--outputs', 'json',
    '--out', outputDir,
  ]);

  assert.notEqual(result.status, 0, 'Export must fail for unmapped callback/content/shape properties');

  // Verify all three unsupported properties are explicitly identified in output
  assert.ok(result.stderr.includes('onDismiss'), 'Diagnostic must name callback property onDismiss');
  assert.ok(result.stderr.includes('children'), 'Diagnostic must name content slot property children');
  assert.ok(result.stderr.includes('options'), 'Diagnostic must name complex shape property options');
  assert.ok(result.stderr.includes('reviewed A2UI mapping is required') || result.stderr.includes('REACT_REVIEWED_MAPPING_REQUIRED'));

  assert.equal(fs.existsSync(path.join(outputDir, 'catalog.json')), false);

  // Verify failure diagnostics structure
  const diagnostics = readJson(path.join(outputDir, 'diagnostics.json'));
  assert.equal(diagnostics.status, 'failed');
  const details = diagnostics.issues[0]?.details ?? [];
  assert.ok(details.some((d) => d.code === 'REACT_REVIEWED_MAPPING_REQUIRED' && d.property === 'onDismiss'));
  assert.ok(details.some((d) => d.code === 'REACT_REVIEWED_MAPPING_REQUIRED' && d.property === 'children'));
  assert.ok(details.some((d) => d.code === 'REACT_REVIEWED_MAPPING_REQUIRED' && d.property === 'options'));
});

test('Acceptance 6b: Angular component with unmapped @Output or projected <ng-content> is blocked with review diagnostic', (t) => {
  const project = temporary(t);
  fs.cpSync(angularCatalogFixture, project, { recursive: true });
  const sourceFile = path.join(project, 'src/status-note.component.ts');
  const originalSource = fs.readFileSync(sourceFile, 'utf8');

  // 1. Test unmapped @Output
  const outputSource = originalSource
    .replace('Component, Input', 'Component, Input, Output, EventEmitter')
    .replace('@Input() suffix?: string;', '@Output() valueChange = new EventEmitter<string>();');
  fs.writeFileSync(sourceFile, outputSource, 'utf8');

  const candidates = discoverProject(project, { indexes: [{ framework: 'angular', file: 'index.json' }] }).candidates;
  const extractor = createAngularCatalogExtractor(project, candidates);
  assert.throws(
    () => extractor(candidates[0]),
    (err) => err.code === 'ANGULAR_CATALOG_REVIEW_REQUIRED' && err.message.includes('@Output has no reviewed A2UI event/payload mapping'),
  );

  // 2. Test unmapped projected content <ng-content>
  const contentSource = originalSource.replace("template: '", "template: '<ng-content></ng-content>");
  fs.writeFileSync(sourceFile, contentSource, 'utf8');
  const extractorContent = createAngularCatalogExtractor(project, candidates);
  assert.throws(
    () => extractorContent(candidates[0]),
    (err) => err.code === 'ANGULAR_CATALOG_REVIEW_REQUIRED' && err.message.includes('Projected content has no reviewed A2UI content mapping'),
  );
});

// ============================================================================
// TEST 7: Component-Name and Identity Collisions
// ============================================================================
test('Acceptance 7: Cross-framework and intra-catalog component name collisions are detected and blocked', (t) => {
  // Test 7a: Mutate React manifest to collide with Angular MaterialCheckbox
  const originalManifest = readJson(reactManifestFixture);
  const collidingManifest = structuredClone(originalManifest);
  collidingManifest.components['javascript-statusnotice'].name = 'MaterialCheckbox';
  collidingManifest.components['javascript-statusnotice'].reactDocgen.displayName = 'MaterialCheckbox';
  collidingManifest.components['javascript-statusnotice'].reactDocgen.actualName = 'MaterialCheckbox';
  collidingManifest.components['javascript-statusnotice'].reactDocgen.exportName = 'MaterialCheckbox';

  const tempDir = temporary(t);
  const collidingManifestPath = path.join(tempDir, 'colliding-manifest.json');
  fs.writeFileSync(collidingManifestPath, JSON.stringify(collidingManifest, null, 2));

  const outputDir = path.join(tempDir, 'collision-output');
  const result = invokeCli(t, [
    'export',
    '--project', root,
    '--protocol', '1.0',
    '--angular-index', 'scripts/a2ui/fixtures/angular-index-v5.json',
    '--react-index', 'scripts/a2ui/fixtures/react-javascript/evidence/index.json',
    '--react-manifest', path.relative(root, collidingManifestPath),
    '--components', 'MaterialCheckbox,StatusNotice',
    '--outputs', 'json',
    '--out', outputDir,
  ]);

  assert.notEqual(result.status, 0, 'Export must reject component name collision');
  assert.ok(
    result.stderr.includes('collision') || result.stderr.includes('COLLISION') || result.stderr.includes('share a catalog name'),
    `Expected collision error message in stderr, got:\n${result.stderr}`,
  );
  assert.equal(fs.existsSync(path.join(outputDir, 'catalog.json')), false, 'Colliding catalog must not be published');

  // Test 7b: makeCatalogV1 rejects duplicate component names in candidate array
  const dummyComponent1 = { name: 'DupWidget', fields: [] };
  const dummyComponent2 = { name: 'DupWidget', fields: [] };
  assert.throws(
    () => makeCatalogV1([dummyComponent1, dummyComponent2]),
    (err) => err.code === 'DUPLICATE_COMPONENT_NAME' || err.message.includes('Duplicate component name'),
  );
});

// ============================================================================
// TEST 8: Accurate Source Defaults, Requiredness, Enum Values, and Descriptions
// ============================================================================
test('Acceptance 8: Source defaults, requiredness, enum values, and descriptions are preserved without widening or distortion', () => {
  // 1. Source default parser tests
  assert.equal(parseDocgenDefault({ value: "'defaultVal'", computed: false }), 'defaultVal');
  assert.equal(parseDocgenDefault({ value: '42', computed: false }), 42);
  assert.equal(parseDocgenDefault({ value: 'true', computed: false }), true);
  assert.equal(parseDocgenDefault({ value: 'false', computed: false }), false);
  assert.equal(parseDocgenDefault({ value: 'null', computed: false }), null);
  // Computed expressions and non-literals are rejected
  assert.equal(parseDocgenDefault({ value: 'Math.random()', computed: true }), undefined);
  assert.equal(parseDocgenDefault({ value: '() => {}', computed: false }), undefined);
  assert.equal(parseDocgenDefault({ value: '{ foo: "bar" }', computed: false }), undefined);

  // 2. formatFieldPropertyV1 preserves exact scalar, enum, union, and default contracts
  const diagnostics = [];
  const testComponent = 'TestComponent';

  // Scalar with description and default
  const stringField = {
    name: 'title',
    required: true,
    schema: { type: 'string', description: 'Item title', default: 'Default Title' },
  };
  const stringProp = formatFieldPropertyV1(stringField, testComponent, { diagnostics });
  assert.equal(stringProp.$ref, 'common_types.json#/$defs/DynamicString');
  assert.equal(stringProp.description, 'Item title');
  assert.equal(stringProp.default, 'Default Title');

  // String enum with source default
  const enumField = {
    name: 'priority',
    required: false,
    schema: { type: 'string', enum: ['low', 'medium', 'high'], default: 'medium', description: 'Task priority' },
  };
  const enumProp = formatFieldPropertyV1(enumField, testComponent, { diagnostics });
  assert.deepEqual(enumProp.enum.sort(), ['high', 'low', 'medium'].sort());
  assert.equal(enumProp.default, 'medium');

  // Homogeneous number | string union
  const unionField = {
    name: 'amount',
    required: true,
    schema: { type: ['number', 'string'], description: 'Cost or formula' },
  };
  const unionProp = formatFieldPropertyV1(unionField, testComponent, { diagnostics });
  assert.deepEqual(
    unionProp.oneOf.map((s) => s.type ?? s.$ref),
    ['number', 'string', 'common_types.json#/$defs/DataBinding', 'common_types.json#/$defs/FunctionCall'],
  );

  assert.equal(diagnostics.length, 0, 'Valid supported fields must produce zero diagnostics');
});

// ============================================================================
// TEST 9: No Silent Property Loss or Fabricated A2UI Actions
// ============================================================================
test('Acceptance 9: No silent property loss occurs and no fabricated A2UI actions or leaked envelope fields are emitted', () => {
  // 9a: Unsupported property raises blocking diagnostic rather than being dropped or widened
  const errorDiagnostics = [];
  const unsupportedField = {
    name: 'callbackHandler',
    schema: { type: 'function' },
  };
  const result = formatFieldPropertyV1(unsupportedField, 'Widget', { diagnostics: errorDiagnostics });
  assert.equal(result, null, 'Unsupported field must not return a schema definition');
  assert.equal(errorDiagnostics.length, 1);
  assert.equal(errorDiagnostics[0].code, 'UNSUPPORTED_PROPERTY_TYPE');
  assert.equal(errorDiagnostics[0].blocking, true);
  assert.equal(errorDiagnostics[0].field, 'callbackHandler');

  // 9b: Required properties invariant enforcement in structural validator
  const brokenCatalog = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: 'https://example.com/catalogs/test/1.0.0',
    catalogId: 'https://example.com/catalogs/test/1.0.0',
    protocolVersion: '1.0',
    title: 'Test',
    description: 'Test',
    version: '1.0.0',
    instructions: 'Test instructions',
    $defs: {
      anyComponent: {
        discriminator: { propertyName: 'component' },
        oneOf: [{ $ref: '#/components/Card' }],
      },
      anyFunction: false,
    },
    components: {
      Card: {
        type: 'object',
        component: { const: 'Card' },
        additionalProperties: false,
        properties: {
          component: { const: 'Card' },
          title: { $ref: 'common_types.json#/$defs/DynamicString' },
        },
        // 'nonExistentProp' is declared in required but missing from properties!
        required: ['component', 'title', 'nonExistentProp'],
      },
    },
  };
  const structuralResult = validateCatalogStructuralRules(brokenCatalog);
  assert.equal(structuralResult.valid, false, 'Structural validator must reject required property missing from properties');
  assert.ok(
    structuralResult.errors.some((e) => e.includes("required property 'nonExistentProp' does not exist in component properties")),
  );

  // 9c: Wire envelope properties (id, catalogId) must NOT leak into component properties
  const leakedEnvelopeCatalog = structuredClone(brokenCatalog);
  leakedEnvelopeCatalog.components.Card.required = ['component', 'title'];
  leakedEnvelopeCatalog.components.Card.properties.id = { type: 'string' }; // Illegal wire property in component properties
  const envelopeResult = validateCatalogStructuralRules(leakedEnvelopeCatalog);
  assert.equal(envelopeResult.valid, false, 'Structural validator must reject wire envelope property in component properties');
  assert.ok(envelopeResult.errors.some((e) => e.includes("defines envelope property 'id' in component properties")));
});

// ============================================================================
// TEST 10: Official A2UI v1.0 Schema Compliance and Reference Integrity
// ============================================================================
test('Acceptance 10: Official A2UI v1.0 schema compilation, meta-schema validation, and reference integrity checks pass', () => {
  // Verify official specification files load cleanly
  const { catalogDefinition, commonTypes } = loadOfficialSchemas();
  assert.ok(catalogDefinition, 'catalog_definition.json must load');
  assert.ok(commonTypes, 'common_types.json must load');

  // Generate a catalog from normalized metadata
  const metadata = [
    {
      name: 'MetricDisplay',
      description: 'Displays a metric with label and value',
      fields: [
        { name: 'label', required: true, schema: { type: 'string', description: 'Label' } },
        { name: 'value', required: true, schema: { type: ['number', 'string'], description: 'Value' } },
        { name: 'trend', required: false, schema: { type: 'string', enum: ['up', 'down', 'flat'], default: 'flat' } },
      ],
    },
  ];
  const catalog = makeCatalogV1(metadata);

  // 1. Meta-schema validation
  const catalogValidator = createCatalogValidator();
  const metaResult = catalogValidator(catalog);
  assert.equal(metaResult.valid, true, `Catalog must pass meta-schema: ${JSON.stringify(metaResult.errors)}`);

  // 2. Structural invariants validation
  const structuralResult = validateCatalogStructuralRules(catalog);
  assert.equal(structuralResult.valid, true, `Catalog must pass structural validation: ${JSON.stringify(structuralResult.errors)}`);

  // 3. Reference integrity validation
  const refResult = validateCatalogReferences(catalog, commonTypes);
  assert.equal(refResult.valid, true, `Catalog references must resolve: ${JSON.stringify(refResult.errors)}`);

  // 4. Test reference validator catches broken references
  const brokenRefCatalog = structuredClone(catalog);
  brokenRefCatalog.$defs.anyComponent.oneOf.push({ $ref: '#/components/MissingComponent' });
  const brokenRefResult = validateCatalogReferences(brokenRefCatalog, commonTypes);
  assert.equal(brokenRefResult.valid, false, 'Reference validator must catch dangling component reference');
  assert.ok(brokenRefResult.errors.some((e) => e.includes('references non-existent component')));

  // 5. Test reference validator catches invalid external common_types reference
  const brokenCommonRefCatalog = structuredClone(catalog);
  brokenCommonRefCatalog.components.MetricDisplay.properties.label = { $ref: 'common_types.json#/$defs/NonExistentType' };
  const brokenCommonResult = validateCatalogReferences(brokenCommonRefCatalog, commonTypes);
  assert.equal(brokenCommonResult.valid, false, 'Reference validator must catch invalid common_types ref');
  assert.ok(brokenCommonResult.errors.some((e) => e.includes('Unresolved external reference')));

  // 6. Runtime instance validator compilation
  const instanceValidator = createComponentInstanceValidator(catalog);
  assert.equal(instanceValidator({ component: 'MetricDisplay', label: 'Rev', value: 100 }).valid, true);
  assert.equal(instanceValidator({ component: 'MetricDisplay', label: 'Rev', value: '100k', trend: 'up' }).valid, true);
  assert.equal(instanceValidator({ component: 'MetricDisplay', label: 'Rev' }).valid, false, 'Missing value must fail');
  assert.equal(instanceValidator({ component: 'MetricDisplay', label: 'Rev', value: 10, trend: 'invalid' }).valid, false, 'Bad enum must fail');
});

// ============================================================================
// TEST 11: Source Metadata Change Propagation
// ============================================================================
test('Acceptance 11: Source metadata modifications propagate accurately into regenerated catalog definitions', (t) => {
  // 11a: Unregistered Angular source editing propagation
  const tempFixtureDir = temporary(t);
  fs.cpSync(angularCatalogFixture, tempFixtureDir, { recursive: true });

  const sourceFile = path.join(tempFixtureDir, 'src/status-note.component.ts');
  let sourceCode = fs.readFileSync(sourceFile, 'utf8');

  // Mutate source:
  // - change default of label from 'Status' to 'SystemNotice'
  // - update JSDoc comment
  // - add 'spacious' to density union
  // - change precision default from 2 to 4
  sourceCode = sourceCode.replace("@Input({ required: true }) label = 'Status';", "@Input({ required: true }) label = 'SystemNotice';");
  sourceCode = sourceCode.replace("Accessible label for the reported value.", "Updated accessible label.");
  sourceCode = sourceCode.replace("'compact' | 'comfortable'", "'compact' | 'comfortable' | 'spacious'");
  sourceCode = sourceCode.replace("@Input() precision = 2;", "@Input() precision = 4;");
  fs.writeFileSync(sourceFile, sourceCode, 'utf8');

  const outputDirAngular = path.join(temporary(t), 'export-propagation-angular');
  const resultAngular = invokeCli(t, [
    'export',
    '--project', tempFixtureDir,
    '--protocol', '1.0',
    '--angular-index', 'index.json',
    '--components', 'StatusNote',
    '--outputs', 'json',
    '--out', outputDirAngular,
  ], { cwd: tempFixtureDir });

  assert.equal(resultAngular.status, 0, `CLI failed: ${resultAngular.stderr}`);
  const catalogAngular = readJson(path.join(outputDirAngular, 'catalog.json'));
  const schemaAngular = catalogAngular.components.StatusNoteComponent;

  assert.equal(schemaAngular.properties.label.default, 'SystemNotice', 'Modified default must propagate to catalog');
  assert.equal(schemaAngular.properties.label.description, 'Updated accessible label.', 'Modified JSDoc must propagate to catalog');
  assert.deepEqual(schemaAngular.properties.density.enum.sort(), ['comfortable', 'compact', 'spacious'].sort(), 'Modified enum set must propagate');
  assert.equal(schemaAngular.properties.precision.default, 4, 'Modified precision default must propagate');

  // 11b: React manifest source editing propagation
  const originalManifest = readJson(reactManifestFixture);
  const mutatedManifest = structuredClone(originalManifest);
  const statusNoticeEntry = mutatedManifest.components['javascript-statusnotice'];
  statusNoticeEntry.reactDocgen.props.count.defaultValue.value = '42';
  statusNoticeEntry.reactDocgen.props.tone.defaultValue.value = "'critical'";
  statusNoticeEntry.reactDocgen.props.tone.type.value.push({ value: "'critical'", computed: false });

  const tempManifestDir = temporary(t);
  const mutatedManifestPath = path.join(tempManifestDir, 'mutated-components.json');
  fs.writeFileSync(mutatedManifestPath, JSON.stringify(mutatedManifest, null, 2), 'utf8');

  const outputDirReact = path.join(temporary(t), 'export-propagation-react');
  const resultReact = invokeCli(t, [
    'export',
    '--project', root,
    '--protocol', '1.0',
    '--react-index', 'scripts/a2ui/fixtures/react-javascript/evidence/index.json',
    '--react-manifest', path.relative(root, mutatedManifestPath),
    '--components', 'StatusNotice',
    '--outputs', 'json',
    '--out', outputDirReact,
  ]);

  assert.equal(resultReact.status, 0, `CLI failed: ${resultReact.stderr}`);
  const catalogReact = readJson(path.join(outputDirReact, 'catalog.json'));
  const schemaReact = catalogReact.components.StatusNotice;

  assert.equal(schemaReact.properties.count.default, 42, 'Modified React count default must propagate');
  assert.equal(schemaReact.properties.tone.default, 'critical', 'Modified React tone default must propagate');
  assert.ok(schemaReact.properties.tone.enum.includes('critical'), 'Modified React tone enum must propagate');
});

// ============================================================================
// TEST 12: External Storybook Manifest Compatibility
// ============================================================================
test('Acceptance 12: External Storybook manifest (Intro Button) categorizes props and preserves verified scalar contracts', () => {
  assert.ok(fs.existsSync(externalManifestFixture), 'External Storybook manifest fixture must exist');
  const manifest = readReactComponentsManifest(externalManifestFixture);
  assert.equal(manifest.v, 0);

  const introEntry = manifest.components['example-button'];
  assert.ok(introEntry, 'Intro Button entry must exist in manifest');
  assert.equal(introEntry.name, 'Button');

  // Normalize Intro Button
  const normalized = normalizeReactComponentManifest(introEntry, {
    manifestVersion: manifest.v,
    docgenEngine: 'react-docgen-typescript',
  });

  // Verify property classification
  // 1. primary: boolean, default false
  const primaryField = normalized.fields.find((f) => f.name === 'primary');
  assert.ok(primaryField);
  assert.equal(primaryField.schema.type, 'boolean');
  assert.equal(primaryField.schema.default, false);

  // 2. backgroundColor: string, no default
  const bgField = normalized.fields.find((f) => f.name === 'backgroundColor');
  assert.ok(bgField);
  assert.equal(bgField.schema.type, 'string');

  // 3. size: string enum ['large', 'medium', 'small'], default 'medium'
  const sizeField = normalized.fields.find((f) => f.name === 'size');
  assert.ok(sizeField);
  assert.equal(sizeField.schema.type, 'string');
  assert.deepEqual(sizeField.schema.enum, ['large', 'medium', 'small']);
  assert.equal(sizeField.schema.default, 'medium');

  // 4. label: string, required
  const labelField = normalized.fields.find((f) => f.name === 'label');
  assert.ok(labelField);
  assert.equal(labelField.schema.type, 'string');
  assert.equal(labelField.required, true);

  // 5. onClick: callback, accurately partitioned out of data fields
  assert.equal(normalized.fields.some((f) => f.name === 'onClick'), false);
  assert.equal(normalized.callbacks.some((c) => c.name === 'onClick'), true);

  // Convert to A2UI component metadata and verify v1 schema generation
  const a2uiMetadata = toA2UIComponentMetadata(normalized);
  assertV1Convertible([a2uiMetadata]);

  const catalog = makeCatalogV1([a2uiMetadata]);
  const catalogValidator = createCatalogValidator();
  assert.equal(catalogValidator(catalog).valid, true, 'Intro Button catalog must satisfy official meta-schema');

  const instanceValidator = createComponentInstanceValidator(catalog);
  assert.equal(instanceValidator({ component: 'Button', label: 'Click me', primary: true, size: 'large' }).valid, true);
});

// ============================================================================
// TEST 13: Fresh-Checkout Portability and Dependency Isolation
// ============================================================================
test('Acceptance 13: Exporter runs cleanly using relative paths and committed index fixtures without local build artifacts', (t) => {
  // Verify exporter runs using only committed index fixtures, requiring no storybook-static artifact
  const outputDir = path.join(temporary(t), 'portability-export');
  const result = invokeCli(t, [
    'export',
    '--project', root,
    '--protocol', '1.0',
    '--angular-index', 'scripts/a2ui/fixtures/angular-index-v5.json',
    '--components', 'FinanceMetricCard',
    '--outputs', 'json',
    '--out', outputDir,
  ]);

  assert.equal(result.status, 0, `CLI export failed: ${result.stderr}`);

  const catalog = readJson(path.join(outputDir, 'catalog.json'));
  assert.ok(catalog.components.FinanceMetricCard);
  assert.equal(catalog.components.FinanceMetricCard.properties.label.$ref, 'common_types.json#/$defs/DynamicString');
  assert.ok(Array.isArray(catalog.components.FinanceMetricCard.properties.value.oneOf));
  assert.deepEqual(
    catalog.components.FinanceMetricCard.properties.value.oneOf.map((s) => s.type ?? s.$ref),
    ['number', 'string', 'common_types.json#/$defs/DataBinding', 'common_types.json#/$defs/FunctionCall'],
  );

  // Verify that all $refs use standard relative or canonical URI pointers (no machine-specific absolute paths)
  const catalogStr = JSON.stringify(catalog);
  assert.equal(catalogStr.includes('C:'), false, 'Catalog must not leak host drive letters');
  assert.equal(catalogStr.includes('/Users/'), false, 'Catalog must not leak host user directories');

  // Verify readiness assessment handles committed index fixtures cleanly
  const discovery = discoverProject(root, {
    indexes: [{ framework: 'angular', file: 'scripts/a2ui/fixtures/angular-index-v5.json' }],
  });
  const readiness = assessV1Readiness(root, discovery.candidates);
  const metricCardReadiness = readiness.find((r) => r.name === 'FinanceMetricCard');
  assert.ok(metricCardReadiness);
  assert.equal(metricCardReadiness.ready, true);
});
