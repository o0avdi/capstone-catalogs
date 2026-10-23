import fs from 'node:fs';
import path from 'node:path';
import { extract } from './metadata.mjs';
import { createAngularCatalogExtractor } from './angular-catalog.mjs';
import { createReactCatalogExtractor } from './react-integration.mjs';
import { makeCatalogV1 } from './catalog-v1.mjs';
import {
  createCatalogValidator,
  createComponentInstanceValidator,
  validateCatalogStructuralRules,
} from './validate-catalog-v1.mjs';

const json = (value) => JSON.stringify(value, null, 2) + '\n';
const normalize = (value) => value.replaceAll('\\', '/').replace(/^\.\//, '');

// Bound the integration to field shapes the current generator preserves exactly.
// In particular, do not allow its DynamicValue fallback or discard constraints.
export function assertV1Convertible(components) {
  for (const component of components) {
    for (const field of component.fields) {
      const schema = field.schema;
      const keys = Object.keys(schema);
      const scalar = ['string', 'number', 'boolean'].includes(schema.type);
      const union = Array.isArray(schema.type) && schema.type.length === 2 &&
        schema.type.includes('number') && schema.type.includes('string');
      const stringEnum = schema.type === 'string' && Array.isArray(schema.enum) &&
        schema.enum.length > 0 && schema.enum.every((value) => typeof value === 'string');
      if ((!scalar && !union) || (schema.enum && !stringEnum) ||
          keys.some((key) => !['type', 'enum', 'description', 'default'].includes(key))) {
        throw new Error(`${component.name}.${field.name}: unsupported v1.0 source schema ${JSON.stringify(schema)}. ` +
          'Add a reviewed lossless field conversion to catalog-v1.mjs before exporting this contract.');
      }
    }
  }
}

// Reuse the official validator APIs, compiling component schemas as well as checking
// the meta-schema. The latter alone cannot detect dangling component references.
export function validateV1Export(catalog) {
  const schema = createCatalogValidator()(catalog);
  const structural = validateCatalogStructuralRules(catalog);
  if (!schema.valid || !structural.valid)
    throw new Error(`A2UI v1.0 catalog validation failed: ${json({ schema, structural })}`);
  createComponentInstanceValidator(catalog);
  return { valid: true, schema, structural, componentSchemasCompiled: true };
}

const instructions = 'Use only the components and properties declared in this catalog. ' +
  'Follow each schema for field types, required properties and source defaults; Storybook args are examples. ' +
  'Reviewed event/content mappings apply only to components declaring those properties. ' +
  'The developer implements the renderer and agent. Storybook callbacks are never serialized. ' +
  'Bindings use the A2UI v1.0 @path form. No custom functions are supplied. ' +
  'This export contains catalog JSON only; no v1.0 renderer compatibility is claimed.';

// Used only for readiness discovery/bulk selection. Export re-reads source, so a
// preflight result can never authorize stale contracts or bypass validation.
export function assessV1Readiness(root, candidates, { reactManifest } = {}) {
  const registrationsFile = path.join(root, 'a2ui/registrations.json');
  const registrations = fs.existsSync(registrationsFile) ? JSON.parse(fs.readFileSync(registrationsFile, 'utf8')) : [];
  const unregistered = candidates.filter((c) => c.framework === 'angular' && !c.registrationName);
  const extractAngular = unregistered.length ? createAngularCatalogExtractor(root, unregistered) : undefined;
  const extractReact = candidates.some((c) => c.framework === 'react') ? createReactCatalogExtractor(root, reactManifest) : undefined;
  const results = candidates.map((candidate) => {
    try {
      const matches = registrations.filter((r) => normalize(r.story) === candidate.storyPath);
      let component;
      if (candidate.framework === 'react') component = extractReact(candidate);
      else if (!matches.length) component = extractAngular(candidate);
      else {
        if (matches.length !== 1 || matches[0].name !== candidate.registrationName)
          throw new Error('No unique reviewed Angular source registration.');
        const entries = Object.fromEntries(candidate.discovery.stories.map((entry) => [entry.id, entry]));
        [component] = extract(root, matches, { v: 5, entries }, { catalogOnly: true });
      }
      assertV1Convertible([component]);
      validateV1Export(makeCatalogV1([component], { instructions }));
      return { id: candidate.id, ready: true, name: component.name };
    } catch (error) {
      return { id: candidate.id, ready: false, code: error.code ?? 'UNSUPPORTED_SOURCE_CONTRACT', message: error.message };
    }
  });
  for (const result of results.filter((r) => r.ready)) {
    if (results.filter((r) => r.name === result.name).length > 1) {
      result.ready = false;
      result.code = 'COMPONENT_IDENTITY_COLLISION';
      result.message = `Multiple indexed sources produce ${result.name}; select an individual identity or supply reviewed unique mappings.`;
    }
  }
  return results;
}

export function exportV1Selection({ projectRoot, candidates, outputs, output, discovery, reactManifest }) {
  if (!candidates?.length) throw new Error('Select at least one component.');
  if (!outputs?.length || outputs.some((value) => value !== 'json'))
    throw new Error('Protocol 1.0 supports --outputs json only. ZIP/renderer export requires an implemented and tested v1.0 runtime; existing renderers use v0.9.');
  const root = path.resolve(projectRoot);
  const destination = path.resolve(output);
  if (destination === root || root.startsWith(destination + path.sep))
    throw new Error('Output must not be the project or one of its parent directories.');
  if (fs.existsSync(destination) && fs.readdirSync(destination).length)
    throw new Error(`Output directory is not empty: ${destination}. Use a fresh directory to avoid stale catalogs or v0.9 messages.`);

  const diagnostics = {
    protocolVersion: '1.0', status: 'failed', renderer: { available: false, reason: 'v1.0 runtime compatibility is not implemented or tested.' },
    selected: candidates.map((candidate) => candidate.id),
    discovery: discovery?.diagnostics ?? [], issues: [], warnings: [],
  };
  try {
    if (candidates.some((candidate) => candidate.discovery?.mode !== 'storybook-index'))
      throw new Error('Protocol 1.0 requires official Storybook index discovery; supply --angular-index and/or --react-index.');
    const registrationsFile = path.join(root, 'a2ui/registrations.json');
    const registrations = fs.existsSync(registrationsFile) ? JSON.parse(fs.readFileSync(registrationsFile, 'utf8')) : [];
    const selectedRegistrations = [];
    const unregistered = [];
    const reactCandidates = [];
    for (const candidate of candidates) {
      const matches = registrations.filter((registration) => normalize(registration.story) === candidate.storyPath);
      if (candidate.framework === 'react') {
        reactCandidates.push(candidate);
      } else if (candidate.framework === 'angular' && !matches.length) {
        unregistered.push(candidate);
      } else if (candidate.framework !== 'angular' || matches.length !== 1 || matches[0].name !== candidate.registrationName) {
        diagnostics.issues.push({ code: 'UNSUPPORTED_V1_COMPONENT', id: candidate.id, storyPath: candidate.storyPath,
          message: `${candidate.componentName}: no unique reviewed Angular source registration for v1.0. Add a registration with source class/type, bindings and reviewed content/event/callback semantics. Discovery args are examples and cannot define this schema.` });
      } else selectedRegistrations.push({ ...matches[0], story: candidate.storyPath });
    }
    if (diagnostics.issues.length) throw new Error(diagnostics.issues.map((issue) => issue.message).join('\n'));
    // Only indexed stories from selected candidates enter the existing extractor.
    const entries = Object.fromEntries(candidates.flatMap((candidate) => candidate.discovery.stories).map((entry) => [entry.id, entry]));
    const metadata = selectedRegistrations.length
      ? extract(root, selectedRegistrations, { v: 5, entries }, { catalogOnly: true }) : [];
    if (reactCandidates.length) {
      const extractReact = createReactCatalogExtractor(root, reactManifest);
      for (const candidate of reactCandidates) {
        try { metadata.push(extractReact(candidate)); }
        catch (error) {
          diagnostics.issues.push({ code: error.code ?? 'UNSUPPORTED_V1_COMPONENT',
            id: candidate.id, storyPath: candidate.storyPath, message: error.message, details: error.details ?? [] });
        }
      }
    }
    if (unregistered.length) {
      const extractAngular = createAngularCatalogExtractor(root, unregistered);
      for (const candidate of unregistered) {
        try {
          const component = extractAngular(candidate);
          assertV1Convertible([component]);
          metadata.push(component);
        } catch (error) {
          diagnostics.issues.push({ code: 'UNSUPPORTED_V1_COMPONENT', reasonCode: error.code ?? 'UNSUPPORTED_SOURCE_CONTRACT',
            id: candidate.id, storyPath: candidate.storyPath, message: error.message });
        }
      }
    }
    if (diagnostics.issues.length) throw new Error(diagnostics.issues.map((issue) => issue.message).join('\n'));
    if (new Set(metadata.map((component) => component.name)).size !== metadata.length)
      throw new Error('Component identity collision: selected source classes/registrations share a catalog name. Select one CSF identity or add a reviewed unique mapping.');
    assertV1Convertible(metadata);
    diagnostics.warnings = metadata.flatMap((component) => component.warnings ?? []);
    const catalog = makeCatalogV1(metadata, { instructions,
      ...(reactCandidates.length ? { title: 'Storybook A2UI Catalog',
        description: 'Source contracts exported from official Storybook indexes and component metadata.' } : {}),
    });
    const validation = validateV1Export(catalog);
    const names = metadata.map((component) => component.name).sort();
    if (JSON.stringify(Object.keys(catalog.components).sort()) !== JSON.stringify(names))
      throw new Error('Generated catalog components do not match the selected source contracts.');

    const components = metadata.map((component) => {
      const candidate = candidates.find((item) => component.candidateId ? item.id === component.candidateId : item.storyPath === component.story);
      return {
        name: component.name, id: candidate.id, title: candidate.title, framework: candidate.framework,
        storyPath: candidate.storyPath, source: component.source, typeName: component.typeName,
        className: component.className, sourceIdentity: component.identity,
        storyIds: component.storyIds, discovery: candidate.discovery,
        contractSource: component.framework === 'react' ? 'Official Storybook Components Manifest + react-manifest.mjs; story args are examples only' :
          component.candidateId ? 'Angular compiler source inputs (catalog only); no registration or adapter' :
          'metadata.mjs source extractor and reviewed registration; story args are examples only',
        content: component.content ?? {}, events: component.events ?? {}, callbacks: component.callbacks,
        ...(component.framework === 'react' ? { manifest: component.manifestProvenance, rawProperties: component.rawProperties } : {}),
      };
    });
    diagnostics.status = 'success';
    fs.mkdirSync(destination, { recursive: true });
    fs.writeFileSync(path.join(destination, 'components.json'), json(components));
    fs.writeFileSync(path.join(destination, 'provenance.json'), json({
      generatedFrom: 'official Storybook v5 index + source contracts (Angular compiler / React Components Manifest)',
      indexSources: discovery?.indexSources ?? [],
      reactManifests: [...new Map(metadata.filter((component) => component.manifestProvenance)
        .map((component) => [component.manifestProvenance.sha256, component.manifestProvenance])).values()],
    }));
    fs.writeFileSync(path.join(destination, 'validation.json'), json(validation));
    fs.writeFileSync(path.join(destination, 'diagnostics.json'), json(diagnostics));
    // Publish the single authoritative catalog only after all checks pass.
    fs.writeFileSync(path.join(destination, 'catalog.json.tmp'), json(catalog));
    fs.renameSync(path.join(destination, 'catalog.json.tmp'), path.join(destination, 'catalog.json'));
    return { output: destination, files: fs.readdirSync(destination).sort(), components: names };
  } catch (error) {
    diagnostics.status = 'failed';
    diagnostics.issues.push({ code: 'V1_EXPORT_FAILED', message: error.message });
    fs.mkdirSync(destination, { recursive: true });
    fs.writeFileSync(path.join(destination, 'diagnostics.json'), json(diagnostics));
    throw new Error(`${error.message}\nFailure diagnostics: ${path.join(destination, 'diagnostics.json')}`, { cause: error });
  }
}
