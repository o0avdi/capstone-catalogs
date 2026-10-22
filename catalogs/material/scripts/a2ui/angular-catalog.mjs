import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { createMetadataProgram, literal, property, typeSchema, unwrap } from './metadata.mjs';

function review(context, message) {
  const error = new Error(`${context}: ${message} A reviewed catalog mapping is required before export.`);
  error.code = 'ANGULAR_CATALOG_REVIEW_REQUIRED';
  throw error;
}

function localFile(root, filename) {
  const relative = path.relative(fs.realpathSync(root), fs.realpathSync(filename));
  if (path.isAbsolute(relative) || relative.split(/[\\/]/).some((part) => ['..', 'node_modules'].includes(part)))
    review(filename, 'Only locally authored source declarations are supported.');
  return relative.replaceAll('\\', '/');
}

// Recognize Angular imports, including renamed imports, rather than decorator text.
function angularImport(node, checker) {
  if (ts.isPropertyAccessExpression(node)) {
    const namespace = checker.getSymbolAtLocation(node.expression)?.declarations?.find(ts.isNamespaceImport);
    if (namespace?.parent.parent.moduleSpecifier.text === '@angular/core') return node.name.text;
  }
  const symbol = checker.getSymbolAtLocation(node);
  const declaration = symbol?.declarations?.find(ts.isImportSpecifier);
  if (declaration?.parent.parent.parent.moduleSpecifier.text === '@angular/core')
    return (declaration.propertyName ?? declaration.name).text;
}

function decorators(node, checker) {
  return (ts.getDecorators(node) ?? []).map((decorator) => {
    const expression = decorator.expression;
    return {
      name: ts.isCallExpression(expression) ? angularImport(expression.expression, checker) : undefined,
      expression,
    };
  });
}

