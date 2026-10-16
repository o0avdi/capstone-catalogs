export const universalCatalogId = 'https://capstone.example/catalogs/universal-storybook/1.0.0';

function fieldProperty(field) {
  const schema = { ...field.schema };
  const description = schema.description;
  delete schema.description;
  const value = field.binding
    ? { anyOf: [schema, { $ref: '#/$defs/common_types_DataBinding' }] }
    : schema;
  if (description) value.description = description;
  if ('default' in schema) value.default = schema.default;
  return value;
}

export function makeUniversalCatalog(candidates, options = {}) {
  if (!candidates.length) throw new Error('Select at least one component.');
  const catalogId = options.catalogId ?? universalCatalogId;
  const components = {};
  for (const candidate of candidates) {
    if (components[candidate.componentName])
      throw new Error(`Duplicate generated component name ${candidate.componentName}.`);
    components[candidate.componentName] = {
      type: 'object',
      description: candidate.description,
      allOf: [
        { $ref: '#/$defs/common_types_ComponentCommon' },
        { $ref: '#/$defs/catalog_CatalogComponentCommon' },
        {
          type: 'object',
          properties: {
            component: { const: candidate.componentName },
            ...Object.fromEntries(candidate.fields.map((field) => [field.name, fieldProperty(field)])),
          },
          required: [
            'component',
            ...candidate.fields.filter((field) => field.required).map((field) => field.name),
          ],
        },
      ],
      unevaluatedProperties: false,
    };
  }
  return {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: catalogId,
    title: 'Universal Storybook A2UI export',
    description: 'Components discovered from Angular Material and React/Shadcn Storybook sources.',
    catalogId,
    components,
    functions: {},
    $defs: {
      common_types_ComponentCommon: {
        type: 'object',
        properties: { id: { type: 'string', minLength: 1 } },
        required: ['id'],
      },
      catalog_CatalogComponentCommon: { type: 'object', properties: {} },
      common_types_DataBinding: {
        type: 'object',
        properties: { path: { type: 'string', minLength: 1 } },
        required: ['path'],
        additionalProperties: false,
      },
      anyFunction: false,
      anyComponent: {
        oneOf: candidates.map((candidate) => ({
          $ref: `#/components/${candidate.componentName}`,
        })),
      },
    },
  };
}

export function makeMessages(candidates, options = {}) {
  const catalogId = options.catalogId ?? universalCatalogId;
  return Object.fromEntries(
    candidates.map((candidate) => {
      const props = { ...candidate.exampleProps };
      if (!Object.keys(props).length && candidate.variants[0]) props.state = candidate.variants[0];
      return [
        candidate.componentName,
        [
          { version: 'v0.9', createSurface: { surfaceId: 'demo', catalogId } },
          {
            version: 'v0.9',
            updateComponents: {
              surfaceId: 'demo',
              components: [{ id: 'root', component: candidate.componentName, ...props }],
            },
          },
        ],
      ];
    }),
  );
}

export function makeDiagnostics(candidates) {
  return {
    schemaVersion: 1,
    components: candidates.map((candidate) => ({
      id: candidate.id,
      componentName: candidate.componentName,
      framework: candidate.framework,
      library: candidate.library,
      status: candidate.status,
      storyPath: candidate.storyPath,
      sourceFiles: candidate.sourceFiles,
      outputSupport: candidate.outputSupport,
      reasons: candidate.reasons,
    })),
    notes: [
      'JSON is generated from statically readable Storybook metadata and never executes story code.',
      'Portable status means a reviewed component adapter exists.',
      'Custom Shadcn entries use the included React catalog-demo renderer.',
      'Needs-configuration entries require a reviewed renderer adapter before ZIP export.',
    ],
  };
}
