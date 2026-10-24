import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { createMetadataProgram, property, unwrap, typeSchema, literal } from './metadata.mjs';
import { evidenceHash, validateReviewedSurface } from './reviewed-surface.mjs';

// TypeScript interns unions in encounter order, including inside generic args.
// Canonicalize the printed type AST so discovery order cannot stale a review.
function canonicalTypeText(text) {
  const ast = ts.createSourceFile('evidence.ts', `type Evidence = ${text};`, ts.ScriptTarget.Latest, true);
  const printer = ts.createPrinter({ removeComments: true });
  const print = (node) => printer.printNode(ts.EmitHint.Unspecified, node, ast);
  const transformed = ts.transform(ast.statements[0].type, [(context) => {
    const visit = (node) => {
      const next = ts.visitEachChild(node, visit, context);
      if (!ts.isUnionTypeNode(next) && !ts.isIntersectionTypeNode(next)) return next;
      const types = [...next.types].sort((a, b) => print(a).localeCompare(print(b), 'en'));
      return ts.isUnionTypeNode(next) ? ts.factory.updateUnionTypeNode(next, types) : ts.factory.updateIntersectionTypeNode(next, types);
    };
    return (node) => ts.visitNode(node, visit);
  }]);
  try { return print(transformed.transformed[0]); }
  finally { transformed.dispose(); }
}