function object(node, context) {
  node = unwrap(node);
  if (!ts.isObjectLiteralExpression(node) || node.properties.some((p) =>
    !ts.isPropertyAssignment(p) || ts.isComputedPropertyName(p.name)))
    review(context, 'Expected a declarative object without spreads, methods or computed keys.');
  const names = node.properties.map((p) => p.name.getText().replace(/^['"]|['"]$/g, ''));
  if (new Set(names).size !== names.length) review(context, 'Duplicate metadata keys are ambiguous.');
  return node;
}

function sourceDefault(node, checker, context) {
  if (ts.isPropertyAccessExpression(unwrap(node))) {
    const declaration = checker.getSymbolAtLocation(unwrap(node))?.valueDeclaration;
    const value = declaration && ts.isEnumMember(declaration) ? checker.getConstantValue(declaration) : undefined;
    if (typeof value === 'string' || typeof value === 'number') return value;
  }
  return literal(node, context);
}

/** Bounded catalog-only source extraction. No story code is imported or executed. */
export function createAngularCatalogExtractor(root, candidates) {
  root = path.resolve(root);
  const program = createMetadataProgram(candidates.filter((c) => c.framework === 'angular')
    .map((c) => path.resolve(root, c.storyPath)));
  const checker = program.getTypeChecker();

  return (candidate) => {
    const context = candidate.id;
    if (candidate.framework !== 'angular' || candidate.discovery?.mode !== 'storybook-index')
      review(context, 'An official Angular Storybook v5 index is required.');
    const storyPath = path.resolve(root, candidate.storyPath);
    localFile(root, storyPath);
    const story = program.getSourceFile(storyPath);
    if (program.getSyntacticDiagnostics(story).length) review(context, 'Story contains TypeScript syntax errors.');
    const assignment = story.statements.find((s) => ts.isExportAssignment(s) && !s.isExportEquals);
    if (!assignment) review(context, 'Missing declarative default CSF meta export.');
    let meta = unwrap(assignment.expression);
    if (ts.isIdentifier(meta)) {
      const declaration = checker.getSymbolAtLocation(meta)?.valueDeclaration;
      if (!declaration || !ts.isVariableDeclaration(declaration) || !declaration.initializer)
        review(context, 'Default CSF meta cannot be resolved to a local declaration.');
      meta = unwrap(declaration.initializer);
    }
    meta = object(meta, context);
    const reference = property(meta, 'component');
    if (!reference) review(context, 'Missing resolvable meta.component; story titles and args are not component contracts.');
    let symbol = checker.getSymbolAtLocation(unwrap(reference));
    if (symbol?.flags & ts.SymbolFlags.Alias) symbol = checker.getAliasedSymbol(symbol);
    const declaration = symbol?.valueDeclaration;
    if (!declaration || !ts.isClassDeclaration(declaration) || !declaration.name)
      review(context, 'meta.component must resolve to a named local Angular class.');
    const source = localFile(root, declaration.getSourceFile().fileName);
    if (program.getSyntacticDiagnostics(declaration.getSourceFile()).length)
      review(context, 'Component source contains TypeScript syntax errors.');
    const name = declaration.name.text;
    if (declaration.heritageClauses?.some((clause) => clause.token === ts.SyntaxKind.ExtendsKeyword))
      review(name, 'Inherited inputs and outputs are not automatically supported.');
    if (declaration.members.some(ts.isConstructorDeclaration))
      review(name, 'Constructor initialization requires review of source defaults.');
    const component = decorators(declaration, checker).find((d) => d.name === 'Component');
    if (!component || component.expression.arguments.length !== 1)
      review(name, 'Missing supported @Component declaration.');
    const config = object(component.expression.arguments[0], name);
    for (const key of ['inputs', 'outputs', 'hostDirectives', 'host'])
      if (property(config, key)) review(name, `@Component ${key} semantics are not automatically supported.`);
    let template;
    if (property(config, 'template')) template = literal(property(config, 'template'), name);
    else if (property(config, 'templateUrl')) {
      const filename = path.resolve(path.dirname(declaration.getSourceFile().fileName), literal(property(config, 'templateUrl'), name));
      localFile(root, filename);
      template = fs.readFileSync(filename, 'utf8');
    }
    if (typeof template !== 'string') review(name, 'A static template or local templateUrl is required.');
    if (/<ng-content\b/i.test(template)) review(name, 'Projected content has no reviewed A2UI content mapping.');

    const fields = [];
    for (const member of declaration.members) {
      const memberDecorators = decorators(member, checker);
      if (memberDecorators.some((d) => d.name === 'Output'))
        review(`${name}.${member.name.getText()}`, '@Output has no reviewed A2UI event/payload mapping.');
      if (memberDecorators.some((d) => d.name !== 'Input'))
        review(name, 'Member decorators other than @Input require semantic review.');
      // Signal APIs, including input.required(), must never disappear as ordinary fields.
      if (member.initializer && ts.isCallExpression(unwrap(member.initializer))) {
        const callee = unwrap(member.initializer).expression;
        const api = angularImport(callee, checker) ??
          (ts.isPropertyAccessExpression(callee) ? angularImport(callee.expression, checker) : undefined);
        if (['input', 'output', 'model'].includes(api))
          review(name, 'Signal input/output/model declarations are not automatically supported.');
      }
      const input = memberDecorators.find((d) => d.name === 'Input');
      if (!input) continue;
      if (!ts.isPropertyDeclaration(member) || !ts.isIdentifier(member.name) ||
          member.modifiers?.some((m) => [ts.SyntaxKind.StaticKeyword, ts.SyntaxKind.PrivateKeyword, ts.SyntaxKind.ProtectedKeyword].includes(m.kind)))
        review(name, '@Input must be a public instance property, not an accessor or computed member.');
      const fieldName = member.name.text;
      const fieldContext = `${name}.${fieldName}`;
      if (fieldName === '__proto__') review(fieldContext, 'This property name cannot be preserved by the current generator.');
      if (input.expression.arguments.length > 1) review(fieldContext, 'Unsupported @Input arguments.');
      const options = input.expression.arguments.length ? literal(input.expression.arguments[0], fieldContext) : {};
      if (!options || Array.isArray(options) || typeof options !== 'object' ||
          Object.keys(options).some((key) => key !== 'required') ||
          ('required' in options && typeof options.required !== 'boolean'))
        review(fieldContext, '@Input aliases/transforms or nonliteral requiredness need review.');
      const type = checker.getTypeAtLocation(member);
      if (type.getCallSignatures().length) review(fieldContext, 'Callback inputs have no reviewed event mapping.');
      let schema = typeSchema(type, checker, fieldContext);
      // The existing generator losslessly supports string enums, including a singleton.
      if (schema.type === 'string' && 'const' in schema) schema = { type: 'string', enum: [schema.const] };
      const description = ts.displayPartsToString(checker.getSymbolAtLocation(member.name)?.getDocumentationComment(checker) ?? []);
      if (description) schema.description = description;
      if (member.initializer) {
        const value = sourceDefault(member.initializer, checker, `${fieldContext} default`);
        if (value !== undefined) {
          const types = Array.isArray(schema.type) ? schema.type : [schema.type];
          if (!types.includes(typeof value) || (typeof value === 'number' && !Number.isFinite(value)) ||
              (schema.enum && !schema.enum.includes(value)))
            review(fieldContext, 'Source initializer does not match the supported input type.');
          schema.default = value;
        }
      }
      fields.push({ name: fieldName, schema, required: options.required === true, binding: !schema.enum });
    }
    if (!fields.length) review(name, 'No supported @Input surface; connected/behavioral components need review.');
    if (new Set(fields.map((f) => f.name)).size !== fields.length) review(name, 'Duplicate input declarations.');
    if (/\([^)]*\)\s*=/.test(template)) review(name, 'Template event handlers require review; no A2UI action is inferred.');
    // Inspect only indexed stories. Export filters/renamed stories remain index-owned.
    const indexedNames = new Set(candidate.discovery.stories.map((s) => s.exportName).filter(Boolean));
    if (candidate.discovery.stories.some((s) => !s.exportName))
      review(context, 'Indexed stories need exportName to associate source args without inventing story identities.');
    const storyObjects = story.statements.filter(ts.isVariableStatement)
      .filter((s) => s.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword))
      .flatMap((s) => [...s.declarationList.declarations])
      .filter((d) => indexedNames.has(d.name.getText()) && d.initializer)
      .map((d) => object(d.initializer, context));
    if (storyObjects.length !== indexedNames.size)
      review(context, 'Indexed exports are missing or not declarative story objects; regenerate the official index or review the story form.');
    for (const node of [meta, ...storyObjects]) {
      if (property(node, 'render')) review(name, 'Custom story render semantics require review.');
      if (property(node, 'decorators')) review(name, 'Story decorators require review of wrapper semantics.');
      const args = property(node, 'args');
      if (args) for (const prop of object(args, context).properties) {
        const argName = prop.name.getText().replace(/^['"]|['"]$/g, '');
        if (!fields.some((f) => f.name === argName))
          review(`${name}.${argName}`, 'Story arg is not a source @Input (callback/content/wrapper semantics may be missing).');
      }
    }
    return {
      name, className: name, source, story: candidate.storyPath,
      identity: `${source}#${name}`, candidateId: candidate.id,
      title: candidate.title,
      description: ts.displayPartsToString(symbol.getDocumentationComment(checker)) || `${name} source input contract.`,
      fields, callbacks: [], events: {},
      storyIds: candidate.discovery.stories.map((s) => s.id).sort(),
      warnings: ['Catalog-only contract: story args/controls are examples, not API defaults or type authority; renderer behavior is developer-owned.'],
      // Prevent known-name policies from being applied to unrelated local classes.
      required: ['component', ...fields.filter((f) => f.required).map((f) => f.name)],
    };
  };
}
