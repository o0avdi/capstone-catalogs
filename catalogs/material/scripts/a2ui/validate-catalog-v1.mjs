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
 * Create an Ajv2020 validator for A2UI v1.0 catalogs using official catalog_definition.json.
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
    const valid = validate(catalog);
    return {
      valid: !!valid,
      errors: validate.errors ? [...validate.errors] : [],
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
export function runValidationSuite(catalog, metadata, registrations, projectRoot) {
  const schemaValidator = createCatalogValidator();
  const schemaResult = schemaValidator(catalog);

  const structuralResult = validateCatalogStructuralRules(catalog);

  const instanceValidator = createComponentInstanceValidator(catalog);

  // Representative test instances
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
    // 4. MaterialButton valid literal
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
    // 5. MaterialButton valid dynamic binding and complex action with context
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
    // 6. MaterialCheckbox valid literal
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
    // 7. MaterialCheckbox valid @path binding and optional action
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
    // 8. Negative: Missing required label in FinanceMetricCard
    {
      name: 'FinanceMetricCard (negative: missing required label)',
      instance: {
        component: 'FinanceMetricCard',
        value: 100,
      },
      expectValid: false,
    },
    // 9. Negative: Missing required value in FinanceMetricCard
    {
      name: 'FinanceMetricCard (negative: missing required value)',
      instance: {
        component: 'FinanceMetricCard',
        label: 'Missing Value',
      },
      expectValid: false,
    },
    // 10. Negative: Invalid boolean value type in FinanceMetricCard
    {
      name: 'FinanceMetricCard (negative: invalid boolean value)',
      instance: {
        component: 'FinanceMetricCard',
        label: 'Bad Type',
        value: true,
      },
      expectValid: false,
    },
    // 11. Negative: Legacy { path: ... } binding instead of @path
    {
      name: 'FinanceMetricCard (negative: legacy path binding)',
      instance: {
        component: 'FinanceMetricCard',
        label: 'Revenue',
        value: { path: '/kpi/revenue' },
      },
      expectValid: false,
    },
    // 12. Negative: Missing required action in MaterialButton
    {
      name: 'MaterialButton (negative: missing required action)',
      instance: {
        component: 'MaterialButton',
        label: 'Click Me',
      },
      expectValid: false,
    },
    // 13. Negative: Missing required checked in MaterialCheckbox
    {
      name: 'MaterialCheckbox (negative: missing required checked)',
      instance: {
        component: 'MaterialCheckbox',
        label: 'Unchecked Checkbox',
      },
      expectValid: false,
    },
    // 14. Negative: Disallowed extra property under additionalProperties: false
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
    // 15. Negative: Unknown component discriminator
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
    instancesPassed === testInstances.length &&
    runtimeResults.valid;

  return {
    schemaResult,
    structuralResult,
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
    const registrations = JSON.parse(fs.readFileSync(path.join(root, 'a2ui/registrations.json'), 'utf8'));
    const index = JSON.parse(fs.readFileSync(path.join(root, 'storybook-static/index.json'), 'utf8'));
    const { extract } = await import('./metadata.mjs');
    const metadata = extract(root, registrations, index);

    const catalog = generateCatalogV1(root);
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

    console.log(`3. Instance validation: ${report.instancesPassed}/${report.instancesTotal} passed.`);
    for (const item of report.instanceResults) {
      console.log(`   ${item.passed ? '✔' : '✖'} ${item.name}`);
    }

    console.log(`4. Runtime mapping check: ${report.runtimeResults.valid ? 'PASSED' : 'FAILED'}`);
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
