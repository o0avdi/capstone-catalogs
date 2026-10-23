import path from 'node:path';
import { readReactComponentsManifest, normalizeReactComponentManifest, toA2UIComponentMetadata } from './react-manifest.mjs';

const normalizedPath = (value) => value.replaceAll('\\', '/').replace(/^\.\//, '');
const record = (value) => value && typeof value === 'object' && !Array.isArray(value);
function fail(code, message, details = []) {
  throw Object.assign(new Error(message), { code, details });
}

// Consume official artifacts only. No CSF evaluation or additional source parser.
export function createReactCatalogExtractor(root, manifestFile) {
  if (!manifestFile) return () => fail('REACT_MANIFEST_REQUIRED',
    'React v1.0 export requires --react-manifest <manifests/components.json> from the same Storybook build as --react-index.');
  const manifest = readReactComponentsManifest(path.resolve(root, manifestFile));
  const entries = Object.entries(manifest.components);
  for (const [key, entry] of entries) {
    if (!record(entry) || entry.id !== key || typeof entry.path !== 'string' || !entry.path ||
        !Array.isArray(entry.stories) || entry.stories.some((story) => !record(story) || typeof story.id !== 'string'))
      fail('INVALID_REACT_MANIFEST_ENTRY', `Malformed React manifest entry '${key}': expected matching id, path and story IDs.`);
  }
  return (candidate) => {
    if (candidate.framework !== 'react' || candidate.discovery?.mode !== 'storybook-index')
      fail('REACT_INDEX_REQUIRED', 'React export requires official React Storybook index discovery.');
    const matches = entries.filter(([, entry]) => normalizedPath(entry.path) === candidate.storyPath);
    if (matches.length !== 1) fail('REACT_MANIFEST_IDENTITY',
      `${candidate.id}: expected one manifest component with this exact CSF path, found ${matches.length}. Rebuild both official artifacts together; names/titles are not identities.`);
    const [manifestId, entry] = matches[0];
    const indexedIds = candidate.discovery.stories.map((story) => story.id).sort();
    const manifestIds = entry.stories.map((story) => story.id).sort();
    if (JSON.stringify(indexedIds) !== JSON.stringify(manifestIds) ||
        entries.some(([key, other]) => key !== manifestId && other.stories.some((story) => indexedIds.includes(story.id))))
      fail('REACT_MANIFEST_STORY_MISMATCH', `${candidate.id}: manifest story IDs disagree with the index or belong to multiple components. Rebuild index and manifest together, with matching tags/filters.`);
    const normalized = normalizeReactComponentManifest(entry, {
      manifestVersion: manifest.v, manifestPath: manifest.provenance.filePath,
      docgenEngine: manifest.meta.docgen ?? (entry.reactDocgenTypescript ? 'react-docgen-typescript' : 'react-docgen'),
    });
    const problems = normalized.diagnostics.filter((item) => item.severity === 'error');
    const docgen = entry.reactDocgenTypescript ?? entry.reactDocgen;
    if (!record(docgen?.props) || !Object.keys(docgen.props).length)
      problems.push({ code: 'REACT_PROP_METADATA_UNAVAILABLE', message: 'No property contract was exposed by docgen. An empty manifest is not proof of a prop-free component; add documented PropTypes/types and rebuild.' });
    for (const prop of Object.values(normalized.rawProperties)) {
      if (!prop.structuredType) problems.push({ code: 'REACT_PROP_TYPE_UNAVAILABLE', property: prop.name,
        message: `${prop.name}: docgen exposes no prop type. Source defaults and story args cannot establish exact types; add documented PropTypes/types and rebuild.`,
      });
      if (typeof docgen.props[prop.name].required !== 'boolean') problems.push({
        code: 'REACT_REQUIREDNESS_UNAVAILABLE', property: prop.name,
        message: `${prop.name}: requiredness is unavailable in docgen; it cannot be assumed optional. Add documented PropTypes/types and rebuild.`,
      });
    }
    for (const prop of [...normalized.callbacks, ...Object.keys(normalized.content).map((name) => ({ name })), ...normalized.unsupportedProperties])
      problems.push({ code: 'REACT_REVIEWED_MAPPING_REQUIRED', property: prop.name,
        message: `${prop.name}: ${prop.reason ?? 'Callback or projected content.'} An explicit reviewed A2UI mapping is required. This CLI currently exports scalar React contracts only; implement and test a lossless mapping before selecting this component.` });
    if (problems.length) fail('REACT_SOURCE_CONTRACT_UNSUPPORTED',
      `${candidate.id}: ${problems.map((item) => item.message).join('\n')}`, problems);
    const indexedPaths = candidate.discovery.stories.map((story) => story.componentPath).filter(Boolean);
    if (!normalized.source || !normalized.exportName) fail('REACT_SOURCE_IDENTITY_UNAVAILABLE', `${candidate.id}: docgen did not expose a source file/export identity.`);
    if (indexedPaths.some((source) => path.resolve(root, source) !== path.resolve(root, normalized.source)))
      fail('REACT_SOURCE_IDENTITY_MISMATCH', `${candidate.id}: indexed componentPath disagrees with the manifest source file.`);
    const metadata = toA2UIComponentMetadata(normalized);
    return {
      ...metadata, story: candidate.storyPath, storyIds: indexedIds, candidateId: candidate.id,
      identity: { manifestId, source: normalized.source, exportName: normalized.exportName },
      manifestProvenance: manifest.provenance,
      rawProperties: normalized.rawProperties,
      warnings: [...normalized.diagnostics, { code: 'REACT_METADATA_SCOPE',
        message: 'Export covers properties exposed by Storybook docgen. Undeclared props omitted by docgen cannot be recovered from the index or story examples; review source documentation for completeness.' }],
    };
  };
}
