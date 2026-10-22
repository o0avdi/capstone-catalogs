import fs from 'node:fs';
import path from 'node:path';
import { extract } from './metadata.mjs';
import { makeCatalogV1 } from './catalog-v1.mjs';
import {
  createCatalogValidator,
  createComponentInstanceValidator,
  validateCatalogStructuralRules,
  validateRuntimeMappings,
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
  'Button and checkbox labels are projected text. Button actions describe click events. ' +
  'Checkbox checked state belongs to the host data model; optional change actions emit context.checked. ' +
  'The host applies data-model updates. Storybook callbacks are never serialized. ' +
  'Bindings use the A2UI v1.0 @path form. No custom functions are supplied. ' +
  'This export contains catalog JSON only; no v1.0 renderer compatibility is claimed.';

export function exportV1Selection({ projectRoot, candidates, outputs, output, discovery }) {
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
    for (const candidate of candidates) {
      const matches = registrations.filter((registration) => normalize(registration.story) === candidate.storyPath);
      if (candidate.framework !== 'angular' || matches.length !== 1 || matches[0].name !== candidate.registrationName) {
        diagnostics.issues.push({ code: 'UNSUPPORTED_V1_COMPONENT', id: candidate.id, storyPath: candidate.storyPath,
          message: `${candidate.componentName}: no unique reviewed Angular source registration for v1.0. Add a registration with source class/type, bindings and reviewed content/event/callback semantics. Discovery args are examples and cannot define this schema.` });
      } else selectedRegistrations.push({ ...matches[0], story: candidate.storyPath });
    }
    if (diagnostics.issues.length) throw new Error(diagnostics.issues.map((issue) => issue.message).join('\n'));
    // Only indexed stories from selected candidates enter the existing extractor.
    const entries = Object.fromEntries(candidates.flatMap((candidate) => candidate.discovery.stories).map((entry) => [entry.id, entry]));
    const metadata = extract(root, selectedRegistrations, { v: 5, entries });
    assertV1Convertible(metadata);
    const mappings = validateRuntimeMappings(metadata, selectedRegistrations, root);
    diagnostics.warnings = mappings.warnings;
    if (!mappings.valid) throw new Error(`Reviewed registration validation failed: ${mappings.issues.join('; ')}`);
    const catalog = makeCatalogV1(metadata, { instructions });
    const validation = validateV1Export(catalog);
    const names = metadata.map((component) => component.name).sort();
    if (JSON.stringify(Object.keys(catalog.components).sort()) !== JSON.stringify(names))
      throw new Error('Generated catalog components do not match the selected source contracts.');

    const components = metadata.map((component) => {
      const candidate = candidates.find((item) => item.registrationName === component.name);
      return {
        name: component.name, id: candidate.id, title: candidate.title, framework: candidate.framework,
        storyPath: candidate.storyPath, source: component.source, typeName: component.typeName,
        storyIds: component.storyIds, discovery: candidate.discovery,
        contractSource: 'metadata.mjs source extractor and reviewed registration; story args are examples only',
        content: component.content ?? {}, events: component.events ?? {}, callbacks: component.callbacks,
      };
    });
    diagnostics.status = 'success';
    fs.mkdirSync(destination, { recursive: true });
    fs.writeFileSync(path.join(destination, 'components.json'), json(components));
    fs.writeFileSync(path.join(destination, 'provenance.json'), json({
      generatedFrom: 'official Storybook v5 index + registered source contracts',
      indexSources: discovery?.indexSources ?? [],
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
