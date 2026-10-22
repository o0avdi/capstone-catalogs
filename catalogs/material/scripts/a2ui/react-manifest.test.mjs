import test from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  SUPPORTED_MANIFEST_VERSION,
  classifyProperty,
  demonstrateA2UIExport,
  normalizeReactComponentManifest,
  normalizeReactManifest,
  parseDocgenDefault,
  readReactComponentsManifest,
  toA2UIComponentMetadata,
} from './react-manifest.mjs';

import { assertV1Convertible } from './integration-v1.mjs';
import { createComponentInstanceValidator } from './validate-catalog-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fixturesDir = path.join(__dirname, 'fixtures');

const manifestFixturePath = path.join(fixturesDir, 'storybook-react-manifest.fixture.json');
const manifestTsErrorPath = path.join(fixturesDir, 'storybook-react-manifest-ts-error.fixture.json');
const manifestReactDocgenPath = path.join(fixturesDir, 'storybook-react-manifest-reactdocgen.fixture.json');

// --- 1. Version Gating and Manifest Integrity ---

test('react-manifest: accepts verified Storybook 10.6 manifest (v: 0) and records provenance', () => {
  const parsed = readReactComponentsManifest(manifestFixturePath);

  assert.equal(parsed.v, SUPPORTED_MANIFEST_VERSION);
  assert.equal(parsed.provenance.manifestVersion, 0);
  assert.equal(parsed.provenance.docgenEngine, 'react-docgen-typescript');
  assert.ok(typeof parsed.provenance.sha256 === 'string' && parsed.provenance.sha256.length === 64);
  assert.ok(parsed.components && typeof parsed.components === 'object');
  assert.ok('example-button' in parsed.components);
});

test('react-manifest: rejects unsupported or missing manifest version with actionable diagnostic', () => {
  assert.throws(
    () => readReactComponentsManifest({ v: 1, components: {} }),
    /Unsupported Storybook Components Manifest version: 1\. Only version 0 is currently verified and supported\./,
  );

  assert.throws(
    () => readReactComponentsManifest({ components: {} }),
    /Unsupported Storybook Components Manifest version: undefined\./,
  );

  assert.throws(
    () => readReactComponentsManifest({ v: 0 }),
    /missing or malformed 'components' dictionary/,
  );
});

test('react-manifest: rejects non-existent manifest file path', () => {
  assert.throws(
    () => readReactComponentsManifest(path.join(fixturesDir, 'does-not-exist.json')),
    /Storybook Components Manifest not found at/,
  );
});

// --- 2. Actionable Diagnostics on Storybook Failures ---

test('react-manifest: missing meta.component yields MISSING_META_COMPONENT diagnostic', () => {
  const result = normalizeReactManifest(manifestFixturePath);
  const wrapperError = result.errors.find((e) => e.id === 'research-statewrapper');

  assert.ok(wrapperError, 'research-statewrapper must be classified in errors list');
  assert.equal(wrapperError.readiness.status, 'error');
  assert.equal(wrapperError.readiness.v1Convertible, false);

  const missingMetaDiag = wrapperError.diagnostics.find((d) => d.code === 'MISSING_META_COMPONENT');
  assert.ok(missingMetaDiag, 'Must emit MISSING_META_COMPONENT diagnostic');
  assert.equal(missingMetaDiag.severity, 'error');
  assert.match(missingMetaDiag.message, /Specify 'meta\.component' in the CSF default export/);
  assert.match(missingMetaDiag.message, /research-cases\/wrapper\.stories\.tsx/);
});

