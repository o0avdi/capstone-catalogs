import Ajv2020 from 'ajv/dist/2020.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { generateCatalogV1, sortDeterministic } from './catalog-v1.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const specDir = path.resolve(__dirname, 'specification/v1_0');

/**
 * Load the pinned official A2UI v1.0 specification schemas.
 */
export function loadOfficialSchemas(directory = specDir) {
  const catalogDefPath = path.join(directory, 'catalog_definition.json');
  const commonTypesPath = path.join(directory, 'common_types.json');

  if (!fs.existsSync(catalogDefPath)) {
    throw new Error(`Official catalog_definition.json not found in ${directory}`);
  }
  if (!fs.existsSync(commonTypesPath)) {
    throw new Error(`Official common_types.json not found in ${directory}`);
  }

  const catalogDefinition = JSON.parse(fs.readFileSync(catalogDefPath, 'utf8'));
  const commonTypes = JSON.parse(fs.readFileSync(commonTypesPath, 'utf8'));

  return { catalogDefinition, commonTypes };
}

/**
 * Recursively find and validate all $ref occurrences in an object.
 */
function collectRefs(obj, currentPath = '', refs = []) {
  if (!obj || typeof obj !== 'object') return refs;
  if (Array.isArray(obj)) {
    obj.forEach((item, index) => collectRefs(item, `${currentPath}[${index}]`, refs));
    return refs;
  }
  for (const [key, value] of Object.entries(obj)) {
    if (key === '$ref' && typeof value === 'string') {
      refs.push({ path: currentPath, ref: value });
    } else {
      collectRefs(value, currentPath ? `${currentPath}.${key}` : key, refs);
    }
  }
  return refs;
}

/**
 * Validate catalog reference integrity, including internal schema pointers and external common_types.json references.
 * Ensures a catalog is never reported as passing if component-level references or constraints are invalid.
 */
