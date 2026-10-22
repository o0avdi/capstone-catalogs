import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';

const record = (value) => value && typeof value === 'object' && !Array.isArray(value);
const nonempty = (value) => typeof value === 'string' && value.trim().length > 0;

// Indexes are artifacts only: this module never loads Storybook configuration or CSF modules.
export function readStorybookIndex(root, { file, framework }) {
  if (!['angular', 'react'].includes(framework))
    throw new Error('Storybook index requires an explicit angular or react framework.');
  const filename = path.resolve(root, file);
  const bytes = fs.readFileSync(filename);
  let index;
  try { index = JSON.parse(bytes.toString('utf8')); }
  catch (error) { throw new Error(`Invalid Storybook index JSON ${filename}: ${error.message}`); }
  if (!record(index) || index.v !== 5)
    throw new Error(`Unsupported Storybook index version ${index?.v}; expected v5 (${filename}).`);
  if (!record(index.entries)) throw new Error(`Malformed Storybook index entries in ${filename}.`);
  const groups = new Map();
  const docs = [];
  const diagnostics = [];
  const ids = new Set();
  for (const [key, entry] of Object.entries(index.entries)) {
    if (!record(entry) || !['story', 'docs'].includes(entry.type) ||
        !['id', 'title', 'name', 'importPath'].every((field) => nonempty(entry[field])) ||
        !Array.isArray(entry.tags) || !entry.tags.every((tag) => typeof tag === 'string'))
      throw new Error(`Malformed Storybook index entry ${key}: expected type, id, title, name, importPath and tags.`);
    if (ids.has(entry.id)) throw new Error(`Story ID collision: ${entry.id}.`);
    for (const field of ['componentPath', 'exportName', 'refId'])
      if (entry[field] !== undefined && !nonempty(entry[field]))
        throw new Error(`Malformed Storybook index entry ${key}: invalid ${field}.`);
    if (entry.storiesImports !== undefined && (!Array.isArray(entry.storiesImports) || !entry.storiesImports.every(nonempty)))
      throw new Error(`Malformed Storybook index entry ${key}: invalid storiesImports.`);
    ids.add(entry.id);
    if (key !== entry.id) throw new Error(`Story index key/id mismatch: ${key} / ${entry.id}.`);
    if (entry.refId) {
      diagnostics.push({ code: 'REMOTE_ENTRY_EXCLUDED', id: entry.id, refId: entry.refId });
      continue;
    }
    if (entry.type === 'docs') { docs.push(entry); continue; }
    const importPath = entry.importPath.replaceAll('\\', '/');
    if (path.isAbsolute(importPath) || /^[a-z]+:/i.test(importPath))
      throw new Error(`Story ${entry.id}: importPath must be project-relative: ${entry.importPath}.`);
    const absolute = path.resolve(root, importPath);
    const relative = path.relative(root, absolute);
    if (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative))
      throw new Error(`Story ${entry.id}: importPath escapes project: ${entry.importPath}.`);
    if (!fs.existsSync(absolute) || !fs.statSync(absolute).isFile())
      throw new Error(`Story ${entry.id}: missing story path ${entry.importPath}.`);
    const realRelative = path.relative(fs.realpathSync(root), fs.realpathSync(absolute));
    if (realRelative === '..' || realRelative.startsWith(`..${path.sep}`) || path.isAbsolute(realRelative))
      throw new Error(`Story ${entry.id}: resolved story path escapes project.`);
    const storyPath = relative.replaceAll('\\', '/');
    const stories = groups.get(storyPath) ?? [];
    stories.push(entry);
    groups.set(storyPath, stories);
  }
  for (const [storyPath, stories] of groups) {
    if (new Set(stories.map((entry) => entry.title)).size > 1 ||
        new Set(stories.map((entry) => entry.componentPath).filter(Boolean)).size > 1)
      throw new Error(`Ambiguous component identity in ${storyPath}: conflicting indexed titles/component paths.`);
    stories.sort((a, b) => a.id.localeCompare(b.id));
  }
  return {
    groups, docs, diagnostics,
    provenance: { file: filename, framework, version: index.v,
      sha256: createHash('sha256').update(bytes).digest('hex') },
  };
}