test('react-manifest: excluded tsconfig file yields INCOMPLETE_TS_MEMBERSHIP diagnostic', () => {
  const result = normalizeReactManifest(manifestTsErrorPath);
  const capstoneError = result.errors.find((e) => e.id === 'research-capstonebutton');

  assert.ok(capstoneError, 'research-capstonebutton must be classified in errors list');
  assert.equal(capstoneError.readiness.status, 'error');
  assert.equal(capstoneError.readiness.v1Convertible, false);

  const tsDiag = capstoneError.diagnostics.find((d) => d.code === 'INCOMPLETE_TS_MEMBERSHIP');
  assert.ok(tsDiag, 'Must emit INCOMPLETE_TS_MEMBERSHIP diagnostic');
  assert.equal(tsDiag.severity, 'error');
  assert.match(tsDiag.message, /react-docgen-typescript did not return component docs/);
  assert.match(tsDiag.message, /Ensure the component source file is included in tsconfig\.json 'include'/);
});

// --- 3. Property Extraction & Preservation on Intro Button (5 props) ---

test('react-manifest: extracts real Intro Button with 5 source props, preserving types and defaults', () => {
  const result = normalizeReactManifest(manifestFixturePath);
  const button = result.components.find((c) => c.id === 'example-button');

  assert.ok(button, 'example-button must be present in normalized components');
  assert.equal(button.name, 'Button');
  assert.equal(button.exportName, 'Button');
  assert.equal(button.framework, 'react');
  assert.equal(button.storyPath, 'intro/src/stories/Button.stories.ts');
  assert.match(button.source, /intro\/src\/stories\/Button\.tsx/);
  assert.equal(button.description, 'Primary UI component for user interaction');
  assert.equal(button.storyIds.length, 4);

  // 1. Exactly 4 supported scalar/enum data fields
  assert.equal(button.fields.length, 4);
  const fieldNames = button.fields.map((f) => f.name).sort();
  assert.deepEqual(fieldNames, ['backgroundColor', 'label', 'primary', 'size']);

  // 2. Primary: boolean, default false, required false
  const primaryField = button.fields.find((f) => f.name === 'primary');
  assert.deepEqual(primaryField.schema, {
    type: 'boolean',
    description: 'Is this the principal call to action on the page?',
    default: false,
  });
  assert.equal(primaryField.default, false);
  assert.equal(primaryField.required, false);

  // 3. BackgroundColor: string, no default, required false
  const bgField = button.fields.find((f) => f.name === 'backgroundColor');
  assert.deepEqual(bgField.schema, {
    type: 'string',
    description: 'What background color to use',
  });
  assert.equal(bgField.default, undefined);
  assert.equal(bgField.required, false);

  // 4. Size: string enum ["large", "medium", "small"], default "medium", required false
  const sizeField = button.fields.find((f) => f.name === 'size');
  assert.deepEqual(sizeField.schema, {
    type: 'string',
    enum: ['large', 'medium', 'small'],
    description: 'How large should the button be?',
    default: 'medium',
  });
  assert.equal(sizeField.default, 'medium');
  assert.equal(sizeField.required, false);

  // 5. Label: string, no default, required true
  const labelField = button.fields.find((f) => f.name === 'label');
  assert.deepEqual(labelField.schema, {
    type: 'string',
    description: 'Button contents',
  });
  assert.equal(labelField.required, true);

  // 6. Callback onClick: excluded from fields, preserved in callbacks
  assert.equal(button.callbacks.length, 1);
  assert.equal(button.callbacks[0].name, 'onClick');
  assert.equal(button.callbacks[0].typeText, '(() => void)');
  assert.equal(button.callbacks[0].description, 'Optional click handler');

  const callbackDiag = button.diagnostics.find((d) => d.code === 'CALLBACK_PROP');
  assert.ok(callbackDiag);

  // 7. Difference between verified source defaults and Storybook example args
  assert.equal(button.examples.length, 4);
  assert.equal(button.examples[0].id, 'example-button--primary');
  assert.match(button.examples[0].snippet, /primary label="Button"/);
  // Source default for label is NOT "Button" - label has no source default
  assert.equal(labelField.default, undefined);
  // Verified source default for primary is false, despite primary being true in the Primary story
  assert.equal(primaryField.default, false);

  // 8. Readiness
  assert.equal(button.readiness.v1Convertible, true);
  assert.equal(button.readiness.totalRawProps, 5);
  assert.equal(button.readiness.supportedFieldsCount, 4);
  assert.equal(button.readiness.callbacksCount, 1);
});

