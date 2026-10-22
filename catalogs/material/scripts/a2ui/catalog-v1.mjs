import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { extract } from './metadata.mjs';

export const catalogV1Id = 'https://capstone.example/catalogs/finance-material/1.0.0';

/**
 * Reviewed registration policies for known components.
 * Configures explicit normative contracts, action descriptions, and component guidelines
 * without requiring hardcoded component-name branches in the core generator.
 */
export const DEFAULT_REVIEWED_POLICIES = {
  MaterialButton: {
    required: ['component', 'label', 'action'],
    eventDescriptions: {
      click: 'Interaction handler dispatched on button click.',
    },
    instructions:
      "MaterialButton: User interaction trigger. Requires a descriptive 'label' and an 'action' envelope specifying the outbound event name and optional context dictionary.",
  },
  MaterialCheckbox: {
    required: ['component', 'label', 'checked'],
    eventDescriptions: {
      change: 'Interaction handler dispatched when the checkbox state changes.',
    },
    instructions:
      "MaterialCheckbox: Host-owned boolean toggle. Bind 'checked' to a boolean path in the data model (@path). Click interactions emit change events with context.checked; data model updates are host-owned.",
  },
};

/**
 * Generate design and usage instructions relevant to the actually exported components.
 * Omits unexported structural components (like Row or Column) and unused features.
 */
export function generateInstructions(componentNames = [], options = {}) {
  const lines = ['## Layout & Usage Guidelines\n'];
  let step = 1;

  // 1. Surface container requirement
  lines.push(
    `${step++}. Surface Hierarchy: Top-level components must be placed within 'Surface' container roots. Component envelopes supply unique instance IDs via 'id'.`,
  );

  // 2. Container layout - only if container components are actually present
  const hasRow = componentNames.includes('Row');
  const hasColumn = componentNames.includes('Column');
  if (hasRow && hasColumn) {
    lines.push(
      `${step++}. Container Layout: Use Row and Column container components to arrange nested child components.`,
    );
  } else if (hasRow) {
    lines.push(
      `${step++}. Container Layout: Use Row container components to arrange child components horizontally.`,
    );
  } else if (hasColumn) {
    lines.push(
      `${step++}. Container Layout: Use Column container components to arrange child components vertically.`,
    );
  }

  // 3. Component-specific guidelines based on actual exported components
  if (componentNames.includes('FinanceMetricCard')) {
    lines.push(
      `${step++}. FinanceMetricCard: Executive KPI and financial metric displays. Accepts literal numbers, formatted strings, and dynamic data bindings via RFC 6901 @path expressions.`,
    );
  }

  const reviewedPolicies = options.reviewedPolicies ?? DEFAULT_REVIEWED_POLICIES;

  if (componentNames.includes('MaterialButton')) {
    const inst =
      reviewedPolicies.MaterialButton?.instructions ??
      "MaterialButton: Dispatches user interaction events. Must declare an 'action' with a descriptive event name and optional context.";
    lines.push(`${step++}. ${inst}`);
  }

  if (componentNames.includes('MaterialCheckbox')) {
    const inst =
      reviewedPolicies.MaterialCheckbox?.instructions ??
      "MaterialCheckbox: Host-owned boolean toggle. Bind 'checked' to a boolean path in the data model (@path). Click interactions emit change events with context.checked; data model updates are host-owned.";
    lines.push(`${step++}. ${inst}`);
  }

  // Any other exported component with reviewed instructions
  for (const name of componentNames) {
    if (!['FinanceMetricCard', 'MaterialButton', 'MaterialCheckbox', 'Row', 'Column'].includes(name)) {
      if (reviewedPolicies[name]?.instructions) {
        lines.push(`${step++}. ${reviewedPolicies[name].instructions}`);
      }
    }
  }

  // 4. Functions: only mention if catalog defines active functions
  const functionCount = options.functions ? Object.keys(options.functions).length : 0;
  if (functionCount > 0) {
    lines.push(`${step++}. Functions: Active catalog functions are invoked using @call envelopes.`);
  }

  return lines.join('\n');
}

export const defaultInstructions = generateInstructions([
  'FinanceMetricCard',
  'MaterialButton',
  'MaterialCheckbox',
]);