// A completeness check, not a second schema extractor. Official docgen remains
// authoritative for conversion. In particular, omitted inherited props never
// become an apparently complete scalar contract.
export function createReactSourceAudit(root, entries) {
  root = path.resolve(root);
  let program;
  const files = entries.filter((entry) => /\.tsx?$/.test(entry.path)).map((entry) => path.resolve(root, entry.path));
  return (candidate, normalized, docgen, { surface, onEvidence } = {}) => {
    if (!/\.tsx?$/.test(candidate.storyPath)) return surface
      ? [{ code: 'REVIEWED_SURFACE_SOURCE_REQUIRED', message: 'Reviewed surfaces require a resolvable TypeScript source contract.' }] : [];
    const problems = [];
    const issue = (code, message, property) => problems.push({ code, message, ...(property ? { property } : {}) });
    const uncertain = (message) => {
      issue('REACT_SOURCE_AUDIT_UNAVAILABLE', `${candidate.id}: ${message} Source prop completeness cannot be established.`);
      return problems;
    };
    if (!program) {
      // Explicit source roots work even when an Angular tsconfig excludes TSX.
      // Preserve local path aliases, without inheriting Angular-only compilation.
      let options = {};
      const config = ts.findConfigFile(root, ts.sys.fileExists);
      if (config) {
        const read = ts.readConfigFile(config, ts.sys.readFile);
        if (read.error) return uncertain('Cannot read project tsconfig.');
        options = ts.parseJsonConfigFileContent(read.config, ts.sys, path.dirname(config)).options;
      }
      program = createMetadataProgram(files, {
        ...options, module: ts.ModuleKind.ESNext, moduleResolution: ts.ModuleResolutionKind.Bundler,
        jsx: ts.JsxEmit.ReactJSX, strictNullChecks: true, esModuleInterop: true, skipLibCheck: true,
      });
    }
    const checker = program.getTypeChecker();
    const story = program.getSourceFile(path.resolve(root, candidate.storyPath));
    if (!story || program.getSyntacticDiagnostics(story).length) return uncertain('Missing or invalid CSF source.');
    const assignment = story.statements.find((node) => ts.isExportAssignment(node) && !node.isExportEquals);
    if (!assignment) return uncertain('Missing default CSF export.');
    let meta = unwrap(assignment.expression);
    if (ts.isIdentifier(meta)) {
      const declaration = checker.getSymbolAtLocation(meta)?.valueDeclaration;
      if (!declaration?.initializer) return uncertain('Cannot resolve CSF metadata.');
      meta = unwrap(declaration.initializer);
    }
    if (!ts.isObjectLiteralExpression(meta) || meta.properties.some((node) =>
      !ts.isPropertyAssignment(node) || ts.isComputedPropertyName(node.name)))
      return uncertain('CSF metadata must be a declarative object without spreads or computed keys.');
    const component = property(meta, 'component');
    if (!component) {
      issue('MISSING_META_COMPONENT', `${candidate.id}: Specify meta.component referencing the actual source component; wrapper args are not its API.`);
      return problems;
    }
    let symbol = checker.getSymbolAtLocation(unwrap(component));
    if (symbol?.flags & ts.SymbolFlags.Alias) symbol = checker.getAliasedSymbol(symbol);
    const declaration = symbol?.valueDeclaration;
    if (!declaration) return uncertain('Cannot resolve meta.component to a source declaration.');
    const source = declaration.getSourceFile();
    if (surface && (program.getSyntacticDiagnostics(source).length || program.getSemanticDiagnostics(source).length))
      return uncertain('Component source has TypeScript errors; unresolved dependencies cannot authorize a reviewed subset.');
    const relative = path.relative(root, source.fileName);
    if (relative.startsWith('..') || path.isAbsolute(relative) || relative.split(path.sep).includes('node_modules'))
      return uncertain('meta.component must resolve to project-local source.');
    if (!normalized.source || !fs.existsSync(path.resolve(root, normalized.source)) ||
        fs.realpathSync(source.fileName) !== fs.realpathSync(path.resolve(root, normalized.source)))
      return uncertain('meta.component and manifest source file disagree.');
    const moduleSymbol = checker.getSymbolAtLocation(source);
    const exported = moduleSymbol && checker.getExportsOfModule(moduleSymbol).find((item) => item.name === normalized.exportName);
    const resolvedExport = exported?.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported;
    if (resolvedExport !== symbol) return uncertain('meta.component and manifest export identity disagree.');
    const type = checker.getTypeOfSymbolAtLocation(symbol, declaration);
    const signatures = type.getCallSignatures();
    if (signatures.length !== 1 || !signatures[0].parameters.length)
      return uncertain('Expected one unambiguous React function props signature.');
    const parameter = signatures[0].parameters[0];
    const props = checker.getTypeOfSymbolAtLocation(parameter, parameter.valueDeclaration ?? declaration);
    if (props.flags & (ts.TypeFlags.Any | ts.TypeFlags.Unknown) || props.isUnion() || checker.getIndexInfosOfType(props).length)
      return uncertain('Unresolved, union or open-ended props require a reviewed contract.');
    const sourceProps = props.getProperties();
    if (!sourceProps.length) return uncertain('No source props were resolved.');
    const names = new Set(sourceProps.map((prop) => prop.name));
    if (surface || onEvidence) {
      const files = new Set([source.fileName, story.fileName]);
      const properties = sourceProps.map((prop) => {
        for (const node of prop.declarations ?? []) files.add(node.getSourceFile().fileName);
        const type = checker.getTypeOfSymbolAtLocation(prop, prop.valueDeclaration ?? declaration);
        return { name: prop.name, required: !(prop.flags & ts.SymbolFlags.Optional), docgenPresent: Object.hasOwn(docgen.props ?? {}, prop.name),
          type: canonicalTypeText(checker.typeToString(type, declaration, ts.TypeFormatFlags.NoTruncation)) };
      }).sort((a, b) => a.name.localeCompare(b.name, 'en'));
      const lockfile = path.join(root, 'package-lock.json');
      if (fs.existsSync(lockfile)) files.add(lockfile);
      const sourceFiles = [...files].map((file) => ({ path: path.relative(root, file).replaceAll('\\', '/'),
        sha256: evidenceHash(fs.readFileSync(file)) })).sort((a, b) => a.path.localeCompare(b.path, 'en'));
      const facts = { properties, sourceFiles, docgenSha256: evidenceHash(JSON.stringify(docgen)) };
      facts.evidenceSha256 = evidenceHash(JSON.stringify(facts));
      onEvidence?.(facts);
      if (surface) {
        validateReviewedSurface(surface, facts, normalized, issue);
        // Bounded to ordinary local functions; wrappers/overloads need a mapping.
        const implementation = ts.isVariableDeclaration(declaration) && declaration.initializer ? unwrap(declaration.initializer) : declaration;
        if (!ts.isFunctionDeclaration(implementation) && !ts.isArrowFunction(implementation) && !ts.isFunctionExpression(implementation))
          return uncertain('Reviewed surfaces require an ordinary local function component.');
        const parameter = implementation.parameters[0];
        for (const name of new Set([...surface.expose, ...normalized.fields.map((field) => field.name)])) {
          const prop = sourceProps.find((item) => item.name === name);
          const field = normalized.fields.find((item) => item.name === name);
          if (!prop || !field) {
            issue('REVIEWED_SURFACE_UNSUPPORTED_PROPERTY', `${name}: exposed fields must have supported scalar docgen metadata; callbacks/actions/content require a real mapping.`, name);
            continue;
          }
          try {
            const schema = typeSchema(checker.getTypeOfSymbolAtLocation(prop, prop.valueDeclaration ?? declaration), checker, name);
            const canonical = (schema) => JSON.stringify({ type: schema.type, ...(schema.enum ? { enum: [...schema.enum].sort() } : {}) });
            if (Object.keys(schema).some((key) => !['type', 'enum'].includes(key)) || canonical(schema) !== canonical(field.schema))
              issue('REVIEWED_SURFACE_TYPE_CONFLICT', `${name}: docgen type/enum differs from the compiler source contract.`, name);
            const binding = ts.isObjectBindingPattern(parameter.name) && parameter.name.elements.find((item) =>
              !item.dotDotDotToken && (item.propertyName ?? item.name).getText() === name);
            const sourceDefault = binding?.initializer ? literal(binding.initializer, `${name} default`) : undefined;
            if (surface.expose.includes(name) && sourceDefault !== field.schema.default)
              issue('REVIEWED_SURFACE_DEFAULT_CONFLICT', `${name}: docgen default differs from the verified local parameter default (inherited defaults require further support).`, name);
          } catch (error) {
            issue('REVIEWED_SURFACE_SOURCE_UNSUPPORTED', error.message, name);
          }
        }
      }
    }
    for (const prop of sourceProps) {
      const metadata = docgen.props?.[prop.name];
      if (!metadata && !(surface && Object.hasOwn(surface.omit, prop.name))) issue('REACT_DOCGEN_PROP_OMITTED',
        `${normalized.name}.${prop.name}: TypeScript declares this prop but Storybook docgen omitted it. Rebuild with complete metadata or implement a reviewed mapping; it cannot be silently dropped.`, prop.name);
      else if (metadata && metadata.required !== !(prop.flags & ts.SymbolFlags.Optional))
        issue('REACT_SOURCE_REQUIREDNESS_MISMATCH', `${normalized.name}.${prop.name}: docgen requiredness disagrees with the source declaration.`, prop.name);
    }
    for (const name of Object.keys(docgen.props ?? {})) if (!names.has(name))
      issue('REACT_DOCGEN_PROP_NOT_IN_SOURCE', `${normalized.name}.${name}: docgen prop is absent from the source contract. Rebuild the manifest.`, name);
    return problems;
  };
}