// --- 4. Conservative Handling on Shadbook Button ---

test('react-manifest: handles Shadbook Button CVA nullable unions conservatively', () => {
  const result = normalizeReactManifest(manifestFixturePath);
  const shadbookBtn = result.components.find((c) => c.id === 'components-button');

  assert.ok(shadbookBtn, 'components-button must be present');
  assert.equal(shadbookBtn.name, 'Button');

  // asChild is a supported boolean scalar
  const asChildField = shadbookBtn.fields.find((f) => f.name === 'asChild');
  assert.ok(asChildField);
  assert.equal(asChildField.schema.type, 'boolean');
  assert.equal(asChildField.default, false);

  // variant and size contain null in their CVA union -> excluded from data fields
  assert.equal(shadbookBtn.fields.some((f) => f.name === 'variant'), false);
  assert.equal(shadbookBtn.fields.some((f) => f.name === 'size'), false);

  // variant and size are preserved in unsupportedProperties with diagnostic
  const variantProp = shadbookBtn.unsupportedProperties.find((p) => p.name === 'variant');
  assert.ok(variantProp);
  assert.equal(variantProp.category, 'complex_union');
  assert.match(variantProp.reason, /contains null or non-scalar types/);

  const unionDiag = shadbookBtn.diagnostics.find(
    (d) => d.code === 'COMPLEX_UNION_PROP' && d.property === 'variant',
  );
  assert.ok(unionDiag);
  assert.equal(unionDiag.severity, 'warning');

  // Partial readiness because unsupported complex unions are present
  assert.equal(shadbookBtn.readiness.status, 'partial');
  assert.equal(shadbookBtn.readiness.totalRawProps, 3);
  assert.equal(shadbookBtn.readiness.supportedFieldsCount, 1);
  assert.equal(shadbookBtn.readiness.unsupportedPropsCount, 2);
});

// --- 5. Real 42-Property React Aria Button Partitioning ---

test('react-manifest: partitions all 42 props of React Aria Button accurately', () => {
  const result = normalizeReactManifest(manifestFixturePath);
  const ariaBtn = result.components.find((c) => c.id === 'research-capstonebutton');

  assert.ok(ariaBtn, 'research-capstonebutton must be present');
  assert.equal(Object.keys(ariaBtn.rawProperties).length, 42);

  // Supported scalar fields: isDisabled, isPending, autoFocus, form, slot, name, type, value, className
  const fieldNames = ariaBtn.fields.map((f) => f.name);
  assert.ok(fieldNames.includes('isDisabled'));
  assert.ok(fieldNames.includes('isPending'));
  assert.ok(fieldNames.includes('autoFocus'));
  assert.ok(fieldNames.includes('name'));
  assert.ok(fieldNames.includes('type'));
  assert.ok(fieldNames.includes('value'));

  // Callbacks: onPress, onClick, onFocus, onBlur, onHoverStart, onKeyDown, etc.
  const callbackNames = ariaBtn.callbacks.map((c) => c.name);
  assert.ok(callbackNames.includes('onPress'));
  assert.ok(callbackNames.includes('onClick'));
  assert.ok(callbackNames.includes('onFocus'));
  assert.ok(callbackNames.includes('onBlur'));
  assert.ok(callbackNames.includes('onHoverStart'));
  assert.ok(callbackNames.includes('onKeyDown'));
  assert.ok(callbackNames.includes('onPressStart'));

  // Callbacks must NEVER leak into component data fields
  for (const cbName of callbackNames) {
    assert.equal(
      fieldNames.includes(cbName),
      false,
      `Callback ${cbName} must not be present in data fields`,
    );
  }

  // Content slots: children, render
  assert.ok('children' in ariaBtn.content);
  assert.ok('render' in ariaBtn.content);
  assert.equal(fieldNames.includes('children'), false);

  // Unsupported DOM / inherited attributes: ref, key, style, aria-controls, formAction, etc.
  const unsupportedNames = ariaBtn.unsupportedProperties.map((p) => p.name);
  assert.ok(unsupportedNames.includes('ref'));
  assert.ok(unsupportedNames.includes('key'));
  assert.ok(unsupportedNames.includes('style'));
  assert.ok(unsupportedNames.includes('aria-controls'));
  assert.ok(unsupportedNames.includes('formAction'));

  // Total classified properties equals 42
  const totalClassified =
    ariaBtn.fields.length +
    ariaBtn.callbacks.length +
    Object.keys(ariaBtn.content).length +
    ariaBtn.unsupportedProperties.length;
  assert.equal(totalClassified, 42);
});

