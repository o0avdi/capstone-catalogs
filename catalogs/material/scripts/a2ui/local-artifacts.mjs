import fs from 'node:fs';
import path from 'node:path';

// Opt-in file lookup only. Official adapters validate the resulting artifacts.
// Never evaluate Storybook configs or guess a framework from a story extension.
export function resolveArtifacts(root, options) {
  if (!options.detectArtifacts) return options;
  const indexes = [...(options.indexes ?? [])];
  const detected = [];
  if (!indexes.length) {
    const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
    const dependencies = { ...pkg.dependencies, ...pkg.devDependencies };
    const frameworks = [
      ...(dependencies['@storybook/angular'] ? ['angular'] : []),
      ...(['@storybook/react', '@storybook/react-vite', '@storybook/react-webpack5'].some((key) => dependencies[key]) ? ['react'] : []),
    ];
    const conventional = [
      ['angular', 'storybook-static-angular/index.json'],
      ['react', 'storybook-static-react/index.json'],
      ['react', 'storybook-static-shadcn/index.json'],
    ];
    if (fs.existsSync(path.join(root, 'storybook-static/index.json'))) {
      if (frameworks.length !== 1)
        throw new Error('Cannot determine the framework of storybook-static/index.json. Supply --angular-index or --react-index explicitly.');
      conventional.push([frameworks[0], 'storybook-static/index.json']);
    }
    for (const [framework, file] of conventional) {
      if (fs.existsSync(path.join(root, file))) indexes.push({ framework, file });
    }
    for (const framework of ['angular', 'react']) {
      if (indexes.filter((index) => index.framework === framework).length > 1)
        throw new Error(`Multiple conventional ${framework} indexes found. Supply --${framework}-index explicitly; no build is selected by timestamp.`);
    }
    if (!indexes.length) throw new Error('No conventional Storybook index found. Build Storybook or supply --angular-index/--react-index explicitly.');
    detected.push(...indexes.map((index) => path.resolve(root, index.file)));
  }
  let reactManifest = options.reactManifest;
  const reactIndexes = indexes.filter((index) => index.framework === 'react');
  if (!reactManifest && reactIndexes.length) {
    if (reactIndexes.length !== 1) throw new Error('Manifest detection needs one React index; supply --react-manifest explicitly.');
    const file = path.join(path.dirname(path.resolve(root, reactIndexes[0].file)), 'manifests/components.json');
    if (!fs.existsSync(file)) throw new Error(`No React Components Manifest at ${file}. Rebuild with features.componentsManifest enabled or supply --react-manifest explicitly.`);
    reactManifest = file;
    detected.push(file);
  }
  return { ...options, indexes, reactManifest, artifactDiagnostics: detected.length ? [{
    code: 'LOCAL_BUILD_ARTIFACTS',
    message: `Using existing build snapshots: ${detected.join(', ')}. Freshness is not verified; rebuild after source/config changes. Explicit index/manifest flags pin inputs.`,
  }] : [] };
}
