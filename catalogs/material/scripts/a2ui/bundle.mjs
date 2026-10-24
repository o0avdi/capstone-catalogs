import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { archive } from './zip.mjs';
import { exportV1Selection } from './integration-v1.mjs';
import {
  makeDiagnostics,
  makeMessages,
  makeUniversalCatalog,
  universalCatalogId,
} from './universal-json.mjs';

function json(value) {
  return JSON.stringify(value, null, 2) + '\n';
}

function ensureSafeOutput(projectRoot, output) {
  const resolved = path.resolve(output);
  if (resolved === projectRoot || projectRoot.startsWith(resolved + path.sep))
    throw new Error('Output must not be the project or one of its parent directories.');
  return resolved;
}

function copyFile(source, destination) {
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
}

function copyTree(source, destination) {
  for (const entry of fs
    .readdirSync(source, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.isSymbolicLink()) throw new Error(`Refusing to package symbolic link ${entry.name}.`);
    const from = path.join(source, entry.name);
    const to = path.join(destination, entry.name);
    if (entry.isDirectory()) copyTree(from, to);
    else copyFile(from, to);
  }
}

function listFiles(root, directory = root, result = []) {
  for (const entry of fs
    .readdirSync(directory, { withFileTypes: true })
    .sort((a, b) => a.name.localeCompare(b.name))) {
    const location = path.join(directory, entry.name);
    if (entry.isDirectory()) listFiles(root, location, result);
    else result.push(path.relative(root, location).replaceAll('\\', '/'));
  }
  return result;
}

