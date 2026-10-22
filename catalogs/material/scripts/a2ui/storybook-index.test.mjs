import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { discoverProject, selectCandidates } from './discovery.mjs';
import { parseArguments } from './cli.mjs';

const root = fileURLToPath(new URL('../..', import.meta.url));
const angularFile = 'scripts/a2ui/fixtures/angular-index-v5.json';
const reactFile = 'scripts/a2ui/fixtures/react-index-v5.json';
const angular = JSON.parse(fs.readFileSync(path.join(root, angularFile)));
const options = { indexes: [{ file: angularFile, framework: 'angular' }] };

function fixture(index, run) {
  const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'a2ui-index-'));
  try {
    fs.writeFileSync(path.join(temporary, 'package.json'), '{}');
    for (const entry of Object.values(index.entries ?? {})) {
      if (!entry?.importPath?.startsWith('./src/')) continue;
      const destination = path.join(temporary, entry.importPath);
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      // Any attempted story execution fails. The extra export is intentionally not indexed.
      fs.writeFileSync(destination, "throw new Error('STORY EXECUTED'); export const NotAStory = {}; export default {title:'Wrong title'};");
    }
    fs.writeFileSync(path.join(temporary, 'index.json'), JSON.stringify(index));
    return run(temporary, { indexes: [{ file: 'index.json', framework: 'react' }] });
  } finally {
    assert.ok(path.resolve(temporary).startsWith(path.resolve(os.tmpdir()) + path.sep));
    fs.rmSync(temporary, { recursive: true, force: true });
  }
}
const entry = (id, importPath = './src/button.stories.ts') => ({
  id, type: 'story', title: 'Configured/Button', name: 'Configured display name',
  importPath, tags: ['dev', 'test', 'custom'], exportName: 'ActualExport',
});

test('official Angular fixture preserves indexed variants, registrations and documentation', () => {
  const result = discoverProject(root, options);
  assert.equal(result.fallbackUsed, false);
  assert.equal(result.summary.total, 3);
  assert.equal(result.summary.react, 0); // Composition is not a local React index.
  for (const name of ['FinanceMetricCard', 'MaterialButton', 'MaterialCheckbox']) {
    const candidate = selectCandidates(result, [name])[0];
    const entries = Object.values(angular.entries).filter((e) => e.type === 'story' && e.importPath === `./${candidate.storyPath}`);
    assert.deepEqual(candidate.storyIds, entries.map((e) => e.id).sort());
    assert.equal(candidate.variantCount, entries.length);
    assert.ok(candidate.discovery.docs.length);
    assert.equal(candidate.outputSupport.rendererZip, true);
    assert.match(candidate.discovery.sha256, /^[a-f0-9]{64}$/);
  }
  assert.ok(result.indexSources[0].docs.some((e) => e.importPath.endsWith('.mdx')));
});

test('separate official React index adds only explicitly indexed React files', () => {
  const result = discoverProject(root, { indexes: [...options.indexes, { file: reactFile, framework: 'react' }] });
  assert.equal(result.summary.angular, 3);
  assert.equal(result.summary.react, 1);
  const candidate = result.candidates.find((c) => c.framework === 'react');
  const index = JSON.parse(fs.readFileSync(path.join(root, reactFile)));
  assert.deepEqual(candidate.discovery.stories, Object.values(index.entries).filter((e) => e.type === 'story').sort((a,b) => a.id.localeCompare(b.id)));
});

test('index controls title, framework, inclusion, names, tags and export filtering without executing CSF', () => {
  const story = entry('explicit--custom-id');
  fixture({ v: 5, entries: { [story.id]: story } }, (project, settings) => {
    fs.writeFileSync(path.join(project, 'src/unconfigured.stories.ts'), 'throw new Error("DO NOT EXECUTE");');
    const result = discoverProject(project, settings);
    assert.equal(result.candidates.length, 1);
    const candidate = result.candidates[0];
    assert.equal(candidate.framework, 'react'); // .ts does not imply Angular.
    assert.equal(candidate.title, story.title);
    assert.deepEqual(candidate.variants, ['ActualExport']);
    assert.deepEqual(candidate.storyIds, [story.id]);
    assert.deepEqual(candidate.discovery.stories[0], story);
  });
});

