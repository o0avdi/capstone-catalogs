import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { createHash } from 'node:crypto';
import { readStorybookIndex } from './storybook-index.mjs';

const STORY_PATTERN = /\.stories\.(?:[cm]?[jt]sx?)$/i;
const SKIP_DIRECTORIES = new Set([
  '.angular',
  '.git',
  'coverage',
  'dist',
  'node_modules',
  'storybook-static',
  'storybook-static-shadcn',
]);

function posix(value) {
  return value.replaceAll('\\', '/');
}

function unwrap(node) {
  while (
    node &&
    (ts.isAsExpression(node) || ts.isSatisfiesExpression(node) || ts.isParenthesizedExpression(node))
  )
    node = node.expression;
  return node;
}

function propertyName(node) {
  return node?.name?.getText().replace(/^['"]|['"]$/g, '');
}

function property(node, name) {
  node = unwrap(node);
  if (!node || !ts.isObjectLiteralExpression(node)) return undefined;
  const match = node.properties.find((item) => propertyName(item) === name);
  return match && ts.isPropertyAssignment(match) ? match.initializer : undefined;
}

function literal(node) {
  node = unwrap(node);
  if (!node) return undefined;
  if (ts.isStringLiteralLike(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (node.kind === ts.SyntaxKind.NullKeyword) return null;
  if (ts.isIdentifier(node) && node.text === 'undefined') return undefined;
  if (ts.isPrefixUnaryExpression(node) && node.operator === ts.SyntaxKind.MinusToken)
    return -literal(node.operand);
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literal);
  if (ts.isObjectLiteralExpression(node)) {
    const result = {};
    for (const item of node.properties) {
      if (!ts.isPropertyAssignment(item)) continue;
      result[propertyName(item)] = literal(item.initializer);
    }
    return result;
  }
  return undefined;
}

function walk(directory, files = []) {
  for (const entry of fs
    .readdirSync(directory, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.isSymbolicLink() || SKIP_DIRECTORIES.has(entry.name)) continue;
    const location = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(location, files);
    else if (STORY_PATTERN.test(entry.name)) files.push(location);
  }
  return files;
}

function schemaFor(value, options) {
  if (Array.isArray(options) && options.length) {
    const type = typeof options[0];
    if (['string', 'number', 'boolean'].includes(type) && options.every((item) => typeof item === type))
      return { type, enum: options };
  }
  if (Array.isArray(value)) return { type: 'array' };
  if (value === null || (value && typeof value === 'object')) return { type: 'object' };
  if (['string', 'number', 'boolean'].includes(typeof value)) return { type: typeof value };
  return { type: 'string' };
}

function safeIdentifier(value) {
  const words = value.split(/[^\p{L}\p{N}_]+/u).filter(Boolean);
  const joined = words.map((word) => word[0]?.toUpperCase() + word.slice(1)).join('');
  return (/^[\p{L}_]/u.test(joined) ? joined : `Component${joined}`) || 'Component';
}

function shadcnSource(root, title) {
  const slug = title.split('/').at(-1).replace(/\s+/g, '-').toLowerCase();
  const candidate = path.join(root, 'src/shadcn/components/ui', `${slug}.tsx`);
  return fs.existsSync(candidate) ? posix(path.relative(root, candidate)) : undefined;
}

function registrations(root) {
  const file = path.join(root, 'a2ui/registrations.json');
  if (!fs.existsSync(file)) return [];
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function parseStory(root, filename, knownRegistrations, indexed) {
  const storyPath = posix(path.relative(root, filename));
  const extension = path.extname(filename).toLowerCase();
  const source = fs.readFileSync(filename, 'utf8');
  const ast = ts.createSourceFile(
    filename,
    source,
    ts.ScriptTarget.Latest,
    true,
    extension === '.tsx' || extension === '.jsx' ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
  const metaDeclaration = ast.statements
    .flatMap((statement) =>
      ts.isVariableStatement(statement) ? [...statement.declarationList.declarations] : [],
    )
    .find((declaration) => declaration.name.getText() === 'meta');
  const meta = unwrap(metaDeclaration?.initializer);
  const title = indexed?.stories[0].title ?? literal(property(meta, 'title')) ?? storyPath.replace(STORY_PATTERN, '');
  const framework = indexed?.framework ?? (extension.endsWith('x') ? 'react' : 'angular');
  const library = title.startsWith('Shadcn/')
    ? 'shadcn'
    : title.startsWith('Material/')
      ? 'angular-material'
      : framework === 'react'
        ? 'react'
        : 'angular';
  const args = literal(property(meta, 'args')) ?? {};
  const argTypes = literal(property(meta, 'argTypes')) ?? {};
  const variants = indexed ? indexed.stories.map((entry) => entry.exportName ?? entry.name) : ast.statements
    .filter(
      (statement) =>
        ts.isVariableStatement(statement) &&
        statement.modifiers?.some((modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword),
    )
    .flatMap((statement) => [...statement.declarationList.declarations])
    .map((declaration) => declaration.name.getText())
    .filter((name) => name !== 'meta')
    .sort();
  const registrationMatches = knownRegistrations.filter(
    (registration) => posix(registration.story).replace(/^\.\//, '') === storyPath,
  );
  const leafName = title.split('/').at(-1);
  const prefix = library === 'shadcn' ? 'Shadcn' : library === 'angular-material' ? 'Material' : '';
  const componentName = registrationMatches[0]?.name ?? `${prefix}${safeIdentifier(leafName)}`;
  const names = new Set([...Object.keys(args), ...Object.keys(argTypes)]);
  const fields = [...names]
    .sort()
    .map((name) => {
      const options = argTypes[name]?.options;
      const schema = schemaFor(args[name], options);
      if (argTypes[name]?.description) schema.description = argTypes[name].description;
      if (args[name] !== undefined && ['string', 'number', 'boolean'].includes(typeof args[name]))
        schema.default = args[name];
      return { name, schema, required: false, binding: ['string', 'number', 'boolean'].includes(schema.type) };
    });
  const sourceFile = library === 'shadcn' ? shadcnSource(root, title) : undefined;
  const rendererSupported = registrationMatches.length === 1 || library === 'shadcn';
  const status = registrationMatches.length === 1
    ? 'portable'
    : library === 'shadcn'
      ? 'custom'
      : 'needs-configuration';
  const reasons = registrationMatches.length > 1
    ? ['Multiple registrations match this story; choose a unique mapping.']
    : registrationMatches.length === 1
      ? ['Explicit registration and renderer adapter are available.']
      : library === 'shadcn'
        ? [
            sourceFile
              ? 'Shadcn source and story states were discovered; the React renderer uses the catalog demo adapter.'
              : 'Story composition was discovered; the React renderer uses its catalog demo implementation.',
          ]
        : ['A2UI JSON can be generated, but a reviewed renderer adapter is still required for ZIP export.'];
  return {
    id: `${indexed ? framework : library}:${storyPath}`,
    name: leafName,
    componentName,
    title,
    framework,
    library,
    storyPath,
    sourceFiles: sourceFile ? [sourceFile] : [],
    registrationName: registrationMatches.length === 1 ? registrationMatches[0].name : null,
    registrationMatches: registrationMatches.map((registration) => registration.name).sort(),
    variants,
    variantCount: variants.length,
    fields,
    exampleProps: Object.fromEntries(
      Object.entries(args).filter(([, value]) => ['string', 'number', 'boolean'].includes(typeof value)),
    ),
    description:
      literal(property(property(meta, 'parameters'), 'docs'))?.description?.component ??
      `${title} discovered from ${storyPath}.`,
    status,
    reasons,
    outputSupport: { json: true, rendererZip: rendererSupported },
    discovery: indexed ? {
      mode: 'storybook-index', ...indexed.provenance,
      stories: indexed.stories, docs: indexed.docs,
      identityBasis: 'project/framework/importPath; componentPath is an observation, not an export identity',
    } : { mode: 'static-fallback', confidence: 'reduced' },
    ...(indexed ? { storyIds: indexed.stories.map((entry) => entry.id) } : {}),
  };
}

export function resolveProjectRoot(input = process.cwd()) {
  const candidate = path.resolve(input);
  if (fs.existsSync(path.join(candidate, 'package.json'))) return candidate;
  const catalog = path.join(candidate, 'catalogs/material');
  if (fs.existsSync(path.join(catalog, 'package.json'))) return catalog;
  throw new Error(`No supported project found at ${candidate}. Expected package.json or catalogs/material/package.json.`);
}

export function discoverProject(input = process.cwd(), { indexes = [], staticDiscovery = false } = {}) {
  const root = resolveProjectRoot(input);
  const knownRegistrations = registrations(root);
  if (staticDiscovery && indexes.length) throw new Error('Choose index discovery or static fallback, not both.');
  const sources = indexes.map((source) => readStorybookIndex(root, source));
  const diagnostics = sources.flatMap((source) => source.diagnostics);
  if (!sources.length) diagnostics.push({ code: 'STATIC_DISCOVERY_FALLBACK',
    message: 'Static fallback used: configured inclusions, story IDs, export filters and framework identity are unverified. Supply --angular-index and/or --react-index.' });
  const storyRoot = path.join(root, 'src');
  if (!sources.length && !fs.existsSync(storyRoot)) throw new Error(`No src directory found in ${root}.`);
  const seen = new Set();
  const storyIds = new Set();
  const candidates = (sources.length ? sources.flatMap((source) =>
    [...source.groups].map(([storyPath, stories]) => {
      if (seen.has(storyPath)) throw new Error(`Story path collision across indexes: ${storyPath}. Supply each local story project once.`);
      seen.add(storyPath);
      for (const story of stories) {
        const key = `${source.provenance.framework}:${story.id}`;
        if (storyIds.has(key)) throw new Error(`Story ID collision across indexes: ${key}.`);
        storyIds.add(key);
      }
      return parseStory(root, path.join(root, storyPath), knownRegistrations, {
        stories, framework: source.provenance.framework, provenance: source.provenance,
        docs: source.docs.filter((entry) => entry.importPath.replaceAll('\\', '/').replace(/^\.\//, '') === storyPath ||
          entry.storiesImports?.some((value) => value.replaceAll('\\', '/').replace(/^\.\//, '') === storyPath)),
      });
    })) : walk(storyRoot).map((filename) => parseStory(root, filename, knownRegistrations)))
    .sort((a, b) => a.id.localeCompare(b.id));
  if (sources.length) {
    for (const candidate of candidates) {
      const stories = candidate.discovery.stories;
      const componentPath = stories[0].componentPath;
      if (!componentPath && !candidate.registrationName) diagnostics.push({
        code: 'COMPONENT_IDENTITY_UNRESOLVED', id: candidate.id,
        message: 'Indexed CSF identity is known; underlying component identity requires a reviewed mapping.',
      });
      const related = candidates.filter((other) => other !== candidate &&
        other.framework === candidate.framework && (other.title === candidate.title ||
          (componentPath && other.discovery.stories.some((entry) => entry.componentPath === componentPath))));
      if (related.length) diagnostics.push({ code: 'COMPONENT_IDENTITY_REQUIRES_REVIEW', id: candidate.id,
        related: related.map((other) => other.id),
        message: 'CSF files remain separate: a shared title/component path does not establish a shared component export.' });
    }
  }
  const collisions = new Map();
  for (const candidate of candidates) {
    const matches = collisions.get(candidate.componentName) ?? [];
    matches.push(candidate);
    collisions.set(candidate.componentName, matches);
  }
  for (const [name, matches] of collisions)
    if (matches.length > 1)
      for (const candidate of matches) {
        candidate.componentName = `${name}${safeIdentifier(path.basename(candidate.storyPath).split('.')[0])}`;
        candidate.reasons.push(`The generated name ${name} collided and was qualified by source file.`);
      }
  // File basenames can also collide; retain deterministic, unique selection names.
  const names = new Map();
  for (const candidate of candidates) names.set(candidate.componentName, (names.get(candidate.componentName) ?? 0) + 1);
  for (const candidate of candidates) if (names.get(candidate.componentName) > 1) {
    candidate.componentName += createHash('sha256').update(candidate.id).digest('hex').slice(0, 12);
    candidate.reasons.push('Name collision qualified with a stable discovery identity hash.');
  }
  return {
    schemaVersion: 1,
    projectRoot: root,
    generatedFrom: sources.length ? 'official Storybook v5 index' : 'static Storybook CSF discovery (fallback)',
    fallbackUsed: !sources.length,
    diagnostics,
    indexSources: sources.map((source) => ({ ...source.provenance, docs: source.docs })),
    candidates,
    summary: {
      total: candidates.length,
      angular: candidates.filter((candidate) => candidate.framework === 'angular').length,
      react: candidates.filter((candidate) => candidate.framework === 'react').length,
      portable: candidates.filter((candidate) => candidate.status === 'portable').length,
      custom: candidates.filter((candidate) => candidate.status === 'custom').length,
      needsConfiguration: candidates.filter((candidate) => candidate.status === 'needs-configuration').length,
    },
  };
}

export function selectCandidates(discovery, selectors) {
  if (!selectors?.length) return [];
  const selected = [];
  for (const selector of selectors) {
    const matches = discovery.candidates.filter(
      (candidate) =>
        candidate.id === selector ||
        candidate.componentName === selector ||
        candidate.registrationName === selector,
    );
    if (!matches.length) throw new Error(`Unknown component ${selector}. Run a2ui-export discover to list names.`);
    if (matches.length > 1) throw new Error(`Ambiguous component ${selector}; use its full discovery id.`);
    if (!selected.includes(matches[0])) selected.push(matches[0]);
  }
  return selected;
}