function fixtureName(candidate) {
  return candidate.componentName.replace(/([^a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function writeReactRenderer(projectRoot, destination, candidates, catalog, messages) {
  fs.mkdirSync(path.join(destination, 'src'), { recursive: true });
  fs.mkdirSync(path.join(destination, 'public/fixtures'), { recursive: true });
  copyTree(path.join(projectRoot, 'src/shadcn'), path.join(destination, 'src/shadcn'));
  copyFile(
    path.join(projectRoot, 'src/stories/Shadcn/_shared/component-demos.tsx'),
    path.join(destination, 'src/component-demos.tsx'),
  );
  const sourcePackage = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json')));
  const rendererPackage = {
    name: 'universal-shadcn-a2ui-renderer',
    version: '1.0.0',
    private: true,
    type: 'module',
    scripts: { start: 'vite --host localhost --port 3457', build: 'vite build' },
    dependencies: sourcePackage.dependencies,
    devDependencies: sourcePackage.devDependencies,
    packageManager: sourcePackage.packageManager,
  };
  fs.writeFileSync(path.join(destination, 'package.json'), json(rendererPackage));
  copyFile(path.join(projectRoot, 'package-lock.json'), path.join(destination, 'package-lock.json'));
  fs.writeFileSync(
    path.join(destination, 'index.html'),
    '<!doctype html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Shadcn A2UI Renderer</title></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>\n',
  );
  fs.writeFileSync(
    path.join(destination, 'vite.config.ts'),
    `import {defineConfig} from 'vite';\nimport tailwindcss from '@tailwindcss/vite';\nimport {resolve} from 'node:path';\nexport default defineConfig({plugins:[tailwindcss()],resolve:{alias:{'@':resolve(import.meta.dirname,'src/shadcn')}}});\n`,
  );
  fs.writeFileSync(
    path.join(destination, 'tsconfig.json'),
    json({
      compilerOptions: {
        target: 'ES2022',
        useDefineForClassFields: true,
        lib: ['ES2022', 'DOM', 'DOM.Iterable'],
        allowJs: false,
        skipLibCheck: true,
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        strict: true,
        forceConsistentCasingInFileNames: true,
        module: 'ESNext',
        moduleResolution: 'Bundler',
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: 'react-jsx',
        baseUrl: '.',
        paths: { '@/*': ['src/shadcn/*'] },
      },
      include: ['src'],
    }),
  );
  const componentMap = Object.fromEntries(
    candidates.map((candidate) => [
      candidate.componentName,
      candidate.title.split('/').at(-1).replace(/\s+/g, '-').toLowerCase(),
    ]),
  );
  const fixtureMap = Object.fromEntries(
    candidates.map((candidate) => [fixtureName(candidate), candidate.componentName]),
  );
  fs.writeFileSync(path.join(destination, 'public/catalog.json'), json(catalog));
  fs.writeFileSync(path.join(destination, 'public/fixtures.json'), json(messages));
  for (const candidate of candidates)
    fs.writeFileSync(
      path.join(destination, 'public/fixtures', `${fixtureName(candidate)}.json`),
      json(messages[candidate.componentName]),
    );
  fs.writeFileSync(
    path.join(destination, 'src/main.tsx'),
    `import {StrictMode, useEffect, useState} from 'react';
import {createRoot} from 'react-dom/client';
import {ComponentDemo} from './component-demos';
import './shadcn/index.css';
import './renderer.css';

type Message={updateDataModel?:{path?:string,value:unknown},updateComponents?:{components:Array<Record<string,unknown>>}};
const componentMap=${JSON.stringify(componentMap)} as Record<string,string>;
const fixtureMap=${JSON.stringify(fixtureMap)} as Record<string,string>;
let model:Record<string,unknown>={};
function atPath(value:unknown,pathValue:string){return pathValue.split('/').filter(Boolean).reduce<unknown>((current,key)=>current&&typeof current==='object'?(current as Record<string,unknown>)[key]:undefined,value)}
function resolve(value:unknown):unknown{return value&&typeof value==='object'&&Object.keys(value).length===1&&typeof (value as {path?:unknown}).path==='string'?atPath(model,(value as {path:string}).path):value}
function readMessages(messages:Message[]){let root:Record<string,unknown>|undefined;for(const message of messages){if(message.updateDataModel){const update=message.updateDataModel;if(!update.path||update.path==='/')model=(update.value??{}) as Record<string,unknown>;}if(message.updateComponents)root=message.updateComponents.components.find(component=>component.id==='root')??root;}if(!root)return undefined;return Object.fromEntries(Object.entries(root).map(([key,value])=>[key,resolve(value)]));}
function App(){const [component,setComponent]=useState<Record<string,unknown>>();const [error,setError]=useState('');const render=(payload:unknown)=>{try{if(!Array.isArray(payload))throw new Error('RENDER_A2UI payload must be an array');const next=readMessages(payload as Message[]);if(!next)throw new Error('No root component was provided');setComponent(next);setError('');window.parent?.postMessage({type:'RENDER_SUCCESS'},'*')}catch(reason){const message=reason instanceof Error?reason.message:String(reason);setError(message);window.parent?.postMessage({type:'RENDER_ERROR',payload:{message}},'*')}};useEffect(()=>{const listener=(event:MessageEvent)=>{if(event.data?.type==='RENDER_A2UI')render(event.data.payload);if(event.data?.type==='GET_CATALOG')fetch('/catalog.json').then(response=>response.json()).then(payload=>window.parent?.postMessage({type:'A2UI_CATALOG',payload},'*'))};window.addEventListener('message',listener);window.parent?.postMessage({type:'RENDERER_READY'},'*');const first=Object.keys(fixtureMap)[0];if(first)fetch('/fixtures/'+first+'.json').then(response=>response.json()).then(render);return()=>window.removeEventListener('message',listener)},[]);const name=String(component?.component??'');const state=String(component?.state??'Basic');return <main><header><strong>Shadcn A2UI renderer</strong><nav>{Object.entries(fixtureMap).map(([fixture,label])=><button key={fixture} onClick={()=>fetch('/fixtures/'+fixture+'.json').then(response=>response.json()).then(render)}>{label}</button>)}</nav></header>{error?<pre role="alert">{error}</pre>:componentMap[name]?<ComponentDemo component={componentMap[name]} state={state}/>:<p>Select a fixture or send A2UI messages.</p>}</main>}
createRoot(document.getElementById('root')!).render(<StrictMode><App/></StrictMode>);
`,
  );
  fs.writeFileSync(
    path.join(destination, 'src/renderer.css'),
    `body{margin:0;background:var(--background);color:var(--foreground);font-family:ui-sans-serif,system-ui,sans-serif}main{padding:1rem}header{display:grid;gap:.75rem;margin-bottom:1rem}nav{display:flex;flex-wrap:wrap;gap:.5rem}nav button{border:1px solid var(--border);border-radius:.5rem;background:var(--background);color:inherit;padding:.4rem .7rem;cursor:pointer}pre[role=alert]{color:var(--destructive)}\n`,
  );
  fs.writeFileSync(
    path.join(destination, 'README.md'),
    `# Shadcn A2UI renderer\n\nThis source renderer contains the original Shadcn catalog files and the selected A2UI catalog.\n\n    npm ci\n    npm run build\n    npm start\n\nOpen http://localhost:3457. The standalone menu loads deterministic A2UI fixtures. The renderer also accepts Composer-style RENDER_A2UI and GET_CATALOG parent-frame messages.\n`,
  );
}

function writeRootFiles(stage, candidates, catalog, messages, diagnostics) {
  fs.writeFileSync(path.join(stage, 'catalog.json'), json(catalog));
  fs.writeFileSync(path.join(stage, 'messages.json'), json(messages));
  fs.writeFileSync(path.join(stage, 'components.json'), json(candidates));
  fs.writeFileSync(path.join(stage, 'diagnostics.json'), json(diagnostics));
  fs.writeFileSync(
    path.join(stage, 'README.md'),
    `# Universal A2UI export\n\nThis bundle contains A2UI JSON plus the original selected sources and available framework renderers.\n\n- \`renderers/angular\`: portable Angular renderer for registered Material components, when selected.\n- \`renderers/react\`: React/Shadcn renderer using the original catalog sources, when selected.\n- \`components\`: selected original stories and direct component sources for provenance.\n\nEach renderer has its own installation instructions. Dependencies are declared in lockfiles; \`node_modules\` is intentionally excluded.\n`,
  );
}

export function exportSelection({ projectRoot, candidates, outputs, output, protocol = '0.9', discovery, reactManifest, reviewedSurfaces, catalogOptions, catalogOnly, diagnostics: includeDiagnostics }) {
  if (protocol === '1.0') return exportV1Selection({ projectRoot, candidates, outputs, output, discovery, reactManifest, reviewedSurfaces, catalogOptions, catalogOnly, diagnostics: includeDiagnostics });
  if (catalogOnly || catalogOptions || includeDiagnostics || reviewedSurfaces) throw new Error('Catalog options require protocol 1.0.');
  if (protocol !== '0.9') throw new Error('Protocol must be 0.9 or 1.0.');
  if (!candidates.length) throw new Error('Select at least one component.');
  const requested = new Set(outputs);
  if (![...requested].every((name) => ['json', 'zip'].includes(name)))
    throw new Error('Outputs must be json, zip, or both.');
  if (!requested.size) throw new Error('Select at least one output.');
  const unsupportedZip = candidates.filter((candidate) => !candidate.outputSupport.rendererZip);
  if (requested.has('zip') && unsupportedZip.length)
    throw new Error(
      `Renderer ZIP needs adapters for: ${unsupportedZip.map((candidate) => candidate.componentName).join(', ')}. Export JSON only or add registrations.`,
    );
  const resolvedOutput = ensureSafeOutput(projectRoot, output);
  if (fs.existsSync(resolvedOutput) && fs.readdirSync(resolvedOutput).length)
    throw new Error(`Output directory is not empty: ${resolvedOutput}`);
  fs.mkdirSync(resolvedOutput, { recursive: true });
  const catalog = makeUniversalCatalog(candidates);
  const messages = makeMessages(candidates);
  const diagnostics = makeDiagnostics(candidates);
  if (requested.has('json')) {
    fs.writeFileSync(path.join(resolvedOutput, 'catalog.json'), json(catalog));
    fs.writeFileSync(path.join(resolvedOutput, 'messages.json'), json(messages));
    fs.writeFileSync(path.join(resolvedOutput, 'components.json'), json(candidates));
    fs.writeFileSync(path.join(resolvedOutput, 'diagnostics.json'), json(diagnostics));
  }
  let zipPath;
  if (requested.has('zip')) {
    const temporary = fs.mkdtempSync(path.join(os.tmpdir(), 'a2ui-universal-'));
    try {
      const stage = path.join(temporary, 'bundle');
      fs.mkdirSync(path.join(stage, 'components'), { recursive: true });
      writeRootFiles(stage, candidates, catalog, messages, diagnostics);
      for (const candidate of candidates) {
        const componentRoot = path.join(stage, 'components', candidate.componentName);
        copyFile(path.join(projectRoot, candidate.storyPath), path.join(componentRoot, candidate.storyPath));
        for (const source of candidate.sourceFiles)
          copyFile(path.join(projectRoot, source), path.join(componentRoot, source));
      }
      const angularNames = candidates
        .filter((candidate) => candidate.registrationName)
        .map((candidate) => candidate.registrationName);
      if (angularNames.length) {
        const angularOut = path.join(stage, 'renderers/angular');
        execFileSync(
          process.execPath,
          [
            path.join(projectRoot, 'scripts/a2ui/export.mjs'),
            '--components',
            angularNames.join(','),
            '--out',
            angularOut,
            '--no-zip',
          ],
          { cwd: projectRoot, stdio: 'pipe' },
        );
      }
      const reactCandidates = candidates.filter((candidate) => candidate.library === 'shadcn');
      if (reactCandidates.length)
        writeReactRenderer(
          projectRoot,
          path.join(stage, 'renderers/react'),
          reactCandidates,
          makeUniversalCatalog(reactCandidates),
          makeMessages(reactCandidates),
        );
      const filesBeforeManifest = listFiles(stage);
      fs.writeFileSync(
        path.join(stage, 'manifest.json'),
        json({
          formatVersion: 1,
          catalogId: universalCatalogId,
          components: candidates.map((candidate) => candidate.componentName),
          renderers: {
            angular: Boolean(angularNames.length),
            react: Boolean(reactCandidates.length),
          },
          files: [...filesBeforeManifest, 'manifest.json'].sort(),
        }),
      );
      zipPath = path.join(resolvedOutput, 'a2ui-export.zip');
      archive(stage, listFiles(stage), zipPath);
    } finally {
      fs.rmSync(temporary, { recursive: true, force: true });
    }
  }
  return {
    output: resolvedOutput,
    files: listFiles(resolvedOutput),
    zipPath,
    components: candidates.map((candidate) => candidate.componentName),
  };
}