test('same titles and basenames stay distinct; identity is stable across title changes', () => {
  const a = entry('a', './src/a/button.stories.ts');
  const b = entry('b', './src/b/button.stories.ts');
  fixture({v:5, entries:{a,b}}, (project, settings) => {
    const result = discoverProject(project, settings);
    assert.equal(result.candidates.length, 2);
    assert.equal(new Set(result.candidates.map((c) => c.componentName)).size, 2);
    assert.ok(result.diagnostics.some((d) => d.code === 'COMPONENT_IDENTITY_REQUIRES_REVIEW'));
    const changed = {v:5, entries:{a:{...a,title:'Renamed'},b}};
    fs.writeFileSync(path.join(project, 'index.json'), JSON.stringify(changed));
    assert.deepEqual(discoverProject(project, settings).candidates.map((c)=>c.id), result.candidates.map((c)=>c.id));
  });
});

test('shared component paths across CSF files are observations requiring identity review', () => {
  const a = {...entry('a'), componentPath:'./src/button.ts'};
  const b = {...entry('b','./src/other.stories.ts'), title:'Other', componentPath:a.componentPath};
  fixture({v:5,entries:{a,b}}, (project, settings) => {
    const result = discoverProject(project, settings);
    assert.equal(result.candidates.length, 2);
    assert.ok(result.diagnostics.some((d)=>d.code === 'COMPONENT_IDENTITY_REQUIRES_REVIEW'));
  });
});

test('docs-only indexes retain provenance; remote stories never access local paths', () => {
  const docs = {...entry('docs'), type:'docs', importPath:'./guide.mdx'};
  const remote = {...entry('remote'), refId:'composed-react', importPath:'https://remote/story.tsx'};
  fixture({v:5,entries:{docs,remote}}, (project, settings) => {
    const result = discoverProject(project, settings);
    assert.equal(result.candidates.length, 0);
    assert.deepEqual(result.indexSources[0].docs, [docs]);
    assert.equal(result.diagnostics[0].code, 'REMOTE_ENTRY_EXCLUDED');
  });
});

test('malformed indexes, versions, missing paths, collisions and ambiguous identities fail explicitly', () => {
  const a = entry('a');
  for (const [index, pattern] of [
    [{v:6,entries:{}}, /version/], [{v:5,entries:[]}, /entries/],
    [{v:5,entries:{a:{...a, tags:null}}}, /Malformed/],
    [{v:5,entries:{a:{...a, importPath:''}}}, /Malformed/],
    [{v:5,entries:{a:{...a, importPath:'./missing.ts'}}}, /missing story path/],
    [{v:5,entries:{a:{...a, importPath:'../outside.ts'}}}, /escapes project/],
    [{v:5,entries:{a,b:a}}, /collision/],
    [{v:5,entries:{wrong:a}}, /mismatch/],
    [{v:5,entries:{a,b:{...entry('b'),title:'Different'}}}, /Ambiguous component identity/],
    [{v:5,entries:{a:{...a,componentPath:'a.ts'},b:{...entry('b'),componentPath:'b.ts'}}}, /Ambiguous component identity/],
  ]) fixture(index, (project, settings) => assert.throws(()=>discoverProject(project, settings), pattern));
  fixture({v:5,entries:{a}}, (project, settings) => {
    assert.throws(()=>discoverProject(project,{indexes:[...settings.indexes,...settings.indexes]}), /path collision/);
    fs.writeFileSync(path.join(project,'src/other.stories.ts'), 'export default {};');
    fs.writeFileSync(path.join(project,'second.json'), JSON.stringify({v:5,entries:{a:{...a,importPath:'./src/other.stories.ts'}}}));
    assert.throws(()=>discoverProject(project,{indexes:[...settings.indexes,{file:'second.json',framework:'react'}]}), /ID collision across indexes/);
    assert.throws(()=>discoverProject(project,{indexes:[{file:'index.json',framework:'unknown'}]}), /explicit angular or react/);
    assert.throws(()=>discoverProject(project,{indexes:[{file:'absent.json',framework:'react'}]}), /ENOENT/);
    fs.writeFileSync(path.join(project,'index.json'), '{invalid');
    assert.throws(()=>discoverProject(project, settings), /Invalid Storybook index JSON/);
  });
});

test('static fallback and CLI source choices are explicit and diagnosed', () => {
  const fallback = discoverProject(root, {staticDiscovery:true});
  assert.equal(fallback.fallbackUsed, true);
  assert.equal(fallback.diagnostics[0].code, 'STATIC_DISCOVERY_FALLBACK');
  assert.ok(fallback.candidates.every((c)=>c.discovery.mode === 'static-fallback'));
  assert.equal(discoverProject(root).fallbackUsed, true);
  assert.throws(()=>discoverProject(root,{...options,staticDiscovery:true}), /not both/);
  assert.deepEqual(parseArguments(['discover','--angular-index','a.json','--react-index','r.json']).indexes,
    [{file:'a.json',framework:'angular'},{file:'r.json',framework:'react'}]);
  assert.throws(()=>parseArguments(['--react-index']), /requires a value/);
});
