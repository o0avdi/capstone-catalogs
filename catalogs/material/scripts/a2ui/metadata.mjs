import ts from 'typescript';
import fs from 'node:fs';
import path from 'node:path';

export const catalogId = 'https://capstone.example/catalogs/finance-material/1.0.0';
export function discover(index, registrations) {
  const entries = Object.values(index.entries ?? {});
  return registrations.map((r) => {
    const stories = entries.filter(
      (e) =>
        e.type === 'story' &&
        !e.refId &&
        e.importPath?.replaceAll('\\', '/').replace(/^\.\//, '') === r.story,
    );
    const ids = [...new Set(stories.map((e) => e.id))].sort();
    if (!ids.length)
      throw new Error(
        `${r.name}: no local stories discovered in index.json for ${r.story}. Run build-storybook.`,
      );
    return { ...r, storyIds: ids };
  });
}
export function unwrap(n) {
  while (ts.isAsExpression(n) || ts.isSatisfiesExpression(n) || ts.isParenthesizedExpression(n))
    n = n.expression;
  return n;
}
export function property(node, name) {
  const p = unwrap(node).properties?.find(
    (p) => p.name?.getText().replace(/^['"]|['"]$/g, '') === name,
  );
  return p && ts.isPropertyAssignment(p) ? p.initializer : undefined;
}
export function literal(node, context) {
  node = unwrap(node);
  if (ts.isStringLiteralLike(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (ts.isIdentifier(node) && node.text === 'undefined') return undefined;
  if (ts.isPrefixUnaryExpression(node) && node.operator === ts.SyntaxKind.MinusToken)
    return -literal(node.operand, context);
  if (ts.isArrayLiteralExpression(node)) return node.elements.map((n) => literal(n, context));
  if (ts.isObjectLiteralExpression(node)) {
    return Object.fromEntries(
      node.properties.map((p) => {
        if (!ts.isPropertyAssignment(p))
          throw new Error(
            `${context}: unsupported spread/shorthand metadata; use declarative literals.`,
          );
        return [p.name.getText().replace(/^['"]|['"]$/g, ''), literal(p.initializer, context)];
      }),
    );
  }
  throw new Error(
    `${context}: unsupported metadata expression ${node.getText()}; use a literal or explicit registration.`,
  );
}
export function typeSchema(type, checker, context) {
  if (type.isUnion()) {
    const schemas = type.types
      .filter((t) => !(t.flags & ts.TypeFlags.Undefined))
      .map((t) => typeSchema(t, checker, context));
    if (schemas.length === 2 && schemas.every((s) => s.type === 'boolean'))
      return { type: 'boolean' };
    if (schemas.length && schemas.every((s) => 'const' in s && s.type === schemas[0].type))
      return { type: typeof schemas[0].const, enum: schemas.map((s) => s.const) };
    const types = [...new Set(schemas.map((s) => s.type))];
    if (schemas.every((s) => Object.keys(s).length === 1))
      return { type: types.length === 1 ? types[0] : types };
    return { anyOf: schemas };
  }
  if (type.flags & ts.TypeFlags.StringLiteral) return { type: 'string', const: type.value };
  if (type.flags & ts.TypeFlags.NumberLiteral) return { type: 'number', const: type.value };
  if (type.flags & ts.TypeFlags.BooleanLiteral)
    return { type: 'boolean', const: type.intrinsicName === 'true' };
  if (type.flags & ts.TypeFlags.String) return { type: 'string' };
  if (type.flags & ts.TypeFlags.Number) return { type: 'number' };
  if (type.flags & ts.TypeFlags.Boolean) return { type: 'boolean' };
  throw new Error(
    `${context}: unsupported type ${checker.typeToString(type)}; add an explicit schema and runtime mapping.`,
  );
}
export function createMetadataProgram(files) {
  return ts.createProgram(files, {
    experimentalDecorators: true, strictNullChecks: true, target: ts.ScriptTarget.ES2022,
  });
}

// Catalog extraction keeps reviewed source/event mappings but does not require
// packaging inputs. Legacy callers retain all adapter and portability checks.
export function extract(root, registrations, index, { catalogOnly = false } = {}) {
  for (const r of registrations) {
    for (const file of [r.story, r.source].filter(Boolean))
      if (path.isAbsolute(file) || file.split(/[\\/]/).includes('..'))
        throw new Error(r.name + ': source paths must be relative and inside the project: ' + file);
  }
  for (const r of catalogOnly ? [] : registrations) {
    if (
      !/^[A-Za-z_$][\w$]*$/.test(r.adapter) ||
      !r.adapterFile ||
      !fs.existsSync(path.join(root, r.adapterFile))
    )
      throw new Error(r.name + ': missing supported adapter mapping ' + r.adapter);
    for (const file of [
      r.story,
      r.source,
      r.adapterFile,
      r.fixturesFile,
      r.adapterOutput,
      ...(r.publicExports ?? []),
      ...(r.assets ?? []).flatMap((a) => [a.source, a.output]),
      ...r.files,
    ].filter(Boolean)) {
      if (path.isAbsolute(file) || file.split(/[\\/]/).includes('..'))
        throw new Error(r.name + ': source paths must be relative and inside the project: ' + file);
    }
    if (
      !r.fixturesFile ||
      !fs.existsSync(path.join(root, r.fixturesFile)) ||
      !r.adapterOutput?.startsWith('src/adapters/')
    )
      throw new Error(r.name + ': missing adapter output or fixture file mapping');
    const adapter = ts.createSourceFile(
      r.adapterFile,
      fs.readFileSync(path.join(root, r.adapterFile), 'utf8'),
      ts.ScriptTarget.Latest,
    );
    if (
      !adapter.statements.some(
        (s) =>
          ts.isClassDeclaration(s) &&
          s.name?.text === r.adapter &&
          s.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword),
      )
    )
      throw new Error(r.name + ': adapter file must export ' + r.adapter);
    if (r.source && !r.files.includes(r.source))
      throw new Error(r.name + ': component source missing from file allowlist');
    for (const file of r.files) {
      const ast = ts.createSourceFile(
        file,
        fs.readFileSync(path.join(root, file), 'utf8'),
        ts.ScriptTarget.Latest,
      );
      for (const declaration of ast.statements.filter(ts.isImportDeclaration)) {
        const specifier = declaration.moduleSpecifier.text;
        if (!specifier.startsWith('.')) continue;
        const local = path
          .relative(root, path.resolve(root, path.dirname(file), specifier + '.ts'))
          .replaceAll('\\', '/');
        if (!r.files.includes(local))
          throw new Error(
            r.name + ': missing local source dependency ' + local + ' in files allowlist',
          );
      }
    }
  }
  const selected = discover(index, registrations);
  if (new Set(selected.map((r) => r.name)).size !== selected.length)
    throw new Error('Component identity collision in registrations.');
  if (!catalogOnly && new Set(selected.map((r) => r.adapterOutput)).size !== selected.length)
    throw new Error('Adapter output collision in registrations');
  const program = createMetadataProgram(
    selected.flatMap((r) => [r.story, r.source].filter(Boolean).map((f) => path.join(root, f))),
  );
  const checker = program.getTypeChecker();
  return selected.map((r) => {
    const story = program.getSourceFile(path.join(root, r.story));
    const metaDeclaration = story.statements
      .flatMap((s) => (ts.isVariableStatement(s) ? [...s.declarationList.declarations] : []))
      .find((d) => d.name.getText() === 'meta');
    if (!metaDeclaration?.initializer)
      throw new Error(`${r.name}: expected declarative const meta.`);
    const meta = unwrap(metaDeclaration.initializer);
    const read = (node, key) => {
      const n = property(node, key);
      return n ? literal(n, `${r.story}:${key}`) : undefined;
    };
    const callbackMappings = r.callbacks ?? {};
    const readArgs = (node) => {
      const value = property(node, 'args');
      if (!value) return {};
      const object = unwrap(value);
      if (!ts.isObjectLiteralExpression(object))
        throw new Error(r.name + ': args must be declarative object literals');
      const result = {};
      for (const p of object.properties) {
        if (!ts.isPropertyAssignment(p))
          throw new Error(r.name + ': unsupported spread/shorthand args');
        const name = p.name.getText().replace(/^['"]|['"]$/g, '');
        const mapping = callbackMappings[name];
        if (mapping) {
          const expression = p.initializer.getText();
          // Registered Storybook spies are provenance only. Never execute callbacks.
          const spyImport = story.statements.some(
            (s) =>
              ts.isImportDeclaration(s) &&
              s.moduleSpecifier.text === 'storybook/test' &&
              s.importClause?.namedBindings?.elements?.some(
                (e) => e.name.text === 'fn' && !e.propertyName,
              ),
          );
          if (mapping.exampleExpression !== 'fn()' || expression !== 'fn()' || !spyImport)
            throw new Error(
              r.name +
                '.' +
                name +
                ': unsupported callback expression ' +
                expression +
                '; only explicitly mapped Storybook fn() spies are supported',
            );
        } else result[name] = literal(p.initializer, r.story + ':args.' + name);
      }
      return result;
    };
    const args = readArgs(meta);
    const argTypes = read(meta, 'argTypes') ?? {};
    const params = read(meta, 'parameters') ?? {};
    const file = r.source ? program.getSourceFile(path.join(root, r.source)) : story;
    const declaration = file.statements.find((n) =>
      r.source
        ? ts.isClassDeclaration(n) && n.name?.text === r.className
        : ts.isTypeAliasDeclaration(n) && n.name.text === r.typeName,
    );
    if (!declaration) throw new Error(`${r.name}: missing source class/type.`);
    const members = r.source
      ? declaration.members.filter(
          (n) =>
            ts.isPropertyDeclaration(n) &&
            ts.getDecorators(n)?.some((d) => d.expression.getText().startsWith('Input(')),
        )
      : declaration.type.members;
    const callbacks = [];
    const inputMembers = members.filter((m) => {
      const name = m.name.getText();
      const mapping = callbackMappings[name];
      const type = checker.getTypeAtLocation(m);
      const signatures = type.getCallSignatures();
      if (!mapping) {
        if (signatures.length)
          throw new Error(
            r.name + '.' + name + ': unsupported callback; register its event mapping explicitly',
          );
        return true;
      }
      if (signatures.length !== 1)
        throw new Error(r.name + '.' + name + ': expected one callback signature');
      const signature = signatures[0];
      const parameters = signature.parameters.map((parameter) => ({
        name: parameter.name,
        schema: typeSchema(
          checker.getTypeOfSymbolAtLocation(parameter, m),
          checker,
          r.name + '.' + name,
        ),
      }));
      if (
        checker.typeToString(signature.getReturnType()) !== 'void' ||
        JSON.stringify(parameters) !== JSON.stringify(mapping.parameters)
      )
        throw new Error(
          r.name + '.' + name + ': callback signature conflicts with registered mapping',
        );
      if (
        r.events?.[mapping.event] !== mapping.property ||
        !mapping.payload ||
        Object.keys(mapping.payload).length !== parameters.length ||
        parameters.some((p) => mapping.payload[p.name] !== '$event.' + p.name)
      )
        throw new Error(r.name + '.' + name + ': missing callback event/payload mapping');
      callbacks.push({
        name,
        parameters,
        event: mapping.event,
        property: mapping.property,
        payload: mapping.payload,
        exampleExpression: mapping.exampleExpression,
        modelUpdate: mapping.modelUpdate,
      });
      return false;
    });
    for (const name of Object.keys(callbackMappings))
      if (!callbacks.some((c) => c.name === name))
        throw new Error(r.name + '.' + name + ': callback mapping missing from source');
    const fields = inputMembers.map((m) => {
      const name = m.name.getText();
      if (!r.bindings.includes(name))
        throw new Error(`${r.name}.${name}: missing binding/adapter mapping.`);
      if (r.source) {
        const input = ts
          .getDecorators(m)
          .find((d) => d.expression.getText().startsWith('Input(')).expression;
        if (input.arguments.length > 1)
          throw new Error(r.name + '.' + name + ': unsupported Input arguments');
        if (input.arguments[0]) {
          const options = literal(input.arguments[0], r.name + '.' + name + ' Input');
          if (
            !options ||
            typeof options !== 'object' ||
            Object.keys(options).some((k) => k !== 'required')
          )
            throw new Error(
              r.name + '.' + name + ': unsupported Input alias/transform; add an explicit mapping',
            );
        }
      }
      const type = checker.getTypeAtLocation(m);
      let schema = typeSchema(type, checker, `${r.name}.${name}`);
      // Boolean is a union of true/false in the checker; keep the plain boolean contract.
      if (schema.type === 'boolean' && schema.enum?.length === 2) schema = { type: 'boolean' };
      const control = argTypes[name];
      if (
        control?.options &&
        JSON.stringify([...control.options].sort()) !==
          JSON.stringify([...(schema.enum ?? [])].sort())
      )
        throw new Error(`${r.name}.${name}: story options conflict with source enum.`);
      const sourceDescription = ts.displayPartsToString(
        checker.getSymbolAtLocation(m.name)?.getDocumentationComment(checker) ?? [],
      );
      if (control?.description || sourceDescription)
        schema.description = control?.description ?? sourceDescription;
      const required = r.source
        ? ts.getDecorators(m).some((d) => /required:\s*true/.test(d.expression.getText()))
        : !m.questionToken;
      if (m.initializer && !required)
        schema.default = literal(m.initializer, `${r.name}.${name} default`);
      return { name, schema, required, binding: true };
    });
    const examples = story.statements
      .flatMap((s) =>
        ts.isVariableStatement(s) &&
        s.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword)
          ? [...s.declarationList.declarations]
          : [],
      )
      .filter(
        (d) =>
          d.name.getText() !== 'meta' &&
          d.initializer &&
          ts.isObjectLiteralExpression(unwrap(d.initializer)),
      )
      .map((d) => ({ name: d.name.getText(), props: { ...args, ...readArgs(d.initializer) } }));
    const unmapped = r.bindings.filter((name) => !fields.some((f) => f.name === name));
    if (unmapped.length)
      throw new Error(r.name + ': registered fields missing from source: ' + unmapped.join(', '));
    if (!examples.length) throw new Error(r.name + ': no declarative exported story examples');
    for (const example of examples)
      for (const name of Object.keys(example.props))
        if (!fields.some((f) => f.name === name))
          throw new Error(r.name + '.' + name + ': unsupported story arg; add an explicit mapping');
    const warnings = fields
      .filter((f) => argTypes[f.name]?.control === 'number' && Array.isArray(f.schema.type))
      .map(
        (f) =>
          `${r.name}.${f.name}: numeric story control does not narrow source ${f.schema.type.join('|')}.`,
      );
    return {
      ...r,
      title: read(meta, 'title'),
      description:
        params.docs?.description?.component ??
        `${read(meta, 'title')} exported from declarative CSF and source types.`,
      fields,
      callbacks,
      examples,
      warnings,
    };
  });
}
export function makeCatalog(components) {
  if (!components.length) throw new Error('No supported components registered');
  const definitions = {
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
    catalog_EventAction: {
      type: 'object',
      properties: {
        event: {
          type: 'object',
          properties: {
            name: { type: 'string', minLength: 1 },
            context: {
              type: 'object',
              additionalProperties: { type: ['string', 'number', 'boolean'] },
            },
          },
          required: ['name'],
          additionalProperties: false,
        },
      },
      required: ['event'],
      additionalProperties: false,
    },
    anyFunction: false,
  };
  const schemas = Object.fromEntries(
    components.map((c) => {
      const properties = { component: { const: c.name } };
      for (const f of c.fields)
        properties[f.name] = {
          anyOf: [f.schema, { $ref: '#/$defs/common_types_DataBinding' }],
          ...(f.schema.description ? { description: f.schema.description } : {}),
          ...('default' in f.schema ? { default: f.schema.default } : {}),
        };
      for (const property of new Set(Object.values(c.events ?? {})))
        properties[property] = { $ref: '#/$defs/catalog_EventAction' };
      return [
        c.name,
        {
          type: 'object',
          description: c.description,
          allOf: [
            { $ref: '#/$defs/common_types_ComponentCommon' },
            { $ref: '#/$defs/catalog_CatalogComponentCommon' },
            {
              type: 'object',
              properties,
              required: [
                'component',
                ...c.fields.filter((f) => f.required).map((f) => f.name),
                ...new Set(Object.values(c.events ?? {})),
              ],
            },
          ],
          unevaluatedProperties: false,
        },
      ];
    }),
  );
  definitions.anyComponent = {
    oneOf: components.map((c) => ({ $ref: `#/components/${c.name}` })),
  };
  return {
    $schema: 'https://json-schema.org/draft/2020-12/schema',
    $id: catalogId,
    title: 'Finance and Material export',
    description: 'Metadata-driven Angular Storybook export; path bindings and event actions only.',
    catalogId,
    components: schemas,
    functions: {},
    $defs: definitions,
  };
}