/**
 * Format a single component field into an A2UI v1.0 compliant JSON Schema property.
 * Strictly preserves supported scalar types, unions, enums, and nullability where backed by source evidence.
 * Disallows silent type widening of unrecognized types (objects, callbacks, React nodes, functions, unknown generics)
 * into DynamicValue without explicit reviewed schema mappings.
 */
export function formatFieldPropertyV1(field, componentName, options = {}) {
  // Check for explicit reviewed property schema override
  const reviewedSchema =
    options.reviewedPropertySchemas?.[componentName]?.[field.name] ??
    field.reviewedSchema;
  if (reviewedSchema) {
    return reviewedSchema;
  }

  const schema = { ...field.schema };
  const description = schema.description ?? field.description;
  const defaultValue = schema.default ?? field.default;

  // 1. Union scalar types like number | string (e.g. value and change in FinanceMetricCard)
  const isNumberStringUnion =
    (Array.isArray(schema.type) &&
      schema.type.includes('number') &&
      schema.type.includes('string')) ||
    (Array.isArray(schema.anyOf) &&
      schema.anyOf.some((s) => s.type === 'number') &&
      schema.anyOf.some((s) => s.type === 'string'));

  if (isNumberStringUnion) {
    const prop = {
      description:
        description ??
        `Dynamic metric value supporting literal numbers, strings, @path bindings, or function calls.`,
      oneOf: [
        { type: 'number' },
        { type: 'string' },
        { $ref: 'common_types.json#/$defs/DataBinding' },
        { $ref: 'common_types.json#/$defs/FunctionCall' },
      ],
    };
    if (defaultValue !== undefined) prop.default = defaultValue;
    return prop;
  }

  // 2. String enums with fixed allowed values (e.g. format, appearance, state)
  if (schema.enum && Array.isArray(schema.enum)) {
    const prop = {
      type: 'string',
      enum: [...schema.enum].sort(),
    };
    if (description) prop.description = description;
    if (defaultValue !== undefined) prop.default = defaultValue;
    return prop;
  }

  // 3. Nullable supported scalars (backed by source evidence e.g. string | null, number | null, boolean | null)
  const isNullableString =
    (Array.isArray(schema.type) && schema.type.includes('string') && schema.type.includes('null')) ||
    (schema.type === 'string' && schema.nullable === true);
  if (isNullableString) {
    const prop = {
      oneOf: [
        { type: 'string' },
        { type: 'null' },
        { $ref: 'common_types.json#/$defs/DataBinding' },
        { $ref: 'common_types.json#/$defs/FunctionCall' },
      ],
    };
    if (description) prop.description = description;
    if (defaultValue !== undefined) prop.default = defaultValue;
    return prop;
  }

  const isNullableNumber =
    (Array.isArray(schema.type) && schema.type.includes('number') && schema.type.includes('null')) ||
    (schema.type === 'number' && schema.nullable === true);
  if (isNullableNumber) {
    const prop = {
      oneOf: [
        { type: 'number' },
        { type: 'null' },
        { $ref: 'common_types.json#/$defs/DataBinding' },
        { $ref: 'common_types.json#/$defs/FunctionCall' },
      ],
    };
    if (description) prop.description = description;
    if (defaultValue !== undefined) prop.default = defaultValue;
    return prop;
  }

  const isNullableBoolean =
    (Array.isArray(schema.type) && schema.type.includes('boolean') && schema.type.includes('null')) ||
    (schema.type === 'boolean' && schema.nullable === true);
  if (isNullableBoolean) {
    const prop = {
      oneOf: [
        { type: 'boolean' },
        { type: 'null' },
        { $ref: 'common_types.json#/$defs/DataBinding' },
        { $ref: 'common_types.json#/$defs/FunctionCall' },
      ],
    };
    if (description) prop.description = description;
    if (defaultValue !== undefined) prop.default = defaultValue;
    return prop;
  }

  // 4. String scalars -> common_types.json#/$defs/DynamicString
  if (schema.type === 'string') {
    const prop = {
      $ref: 'common_types.json#/$defs/DynamicString',
    };
    if (description) prop.description = description;
    if (defaultValue !== undefined) prop.default = defaultValue;
    return prop;
  }

  // 5. Boolean scalars -> common_types.json#/$defs/DynamicBoolean
  if (schema.type === 'boolean') {
    const prop = {
      $ref: 'common_types.json#/$defs/DynamicBoolean',
    };
    if (description) prop.description = description;
    if (defaultValue !== undefined) prop.default = defaultValue;
    return prop;
  }

  // 6. Numeric scalars -> common_types.json#/$defs/DynamicNumber
  if (schema.type === 'number') {
    const prop = {
      $ref: 'common_types.json#/$defs/DynamicNumber',
    };
    if (description) prop.description = description;
    if (defaultValue !== undefined) prop.default = defaultValue;
    return prop;
  }

  // 7. String list (array of strings) -> common_types.json#/$defs/DynamicStringList
  if (schema.type === 'array' && schema.items?.type === 'string') {
    const prop = {
      $ref: 'common_types.json#/$defs/DynamicStringList',
    };
    if (description) prop.description = description;
    if (defaultValue !== undefined) prop.default = defaultValue;
    return prop;
  }

  // 8. Unsupported types: reject silent type widening into DynamicValue
  const typeSummary = schema.type ? JSON.stringify(schema.type) : (schema.$ref ?? 'unspecified/unknown');
  const errorMessage = `Unsupported property type for '${componentName}.${field.name}' (${typeSummary}). A2UI v1.0 exporter does not permit widening unrecognized types (arbitrary objects, callbacks, React nodes, functions, unknown generics) into DynamicValue without an explicit reviewed schema.`;

  if (options.diagnostics && Array.isArray(options.diagnostics)) {
    options.diagnostics.push({
      component: componentName,
      field: field.name,
      message: errorMessage,
    });
    return null;
  }

  throw new Error(errorMessage);
}