// --- 6. Support for standard react-docgen ---

test('react-manifest: supports reactDocgen engine format and parses tsType structures', () => {
  const result = normalizeReactManifest(manifestReactDocgenPath);

  assert.equal(result.docgenEngine, 'react-docgen');
  const button = result.components.find((c) => c.id === 'example-button');
  assert.ok(button);
  assert.equal(button.name, 'Button');

  // Fields extracted from tsType
  assert.equal(button.fields.length, 4);
  const primary = button.fields.find((f) => f.name === 'primary');
  assert.equal(primary.schema.type, 'boolean');
  assert.equal(primary.default, false);

  const size = button.fields.find((f) => f.name === 'size');
  assert.equal(size.schema.type, 'string');
  assert.deepEqual(size.schema.enum, ['large', 'medium', 'small']);
  assert.equal(size.default, 'medium');

  const label = button.fields.find((f) => f.name === 'label');
  assert.equal(label.schema.type, 'string');
  assert.equal(label.required, true);

  // Callback from signature tsType
  assert.equal(button.callbacks.length, 1);
  assert.equal(button.callbacks[0].name, 'onClick');
});

// --- 7. End-to-End A2UI v1.0 Catalog Generation & Validation Demonstration ---

test('react-manifest: normalized Intro Button satisfies assertV1Convertible and generates valid v1.0 catalog', () => {
  const result = normalizeReactManifest(manifestFixturePath);
  const button = result.components.find((c) => c.id === 'example-button');
  assert.ok(button);

  // 1. Convert to A2UI component definition with reviewed action event
  const a2uiDef = toA2UIComponentMetadata(button, {
    events: { click: 'action' },
    required: ['component', 'label', 'action'],
  });

  // 2. Pass strict v1 convertible schema assertions (reused from integration-v1.mjs)
  assert.doesNotThrow(() => assertV1Convertible([a2uiDef]));

  // 3. Generate and validate catalog via demonstrateA2UIExport
  const { valid, catalog, validation } = demonstrateA2UIExport(button, {
    events: { click: 'action' },
    required: ['component', 'label', 'action'],
  });

  assert.equal(valid, true);
  assert.equal(validation.schema.valid, true);
  assert.equal(validation.structural.valid, true);
  assert.equal(validation.componentSchemasCompiled, true);

  // 4. Verify catalog envelope and component schema structure
  assert.equal(catalog.protocolVersion, '1.0');
  assert.ok('Button' in catalog.components);

  const buttonSchema = catalog.components.Button;
  assert.equal(buttonSchema.type, 'object');
  assert.equal(buttonSchema.additionalProperties, false);
  assert.deepEqual(buttonSchema.required.sort(), ['action', 'component', 'label']);

  // Properties in catalog schema
  assert.ok('component' in buttonSchema.properties);
  assert.ok('primary' in buttonSchema.properties);
  assert.ok('backgroundColor' in buttonSchema.properties);
  assert.ok('size' in buttonSchema.properties);
  assert.ok('label' in buttonSchema.properties);
  assert.ok('action' in buttonSchema.properties);

  // Callback onClick is NOT in catalog data properties
  assert.equal('onClick' in buttonSchema.properties, false);

  // 5. Test instance validation against the compiled schema
  const validateInstance = createComponentInstanceValidator(catalog);

  // Valid button instance
  const validInstance = {
    component: 'Button',
    label: 'Click Here',
    size: 'large',
    primary: true,
    action: {
      event: { name: 'click' },
    },
  };
  const validRes = validateInstance(validInstance);
  assert.equal(
    validRes.valid,
    true,
    `Valid instance failed: ${JSON.stringify(validRes.errors)}`,
  );

  // Missing required label
  const missingLabelInstance = {
    component: 'Button',
    size: 'small',
    action: {
      event: { name: 'click' },
    },
  };
  const missingLabelRes = validateInstance(missingLabelInstance);
  assert.equal(missingLabelRes.valid, false);
  assert.ok(missingLabelRes.errors.some((e) => e.message?.includes('label')));

  // Invalid enum value for size
  const invalidEnumInstance = {
    component: 'Button',
    label: 'Submit',
    size: 'enormous', // not small, medium, or large
    action: {
      event: { name: 'click' },
    },
  };
  const invalidEnumRes = validateInstance(invalidEnumInstance);
  assert.equal(invalidEnumRes.valid, false);
});