export function validateCatalogReferences(catalog, commonTypes) {
  const errors = [];

  if (!catalog || typeof catalog !== 'object') {
    return { valid: false, errors: ['Catalog must be a non-null object.'] };
  }

  // 1. Validate $defs.anyComponent alignment with components
  const anyComponent = catalog.$defs?.anyComponent;
  if (!anyComponent) {
    errors.push("Missing '$defs.anyComponent'.");
  } else {
    if (!anyComponent.discriminator || anyComponent.discriminator.propertyName !== 'component') {
      errors.push("Discriminator on '$defs.anyComponent' must declare propertyName 'component'.");
    }
    const componentNames = Object.keys(catalog.components ?? {});
    const oneOfRefs = (anyComponent.oneOf ?? []).map((o) => o.$ref);

    for (const name of componentNames) {
      const expectedRef = `#/components/${name}`;
      if (!oneOfRefs.includes(expectedRef)) {
        errors.push(`Component '${name}' defined in catalog.components is missing from $defs.anyComponent.oneOf.`);
      }
    }

    for (const ref of oneOfRefs) {
      if (!ref || !ref.startsWith('#/components/')) {
        errors.push(`$defs.anyComponent.oneOf reference '${ref}' must target '#/components/<ComponentName>'.`);
      } else {
        const targetName = ref.replace('#/components/', '');
        if (!catalog.components?.[targetName]) {
          errors.push(`$defs.anyComponent.oneOf references non-existent component '${targetName}'.`);
        }
      }
    }
  }

  // 2. Validate all $refs inside catalog.components
  const componentRefs = collectRefs(catalog.components, 'components');
  for (const { path: refPath, ref } of componentRefs) {
    if (ref.startsWith('common_types.json#/$defs/')) {
      const defName = ref.replace('common_types.json#/$defs/', '');
      if (!commonTypes.$defs || !(defName in commonTypes.$defs)) {
        errors.push(
          `Unresolved external reference '${ref}' at ${refPath}: '${defName}' is not defined in common_types.json.`,
        );
      }
    } else if (ref.startsWith('#/')) {
      // Internal reference
      const segments = ref.replace('#/', '').split('/');
      let current = catalog;
      let resolved = true;
      for (const seg of segments) {
        if (current && typeof current === 'object' && seg in current) {
          current = current[seg];
        } else {
          resolved = false;
          break;
        }
      }
      if (!resolved) {
        errors.push(`Unresolved internal reference '${ref}' at ${refPath}.`);
      }
    } else {
      errors.push(`Unsupported or malformed reference '${ref}' at ${refPath}.`);
    }
  }

  // 3. Validate individual component schema constraints
  if (catalog.components && typeof catalog.components === 'object') {
    for (const [name, comp] of Object.entries(catalog.components)) {
      if (comp.type !== 'object') {
        errors.push(`Component '${name}' schema type must be 'object'.`);
      }
      if (comp.additionalProperties !== false) {
        errors.push(`Component '${name}' must explicitly set 'additionalProperties: false'.`);
      }
      if (!Array.isArray(comp.required) || !comp.required.includes('component')) {
        errors.push(`Component '${name}' required list must include discriminator property 'component'.`);
      }
      if (comp.properties?.component?.const !== name) {
        errors.push(`Component '${name}' properties.component.const must equal '${name}'.`);
      }
    }
  }

  // 4. Verify Ajv compilation of anyComponent and component dereferencing
  try {
    const ajv = new Ajv2020({ strict: false, allErrors: true, discriminator: true });
    ajv.addSchema(commonTypes, 'common_types.json');
    if (catalog.$id) {
      const relativeCommonUrl = new URL('common_types.json', catalog.$id).href;
      if (relativeCommonUrl !== commonTypes.$id) {
        ajv.addSchema(commonTypes, relativeCommonUrl);
      }
      ajv.addSchema(catalog);
      ajv.addSchema({ ...catalog, $id: 'https://a2ui.org/specification/v1_0/catalog.json' });
      ajv.addSchema({ ...catalog, $id: 'catalog.json' });
      ajv.compile({ $ref: `${catalog.$id}#/$defs/anyComponent` });
    }
  } catch (err) {
    errors.push(`Ajv schema compilation / dereferencing failed: ${err.message}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Create an Ajv2020 validator for A2UI v1.0 catalogs using official catalog_definition.json
 * combined with deep reference and constraint verification.
 */
export function createCatalogValidator(options = {}) {
  const { catalogDefinition, commonTypes } = loadOfficialSchemas(options.specDir);

  const ajv = new Ajv2020({
    strict: false,
    allErrors: true,
  });

  ajv.addSchema(commonTypes, 'common_types.json');

  const validate = ajv.compile(catalogDefinition);

  return function validateCatalogSchema(catalog) {
    const metaValid = validate(catalog);
    const metaErrors = validate.errors ? [...validate.errors] : [];

    // Also check deep reference and component-level constraints
    const refResult = validateCatalogReferences(catalog, commonTypes);
    const allErrors = [
      ...metaErrors,
      ...refResult.errors.map((msg) => ({
        instancePath: '',
        schemaPath: '#/components',
        keyword: 'reference',
        params: {},
        message: msg,
      })),
    ];

    return {
      valid: !!metaValid && refResult.valid,
      errors: allErrors,
      metaErrors,
      referenceErrors: refResult.errors,
    };
  };
}

/**
 * Validate specific A2UI v1.0 structural invariants.
 */
export function validateCatalogStructuralRules(catalog) {
  const errors = [];

  // 1. Root properties must strictly belong to the normative 10 fields
  const allowedRootProps = new Set([
    '$schema',
    '$id',
    'protocolVersion',
    '$defs',
    'title',
    'description',
    'catalogId',
    'instructions',
    'components',
    'functions',
  ]);

  for (const key of Object.keys(catalog)) {
    if (!allowedRootProps.has(key)) {
      errors.push(`Disallowed root property '${key}' violates catalog_definition additionalProperties: false.`);
    }
  }

  // 2. protocolVersion must be "1.0" or semantic version
  if (!catalog.protocolVersion) {
    errors.push(`Missing 'protocolVersion' at catalog root (defaults to legacy '0.9' if omitted).`);
  } else if (!/^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)/.test(catalog.protocolVersion)) {
    errors.push(`Invalid 'protocolVersion' format: '${catalog.protocolVersion}'.`);
  }

  // 3. $id must match catalogId
  if (catalog.$id && catalog.catalogId && catalog.$id !== catalog.catalogId) {
    errors.push(`Root $id ('${catalog.$id}') does not match catalogId ('${catalog.catalogId}').`);
  }

  // 4. Strict $defs boundary: strictly ONLY anyComponent and anyFunction
  if (!catalog.$defs) {
    errors.push(`Missing mandatory root '$defs'.`);
  } else {
    const defKeys = Object.keys(catalog.$defs);
    const requiredDefs = ['anyComponent', 'anyFunction'];
    for (const req of requiredDefs) {
      if (!defKeys.includes(req)) {
        errors.push(`Root '$defs' missing required key '${req}'.`);
      }
    }
    for (const key of defKeys) {
      if (!requiredDefs.includes(key)) {
        errors.push(`Root '$defs' contains disallowed helper key '${key}'. In v1.0 only anyComponent and anyFunction are allowed.`);
      }
    }

    // Check discriminator on anyComponent
    if (catalog.$defs.anyComponent) {
      const anyComp = catalog.$defs.anyComponent;
      if (!anyComp.discriminator || anyComp.discriminator.propertyName !== 'component') {
        errors.push(`Root '$defs.anyComponent' must declare discriminator with propertyName 'component'.`);
      }
      if (!Array.isArray(anyComp.oneOf) || !anyComp.oneOf.length) {
        errors.push(`Root '$defs.anyComponent' must declare non-empty 'oneOf' array of component references.`);
      }
    }
  }

  // 5. Component naming & discriminator checks
  if (catalog.components && typeof catalog.components === 'object') {
    for (const [name, comp] of Object.entries(catalog.components)) {
      if (name === 'Surface') {
        errors.push(`Component name 'Surface' is reserved by A2UI protocol specification.`);
      }
      if (!/^[\p{XID_Start}_][\p{XID_Continue}]*$/u.test(name)) {
        errors.push(`Component name '${name}' violates UAX #31 identifier syntax.`);
      }

      // Check discriminator const in component schema
      const compConst = comp.properties?.component?.const;
      if (compConst !== name) {
        errors.push(`Component '${name}' properties.component.const must match component key (found: '${compConst}').`);
      }

      // Ensure no component defines wire envelope property 'id'
      if (comp.properties?.id) {
        errors.push(`Component '${name}' defines envelope property 'id' in component properties. In v1.0, 'id' belongs strictly to wire protocol envelopes.`);
      }

      // Ensure no legacy allOf wrapping ComponentCommon
      if (Array.isArray(comp.allOf)) {
        for (const item of comp.allOf) {
          if (item.$ref && item.$ref.includes('ComponentCommon')) {
            errors.push(`Component '${name}' uses legacy allOf wrapping ComponentCommon.`);
          }
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Create an Ajv2020 validator for validating component instances against a catalog's anyComponent.
 */
export function createComponentInstanceValidator(catalog, options = {}) {
  const { commonTypes } = loadOfficialSchemas(options.specDir);

  const ajv = new Ajv2020({
    strict: false,
    allErrors: true,
    discriminator: true,
  });

  // Register common_types.json under both canonical ID and relative name
  ajv.addSchema(commonTypes, 'common_types.json');
  ajv.addSchema(commonTypes, new URL('common_types.json', catalog.$id).href);

  // Register catalog under its canonical ID and standard relative alias
  ajv.addSchema(catalog);
  ajv.addSchema({ ...catalog, $id: 'https://a2ui.org/specification/v1_0/catalog.json' });
  ajv.addSchema({ ...catalog, $id: 'catalog.json' });

  const validate = ajv.compile({ $ref: `${catalog.$id}#/$defs/anyComponent` });

  return function validateComponentInstance(instance) {
    const valid = validate(instance);
    return {
      valid: !!valid,
      errors: validate.errors ? [...validate.errors] : [],
    };
  };
}

/**
 * Validate runtime mappings and metadata separately from schema errors (Requirement 12).
 * Distinguishes formal schema validation from verification that a renderer implements the component.
 */
export function validateRuntimeMappings(components, registrations, projectRoot) {
  const root = projectRoot ?? path.resolve(__dirname, '../..');
  const issues = [];
  const warnings = [];

  for (const reg of registrations) {
    const name = reg.name;

    // Check adapter file
    if (!reg.adapterFile) {
      issues.push(`${name}: Missing adapterFile in registration.`);
    } else {
      const fullAdapterPath = path.join(root, reg.adapterFile);
      if (!fs.existsSync(fullAdapterPath)) {
        issues.push(`${name}: Adapter file not found at ${reg.adapterFile}.`);
      } else {
        const adapterCode = fs.readFileSync(fullAdapterPath, 'utf8');
        if (!new RegExp(`export\\s+class\\s+${reg.adapter}\\b`).test(adapterCode)) {
          issues.push(`${name}: Adapter file ${reg.adapterFile} does not export class ${reg.adapter}.`);
        }
      }
    }

    // Check adapter output path
    if (!reg.adapterOutput?.startsWith('src/adapters/')) {
      issues.push(`${name}: Adapter output must target 'src/adapters/' (found: '${reg.adapterOutput}').`);
    }

    // Check fixtures file
    if (!reg.fixturesFile) {
      issues.push(`${name}: Missing fixturesFile in registration.`);
    } else if (!fs.existsSync(path.join(root, reg.fixturesFile))) {
      issues.push(`${name}: Fixtures file not found at ${reg.fixturesFile}.`);
    }

    // Check source files
    for (const src of reg.files ?? []) {
      if (!fs.existsSync(path.join(root, src))) {
        issues.push(`${name}: Source dependency not found at ${src}.`);
      }
    }

    // Check metadata warnings if available
    const compMeta = components?.find((c) => c.name === name);
    if (compMeta?.warnings?.length) {
      for (const w of compMeta.warnings) {
        warnings.push(`${name}: ${w}`);
      }
    }
  }

  return {
    valid: issues.length === 0,
    issues,
    warnings,
  };
}

/**
 * Run a full automated validation suite on a catalog.
 */
export function runValidationSuite(catalog, metadata, registrations, projectRoot, options = {}) {
  const { commonTypes } = loadOfficialSchemas(options.specDir);

  const schemaValidator = createCatalogValidator(options);
  const schemaResult = schemaValidator(catalog);

  const structuralResult = validateCatalogStructuralRules(catalog);
  const referenceResult = validateCatalogReferences(catalog, commonTypes);

  const instanceValidator = createComponentInstanceValidator(catalog, options);

  // Representative test instances: positive and negative cases covering literals, @path bindings,
  // requiredness, unions, enums, wrong types, disallowed properties, and discriminators.
  const testInstances = [
    // 1. FinanceMetricCard valid literal
    {
      name: 'FinanceMetricCard (valid literal number)',
      instance: {
        component: 'FinanceMetricCard',
        label: 'Quarterly Revenue',
        value: 1250000,
        format: 'currency',
        currency: 'USD',
        state: 'positive',
      },
      expectValid: true,
    },
    // 2. FinanceMetricCard valid pre-formatted string
    {
      name: 'FinanceMetricCard (valid formatted string value)',
      instance: {
        component: 'FinanceMetricCard',
        label: 'Conversion Rate',
        value: '3.42%',
        format: 'percent',
      },
      expectValid: true,
    },
    // 3. FinanceMetricCard valid dynamic @path binding
    {
      name: 'FinanceMetricCard (valid dynamic @path binding)',
      instance: {
        component: 'FinanceMetricCard',
        label: { '@path': '/kpi/title' },
        value: { '@path': '/kpi/revenue' },
        change: { '@path': '/kpi/delta' },
      },
      expectValid: true,
    },
    // 4. FinanceMetricCard valid dynamic @index function call
    {
      name: 'FinanceMetricCard (valid dynamic @index function call)',
      instance: {
        component: 'FinanceMetricCard',
        label: 'Current Item',
        value: {
          '@call': '@index',
          args: { offset: 1 },
        },
      },
      expectValid: true,
    },
    // 5. MaterialButton valid literal
    {
      name: 'MaterialButton (valid literal)',
      instance: {
        component: 'MaterialButton',
        label: 'Save Changes',
        appearance: 'filled',
        disabled: false,
        action: {
          event: {
            name: 'save_record',
            context: { section: 'billing' },
          },
        },
      },
      expectValid: true,
    },
    // 6. MaterialButton valid dynamic binding and complex action with context
    {
      name: 'MaterialButton (valid bound disabled and event action with context)',
      instance: {
        component: 'MaterialButton',
        label: { '@path': '/buttons/submitText' },
        disabled: { '@path': '/form/isSubmitting' },
        action: {
          event: {
            name: 'submit_form',
            userMessage: 'User submitted the form',
            context: {
              orderId: 'ORD-9872',
              priority: { '@path': '/form/priority' },
            },
          },
        },
      },
      expectValid: true,
    },
    // 7. MaterialCheckbox valid literal
    {
      name: 'MaterialCheckbox (valid literal)',
      instance: {
        component: 'MaterialCheckbox',
        label: 'Accept terms and conditions',
        checked: false,
        disabled: false,
      },
      expectValid: true,
    },
    // 8. MaterialCheckbox valid @path binding and optional action
    {
      name: 'MaterialCheckbox (valid @path binding and action)',
      instance: {
        component: 'MaterialCheckbox',
        label: 'Enable notifications',
        checked: { '@path': '/user/preferences/notifications' },
        action: {
          event: {
            name: 'toggle_notifications',
          },
        },
      },
      expectValid: true,
    },
    // 9. Negative: Missing required label in FinanceMetricCard
    {
      name: 'FinanceMetricCard (negative: missing required label)',
      instance: {
        component: 'FinanceMetricCard',
        value: 100,
      },
      expectValid: false,
    },
    // 10. Negative: Missing required value in FinanceMetricCard
    {
      name: 'FinanceMetricCard (negative: missing required value)',
      instance: {
        component: 'FinanceMetricCard',
        label: 'Missing Value',
      },
      expectValid: false,
    },
    // 11. Negative: Invalid boolean value type in FinanceMetricCard (must be number | string | binding | call)
    {
      name: 'FinanceMetricCard (negative: invalid boolean value type)',
      instance: {
        component: 'FinanceMetricCard',
        label: 'Bad Type',
        value: true,
      },
      expectValid: false,
    },
    // 12. Negative: Legacy { path: ... } binding instead of @path
    {
      name: 'FinanceMetricCard (negative: legacy path binding)',
      instance: {
        component: 'FinanceMetricCard',
        label: 'Revenue',
        value: { path: '/kpi/revenue' },
      },
      expectValid: false,
    },
    // 13. Negative: Missing required action in MaterialButton
    {
      name: 'MaterialButton (negative: missing required action)',
      instance: {
        component: 'MaterialButton',
        label: 'Click Me',
      },
      expectValid: false,
    },
    // 14. Negative: Invalid enum value for appearance in MaterialButton
    {
      name: 'MaterialButton (negative: invalid enum appearance)',
      instance: {
        component: 'MaterialButton',
        label: 'Bad Style',
        appearance: 'neon_glow',
        action: { event: { name: 'click' } },
      },
      expectValid: false,
    },
    // 15. Negative: Action missing required event.name
    {
      name: 'MaterialButton (negative: action event missing name)',
      instance: {
        component: 'MaterialButton',
        label: 'Save',
        action: {
          event: {},
        },
      },
      expectValid: false,
    },
    // 16. Negative: Missing required checked in MaterialCheckbox
    {
      name: 'MaterialCheckbox (negative: missing required checked)',
      instance: {
        component: 'MaterialCheckbox',
        label: 'Unchecked Checkbox',
      },
      expectValid: false,
    },
    // 17. Negative: String value for boolean checked in MaterialCheckbox
    {
      name: 'MaterialCheckbox (negative: string for checked boolean)',
      instance: {
        component: 'MaterialCheckbox',
        label: 'Check me',
        checked: 'yes',
      },
      expectValid: false,
    },
    // 18. Negative: Disallowed extra property under additionalProperties: false
    {
      name: 'MaterialButton (negative: unexpected additional property)',
      instance: {
        component: 'MaterialButton',
        label: 'Button',
        action: { event: { name: 'click' } },
        unexpectedProperty: 999,
      },
      expectValid: false,
    },
    // 19. Negative: Unregistered function call rejected when anyFunction is false
    {
      name: 'FinanceMetricCard (negative: unregistered function call)',
      instance: {
        component: 'FinanceMetricCard',
        label: 'Bad Function',
        value: {
          '@call': 'unregisteredFunction',
          args: {},
        },
      },
      expectValid: false,
    },
    // 20. Negative: Unknown component discriminator
    {
      name: 'UnknownComponent (negative: unknown discriminator)',
      instance: {
        component: 'UnknownWidget',
        title: 'Non-existent',
      },
      expectValid: false,
    },
  ];

  const instanceResults = [];
  let instancesPassed = 0;

  for (const test of testInstances) {
    const res = instanceValidator(test.instance);
    const passed = res.valid === test.expectValid;
    if (passed) instancesPassed++;
    instanceResults.push({
      name: test.name,
      expectValid: test.expectValid,
      actualValid: res.valid,
      passed,
      errors: res.errors,
    });
  }

  const runtimeResults = validateRuntimeMappings(
    metadata,
    registrations,
    projectRoot,
  );

  const allPassed =
    schemaResult.valid &&
    structuralResult.valid &&
    referenceResult.valid &&
    instancesPassed === testInstances.length &&
    runtimeResults.valid;

  return {
    schemaResult,
    structuralResult,
    referenceResult,
    instancesPassed,
    instancesTotal: testInstances.length,
    instanceResults,
    runtimeResults,
    allPassed,
  };
}

// CLI execution entrypoint
if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(__filename)) {
  const root = path.resolve(__dirname, '../..');
  console.log('--- A2UI v1.0 Catalog Validator ---');
  console.log(`Project root: ${root}`);

  try {
    const registrationsPath = path.join(root, 'a2ui/registrations.json');
    const registrations = JSON.parse(fs.readFileSync(registrationsPath, 'utf8'));

    // Resilient index resolution: checks storybook-static first, then falls back to committed fixture
    const indexPath = path.join(root, 'storybook-static/index.json');
    const fixturePath = path.resolve(__dirname, 'fixtures/storybook-index.fixture.json');
    const index = fs.existsSync(indexPath)
      ? JSON.parse(fs.readFileSync(indexPath, 'utf8'))
      : JSON.parse(fs.readFileSync(fixturePath, 'utf8'));

    const { extract } = await import('./metadata.mjs');
    const metadata = extract(root, registrations, index);

    const catalog = generateCatalogV1(root, { registrations, index });
    console.log(`Generated catalog with ${Object.keys(catalog.components).length} components.`);

    const report = runValidationSuite(catalog, metadata, registrations, root);

    console.log(`\n1. Meta-schema validation: ${report.schemaResult.valid ? 'PASSED' : 'FAILED'}`);
    if (!report.schemaResult.valid) {
      console.error(JSON.stringify(report.schemaResult.errors, null, 2));
    }

    console.log(`2. Structural rules: ${report.structuralResult.valid ? 'PASSED' : 'FAILED'}`);
    if (!report.structuralResult.valid) {
      console.error(JSON.stringify(report.structuralResult.errors, null, 2));
    }

    console.log(`3. Reference integrity: ${report.referenceResult.valid ? 'PASSED' : 'FAILED'}`);
    if (!report.referenceResult.valid) {
      for (const err of report.referenceResult.errors) {
        console.error(`   ✖ ${err}`);
      }
    }

    console.log(`4. Instance validation: ${report.instancesPassed}/${report.instancesTotal} passed.`);
    for (const item of report.instanceResults) {
      console.log(`   ${item.passed ? '✔' : '✖'} ${item.name}`);
    }

    console.log(`5. Runtime mapping check: ${report.runtimeResults.valid ? 'PASSED' : 'FAILED'}`);
    if (report.runtimeResults.issues.length) {
      for (const issue of report.runtimeResults.issues) {
        console.error(`   ✖ ${issue}`);
      }
    }
    if (report.runtimeResults.warnings.length) {
      for (const warning of report.runtimeResults.warnings) {
        console.warn(`   ! ${warning}`);
      }
    }

    console.log(`\nOverall Result: ${report.allPassed ? 'ALL TESTS PASSED' : 'VALIDATION FAILED'}`);
    process.exit(report.allPassed ? 0 : 1);
  } catch (error) {
    console.error('Fatal error during validation:', error);
    process.exit(1);
  }
}
