import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { extract } from './metadata.mjs';

export const catalogV1Id = 'https://capstone.example/catalogs/finance-material/1.0.0';

export const defaultInstructions = `## Layout & Usage Guidelines

1. Hierarchy: Use Row and Column components to arrange components. Restrict top-level surface components to 'Surface' container roots.
2. Metric Cards: Use FinanceMetricCard for executive KPIs. Support dynamic values via RFC 6901 @path data bindings.
3. Actions: Buttons must specify an action with a unique event name and optional context dictionary.
4. Checkboxes: Bind checkbox checked state to a boolean path in the data model (@path). Decouple two-way data model updates from optional change actions.
5. Functions: Catalog functions use @call wire envelopes.`;

/**
 * Format a single component field into an A2UI v1.0 compliant JSON Schema property.
 */
export function formatFieldPropertyV1(field, componentName) {
  const schema = { ...field.schema };
  const description = schema.description;
  const defaultValue = schema.default;

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

  // 3. String scalars -> common_types.json#/$defs/DynamicString
  if (schema.type === 'string') {
    const prop = {
      $ref: 'common_types.json#/$defs/DynamicString',
    };
    if (description) prop.description = description;
    if (defaultValue !== undefined) prop.default = defaultValue;
    return prop;
  }

  // 4. Boolean scalars -> common_types.json#/$defs/DynamicBoolean
  if (schema.type === 'boolean') {
    const prop = {
      $ref: 'common_types.json#/$defs/DynamicBoolean',
    };
    if (description) prop.description = description;
    if (defaultValue !== undefined) prop.default = defaultValue;
    return prop;
  }

  // 5. Numeric scalars -> common_types.json#/$defs/DynamicNumber
  if (schema.type === 'number') {
    const prop = {
      $ref: 'common_types.json#/$defs/DynamicNumber',
    };
    if (description) prop.description = description;
    if (defaultValue !== undefined) prop.default = defaultValue;
    return prop;
  }

  // Fallback for general dynamic values
  const prop = {
    $ref: 'common_types.json#/$defs/DynamicValue',
  };
  if (description) prop.description = description;
  if (defaultValue !== undefined) prop.default = defaultValue;
  return prop;
}

/**
 * Known action descriptions for explicit registrations.
 */
function getActionDescription(componentName, eventName) {
  if (componentName === 'MaterialButton') {
    return 'Interaction handler dispatched on button click.';
  }
  if (componentName === 'MaterialCheckbox') {
    return 'Interaction handler dispatched when the checkbox state changes.';
  }
  return `Interaction handler dispatched for ${eventName} event.`;
}

/**
 * Determine required properties for a component adhering to A2UI v1.0 specifications.
 * Enforces genuine requiredness rather than wrapper demo controls.
 */
function getRequiredProperties(component) {
  if (Array.isArray(component.required)) {
    return ['component', ...component.required.filter((p) => p !== 'component')];
  }

  // Explicit normative contracts for our three registered components
  if (component.name === 'FinanceMetricCard') {
    return ['component', 'label', 'value'];
  }
  if (component.name === 'MaterialButton') {
    return ['component', 'label', 'action'];
  }
  if (component.name === 'MaterialCheckbox') {
    return ['component', 'label', 'checked'];
  }

  // Fallback for general components: fields with required: true and no default value
  const requiredFields = (component.fields ?? [])
    .filter((f) => f.required && !('default' in f.schema))
    .map((f) => f.name);

  return ['component', ...requiredFields];
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
  const instructions = options.instructions ?? defaultInstructions;

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
      properties[f.name] = formatFieldPropertyV1(f, c.name);
    }

    // Add action properties from registered events
    if (c.events && typeof c.events === 'object') {
      for (const [eventName, propName] of Object.entries(c.events)) {
        if (!properties[propName]) {
          properties[propName] = {
            $ref: 'common_types.json#/$defs/Action',
            description: getActionDescription(c.name, eventName),
          };
        }
      }
    }

    // Determine required list
    const required = getRequiredProperties(c);

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
    functions: {},
    $defs: defs,
  };

  return sortDeterministic(catalog);
}

/**
 * Generate catalog from project registrations and storybook index.
 */
export function generateCatalogV1(projectRoot, options = {}) {
  const root = projectRoot ?? path.resolve(fileURLToPath(import.meta.url), '../../..');
  const registrationsPath = path.join(root, 'a2ui/registrations.json');
  const indexPath = path.join(root, 'storybook-static/index.json');

  if (!fs.existsSync(registrationsPath)) {
    throw new Error(`generateCatalogV1: Registrations file not found at ${registrationsPath}`);
  }
  if (!fs.existsSync(indexPath)) {
    throw new Error(`generateCatalogV1: Storybook index not found at ${indexPath}. Run build-storybook first.`);
  }

  const registrations = JSON.parse(fs.readFileSync(registrationsPath, 'utf8'));
  const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));

  // Use existing extract function to obtain TypeScript AST metadata
  const metadata = extract(root, registrations, index);

  return makeCatalogV1(metadata, options);
}
