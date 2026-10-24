import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

const record = (value) => value && typeof value === 'object' && !Array.isArray(value);
const nonempty = (value) => typeof value === 'string' && Boolean(value.trim());
export const evidenceHash = (value) => createHash('sha256').update(value).digest('hex');
function invalid(message) {
  throw Object.assign(new Error(`Reviewed surface: ${message}`), { code: 'INVALID_REVIEWED_SURFACE' });
}
function keys(value, allowed, context) {
  if (!record(value) || Object.keys(value).some((key) => !allowed.includes(key)))
    invalid(`${context}: expected only ${allowed.join(', ')}. Schemas, actions and wildcard exclusions are not supported.`);
}

// Explicit input only: never auto-load this file or infer exclusions from docgen.
export function readReviewedSurfaces(root, file) {
  if (!file) return {};
  const config = JSON.parse(fs.readFileSync(path.resolve(root, file), 'utf8'));
  keys(config, ['version', 'components'], 'configuration');
  if (config.version !== 1 || !record(config.components) || !Object.keys(config.components).length)
    invalid('expected version 1 and a nonempty components map keyed by exact React candidate IDs.');
  for (const [id, surface] of Object.entries(config.components)) {
    keys(surface, ['source', 'exportName', 'expose', 'omit', 'review'], id);
    if (!id.startsWith('react:') || !nonempty(surface.source) || !nonempty(surface.exportName) ||
        !Array.isArray(surface.expose) || !surface.expose.length || surface.expose.some((name) => !nonempty(name)) ||
        new Set(surface.expose).size !== surface.expose.length || !record(surface.omit) ||
        Object.entries(surface.omit).some(([name, reason]) => !nonempty(name) || !nonempty(reason) || surface.expose.includes(name)))
      invalid(`${id}: specify source/export identity, unique exposed names and a reason for every omitted name.`);
    keys(surface.review, ['evidenceSha256', 'rationale', 'usage', 'dependencies'], `${id}.review`);
    if (!/^[a-f0-9]{64}$/.test(surface.review.evidenceSha256) || !nonempty(surface.review.rationale) ||
        surface.review.usage !== 'standalone' || !Array.isArray(surface.review.dependencies) || surface.review.dependencies.length)
      invalid(`${id}: review must pin evidenceSha256, explain rationale, and confirm standalone usage with dependencies: []. Context, slots, coupled properties and behavioral dependencies need a real mapping.`);
  }
  return config.components;
}

export function validateReviewedSurface(surface, facts, normalized, issue) {
  if (surface.source !== normalized.source || surface.exportName !== normalized.exportName)
    issue('REVIEWED_SURFACE_IDENTITY', 'Reviewed source/export identity disagrees with the actual component.');
  if (surface.review.evidenceSha256 !== facts.evidenceSha256)
    issue('REVIEWED_SURFACE_STALE', `Evidence changed; review source, dependencies and the complete omission inventory again. Current evidenceSha256: ${facts.evidenceSha256}`);
  const names = new Set(facts.properties.map((prop) => prop.name));
  for (const name of [...surface.expose, ...Object.keys(surface.omit)]) if (!names.has(name))
    issue('REVIEWED_SURFACE_UNKNOWN_PROPERTY', `Reviewed name '${name}' is absent from source; actions cannot be fabricated.`, name);
  for (const prop of facts.properties) {
    if (surface.expose.includes(prop.name)) continue;
    if (!Object.hasOwn(surface.omit, prop.name))
      issue('REVIEWED_SURFACE_UNREVIEWED_OMISSION', `Every omitted property needs an explicit reason: ${prop.name}.`, prop.name);
    if (prop.required)
      issue('REVIEWED_SURFACE_REQUIRED_OMISSION', `Required source property '${prop.name}' cannot be omitted.`, prop.name);
  }
}