// --- 8. Helper Function Unit Tests ---

test('react-manifest: parseDocgenDefault correctly parses primitives and rejects complex expressions', () => {
  assert.equal(parseDocgenDefault({ value: 'false' }), false);
  assert.equal(parseDocgenDefault({ value: 'true' }), true);
  assert.equal(parseDocgenDefault({ value: 'null' }), null);
  assert.equal(parseDocgenDefault({ value: '42' }), 42);
  assert.equal(parseDocgenDefault({ value: '-3.14' }), -3.14);
  assert.equal(parseDocgenDefault({ value: '"hello"' }), 'hello');
  assert.equal(parseDocgenDefault({ value: "'world'" }), 'world');
  assert.equal(parseDocgenDefault({ value: 'medium' }), 'medium');
  assert.equal(parseDocgenDefault({ value: 'undefined' }), undefined);
  assert.equal(parseDocgenDefault(null), undefined);
  assert.equal(parseDocgenDefault({ value: '() => {}' }), undefined);
  assert.equal(parseDocgenDefault({ value: '{ foo: "bar" }' }), undefined);
});

test('react-manifest: classifyProperty categorizes callbacks, content, DOM, and scalars', () => {
  // Callbacks
  assert.equal(classifyProperty('onClick', { type: { name: '(() => void)' } }).category, 'callback');
  assert.equal(classifyProperty('onPress', { type: { name: 'any' } }).category, 'callback');
  assert.equal(classifyProperty('handleChange', { type: { name: '(e: Event) => void' } }).category, 'callback');

  // Content
  assert.equal(classifyProperty('children', { type: { name: 'ReactNode' } }).category, 'content');
  assert.equal(classifyProperty('render', { type: { name: 'ReactElement' } }).category, 'content');

  // Inherited DOM
  assert.equal(classifyProperty('ref', { type: { name: 'Ref<HTMLButtonElement>' } }).category, 'unsupported_dom');
  assert.equal(classifyProperty('style', { type: { name: 'CSSProperties' } }).category, 'unsupported_dom');
  assert.equal(classifyProperty('aria-label', { type: { name: 'string' } }).category, 'unsupported_dom');

  // Scalars & Enums
  assert.equal(classifyProperty('disabled', { type: { name: 'boolean' } }).category, 'scalar');
  assert.equal(classifyProperty('title', { type: { name: 'string' } }).category, 'scalar');
  assert.equal(classifyProperty('count', { type: { name: 'number' } }).category, 'scalar');
  assert.equal(classifyProperty('variant', { type: { name: 'enum', value: [{ value: '"primary"' }, { value: '"secondary"' }] } }).category, 'enum');

  // Complex Union
  assert.equal(classifyProperty('variant', { type: { name: '"default" | "outline" | null' } }).category, 'complex_union');
});