/**
 * Determine action property description from explicit reviewed policies or event metadata.
 */
function getActionDescription(componentName, eventName, options = {}) {
  const policy =
    options.reviewedPolicies?.[componentName] ??
    DEFAULT_REVIEWED_POLICIES[componentName];

  if (policy?.eventDescriptions?.[eventName]) {
    return policy.eventDescriptions[eventName];
  }
  return `Interaction handler dispatched for ${eventName} event.`;
}

/**
 * Determine required properties for a component adhering to A2UI v1.0 specifications.
 * Enforces genuine requiredness from extracted source contracts and explicit reviewed policies.
 * A JSON Schema default does NOT make a property optional.
 */
export function getRequiredProperties(component, options = {}) {
  // 1. Explicit required list on component or metadata
  if (Array.isArray(component.required)) {
    return ['component', ...component.required.filter((p) => p !== 'component')];
  }
  if (Array.isArray(component.requiredProperties)) {
    return ['component', ...component.requiredProperties.filter((p) => p !== 'component')];
  }

  // 2. Explicit reviewed policy from options or default reviewed policies
  const policy =
    options.reviewedPolicies?.[component.name] ??
    component.policy ??
    DEFAULT_REVIEWED_POLICIES[component.name];

  if (policy && Array.isArray(policy.required)) {
    return ['component', ...policy.required.filter((p) => p !== 'component')];
  }

  // 3. Extracted source requiredness: all fields where required === true
  // Note: A JSON Schema default does NOT make a property optional.
  const requiredFields = (component.fields ?? [])
    .filter((f) => f.required === true)
    .map((f) => f.name);

  // If policy or component designates required event actions
  const requiredEvents = policy?.requiredEvents ?? component.requiredEvents ?? [];
  const eventActionNames = requiredEvents
    .map((evt) => component.events?.[evt] ?? evt)
    .filter(Boolean);

  const combined = new Set(['component', ...requiredFields, ...eventActionNames]);
  return [...combined];
}

/**
 * Deep sort object keys to ensure deterministic serialization.
 */
export function sortDeterministic(value) {
  if (value === null || typeof value !== 'object') {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(sortDeterministic);
  }
  const sorted = {};
  for (const key of Object.keys(value).sort()) {
    sorted[key] = sortDeterministic(value[key]);
  }
  return sorted;
}

/**
 * Generate a strict A2UI v1.0 Catalog Definition from component metadata.
 */
export function makeCatalogV1(components, options = {}) {
  if (!components || !components.length) {
    throw new Error('makeCatalogV1: At least one supported component definition is required.');
  }

  const catalogId = options.catalogId ?? catalogV1Id;
  const title = options.title ?? 'Finance and Material A2UI Catalog';
  const description =
    options.description ??
    'Standardized components exported from Angular Material and finance widgets.';

  const componentSchemas = {};
  const componentNames = [];

  for (const c of components) {
    if (!c.name || typeof c.name !== 'string') {
      throw new Error(`makeCatalogV1: Component missing valid name.`);
    }

    if (c.name === 'Surface') {
      throw new Error(`makeCatalogV1: Component name 'Surface' is reserved by the A2UI specification.`);
    }

    if (!/^[\p{XID_Start}_][\p{XID_Continue}]*$/u.test(c.name)) {
      throw new Error(`makeCatalogV1: Component name '${c.name}' violates UAX #31 identifier syntax.`);
    }

    componentNames.push(c.name);

    // Build component properties
    const properties = {
      component: { const: c.name },
    };

    // Add fields
    for (const f of c.fields ?? []) {
      const prop = formatFieldPropertyV1(f, c.name, options);
      if (prop !== null) {
        properties[f.name] = prop;
      }
    }

    // Add action properties from registered events
    if (c.events && typeof c.events === 'object') {
      for (const [eventName, propName] of Object.entries(c.events)) {
        if (!properties[propName]) {
          properties[propName] = {
            $ref: 'common_types.json#/$defs/Action',
            description: getActionDescription(c.name, eventName, options),
          };
        }
      }
    }

    // Determine required list
    const required = getRequiredProperties(c, options);

    const schema = {
      type: 'object',
      description:
        c.description ??
        `${c.name} component definition exported from Angular Material and finance widgets.`,
      properties,
      required,
      additionalProperties: false,
    };

    if (Array.isArray(c.allowedParents) && c.allowedParents.length) {
      schema.allowedParents = [...new Set(c.allowedParents)].sort();
    }
    if (Array.isArray(c.allowedChildren) && c.allowedChildren.length) {
      schema.allowedChildren = [...new Set(c.allowedChildren)].sort();
    }

    componentSchemas[c.name] = schema;
  }

  const instructions =
    options.instructions ??
    generateInstructions(componentNames, {
      ...options,
      functions: options.functions ?? {},
    });

  // Synthesize root $defs strictly containing ONLY anyComponent and anyFunction
  const defs = {
    anyComponent: {
      oneOf: componentNames.sort().map((name) => ({
        $ref: `#/components/${name}`,
      })),
      discriminator: {
        propertyName: 'component',
      },
    },
    anyFunction: false,
  };

  const catalog = {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: catalogId,
    protocolVersion: '1.0',
    title,
    description,
    catalogId,
    instructions,
    components: componentSchemas,
    functions: options.functions ?? {},
    $defs: defs,
  };

  return sortDeterministic(catalog);
}

/**
 * Generate catalog from project registrations and storybook index.
 * Supports explicit index and registration injection, and falls back to committed
 * fixtures when storybook-static is absent in a fresh checkout.
 */
export function generateCatalogV1(projectRoot, options = {}) {
  const root = projectRoot ?? path.resolve(fileURLToPath(import.meta.url), '../../..');
  const registrationsPath =
    options.registrationsPath ?? path.join(root, 'a2ui/registrations.json');

  let registrations = options.registrations;
  if (!registrations) {
    if (!fs.existsSync(registrationsPath)) {
      throw new Error(`generateCatalogV1: Registrations file not found at ${registrationsPath}`);
    }
    registrations = JSON.parse(fs.readFileSync(registrationsPath, 'utf8'));
  }

  let index = options.index;
  if (!index) {
    const indexPath = options.indexPath ?? path.join(root, 'storybook-static/index.json');
    if (fs.existsSync(indexPath)) {
      index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    } else {
      // Fallback to reproducible committed fixture when storybook-static is absent (e.g. fresh checkout)
      const fixturePath = path.resolve(
        path.dirname(fileURLToPath(import.meta.url)),
        'fixtures/storybook-index.fixture.json',
      );
      if (fs.existsSync(fixturePath)) {
        index = JSON.parse(fs.readFileSync(fixturePath, 'utf8'));
      } else {
        throw new Error(
          `generateCatalogV1: Storybook index not found at ${indexPath} or fixture ${fixturePath}. Run build-storybook first.`,
        );
      }
    }
  }

  // Use existing extract function to obtain TypeScript AST metadata
  const metadata = extract(root, registrations, index);

  return makeCatalogV1(metadata, options);
}
